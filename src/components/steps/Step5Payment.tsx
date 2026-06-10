import { CreditCard, Shield, Check, Zap } from "lucide-react";
import type { PaymentData, SedeData } from "../../types/enrollment";
import { SEDES, PAYMENT_FEATURES } from "../../data/sedes";

interface Props {
  data: PaymentData;
  sede: SedeData;
  onChange: (data: PaymentData) => void;
}

export default function Step5Payment({ data, sede, onChange }: Props) {
  const update = (field: keyof PaymentData, value: string | boolean) =>
    onChange({ ...data, [field]: value });

  // Obtener información de la sede seleccionada
  const sedeInfo = SEDES.find((s) => s.id === sede.sede);
  const matricula = sedeInfo?.matrícula || 0;
  const pension = sedeInfo?.pensión || 0;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{0,2})/, "$1/$2");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <CreditCard size={16} className="text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Pago de Matrícula</h2>
        </div>
        <p className="text-slate-500 text-sm ml-10">Completa los datos del pago para asegurar tu vacante en {sedeInfo?.name || "la sede seleccionada"}.</p>
      </div>

      {/* Info de matrícula */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-yellow-400" />
          <p className="font-bold">Información de Matrícula</p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="opacity-80">Sede seleccionada</span>
            <span className="font-semibold">{sedeInfo?.name || "No seleccionada"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-80">Derecho de matrícula</span>
            <span className="font-semibold">S/ {matricula}.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-80">Pensión mensual</span>
            <span className="font-semibold">S/ {pension}.00</span>
          </div>
          <div className="border-t border-white/20 pt-3 flex justify-between">
            <span className="font-bold">Pago de matrícula a realizar</span>
            <span className="text-2xl font-black">S/ {matricula}.00</span>
          </div>
        </div>
      </div>

      {/* Servicios incluidos */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Servicios incluidos en tu matrícula</h3>
        <div className="grid grid-cols-2 gap-3">
          {PAYMENT_FEATURES.map((feature, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Método de Pago */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Método de Pago</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "card", label: "Tarjeta de Crédito/Débito", icon: "💳" },
            { id: "transfer", label: "Transferencia Bancaria", icon: "🏦" },
            { id: "yape", label: "Yape / Plin", icon: "📱" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => update("method", m.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer
                ${data.method === m.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}
              `}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className={`text-sm font-semibold ${data.method === m.id ? "text-blue-700" : "text-slate-700"}`}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      {data.method === "card" && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Shield size={13} /> Datos de la tarjeta
            <span className="ml-auto flex items-center gap-1 text-green-600 font-semibold normal-case text-xs">
              <Shield size={11} /> Pago seguro SSL
            </span>
          </h3>
          {/* Card visual */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg mb-2">
            <div className="flex justify-between mb-6">
              <div className="w-10 h-7 bg-yellow-400 rounded-md opacity-90" />
              <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
                <circle cx="15" cy="14" r="10" fill="#EB001B" opacity="0.8" />
                <circle cx="25" cy="14" r="10" fill="#F79E1B" opacity="0.8" />
              </svg>
            </div>
            <p className="font-mono text-lg tracking-[0.2em] mb-4">
              {data.cardNumber || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between text-xs">
              <div>
                <p className="opacity-60">TITULAR</p>
                <p className="font-semibold uppercase">{data.cardName || "NOMBRE APELLIDO"}</p>
              </div>
              <div className="text-right">
                <p className="opacity-60">VENCE</p>
                <p className="font-semibold">{data.cardExpiry || "MM/AA"}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Número de tarjeta</label>
              <input
                type="text"
                value={data.cardNumber}
                onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="input-field font-mono tracking-widest"
                maxLength={19}
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Nombre del titular</label>
              <input
                type="text"
                value={data.cardName}
                onChange={(e) => update("cardName", e.target.value.toUpperCase())}
                placeholder="COMO APARECE EN LA TARJETA"
                className="input-field uppercase"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Fecha de vencimiento</label>
              <input
                type="text"
                value={data.cardExpiry}
                onChange={(e) => update("cardExpiry", formatExpiry(e.target.value))}
                placeholder="MM/AA"
                className="input-field font-mono"
                maxLength={5}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">CVV</label>
              <input
                type="password"
                value={data.cardCvv}
                onChange={(e) => update("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                className="input-field font-mono"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transfer info */}
      {data.method === "transfer" && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Datos bancarios</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Banco", value: "BCP" },
              { label: "Tipo de cuenta", value: "Corriente en Soles" },
              { label: "N° de cuenta", value: "191-12345678-0-20" },
              { label: "CCI", value: "002-191-001234567890-20" },
              { label: "RUC", value: "20600190101" },
              { label: "Razón social", value: "Innova Schools S.A.C." },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-3 border border-slate-200">
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="font-semibold text-sm text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">⚠️ Enviar comprobante a <strong>matricula@innovaschools.edu.pe</strong> con asunto "Matrícula 2026 – [DNI estudiante]"</p>
        </div>
      )}

      {/* Yape/Plin */}
      {data.method === "yape" && (
        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center gap-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Escanea el código QR</h3>
          <div className="w-36 h-36 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center">
            <div className="grid grid-cols-7 gap-0.5 p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-sm ${Math.random() > 0.4 ? "bg-slate-800" : "bg-white"}`} />
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-800">📱 987 654 321</p>
            <p className="text-xs text-slate-500">Yape / Plin – Innova Schools SAC</p>
          </div>
          <p className="text-xs text-slate-500 text-center">Monto a transferir: <strong className="text-blue-700">S/ {matricula}.00</strong> (matrícula)</p>
        </div>
      )}

      {/* Terms */}
      <div className="space-y-3">
        {[
          { key: "acceptTerms" as keyof PaymentData, label: "Acepto los Términos y Condiciones de matrícula y el Reglamento Institucional de Innova Schools." },
          { key: "acceptPrivacy" as keyof PaymentData, label: "Acepto la Política de Privacidad y el tratamiento de datos personales conforme a la Ley N° 29733." },
        ].map((term) => (
          <label key={term.key} className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => update(term.key, !data[term.key])}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer
                ${data[term.key] ? "bg-blue-600 border-blue-600" : "border-slate-300 group-hover:border-blue-400"}
              `}
            >
              {data[term.key] && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-slate-600">{term.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
