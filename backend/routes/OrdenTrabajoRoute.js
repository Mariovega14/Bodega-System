import express from "express";
import fs from "fs";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";

const router = express.Router();

router.post("/generar", async (req, res) => {
  const { resultados } = req.body;

  console.log("✅ Solicitud recibida en /api/ordenes/generar");
  console.log("📄 Generando documento con:", resultados);

  if (!resultados || !Array.isArray(resultados)) {
    return res.status(400).json({ error: "Datos inválidos para generar ODT" });
  }

  const now = new Date();
  const fechaFormato = now.toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    hour12: false
  });

  const nombreArchivo = `ODT_${now.toISOString().replace(/[:.]/g, "-")}.docx`;

  // ✅ Crear documento vacío
  const doc = new Document();

  // ✅ Armar contenido en una única sección
  const seccionContenido = [
    new Paragraph({
      children: [
        new TextRun({
          text: "ORDEN DE TRABAJO - Ingreso de Productos",
          bold: true,
          size: 28
        })
      ]
    }),
    new Paragraph(""),
    new Paragraph({
      children: [new TextRun({ text: `Fecha de generación: ${fechaFormato}`, size: 22 })]
    }),
    new Paragraph("")
  ];

  resultados
    .filter((r) => r.estado === "ok")
    .forEach((r) => {
      seccionContenido.push(new Paragraph(`SKU: ${r.sku}`));
      seccionContenido.push(
        new Paragraph(`Ubicación Asignada: ${r.mensaje.replace("Ingresado en ", "")}`)
      );
      seccionContenido.push(new Paragraph(""));
    });

  doc.addSection({
    properties: {},
    children: seccionContenido
  });

  try {
    const buffer = await Packer.toBuffer(doc);
    const rutaArchivo = path.join("ordenes", nombreArchivo);

    fs.mkdirSync("ordenes", { recursive: true });
    fs.writeFileSync(rutaArchivo, buffer);

    res.download(rutaArchivo, nombreArchivo, (err) => {
      if (err) {
        console.error("❌ Error al descargar archivo:", err);
        res.status(500).send("Error al generar el documento");
      } else {
        fs.unlinkSync(rutaArchivo);
        console.log("✅ Documento enviado y eliminado:", nombreArchivo);
      }
    });
  } catch (error) {
    console.error("❌ Error al generar el documento Word:", error);
    res.status(500).send("Error al generar el documento Word");
  }
});

export default router;
