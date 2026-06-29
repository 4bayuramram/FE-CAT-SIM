

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log("WORKER ACTIVE:", url.pathname);

    // HEALTH CHECK
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }


    // TEST SUPABASE CONNECTION
    if (url.pathname === "/test-supabase") {
      const res = await fetch(
        `${env.SUPABASE_URL}/rest/v1/packages?select=*`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // CREATE MIDTRANS TRANSACTION

    if (url.pathname === "/create-transaction" && request.method === "POST") {
      try {
        const body = await request.json();

        // Validasi field wajib
        const { order_id, amount, customer_name, email, user_id, package_id } =
          body;

        if (!order_id || !amount || !user_id || !package_id) {
          return new Response(
            JSON.stringify({
              error:
                "Field wajib tidak lengkap: order_id, amount, user_id, package_id",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const serverKey = env.MIDTRANS_SERVER_KEY;
        if (!serverKey) {
          return new Response(
            JSON.stringify({ error: "MIDTRANS_SERVER_KEY tidak ditemukan" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const auth = btoa(serverKey + ":");

        
        const midtransPayload = {
          transaction_details: {
            order_id,
            gross_amount: amount,
          },
          customer_details: {
            first_name: customer_name,
            email: email,
          },
          custom_field1: user_id,   
          custom_field2: package_id, 
        };

        console.log(
          "MIDTRANS PAYLOAD:",
          JSON.stringify(midtransPayload, null, 2)
        );

        const response = await fetch(
          "https://app.sandbox.midtrans.com/snap/v1/transactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${auth}`,
            },
            body: JSON.stringify(midtransPayload),
          }
        );

        const data = await response.json();
        console.log("MIDTRANS RESPONSE:", JSON.stringify(data, null, 2));

        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("CREATE TRANSACTION ERROR:", err.message);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

  
    // MIDTRANS WEBHOOK
    if (url.pathname === "/midtrans-webhook" && request.method === "POST") {
      try {
        const body = await request.json();

        console.log("WEBHOOK PAYLOAD");
        console.log(JSON.stringify(body, null, 2));

        const orderId = body.order_id;
        const status = body.transaction_status;
        const grossAmount = body.gross_amount;
        const userId = body.custom_field1;
        const packageId = body.custom_field2;

        if (!userId || !packageId) {
          console.error(
            "CRITICAL: custom_field1 atau custom_field2 kosong!",
            "custom_field1:", userId,
            "custom_field2:", packageId
          );
          return new Response(
            JSON.stringify({
              error: "custom_field1 / custom_field2 tidak ada di payload webhook",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Hanya proses transaksi yang sudah settlement
        if (status !== "settlement") {
          console.log("IGNORED - status:", status);
          return new Response("IGNORED");
        }

        // 1. CEK DUPLIKAT PAYMENT
        const check = await fetch(
          `${env.SUPABASE_URL}/rest/v1/payments?midtrans_order_id=eq.${orderId}`,
          {
            headers: {
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
          }
        );
        const existing = await check.json();
        if (existing.length > 0) {
          console.log("ALREADY PROCESSED:", orderId);
          return new Response("ALREADY PROCESSED");
        }

        // 2. INSERT KE TABEL PAYMENTS
        const paymentRes = await fetch(
          `${env.SUPABASE_URL}/rest/v1/payments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              midtrans_order_id: orderId,
              status: "success",
              amount: parseInt(grossAmount),
              user_id: userId,
              package_id: packageId,
            }),
          }
        );

        const paymentBody = await paymentRes.text();
        console.log("PAYMENT INSERT STATUS:", paymentRes.status);
        console.log("PAYMENT INSERT RESPONSE:", paymentBody);

        if (!paymentRes.ok) {
          console.error("PAYMENT INSERT GAGAL:", paymentBody);
          return new Response(
            JSON.stringify({ error: "Gagal insert payment", detail: paymentBody }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        // 3. INSERT KE TABEL USER_PACKAGE_ACCESS
        const accessRes = await fetch(
          `${env.SUPABASE_URL}/rest/v1/user_package_access`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: env.SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              Prefer: "return=representation",
            },
            body: JSON.stringify({
              user_id: userId,
              package_id: packageId,
              access_type: "single",
              status: "active",
            }),
          }
        );

        const accessBody = await accessRes.text();
        console.log("ACCESS INSERT STATUS:", accessRes.status);
        console.log("ACCESS INSERT RESPONSE:", accessBody);

        if (!accessRes.ok) {
          // user_package_access mungkin sudah ada (unique index)
          // parse error untuk bedakan duplikat vs error lain
          let accessError;
          try {
            accessError = JSON.parse(accessBody);
          } catch {
            accessError = { message: accessBody };
          }

          // Kode 23505 = unique violation (akses sudah ada, bukan masalah)
          if (accessError.code === "23505") {
            console.log("ACCESS SUDAH ADA (duplicate), skip insert akses");
          } else {
            console.error("ACCESS INSERT GAGAL:", accessBody);
            return new Response(
              JSON.stringify({
                error: "Gagal insert user_package_access",
                detail: accessBody,
              }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }
        }

        console.log("WEBHOOK SELESAI - semua data berhasil disimpan");
        return new Response("OK", { status: 200 });
      } catch (err) {
        console.error("WEBHOOK ERROR:", err.message);
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    // DEFAULT RESPONSE
    return new Response("WORKER OK: " + url.pathname);
  },
};