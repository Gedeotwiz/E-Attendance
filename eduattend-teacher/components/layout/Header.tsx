"use client";

import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  return (
    <header className="fixed left-[220px] right-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Search */}

      <div className="relative w-[260px]">

        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="
            h-9 w-full rounded-lg
            border border-slate-200
            bg-slate-50
            pl-9 pr-3
            text-sm outline-none
            placeholder:text-slate-400
            focus:border-blue-400
            focus:bg-white
          "
        />

      </div>


      {/* Right */}

      <div className="flex items-center gap-5">

        <button className="text-slate-500 hover:text-slate-900">
          <Bell size={17} />
        </button>


        <div className="flex cursor-pointer items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            JT
          </div>

          <div className="hidden text-left sm:block">

            <p className="text-xs font-semibold text-slate-800">
              John Teacher
            </p>

            <p className="text-[10px] text-slate-400">
              Teacher
            </p>

          </div>

          <ChevronDown
            size={14}
            className="text-slate-400"
          />

        </div>

      </div>

    </header>
  );
}