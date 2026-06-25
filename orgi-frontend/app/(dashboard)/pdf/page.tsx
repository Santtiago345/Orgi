"use client";
import PDFUploader from "@/components/pdf/PDFUploader";

export default function PDFPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-card p-8">
        <h3 className="font-semibold text-lg mb-2">Importar Extracto Bancario</h3>
        <p className="text-sm text-neutral-600 mb-6">
          Sube un extracto PDF de tu banco para importar automáticamente las transacciones.
        </p>
        <PDFUploader />
      </div>
    </div>
  );
}
