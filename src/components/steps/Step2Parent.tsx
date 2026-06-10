import { Users, MapPin, Phone } from "lucide-react";
import type { ParentData } from "../../types/enrollment";
import FormField from "../ui/FormField";

interface Props {
  data: ParentData;
  onChange: (data: ParentData) => void;
}

const DISTRICTS = [
  "Ate", "Barranco", "Breña", "Callao", "Carabayllo", "Chorrillos", "Comas",
  "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria",
  "Lima", "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar",
  "Miraflores", "Pueblo Libre", "Puente Piedra", "Rímac", "San Borja",
  "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores",
  "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita",
  "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"
];

export default function Step2Parent({ data, onChange }: Props) {
  const update = (field: keyof ParentData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Users size={16} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Datos del Apoderado</h2>
        </div>
        <p className="text-slate-500 text-sm ml-10">Información del padre, madre o tutor legal responsable del alumno.</p>
      </div>

      {/* Relationship */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Users size={13} /> Vínculo con el estudiante
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: "padre", label: "Padre", icon: "👨" },
            { id: "madre", label: "Madre", icon: "👩" },
            { id: "tutor", label: "Tutor Legal", icon: "🧑‍⚖️" },
            { id: "otro", label: "Otro", icon: "👤" },
          ].map((rel) => (
            <button
              key={rel.id}
              type="button"
              onClick={() => update("relationship", rel.id)}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer
                ${data.relationship === rel.id
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 bg-white hover:border-green-300"
                }`}
            >
              <span className="text-2xl mb-1">{rel.icon}</span>
              <span className={`text-xs font-semibold ${data.relationship === rel.id ? "text-green-700" : "text-slate-600"}`}>
                {rel.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Personal data */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Users size={13} /> Información Personal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nombres *">
            <input type="text" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Ej: Carlos" className="input-field" />
          </FormField>
          <FormField label="Apellidos *">
            <input type="text" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Ej: Mendoza Ríos" className="input-field" />
          </FormField>
          <FormField label="DNI *">
            <input
              type="text"
              value={data.dni}
              onChange={(e) => update("dni", e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="00000000"
              maxLength={8}
              className="input-field font-mono tracking-widest"
            />
          </FormField>
          <FormField label="Ocupación">
            <input type="text" value={data.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="Ej: Docente" className="input-field" />
          </FormField>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Phone size={13} /> Contacto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Correo electrónico *" hint="Recibirás confirmación en este correo">
            <input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="ejemplo@correo.com" className="input-field" />
          </FormField>
          <FormField label="Teléfono / Celular *">
            <input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="987 654 321" className="input-field" />
          </FormField>
          <FormField label="Contacto de emergencia *">
            <input type="text" value={data.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} placeholder="Nombre completo" className="input-field" />
          </FormField>
          <FormField label="Teléfono de emergencia *">
            <input type="tel" value={data.emergencyPhone} onChange={(e) => update("emergencyPhone", e.target.value)} placeholder="987 000 111" className="input-field" />
          </FormField>
        </div>
      </div>

      {/* Address */}
      <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <MapPin size={13} /> Domicilio
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Dirección completa *">
            <input type="text" value={data.address} onChange={(e) => update("address", e.target.value)} placeholder="Av. Principal 123, Dpto 5" className="input-field sm:col-span-2" />
          </FormField>
          <FormField label="Distrito *">
            <select value={data.district} onChange={(e) => update("district", e.target.value)} className="input-field">
              <option value="">Seleccionar distrito...</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
        </div>
      </div>
    </div>
  );
}
