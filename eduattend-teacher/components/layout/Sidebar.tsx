"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { navigation } from "@/data/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-slate-200 bg-white">

      {/* Logo */}

      <div className="flex h-[72px] items-center gap-2 border-b border-slate-100 px-6">

        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
          A
        </div>

        <span className="text-sm font-bold text-slate-800">
          EduAttend
        </span>

      </div>


      {/* Navigation */}

      <nav className="flex-1 space-y-1 px-3 py-5">

        {navigation.map((item) => {

          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition
                ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              <Icon size={16} />

              <span>{item.label}</span>
            </Link>
          );
        })}

      </nav>


      {/* Logout */}

      <div className="border-t border-slate-100 p-3">

        <button
          className="
            flex w-full items-center gap-3 rounded-lg
            px-3 py-2.5 text-sm font-medium
            text-slate-500 transition
            hover:bg-red-50 hover:text-red-600
          "
        >

          <LogOut size={16} />

          Logout

        </button>

      </div>

    </aside>
  );
}