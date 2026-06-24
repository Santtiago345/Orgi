"use client";
import { useState, useRef } from "react";
import { Upload, FileText, Check } from "lucide-react";
import { uploadPDF, getImportStatus } from "@/lib/api/pdf";

export default function PDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importId, setImportId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadPDF(file);
      setImportId(result.import_id);
      setStatus("procesando");

      // Poll for completion
      const interval = setInterval(async () => {
        const imp = await getImportStatus(result.import_id);
        if (imp.status !== "procesando") {
          setStatus(imp.status);
          clearInterval(interval);
        }
      }, 2000);
    } catch (err: any) {
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-card p-8">
        <h3 className="font-semibold text-lg mb-2">Importar Extracto Bancario</h3>
        <p className="text-sm text-neutral-600 mb-6">Sube un extracto PDF de tu banco para importar automáticamente las transacciones.</p>

        <div
          className="border-2 border-dashed border-neutral-200 rounded-xl p-12 text-center hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText size={24} className="text-primary" />
              <div className="text-left">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-neutral-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <>
              <Upload size={40} className="mx-auto mb-4 text-neutral-400" />
              <p className="text-neutral-600">Arrastra tu PDF aquí o haz click para seleccionar</p>
              <p className="text-xs text-neutral-400 mt-2">Máximo 10MB</p>
            </>
          )}
        </div>

        {file && !uploading && (
          <button
            onClick={handleUpload}
            className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90"
          >
            Subir e Importar
          </button>
        )}

        {uploading && (
          <div className="mt-4 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-neutral-600">Procesando extracto...</p>
          </div>
        )}

        {status && status !== "procesando" && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            status === "completado" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}>
            {status === "completado" ? <Check size={20} /> : <FileText size={20} />}
            <span className="text-sm">
              {status === "completado" ? "Importación completada exitosamente" : "Error durante la importación"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
