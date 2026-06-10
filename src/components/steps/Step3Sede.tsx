import { MapPin, Clock, AlertCircle } from "lucide-react";
import type { SedeData } from "../../types/enrollment";
import { SEDES } from "../../data/sedes";

interface Props {
  data: SedeData;
  onChange: (data: SedeData) => void;
}

const TURNS = [
  { id: "mañana", label: "Turno Mañana", hours: "7:30 am – 1:00 pm", icon: "🌅" },
  { id: "tarde", label: "Turno Tarde", hours: "1:15 pm – 6:45 pm", icon: "☀️" },
];

export default function Step3Sede({ data, onChange }: Props) {
  const update = (field: keyof SedeData, value: string) =>
    onChange({ ...data, [field]: value });

  const selectedSede = SEDES.find((s) => s.id === data.sede);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <MapPin size={16} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sede y Turno</h2>
        </div>
        <p className="text-slate-500 text-sm ml-10">Elige la sede Innova más cercana a ti y el turno disponible.</p>
      </div>

      {/* Sede Selection */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <MapPin size={13} /> Selecciona tu Sede
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SEDES.map((sede) => {
            const isFull = sede.vacantes <= 5;
            const isSelected = data.sede === sede.id;
            return (
              <button
                key={sede.id}
                type="button"
                onClick={() => update("sede", sede.id)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${isSelected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-300"}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-bold text-sm ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                      Innova Schools – {sede.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin size={10} /> {sede.address}
                    </p>
                    <p className="text-xs text-slate-400">{sede.district}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${isFull ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}
                      `}
                    >
                      {sede.vacantes} vacantes
                    </span>
                    {isSelected && (
                      <div className="mt-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {isFull && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <AlertCircle size={10} /> Pocas vacantes disponibles — ¡reserva ahora!
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Turn Selection */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Clock size={13} /> Turno Escolar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TURNS.map((turn) => (
            <button
              key={turn.id}
              type="button"
              onClick={() => update("turn", turn.id)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer
                ${data.turn === turn.id ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}
              `}
            >
              <span className="text-3xl">{turn.icon}</span>
              <div className="text-left">
                <p className={`font-bold ${data.turn === turn.id ? "text-blue-700" : "text-slate-800"}`}>{turn.label}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> {turn.hours}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected summary */}
      {selectedSede && data.turn && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <p className="text-sm font-semibold opacity-80 mb-2">✅ Resumen de tu selección</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/10 rounded-xl p-3">
              <p className="text-xs opacity-70">Sede</p>
              <p className="font-bold">Innova Schools – {selectedSede.name}</p>
              <p className="text-xs opacity-70">{selectedSede.address}</p>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3">
              <p className="text-xs opacity-70">Turno</p>
              <p className="font-bold">{TURNS.find(t => t.id === data.turn)?.label}</p>
              <p className="text-xs opacity-70">{TURNS.find(t => t.id === data.turn)?.hours}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
