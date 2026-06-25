"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Check, AlertCircle, Loader2, X } from "lucide-react";
import { uploadPDF, getImportStatus } from "@/lib/api/pdf";

interface TransactionPreview {
  index: number;
  fecha: string;
  descripcion: string;
  cantidad: string;
  categoria_sugerida: string;
  confianza: number;
  confirm: boolean;
}

interface Props {
  onSuccess?: () => void;
  defaultAccountId?: number;
}

export default function PDFUploader({ onSuccess, defaultAccountId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importId, setImportId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [bankName, setBankName] = useState("");
  const [transactions, setTransactions] = useState<TransactionPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (f.type !== "application/pdf" && !f.name.endsWith(".pdf")) return "Solo se aceptan archivos PDF";
    if (f.size > 10 * 1024 * 1024) return "El archivo no puede superar los 10MB";
    return null;
  };

  const handleFile = (f: File) => {
    const error = validateFile(f);
    if (error) { setErrorMessage(error); return; }
    setFile(f);
    setErrorMessage("");
    setStatus("idle");
    setTransactions([]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("uploading");
    setErrorMessage("");

    try {
      const result = await uploadPDF(file, defaultAccountId);
      setImportId(result.import_id);
      setStatus("processing");

      const poll = setInterval(async () => {
        try {
          const imp = await getImportStatus(result.import_id);
          setBankName(imp.bank_name || "");
          if (imp.status !== "procesando") {
            setStatus(imp.status as "completed" | "error");
            if (imp.status === "completado") {
              if (imp.transactions_found > 0) {
                setTransactions(
                  Array.from({ length: imp.transactions_found }, (_, i) => ({
                    index: i,
                    fecha: "",
                    descripcion: "",
                    cantidad: "",
                    categoria_sugerida: "",
                    confianza: 0.5,
                    confirm: true,
                  }))
                );
              }
              onSuccess?.();
            }
            if (imp.status === "error") setErrorMessage(imp.error_message || "Error desconocido");
            clearInterval(poll);
          }
        } catch { clearInterval(poll); setStatus("error"); setErrorMessage("Error al consultar el estado"); }
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.response?.data?.detail || err?.message || "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImportId(null);
    setStatus("idle");
    setErrorMessage("");
    setBankName("");
    setTransactions([]);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-primary/50"
        } ${file ? "bg-neutral-50" : ""}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {file ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); reset(); }} className="ml-auto p-1.5 text-neutral-400 hover:text-danger rounded-lg hover:bg-danger/10">
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={36} className="mx-auto mb-3 text-neutral-400" />
            <p className="text-neutral-600 font-medium">Arrastra tu extracto PDF aquí</p>
            <p className="text-xs text-neutral-400 mt-1">o haz click para seleccionar &middot; Máximo 10MB</p>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-3 p-3 bg-danger/10 text-danger rounded-lg text-sm">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      {status === "uploading" && (
        <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg text-sm text-primary">
          <Loader2 size={16} className="animate-spin" />
          Subiendo archivo...
        </div>
      )}

      {status === "processing" && (
        <div className="space-y-3 p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Loader2 size={16} className="animate-spin" />
            Procesando extracto{bankName ? ` — ${bankName}` : ""}...
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      )}

      {status === "completed" && (
        <div className="flex items-center gap-3 p-3 bg-success/10 text-success rounded-lg text-sm">
          <Check size={16} />
          Importación completada exitosamente
        </div>
      )}

      {file && status === "idle" && (
        <button onClick={handleUpload} disabled={uploading} className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
          Subir e Importar
        </button>
      )}
    </div>
  );
}
