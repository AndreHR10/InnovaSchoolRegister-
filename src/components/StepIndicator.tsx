import { Check } from "lucide-react";
import type { Step } from "../types/enrollment";

const STEPS = [
  { number: 1, label: "Estudiante" },
  { number: 2, label: "Apoderado" },
  { number: 3, label: "Sede & Turno" },
  { number: 4, label: "Documentos" },
  { number: 5, label: "Pago" },
];

interface Props {
  currentStep: Step;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 via-green-500 to-blue-600 z-0 transition-all duration-700"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm
                  ${isCompleted ? "bg-green-500 border-green-500 text-white shadow-green-200" : ""}
                  ${isActive ? "bg-blue-600 border-blue-600 text-white shadow-blue-200 scale-110 shadow-md" : ""}
                  ${!isCompleted && !isActive ? "bg-white border-slate-300 text-slate-400" : ""}
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
              </div>
              <span
                className={`mt-2 text-xs font-semibold transition-colors duration-300 hidden sm:block
                  ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
