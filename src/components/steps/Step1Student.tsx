import { User, BookOpen, School } from "lucide-react";
import type { StudentData } from "../../types/enrollment";
import { GRADES } from "../../data/sedes";
import FormField from "../ui/FormField";

interface Props {
  data: StudentData;
  onChange: (data: StudentData) => void;
}

export default function Step1Student({ data, onChange }: Props) {
  const update = (
    field: keyof StudentData,
    value: string | boolean
  ) => onChange({ ...data, [field]: value });

  const currentGrades =
    data.level === "initial"
      ? GRADES.initial
      : data.level === "primary"
        ? GRADES.primary
        : data.level === "secondary"
          ? GRADES.secondary
          : [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <User size={16} className="text-orange-600" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Datos del Estudiante
          </h2>
        </div>

        <p className="text-slate-500 text-sm ml-10">
          Ingresa la información personal del alumno que deseas matricular.
        </p>
      </div>

      {/* Personal Info */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <User size={13} /> Información Personal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombres *" required>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Ej: Valentina"
              className="input-field"
            />
          </FormField>

          <FormField label="Apellidos *" required>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Ej: García Mendoza"
              className="input-field"
            />
          </FormField>

          <FormField label="DNI del Estudiante *">
            <input
              type="text"
              value={data.dni}
              onChange={(e) =>
                update(
                  "dni",
                  e.target.value.replace(/\D/g, "").slice(0, 8)
                )
              }
              placeholder="00000000"
              maxLength={8}
              className="input-field font-mono tracking-widest"
            />
          </FormField>

          <FormField label="Fecha de Nacimiento *">
            <input
              type="date"
              value={data.birthDate}
              onChange={(e) => update("birthDate", e.target.value)}
              className="input-field"
            />
          </FormField>

          <FormField label="Género *">
            <select
              value={data.gender}
              onChange={(e) => update("gender", e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Prefiero no indicar</option>
            </select>
          </FormField>

          <FormField label="Necesidades especiales">
            <select
              value={data.specialNeeds}
              onChange={(e) => update("specialNeeds", e.target.value)}
              className="input-field"
            >
              <option value="">Ninguna</option>
              <option value="visual">Discapacidad visual</option>
              <option value="auditiva">Discapacidad auditiva</option>
              <option value="motriz">Discapacidad motriz</option>
              <option value="tea">TEA (Espectro Autista)</option>
              <option value="tdah">TDAH</option>
              <option value="otra">Otra</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={13} />
          Información Académica
        </h3>

        {/* Botón inicial */}
        {!data.showLevels && (
          <button
            type="button"
            onClick={() => update("showLevels", true)}
            className="btn-primary w-full"
          >
            Seleccionar nivel académico
          </button>
        )}

        {/* Opciones */}
        {data.showLevels && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            {[
              {
                id: "initial",
                label: "Inicial",
                icon: "🎨",
                desc: "3 – 5 años",
              },
              {
                id: "primary",
                label: "Primaria",
                icon: "📚",
                desc: "1° – 6°",
              },
              {
                id: "secondary",
                label: "Secundaria",
                icon: "🎓",
                desc: "1° – 5°",
              },
            ].map((lv) => {
              const isSelected = data.level === lv.id;

              return (
                <button
                  key={lv.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange({
                      ...data,
                      level: lv.id,
                      grade: "",
                      showLevels: true,
                    });
                  }}
                  className={`
                    level-select-btn
                    border-2
                    transition-all duration-200
                    ${isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }
                  `}
                >
                  <span className="text-2xl mb-1 block">{lv.icon}</span>

                  <span className="font-bold text-sm block">
                    {lv.label}
                  </span>

                  <span className="text-xs text-slate-400 block">
                    {lv.desc}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grado */}
        {data.level && (
          <FormField label="Grado al que postula *">
            <select
              value={data.grade}
              onChange={(e) => update("grade", e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar grado...</option>

              {currentGrades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </FormField>
        )}
      </div>

      {/* Previous School */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <School size={13} />
          Colegio Anterior
        </h3>

        <FormField label="Nombre del colegio de procedencia">
          <input
            type="text"
            value={data.previousSchool}
            onChange={(e) =>
              update("previousSchool", e.target.value)
            }
            placeholder="Ej: I.E. San Martín de Porres (dejar vacío si es primer año)"
            className="input-field"
          />
        </FormField>
      </div>
    </div>
  );
}