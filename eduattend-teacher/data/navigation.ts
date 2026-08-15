import {
  LayoutDashboard,
  QrCode,
  ClipboardCheck,
  Users,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Generate QR Code",
    href: "/generate-qr",
    icon: QrCode,
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const logoutNavigation = {
  label: "Logout",
  href: "/logout",
  icon: LogOut,
};