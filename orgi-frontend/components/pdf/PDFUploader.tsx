"use client";
import { useState } from "react";
import apiClient from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PDFUploader() {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: async (f: File) => {
      const formData = new FormData();
      formData.append("file", f);
      const { data } = await apiClient.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setFile(null);
    },
  });

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center gap-4 p-10 border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:border-primary/30 hover:bg-primary/[0.02] transition-all group active:scale-[0.99]">
        <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
          <Upload size={26} className="text-primary group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-neutral-700">Selecciona un archivo PDF</p>
          <p className="text-sm text-neutral-400 mt-0.5">Extractos bancarios, máx 10 MB</p>
        </div>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
      </label>

      {file && !upload.isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-primary-light rounded-xl border border-primary/10 animate-fade-in-up">
          <FileText size={20} className="text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{file.name}</p>
            <p className="text-xs text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            onClick={() => upload.mutate(file)}
            disabled={upload.isPending}
            className="btn-primary !py-2"
          >
            {upload.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {upload.isPending ? "Procesando..." : "Subir"}
          </button>
        </div>
      )}

      {upload.isError && (
        <div className="flex items-center gap-2.5 bg-danger-light text-danger text-sm p-3.5 rounded-xl border border-danger/10 animate-fade-in">
          <AlertCircle size={16} className="shrink-0" />
          {upload.error instanceof Error ? upload.error.message : "Error al procesar el PDF"}
        </div>
      )}

      {upload.isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-success-light rounded-xl border border-success/20 animate-scale-in">
          <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
            <CheckCircle size={20} className="text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">PDF procesado exitosamente</p>
            {upload.data?.transactions_imported > 0 && (
              <p className="text-xs text-success/80">{upload.data.transactions_imported} transacciones importadas</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
