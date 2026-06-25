"use client";
import PDFUploader from "@/components/pdf/PDFUploader";
import { FileText } from "lucide-react";

export default function PDFPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="page-title">Importar Extracto Bancario</h2>
        <p className="page-subtitle">Sube un PDF de tu banco para importar transacciones automaticamente</p>
      </div>
      <div className="max-w-xl">
        <div className="card p-6 animate-fade-in-up">
          <PDFUploader />
        </div>
      </div>
    </div>
  );
}
