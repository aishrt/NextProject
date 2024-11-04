const express = require("express");
const next = require("next");
const path = require("path");
require("dotenv").config();
const http = require("http");
const nodeEnv = process.env.NODE_ENV ?? "development";
const port = process.env.PDF_PORT ?? 3001;
const dev = nodeEnv !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const cors = require("cors");
const axios = require("axios");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
// app.prepare().then(() => {
const server = express();
server.use(cors());
server.set("views", path.join(__dirname, "/views"));
server.set("view engine", "hbs");
server.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);
server.use(express.json());
server.use(express.static(path.join(__dirname, "public/uploads")));
server.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

server.post("/claimPdf", async (req, res) => {
  try {
    const url = `${process.env?.NEXT_PUBLIC_PDF_URL}/reportPdf`;
    // Fetch HTML content from the provided URL
    const htmlContentResponse = await axios.post(url, req.body);
    const htmlContent = htmlContentResponse.data;
    let options = { format: "A4" };
    let file = { content: htmlContent };
    // Generate PDF from HTML content
    html_to_pdf
      .generatePdf(file, options)
      .then((pdfBuffer) => {
        const name = `${Date.now()}-pdf.pdf`;
        const filePath = path.join(process.cwd(), "public/uploads", name);
        // Write the PDF buffer to a file
        fs.writeFileSync(filePath, pdfBuffer);
        const url1 = `${process.env?.NEXT_PUBLIC_PDF_URL}/uploads/${name}`;
        return res.json({ pdf: url1 });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: error.message, error: error.stack });
      });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ message: error.message, error: error.stack });
  }
});
server.get("/pdf", (req, res) => {
  return res.render("home");
});
server.get("/", (req, res) => {
  return res.json("mathias pdf");
});
server.post("/reportPdf", (req, res) => {
  const data = req.body;
  return res.render("report", data);
});
server.get("/generate-pdf", async (req, res) => {
  try {
    const url = `${process.env?.NEXT_PUBLIC_PDF_URL}/pdf`;
    // Fetch HTML content from the provided URL
    const htmlContentResponse = await axios.get(url);
    const htmlContent = htmlContentResponse.data;
    let options = { format: "A4" };
    let file = { content: htmlContent };
    // Generate PDF from HTML content
    html_to_pdf
      .generatePdf(file, options)
      .then((pdfBuffer) => {
        const name = `${Date.now()}-pdf.pdf`;
        const filePath = path.join(process.cwd(), "public/uploads", name);
        // Write the PDF buffer to a file
        fs.writeFileSync(filePath, pdfBuffer);
        const url1 = `${process.env?.NEXTAUTH_URL}/uploads/${name}`;
        return res.json({ pdf: url1 });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: error.message, error: error.stack });
      });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ message: error.message, error: error.stack });
  }
});

// server.get("*", (req, res) => {
//   return handle(req, res);
// });

// server.put("*", (req, res) => {
//   return handle(req, res);
// });

// server.delete("*", (req, res) => {
//   return handle(req, res);
// });
const nodeServer = http.createServer(server);
require("./sockets/index")(nodeServer);
nodeServer.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
// });
