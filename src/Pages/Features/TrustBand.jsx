import { BadgeCheck, MapPinned, Sparkles } from "lucide-react";
import { useTheme } from "../../Context/ThemeProvider";

const items = [
  {
    icon: BadgeCheck,
    title: "Verifiable certificates",
    text: "Every seal carries a code anyone can check.",
  },
  {
    icon: MapPinned,
    title: "Built for Bangladesh",
    text: "Roadmaps and roles tuned to the local market.",
  },
  {
    icon: Sparkles,
    title: "AI-backed feedback",
    text: "Every answer scored and explained by AI.",
  },
];

const TrustBand = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className={`py-16 transition-colors duration-500 ${isDark ? "bg-[#050816]" : "bg-slate-50"}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid divide-y rounded-3xl border md:grid-cols-3 md:divide-y-0 ${
            isDark
              ? "border-white/10 bg-white/5 divide-white/10"
              : "border-slate-200 bg-white divide-slate-200 shadow-sm"
          }`}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-4 px-6 py-5 ${
                  index > 0 ? (isDark ? "md:border-l md:border-white/10" : "md:border-l md:border-slate-200") : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Icon size={18} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                    {item.title}
                  </p>
                  <p className={`mt-0.5 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBand;