//production 
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", //stagginf
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ----------------------------------------------------------------
// LOGGER
// Memisahkan level log agar mudah difilter di Cloudflare Logs.
// Secret tidak pernah masuk ke log.
// ----------------------------------------------------------------
const log = {
  info: (msg, data = {}) =>
    console.log(JSON.stringify({ level: "INFO", msg, ...data })),
  warn: (msg, data = {}) =>
    console.warn(JSON.stringify({ level: "WARN", msg, ...data })),
  error: (msg, data = {}) =>
    console.error(JSON.stringify({ level: "ERROR", msg, ...data })),
};


// Helper response dengan CORS
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });

const errorResponse = (message, status = 400) =>
  jsonResponse({ ok: false, error: message }, status);

const okResponse = (message = "OK", data = {}) =>
  jsonResponse({ ok: true, message, ...data });

// ----------------------------------------------------------------
// SIGNATURE VALIDATION
// Midtrans mengirim signature_key di payload webhook.
// Formula: SHA512(order_id + status_code + gross_amount + SERVER_KEY)
// Ini adalah garis pertahanan pertama — tolak request palsu.
// ----------------------------------------------------------------
async function isSignatureValid(body, serverKey) {
  const raw = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-512", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computed = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === body.signature_key;
}

// ----------------------------------------------------------------
// PAYLOAD VALIDATION
// Defensive programming: jangan percaya payload dari Midtrans
// tanpa validasi terlebih dahulu.
// custom_field2 (package_id) boleh null/kosong untuk paket premium.
// ----------------------------------------------------------------
function validateWebhookPayload(body) {
  const required = [
    "order_id",
    "transaction_status",
    "status_code",
    "gross_amount",
    "signature_key",
  ];

  for (const field of required) {
    if (!body[field]) {
      return {
        valid: false,
        reason: `Field wajib tidak ada atau kosong: ${field}`,
      };
    }
  }

  // custom_field1 = user_id, wajib ada dan harus berupa UUID
  if (!body.custom_field1) {
    return { valid: false, reason: "custom_field1 (user_id) wajib ada" };
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(body.custom_field1)) {
    return { valid: false, reason: "custom_field1 bukan UUID yang valid" };
  }

  return { valid: true };
}

// ----------------------------------------------------------------
// DETERMINE ACCESS TYPE
// Jika package_id null atau bernilai "premium" → akses premium.
// Selain itu → akses single per paket.
// ----------------------------------------------------------------
function resolveAccessType(packageId) {
  if (!packageId || packageId === "premium") {
    return { access_type: "premium", package_id: null };
  }
  return { access_type: "single", package_id: packageId };
}

// ----------------------------------------------------------------
// SUPABASE FETCH HELPER
// Wrapper untuk semua request ke Supabase REST API.
// Menggunakan service role key agar bisa bypass RLS dari Worker.
// ----------------------------------------------------------------
async function supabaseFetch(env, path, options = {}) {
  const url = `${env.SUPABASE_URL}/rest/v1${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}

// ----------------------------------------------------------------
// CEK DUPLIKAT PAYMENT
// Idempotency: webhook Midtrans bisa dikirim lebih dari sekali.
// Cek berdasarkan midtrans_order_id sebelum insert.
// Ini mencegah double charge dan double access.
// ----------------------------------------------------------------
async function isPaymentAlreadyProcessed(env, orderId) {
  const { ok, data } = await supabaseFetch(
    env,
    `/payments?midtrans_order_id=eq.${encodeURIComponent(orderId)}&select=id`
  );
  return ok && Array.isArray(data) && data.length > 0;
}

// ----------------------------------------------------------------
// INSERT PAYMENT
// ----------------------------------------------------------------
async function insertPayment(env, { orderId, userId, packageId, amount }) {
  return supabaseFetch(env, "/payments", {
    method: "POST",
    body: JSON.stringify({
      midtrans_order_id: orderId,
      status: "success",
      amount: parseInt(amount, 10),
      user_id: userId,
      package_id: packageId || null,
    }),
  });
}

// ----------------------------------------------------------------
// INSERT USER PACKAGE ACCESS
// Menggunakan ON CONFLICT DO NOTHING via header Prefer.
// Alasan: tabel punya unique index (user_id, package_id).
// Jika akses sudah ada, kita skip insert tanpa error — idempoten.
// Untuk premium: package_id = null, unique index tidak berlaku,
// sehingga duplikat dicegah lewat cek payment di atas.
// ----------------------------------------------------------------
async function insertAccess(env, { userId, packageId, accessType }) {
  return supabaseFetch(env, "/user_package_access", {
    method: "POST",
    headers: {
      // ON CONFLICT DO NOTHING: jika record sudah ada, abaikan
      Prefer: "return=representation,resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      user_id: userId,
      package_id: packageId,
      access_type: accessType,
      status: "active",
    }),
  });
}

// ================================================================
// HANDLER: CREATE TRANSACTION
// Menerima request dari frontend, membuat transaksi di Midtrans.
// custom_field1 dan custom_field2 dikirim ke Midtrans agar
// dikembalikan lagi di payload webhook.
// ================================================================
async function handleCreateTransaction(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body bukan JSON yang valid");
  }

  const { order_id, customer_name, email, user_id, package_id } = body;

  // Validasi field wajib dari frontend
  if (!order_id || !user_id) {
    return errorResponse("Field wajib tidak lengkap: order_id, user_id");
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(user_id)) {
    return errorResponse("user_id bukan UUID yang valid");
  }

  // Fetch harga dari DB berdasarkan package_id
  const pkgResult = await supabaseFetch(
    env,
    `/packages?id=eq.${package_id}&select=price,title`
  );

  if (!pkgResult.ok || !pkgResult.data?.[0]) {
    return errorResponse("Paket tidak ditemukan", 404);
  }
  const amount = pkgResult.data[0].price;


  if (!env.MIDTRANS_SERVER_KEY) {
    log.error("MIDTRANS_SERVER_KEY tidak ditemukan di environment");
    return errorResponse("Konfigurasi server tidak lengkap", 500);
  }

  const auth = btoa(`${env.MIDTRANS_SERVER_KEY}:`);

  const midtransPayload = {
    transaction_details: {
      order_id,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customer_name || "",
      email: email || "",
    },
    // KUNCI: kedua field ini akan dikembalikan Midtrans di payload webhook
    custom_field1: user_id,
    custom_field2: package_id || null,
  };

  log.info("Membuat transaksi Midtrans", {
    order_id,
    user_id,
    package_id: package_id || null,
  });

  try {
    const res = await fetch(
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

    const data = await res.json();

    if (!res.ok) {
      log.error("Midtrans menolak pembuatan transaksi", {
        status: res.status,
        order_id,
      });
      return errorResponse("Gagal membuat transaksi di Midtrans", 502);
    }

    log.info("Transaksi Midtrans berhasil dibuat", {
      order_id,
      token: data.token,
    });
    return okResponse("Transaksi berhasil dibuat", {
      token: data.token,
      redirect_url: data.redirect_url,
    });
  } catch (err) {
    log.error("Error saat menghubungi Midtrans", { message: err.message });
    return errorResponse("Gagal menghubungi Midtrans", 502);
  }
}

// ================================================================
// HANDLER: MIDTRANS WEBHOOK
// ================================================================
async function handleMidtransWebhook(request, env) {
  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    log.warn("Webhook body bukan JSON yang valid");
    return errorResponse("Body bukan JSON yang valid");
  }

  const orderId = body.order_id;
  log.info("Webhook diterima", {
    order_id: orderId,
    status: body.transaction_status,
  });

  // STEP 1: Validasi payload
  const { valid, reason } = validateWebhookPayload(body);
  if (!valid) {
    log.warn("Payload webhook tidak valid", { reason, order_id: orderId });
    return errorResponse(`Payload tidak valid: ${reason}`);
  }

  // STEP 2: Validasi signature Midtrans
  const signatureOk = await isSignatureValid(body, env.MIDTRANS_SERVER_KEY);
  if (!signatureOk) {
    log.warn("Signature webhook tidak valid — kemungkinan request palsu", {
      order_id: orderId,
    });
    return errorResponse("Signature tidak valid", 403);
  }

  log.info("Signature valid", { order_id: orderId });

  // STEP 3: Hanya proses status settlement
  if (body.transaction_status !== "settlement") {
    log.info("Webhook diabaikan — bukan settlement", {
      order_id: orderId,
      status: body.transaction_status,
    });
    return okResponse(`Status ${body.transaction_status} diabaikan`);
  }

  const userId = body.custom_field1;
  const rawPackageId = body.custom_field2 || null;

  // STEP 4: Idempotency check — cegah double insert
  const alreadyProcessed = await isPaymentAlreadyProcessed(env, orderId);
  if (alreadyProcessed) {
    log.info("Webhook duplikat diabaikan", { order_id: orderId });
    return okResponse("Sudah diproses sebelumnya");
  }

  // STEP 5: Tentukan tipe akses
  const { access_type, package_id } = resolveAccessType(rawPackageId);
  log.info("Tipe akses ditentukan", {
    user_id: userId,
    access_type,
    package_id,
  });

  // STEP 6: Insert payment
  const paymentResult = await insertPayment(env, {
    orderId,
    userId,
    packageId: package_id,
    amount: body.gross_amount,
  });

  if (!paymentResult.ok) {
    log.error("Gagal insert payment", {
      order_id: orderId,
      status: paymentResult.status,
      // Tampilkan error code saja, bukan full response
      error_code: paymentResult.data?.code || "unknown",
    });
    return errorResponse("Gagal menyimpan data payment", 500);
  }

  log.info("Payment berhasil disimpan", { order_id: orderId });

  // STEP 7: Insert akses user
  const accessResult = await insertAccess(env, {
    userId,
    packageId: package_id,
    accessType: access_type,
  });

  if (!accessResult.ok) {
    log.error("Gagal insert user_package_access", {
      user_id: userId,
      package_id,
      status: accessResult.status,
      error_code: accessResult.data?.code || "unknown",
    });
    // Payment sudah tersimpan, akses gagal — log untuk manual recovery
    log.warn("PERLU MANUAL RECOVERY: payment tersimpan tapi akses gagal", {
      order_id: orderId,
      user_id: userId,
      package_id,
    });
    return errorResponse("Gagal memberikan akses ke user", 500);
  }

  log.info("Akses user berhasil diberikan", {
    user_id: userId,
    access_type,
    package_id,
  });
  log.info("Webhook selesai diproses", { order_id: orderId });

  return okResponse("Webhook berhasil diproses");
}

// ================================================================
// MAIN FETCH HANDLER
// ================================================================
export default {
  async fetch(request, env, ctx) {

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const method = request.method;

    log.info("Request masuk", { path: url.pathname, method });

    // Health check
    if (url.pathname === "/health" && method === "GET") {
      return okResponse("Worker aktif");
    }

    // Create transaction
    if (url.pathname === "/create-transaction" && method === "POST") {
      return handleCreateTransaction(request, env);
    }

    // Midtrans webhook
    if (url.pathname === "/midtrans-webhook" && method === "POST") {
      return handleMidtransWebhook(request, env);
    }

    // Route tidak ditemukan
    log.warn("Route tidak ditemukan", { path: url.pathname, method });
    return errorResponse("Route tidak ditemukan", 404);
  },
};
