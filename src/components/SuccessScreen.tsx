import { useMemo } from "react";
import { CheckCircle, Download, Share2, Home, MapPin } from "lucide-react";
import Logo from "./Logo";
import type { EnrollmentForm } from "../types/enrollment";
import { SEDES } from "../data/sedes";

interface Props {
  form: EnrollmentForm;
  onReset: () => void;
}

export default function SuccessScreen({ form, onReset }: Props) {
  const sede = SEDES.find((s) => s.id === form.sede.sede);
  const code = useMemo(() => `INN-2026-${Math.floor(Math.random() * 90000) + 10000}`, []);
  const paymentMethodLabel =
    form.payment.method === "card"
      ? "Tarjeta de Credito/Debito"
      : form.payment.method === "transfer"
      ? "Transferencia Bancaria"
      : form.payment.method === "yape"
      ? "Yape / Plin"
      : "No especificado";

  const maskedCardNumber = form.payment.cardNumber
    ? form.payment.cardNumber.replace(/\d(?=\d{4})/g, "*")
    : "";

  const buildPdfContent = () => {
    const date = new Date().toLocaleDateString("es-PE");
    const header = "INNOVA SCHOOLS";
    const title = "COMPROBANTE DE MATRICULA";
    const lines = [
      "",
      "DATOS DEL ESTUDIANTE",
      `Nombre: ${form.student.firstName} ${form.student.lastName}`,
      `DNI: ${form.student.dni}`,
      `Grado: ${form.student.grade}`,
      `Nivel: ${form.student.level === "initial" ? "Inicial" : form.student.level === "primary" ? "Primaria" : "Secundaria"}`,
      "",
      "DATOS DEL APODERADO",
      `Nombre: ${form.parent.firstName} ${form.parent.lastName}`,
      `Email: ${form.parent.email}`,
      `Telefono: ${form.parent.phone}`,
      "",
      "SEDE Y TURNO",
      `Sede: ${sede?.name || "No especificada"}`,
      `Turno: ${form.sede.turn}`,
      "",
      "METODO DE PAGO",
      `Metodo: ${paymentMethodLabel}`,
      form.payment.method === "card" ? `Tarjeta: ${maskedCardNumber}` : "",
      "",
      "INSTRUCCIONES IMPORTANTES",
      "- Conserva este comprobante para tu visita a la sede.",
      "- Si pagaste por transferencia o Yape/Plin, conserva el recibo digital.",
      "- Presenta este comprobante al momento de tu cita.",
    ].filter(Boolean);

    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 60;
    const maxChars = Math.floor((pageWidth - 2 * margin) / 7);

    const escapeText = (value: string) =>
      value.replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    let pdf = "%PDF-1.4\n";
    const streams = [];

    const content = [
      "0.5 w",
      "40 780 m",
      "555 780 l",
      "555 60 l",
      "40 60 l",
      "h",
      "S",
      "0.75 w",
      "40 748 m",
      "555 748 l",
      "S",
      "BT",
      "/F2 18 Tf",
      "60 730 Td",
      `(${escapeText(header)}) Tj`,
      "0 -24 Td",
      "/F2 14 Tf",
      `(${escapeText(title)}) Tj`,
      "0 -28 Td",
      "/F1 10 Tf",
      `(${escapeText(`Código: ${code}`)}) Tj`,
      "0 -14 Td",
      `(${escapeText(`Fecha: ${date}`)}) Tj`,
      "0 -20 Td",
    ];

    lines.forEach((line) => {
      if (!line) {
        content.push("0 -14 Td");
        return;
      }

      const isSection = [
        "DATOS DEL ESTUDIANTE",
        "DATOS DEL APODERADO",
        "SEDE Y TURNO",
        "METODO DE PAGO",
        "INSTRUCCIONES IMPORTANTES",
      ].includes(line);

      if (isSection) {
        content.push("0 -10 Td");
        content.push("/F2 12 Tf");
        content.push(`(${escapeText(line)}) Tj`);
        content.push("0 -16 Td");
        content.push("/F1 10 Tf");
        return;
      }

      const wrapped = line.length > maxChars ? `${line.slice(0, maxChars - 3)}...` : line;
      content.push(`(${escapeText(wrapped)}) Tj`);
      content.push("0 -14 Td");
    });
    content.push("0 -18 Td");
    content.push("/F1 9 Tf");
    content.push(`(Documento generado por Innova Schools. Conserva este comprobante para tu proceso de matrícula.) Tj`);
    content.push("ET");

    const streamData = content.join("\n");
    const streamLength = new TextEncoder().encode(streamData).length;

    streams.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
    streams.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
    streams.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`);
    streams.push(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj\n`);
    streams.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
    streams.push(`6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

    for (const stream of streams) {
      pdf += stream;
    }

    const xrefStart = pdf.length;
    pdf += "xref\n0 7\n0000000000 65535 f\n";

    let offset = pdf.indexOf("1 0 obj");
    for (let i = 1; i < 7; i++) {
      pdf += `${offset.toString().padStart(10, "0")} 00000 n\n`;
      offset = pdf.indexOf(`${i + 1} 0 obj`, offset + 1) || pdf.length;
    }

    pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return pdf;
  };

  const downloadReceipt = () => {
    const pdf = buildPdfContent();
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `comprobante-matricula-${code}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shareReceipt = async () => {
    const text = `Comprobante de Matricula\nCodigo: ${code}\nEstudiante: ${form.student.firstName} ${form.student.lastName}\nSede: ${sede?.name || "No especificada"}\nMetodo de pago: ${paymentMethodLabel}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Comprobante de Matricula",
          text,
        });
      } catch {
        // Silenciar si el usuario cancela compartir
      }
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      window.alert("Texto del comprobante copiado al portapapeles.");
      return;
    }
    window.alert("Tu navegador no soporta la opcion de compartir. Puedes descargar el comprobante en su lugar.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <Logo size="md" />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={44} className="text-white" />
            </div>
            <h1 className="text-2xl font-black mb-1">Matricula Exitosa!</h1>
            <p className="opacity-90 text-sm">
              Tu vacante para el año escolar 2026 ha sido reservada
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4">
            <p className="text-xs opacity-80 mb-1">Codigo de matricula</p>
            <p className="text-2xl font-black tracking-widest font-mono">
              {code}
            </p>
            <p className="text-xs opacity-70 mt-1">
              Guarda este codigo — lo necesitaras en la sede
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Estudiante
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {form.student.firstName} {form.student.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {form.student.grade} -
                  {form.student.level === "initial"
                    ? " Inicial"
                    : form.student.level === "primary"
                    ? " Primaria"
                    : " Secundaria"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-400 font-semibold mb-1">
                  Apoderado
                </p>
                <p className="font-bold text-slate-800 text-sm">
                  {form.parent.firstName} {form.parent.lastName}
                </p>
                <p className="text-xs text-slate-500">
                  {form.parent.email}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-2">
              <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-500 font-semibold">Sede</p>
                <p className="font-bold text-blue-800 text-sm">
                  {sede?.name}
                </p>
                <p className="text-xs text-blue-600">
                  Turno {form.sede.turn}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Metodo de pago</p>
              <p className="font-bold text-slate-800 text-sm">{paymentMethodLabel}</p>
              {form.payment.method === "card" && (
                <p className="text-xs text-slate-500 mt-1">{maskedCardNumber}</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
              <p className="font-bold mb-3 flex items-center gap-2">
                <span className="text-yellow-400">📋</span>
                Proximos pasos
              </p>

              <ol className="space-y-2 text-sm">
                {[
                  `Recibiras un correo de confirmacion en ${form.parent.email}`,
                  "Descarga o imprime este comprobante de matricula",
                  "Presenta los documentos en la sede asignada",
                  "Te contactaremos para completar el proceso de matricula",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-xs flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="opacity-90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadReceipt}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl transition-colors"
            >
              <Download size={16} />
              Descargar comprobante
            </button>

            <button
              onClick={shareReceipt}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-5 rounded-xl transition-colors"
            >
              <Share2 size={16} />
              Compartir
            </button>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-semibold py-2 transition-colors"
        >
          <Home size={15} />
          Volver al inicio
        </button>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Necesitas ayuda? Contactanos:
          </p>
          <p className="font-bold text-blue-700">📞 (01) 700-1200</p>
          <p className="text-sm text-slate-500">
            matricula@innovaschools.edu.pe
          </p>
        </div>
      </div>
    </div>
  );
}
