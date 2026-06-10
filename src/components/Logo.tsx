export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: 28, md: 40, lg: 56 };
  const d = dims[size];
  const textClass = size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl";

  return (
    <div className="flex items-center gap-2">
      {/* Abstract leaf/book icon with 3 overlapping shapes */}
      <svg width={d} height={d} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Orange shape - top left */}
        <ellipse cx="20" cy="18" rx="14" ry="10" transform="rotate(-30 20 18)" fill="#F97316" opacity="0.95" />
        {/* Green shape - bottom */}
        <ellipse cx="28" cy="38" rx="14" ry="10" transform="rotate(10 28 38)" fill="#22C55E" opacity="0.95" />
        {/* Blue shape - right */}
        <ellipse cx="38" cy="22" rx="13" ry="9" transform="rotate(50 38 22)" fill="#3B82F6" opacity="0.95" />
        {/* White center glow */}
        <circle cx="28" cy="26" r="6" fill="white" opacity="0.4" />
      </svg>
      <div>
        <span className={`font-black tracking-tight ${textClass} text-blue-700`}>Innova</span>
        <span className={`font-semibold ${textClass} text-slate-600 ml-1`}>Schools</span>
      </div>
    </div>
  );
}
