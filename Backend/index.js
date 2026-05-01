
const http = require("http");
const pool = require("./db");

const { z } = require("zod");

const leadSchema = z.object({
  name: z.string().min(1, "Name required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  source: z.enum(["Call", "WhatsApp", "Field"]),
});

const statusSchema = z.object({
  id: z.number(),
  status: z.enum(["Interested", "Not Interested", "Converted"]),
});


const server = http.createServer(async (req, res) => {

 //  CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  //  VERY IMPORTANT: handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
  res.writeHead(200, { "Content-Type": "text/plain" });
  return res.end("API is running 🚀");
}

  // ADD LEAD
  if (req.method === "POST" && req.url === "/add") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const parsedBody = JSON.parse(body);

      //  ZOD VALIDATION
      const result = leadSchema.safeParse(parsedBody);

      if (!result.success) {
        res.statusCode = 400;
        return res.end(JSON.stringify(result.error));
      }

      const { name, phone, source } = result.data;

      await pool.query(
        "INSERT INTO leads (name, phone, source) VALUES ($1, $2, $3)",
        [name, phone, source]
      );

      res.end(JSON.stringify({ message: "Lead added " }));

    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Server error" }));
    }
  });
} 


else if (req.method === "GET" && req.url === "/leads") {
  try {
    const result = await pool.query("SELECT * FROM leads ORDER BY id DESC");

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result.rows));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Failed to fetch leads" }));
  }
}

else if (req.method === "PUT" && req.url === "/update") {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const parsedBody = JSON.parse(body);

      //  VALIDATION
      const result = statusSchema.safeParse(parsedBody);

      if (!result.success) {
        res.statusCode = 400;
        return res.end(JSON.stringify(result.error));
      }

      const { id, status } = result.data;

      await pool.query(
        "UPDATE leads SET status=$1 WHERE id=$2",
        [status, id]
      );

      res.end(JSON.stringify({ message: "Status updated " }));

    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Server error" }));
    }
  });
}


else if (req.method === "DELETE" && req.url.startsWith("/delete/")) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
const parts = url.pathname.split("/");
const id = parseInt(parts[2]);

    if (!id) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid ID" }));
    }

    await pool.query("DELETE FROM leads WHERE id=$1", [id]);

    res.end(JSON.stringify({ message: "Lead deleted " }));

  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Server error" }));
  }
}



});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});