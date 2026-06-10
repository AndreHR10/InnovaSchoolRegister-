import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Phone, Mail, Globe } from "lucide-react";
import Logo from "./components/Logo";
import StepIndicator from "./components/StepIndicator";
import Step1Student from "./components/steps/Step1Student";
import Step2Parent from "./components/steps/Step2Parent";
import Step3Sede from "./components/steps/Step3Sede";
import Step4Documents from "./components/steps/Step4Documents";
import Step5Payment from "./components/steps/Step5Payment";
import SuccessScreen from "./components/SuccessScreen";
import { submitEnrollment } from "./lib/enrollmentService";
import type { Step, EnrollmentForm } from "./types/enrollment";

const INITIAL_FORM: EnrollmentForm = {
  student: {
    firstName: "", lastName: "", dni: "", birthDate: "", gender: "",
    grade: "", level: "", previousSchool: "", specialNeeds: "",
  },
  parent: {
    relationship: "", firstName: "", lastName: "", dni: "", email: "",
    phone: "", occupation: "", address: "", district: "",
    emergencyContact: "", emergencyPhone: "",
  },
  sede: { sede: "", turn: "", schedule: "" },
  documents: {
    birthCertificate: false, dniCopy: false, photos: false,
    reportCard: false, medicalCert: false, vaccinationCard: false,
  },
  payment: {
    method: "", cardNumber: "", cardName: "", cardExpiry: "",
    cardCvv: "", acceptTerms: false, acceptPrivacy: false,
  },
};

function validateStep(step: Step, form: EnrollmentForm): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!form.student.firstName) errors.push("Nombre del estudiante requerido");
    if (!form.student.lastName) errors.push("Apellido del estudiante requerido");
    if (!form.student.dni || form.student.dni.length < 8) errors.push("DNI del estudiante (8 dígitos)");
    if (!form.student.birthDate) errors.push("Fecha de nacimiento requerida");
    if (!form.student.gender) errors.push("Género requerido");
    if (!form.student.level) errors.push("Nivel educativo requerido");
    if (!form.student.grade) errors.push("Grado requerido");
  }
  if (step === 2) {
    if (!form.parent.relationship) errors.push("Vínculo con el estudiante requerido");
    if (!form.parent.firstName) errors.push("Nombre del apoderado requerido");
    if (!form.parent.lastName) errors.push("Apellido del apoderado requerido");
    if (!form.parent.dni || form.parent.dni.length < 8) errors.push("DNI del apoderado requerido");
    if (!form.parent.email) errors.push("Correo electrónico requerido");
    if (!form.parent.phone) errors.push("Teléfono requerido");
    if (!form.parent.emergencyContact) errors.push("Contacto de emergencia requerido");
    if (!form.parent.emergencyPhone) errors.push("Teléfono de emergencia requerido");
    if (!form.parent.address) errors.push("Dirección requerida");
    if (!form.parent.district) errors.push("Distrito requerido");
  }
  if (step === 3) {
    if (!form.sede.sede) errors.push("Selecciona una sede");
    if (!form.sede.turn) errors.push("Selecciona un turno");
  }
  if (step === 5) {
    if (!form.payment.method) errors.push("Selecciona un método de pago");
    if (form.payment.method === "card") {
      const digits = form.payment.cardNumber.replace(/\D/g, "");
      if (digits.length !== 16) errors.push("Número de tarjeta debe tener 16 dígitos");
      if (!form.payment.cardName) errors.push("Nombre del titular es requerido");
      if (!/^([0-1][0-9])\/[0-9]{2}$/.test(form.payment.cardExpiry)) errors.push("Fecha de vencimiento inválida");
      if (form.payment.cardCvv.length < 3) errors.push("CVV inválido");
    }
    if (!form.payment.acceptTerms) errors.push("Debes aceptar los Términos y Condiciones");
    if (!form.payment.acceptPrivacy) errors.push("Debes aceptar la Política de Privacidad");
  }
  return errors;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [form, setForm] = useState<EnrollmentForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [submissionError, setSubmissionError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setSubmissionError("");
    setIsLoading(true);

    const response = await submitEnrollment(form);

    setIsLoading(false);

    if (!response.success) {
      setSubmissionError(response.error ?? "Error al procesar la matrícula. Intenta nuevamente.");
      return;
    }

    setSubmitted(true);
  };

  const goNext = async () => {
    const errs = validateStep(currentStep, form);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);

    if (currentStep === 5) {
      await handleSubmit();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setCurrentStep(1);
    setSubmitted(false);
    setErrors([]);
  };

  if (submitted) return <SuccessScreen form={form} onReset={reset} />;

  const STEP_TITLES: Record<Step, string> = {
    1: "Datos del Estudiante",
    2: "Datos del Apoderado",
    3: "Sede y Turno",
    4: "Lista de Documentos",
    5: "Plan y Pago",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white py-2 px-4 text-xs flex items-center justify-center gap-6">
        <span className="flex items-center gap-1"><Phone size={11} /> (01) 700-1200</span>
        <span className="hidden sm:flex items-center gap-1"><Mail size={11} /> matricula@innovaschools.edu.pe</span>
        <span className="flex items-center gap-1"><Globe size={11} /> innovaschools.edu.pe</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Matrícula</p>
            <p className="text-xl font-black text-blue-700">2026</p>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-start gap-4">
            <div className="bg-white/15 rounded-2xl p-3 shrink-0 mt-1">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">🔥 Vacantes limitadas</span>
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Año escolar 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-2">Matricula a tu hijo en <br className="hidden sm:block" />Innova Schools 2026</h1>
              <p className="text-blue-100 text-sm mt-2 max-w-xl">
                Sé parte de la red educativa más innovadora de Latinoamérica. Aprendizaje activo, tecnología y autonomía estudiantil en un solo lugar.
              </p>
              {/* Pillars */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["🤖 Robótica", "🌍 Inglés desde inicial", "💡 Aprendizaje activo", "📱 Plataforma digital"].map((p) => (
                  <span key={p} className="bg-white/15 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Step indicator */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Paso {currentStep} de 5</p>
              <p className="text-lg font-bold text-slate-800">{STEP_TITLES[currentStep]}</p>
            </div>
            <span className="text-xs text-slate-400">
              {Math.round(((currentStep - 1) / 4) * 100)}% completado
            </span>
          </div>
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Form area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {currentStep === 1 && (
            <Step1Student data={form.student} onChange={(d) => setForm((f) => ({ ...f, student: d }))} />
          )}
          {currentStep === 2 && (
            <Step2Parent data={form.parent} onChange={(d) => setForm((f) => ({ ...f, parent: d }))} />
          )}
          {currentStep === 3 && (
            <Step3Sede data={form.sede} onChange={(d) => setForm((f) => ({ ...f, sede: d }))} />
          )}
          {currentStep === 4 && (
            <Step4Documents data={form.documents} onChange={(d) => setForm((f) => ({ ...f, documents: d }))} />
          )}
          {currentStep === 5 && (
            <Step5Payment sede={form.sede} data={form.payment} onChange={(d) => setForm((f) => ({ ...f, payment: d }))} />
          )}
        </div>

        {/* Errors */}
        {(errors.length > 0 || submissionError) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            {errors.length > 0 ? (
              <>
                <p className="text-red-700 font-semibold text-sm mb-2">⚠️ Por favor completa los siguientes campos:</p>
                <ul className="space-y-1">
                  {errors.map((e, i) => (
                    <li key={i} className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-red-700 font-semibold text-sm">{submissionError}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button onClick={goBack} className="btn-secondary">
              <ArrowLeft size={16} /> Anterior
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={goNext}
            disabled={isLoading}
            className="btn-primary ml-auto min-w-[160px]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Procesando...
              </span>
            ) : currentStep === 5 ? (
              <>Confirmar Matrícula <Sparkles size={16} /></>
            ) : (
              <>Siguiente <ArrowRight size={16} /></>
            )}
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🔒", title: "Pago Seguro", desc: "Encriptación SSL 256-bit" },
            { icon: "✅", title: "Dato Protegido", desc: "Ley N° 29733" },
            { icon: "🏆", title: "+145 sedes", desc: "En todo el Perú" },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-xl p-3 border border-slate-200 text-center">
              <p className="text-xl mb-1">{b.icon}</p>
              <p className="text-xs font-bold text-slate-700">{b.title}</p>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500">
                © 2026 Innova Schools S.A.C. | RUC: 20600190101
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Av. La Encalada 1611, Surco, Lima – Perú
              </p>
              <div className="flex gap-4 justify-center sm:justify-end mt-2">
                {["Términos y condiciones", "Política de privacidad", "Libro de Reclamaciones"].map((link) => (
                  <a key={link} href="#" className="text-xs text-blue-500 hover:underline">{link}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
