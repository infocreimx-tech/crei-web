/**
 * exportToExcel.ts
 * Utilitario compartido para exportar datos a Excel (.xlsx)
 * Usa la librería `xlsx` (SheetJS)
 */
import * as XLSX from "xlsx";

export interface ExcelSheet {
  /** Nombre de la pestaña */
  sheetName: string;
  /** Filas de datos — array de objetos con cabeceras como keys */
  rows: Record<string, string | number | null | undefined>[];
}

/**
 * Genera y descarga un archivo Excel con una o varias pestañas.
 * @param sheets  Array de hojas a incluir
 * @param fileName Nombre del archivo sin extensión
 */
export function exportToExcel(sheets: ExcelSheet[], fileName: string): void {
  const workbook = XLSX.utils.book_new();

  for (const { sheetName, rows } of sheets) {
    if (rows.length === 0) {
      // Hoja vacía con encabezado informativo
      const ws = XLSX.utils.aoa_to_sheet([["Sin datos para el período seleccionado"]]);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName.slice(0, 31));
      continue;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      // Las cabeceras se toman del primer objeto
      header: Object.keys(rows[0]),
    });

    // Ancho automático por columna
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(
        key.length,
        ...rows.map((r) => String(r[key] ?? "").length)
      ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  }

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/** Formatea fecha ISO a DD/MM/YYYY */
export function fmtFecha(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Formatea número a moneda MXN legible para Excel */
export function fmtMXN(n: number | string | null | undefined): string {
  const num = +(n ?? 0);
  return `$${num.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
