import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "blue" | "green" | "red" | "purple";
}

const variants = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "blue",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-[11px] text-slate-400">
              {description}
            </p>
          )}

        </div>


        <div
          className={`
            flex h-9 w-9 items-center
            justify-center rounded-lg
            ${variants[variant]}
          `}
        >
          <Icon size={18} />
        </div>

      </div>

    </div>
  );
}