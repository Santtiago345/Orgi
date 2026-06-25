"use client";
import PDFUploader from "@/components/pdf/PDFUploader";
import { FileText } from "lucide-react";

export default function PDFPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-800">Importar Extracto Bancario</h2>
        <p className="text-sm text-neutral-500 mt-0.5">Sube un PDF de tu banco para importar transacciones automáticamente</p>
      </div>
      <div className="max-w-xl">
        <div className="card p-6">
          <PDFUploader />
        </div>
      </div>
    </div>
  );
}
