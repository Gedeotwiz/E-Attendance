interface StatusBadgeProps {
  status: "Present" | "Absent" | "Active" | "Inactive";
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const styles = {
    Present: "bg-green-50 text-green-600",
    Active: "bg-green-50 text-green-600",
    Absent: "bg-red-50 text-red-600",
    Inactive: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-2.5 py-1
        text-[10px] font-semibold
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}