export const config = {
    api: {
      bodyParser: false, // Disable default body parsing
    },
  };
  
  export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const formData = new FormData();
      const file = req.body.get("file");
      formData.append("file", file);
  
      const response = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }