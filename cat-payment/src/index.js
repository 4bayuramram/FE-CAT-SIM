cat > (src / index.js) << "EOF";
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/create-transaction" && request.method === "POST") {
      return new Response(
        JSON.stringify({
          message: "create-transaction endpoint ready",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("CAT Payment Worker Running", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
EOF;
