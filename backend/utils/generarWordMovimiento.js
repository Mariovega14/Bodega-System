import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
} from "docx";

export const generarWordMovimiento = async (mov) => {
    const doc = new Document({
        sections: [
            {
                children: [
                    // Título
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "📄 Orden de Movimiento",
                                bold: true,
                                size: 32,
                            }),
                        ],
                        spacing: { after: 300 },
                    }),

                    // Tabla bonita
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            fila("SKU", mov.sku || "N/A"),
                            fila("Coordenada", mov.coordenada || "N/A"),
                            fila("Tipo", capitalize(mov.tipo) || "N/A"),
                            fila("Fecha", new Date(mov.fecha).toLocaleString("es-CL")),
                        ],
                    }),

                    // Pie de página opcional
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "\nGenerado automáticamente por el sistema de Bodega",
                                italics: true,
                                color: "888888",
                                size: 20,
                            }),
                        ],
                        spacing: { before: 400 },
                    }),
                ],
            },
        ],
    });

    return await Packer.toBuffer(doc);
};

// Helper para crear filas limpias
function fila(label, valor) {
    return new TableRow({
        children: [
            new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: label, bold: true })],
                    }),
                ],
            }),
            new TableCell({
                children: [
                    new Paragraph({
                        children: [new TextRun({ text: valor })],
                    }),
                ],
            }),
        ],
    });
}

// Capitaliza texto tipo 'ingreso' -> 'Ingreso'
function capitalize(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
}
