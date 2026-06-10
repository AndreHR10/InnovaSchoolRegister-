import { FileText, CheckCircle, Info, X } from "lucide-react";
import type { DocumentData } from "../../types/enrollment";

interface Props {
  data: DocumentData;
  onChange: (data: DocumentData) => void;
}

const REQUIRED_DOCS = [
  {
    key: "birthCertificate" as keyof DocumentData,
    label: "Partida de Nacimiento",
    desc: "Original o copia legalizada",
    required: true,
    icon: "📋",
  },
  {
    key: "dniCopy" as keyof DocumentData,
    label: "Copia DNI del estudiante",
    desc: "Legible y vigente (2 copias)",
    required: true,
    icon: "🪪",
  },
  {
    key: "photos" as keyof DocumentData,
    label: "Fotografías recientes",
    desc: "4 fotos tamaño carnet con fondo blanco",
    required: true,
    icon: "📸",
  },
  {
    key: "reportCard" as keyof DocumentData,
    label: "Libreta de Notas / Certificado de Estudios",
    desc: "Último año cursado (original o copia simple)",
    required: true,
    icon: "📊",
  },
  {
    key: "medicalCert" as keyof DocumentData,
    label: "Certificado Médico",
    desc: "Emitido en los últimos 3 meses",
    required: false,
    icon: "🏥",
  },
  {
    key: "vaccinationCard" as keyof DocumentData,
    label: "Tarjeta de Vacunación",
    desc: "Copia actualizada (MINSA)",
    required: false,
    icon: "💉",
  },
];

export default function Step4Documents({ data, onChange }: Props) {
  const uploadFileFor = (key: keyof DocumentData) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.jpeg,.png";
    input.onchange = () => {
      const file = input.files?.[0] || null;
      handleUploadFile(key, file);
    };
    input.click();
  };

  const handleUploadFile = (key: keyof DocumentData, file: File | null) => {
    if (!file) return;
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Solo se permiten archivos PDF, JPG o PNG");
      return;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`El archivo ${file.name} excede el tamaño máximo de 5MB`);
      return;
    }

    const uploadedFiles = { ...(data.uploadedFiles || {}) } as Record<string, File>;
    uploadedFiles[key as string] = file;
    onChange({ ...(data as DocumentData), uploadedFiles, [key]: true } as DocumentData & { uploadedFiles: Record<string, File> });
  };

  const removeFile = (key: string) => {
    const uploadedFiles = { ...(data.uploadedFiles || {}) } as Record<string, File>;
    delete uploadedFiles[key];
    onChange({ ...(data as DocumentData), uploadedFiles, [key]: false } as DocumentData & { uploadedFiles: Record<string, File> });
  };

  const completedRequired = REQUIRED_DOCS.filter((d) => d.required && !!data[d.key]).length;
  const totalRequired = REQUIRED_DOCS.filter((d) => d.required).length;
  const progress = Math.round((completedRequired / totalRequired) * 100);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <FileText size={16} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Documentos Requeridos</h2>
        </div>
        <p className="text-slate-500 text-sm ml-10">Marca los documentos que ya tienes listos para presentar al momento de la matrícula.</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Documentos obligatorios listos</p>
          <span className={`text-sm font-bold ${progress === 100 ? "text-green-600" : "text-orange-500"}`}>
            {completedRequired} / {totalRequired}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-orange-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> ¡Tienes todos los documentos obligatorios!
          </p>
        )}
      </div>

      {/* Documents list */}
      <div className="space-y-3">
        {REQUIRED_DOCS.map((doc) => {
          const isUploaded = !!data.uploadedFiles && !!data.uploadedFiles[doc.key as string];
          const file = data.uploadedFiles ? data.uploadedFiles[doc.key as string] : undefined;
          return (
            <div
              key={doc.key}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200` +
                (isUploaded ? " border-green-400 bg-green-50" : " border-slate-200 bg-white hover:border-slate-300")
              }
            >
              <span className="text-2xl shrink-0">{doc.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-semibold text-sm ${isUploaded ? "text-green-800" : "text-slate-800"}`}>
                    {doc.label}
                  </p>
                  {doc.required ? (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold shrink-0">Obligatorio</span>
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold shrink-0">Opcional</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{doc.desc}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {isUploaded ? (
                  <>
                    <a
                      href={URL.createObjectURL(file as File)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline mr-2"
                    >
                      Ver
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFile(doc.key as string)}
                      className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <X size={18} className="text-red-500" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => uploadFileFor(doc.key)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                  >
                    Subir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">¿Cómo entregar los documentos?</p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Presencialmente en la sede el día de la matrícula</li>
            <li>O envíalos escaneados a <span className="font-semibold">matricula@innovaschools.edu.pe</span></li>
            <li>Plazo máximo: <strong>15 de diciembre 2026</strong></li>
          </ul>
        </div>
      </div>

      {/* Archivos subidos */}
      {data.uploadedFiles && Object.keys(data.uploadedFiles).length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">Archivos subidos ({Object.keys(data.uploadedFiles).length})</p>
          <div className="space-y-2">
            {Object.entries(data.uploadedFiles).map(([fileName, file]) => (
              <div
                key={fileName}
                className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {file.type === "application/pdf" ? (
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-600">PDF</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">IMG</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{fileName}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(fileName)}
                  className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <X size={18} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
