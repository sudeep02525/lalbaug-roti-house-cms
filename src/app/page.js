"use client";
import { Card } from "@/components/ui/card";
import {
  UtensilsCrossed,
  Video,
  Home,
  Info,
  Phone,
  Settings,
  UserCircle,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const sections = [
    {
      title: "Manage Menu",
      desc: "Edit categories, products, prices",
      icon: <UtensilsCrossed className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      href: "/menu",
    },
    {
      title: "Manage Videos",
      desc: "Upload promotional gallery videos",
      icon: <Video className="w-8 h-8 text-violet-500" />,
      bg: "bg-violet-100 dark:bg-violet-900/30",
      href: "/media",
    },
    {
      title: "Home Content",
      desc: "Edit landing page and hero image",
      icon: <Home className="w-8 h-8 text-green-500" />,
      bg: "bg-green-100 dark:bg-green-900/30",
      href: "/content-home",
    },
    {
      title: "About Content",
      desc: "Edit About Us story and details",
      icon: <Info className="w-8 h-8 text-amber-500" />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      href: "/content-about",
    },
    {
      title: "Footer",
      desc: "Edit phone, address, and map",
      icon: <Phone className="w-8 h-8 text-rose-500" />,
      bg: "bg-rose-100 dark:bg-rose-900/30",
      href: "/content-contact",
    },
    {
      title: "Settings",
      desc: "Manage website logo and config",
      icon: <Settings className="w-8 h-8 text-slate-500" />,
      bg: "bg-slate-100 dark:bg-slate-800/50",
      href: "/settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2">
          CMS Dashboard
        </h1>
        <p className="text-[var(--muted-foreground)] font-medium">
          Welcome! Choose a section to manage your website content.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, i) => (
          <Link key={i} href={section.href}>
            <Card className="glass-panel premium-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group overflow-hidden relative cursor-pointer h-48 flex flex-col items-center justify-center text-center p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className={`p-4 rounded-3xl ${section.bg} shadow-sm transition-transform group-hover:rotate-6 group-hover:scale-110 duration-300 mb-4 z-10`}
              >
                {section.icon}
              </div>

              <div className="z-10">
                <h3 className="text-lg font-bold tracking-tight text-[var(--foreground)] drop-shadow-sm mb-1">
                  {section.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] font-medium">
                  {section.desc}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
