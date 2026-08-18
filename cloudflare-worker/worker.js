export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      if (url.pathname === "/webhook" && request.method === "POST") {
        const update = await request.json();
  
        console.log("Telegram update:", update);
  
        return new Response("OK");
      }
  
      if (url.pathname === "/set-webhook") {
        return new Response("Worker is running");
      }
  
      return new Response("Cloudflare Worker OK");
    }
  };