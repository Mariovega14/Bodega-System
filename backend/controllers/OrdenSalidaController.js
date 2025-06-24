import { Document, Packer, Paragraph, TextRun } from "docx";

export const generarOrdenSalida = async (req, res) => {
    const { resultados } = req.body;

    console.log("📝 Generando documento de salida con:", resultados);

    if (!resultados || !Array.isArray(resultados)) {
        return res.status(400).json({ error: "Datos inválidos para generar orden de salida" });
    }

    const now = new Date();
    const fechaFormato = now.toLocaleString("es-CL", {
        timeZone: "America/Santiago",
        hour12: false,
    });

    const nombreArchivo = `Salida_${now.toISOString().replace(/[:.]/g, "-")}.docx`;

    const contenido = [
        new Paragraph({
            children: [
                new TextRun({
                    text: "ORDEN DE SALIDA",
                    bold: true,
                    size: 28,
                }),
            ],
        }),
        new Paragraph(""),
        new Paragraph({
            children: [
                new TextRun({ text: `Fecha de generación: ${fechaFormato}`, size: 22 }),
            ],
        }),
        new Paragraph(""),
    ];

    resultados.forEach((r) => {
        contenido.push(new Paragraph(`SKU: ${r.sku}`));
        contenido.push(new Paragraph(`Coordenadas retiradas: ${r.coordenadas?.join(", ") || "—"}`));
        contenido.push(new Paragraph(`${r.mensaje || ""}`));
        contenido.push(new Paragraph(""));
    });

    const doc = new Document({
        creator: "Sistema de Bodega",
        title: "Orden de Salida",
        description: "Documento generado automáticamente",
        sections: [
            {
                properties: {},
                children: contenido,
            },
        ],
    });

    try {
        const buffer = await Packer.toBuffer(doc);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${nombreArchivo}"`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        res.send(buffer);
        console.log("✅ Orden de salida generada correctamente");
    } catch (error) {
        console.error("❌ Error al generar el documento Word:", error);
        res.status(500).send("Error al generar el documento Word");
    }
};
