"use client";

import type { Metadata } from "next";
import withAuth from "@/components/withAuth";
import Link from "next/link";

// Import ikon dari lucide-react
import { Package, Layers, Building, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Master Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "Halaman utama untuk manajemen master data",
};

const menuItems = [
  {
    title: "Paket",
    href: "/master-paket",
    icon: <Package size={24} />,
    description: "Kelola data paket layanan",
  },
  {
    title: "Subpaket",
    href: "/master-subpaket",
    icon: <Layers size={24} />,
    description: "Kelola subpaket terkait",
  },
  {
    title: "Cabang",
    href: "/master-cabang",
    icon: <Building size={24} />,
    description: "Daftar dan pengaturan cabang",
  },
  {
    title: "Berita",
    href: "/master-berita",
    icon: <Newspaper size={24} />,
    description: "Manajemen konten berita",
  },
];

function MasterDashboard() {
  return (
    <main className="flex-1 p-6 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto bg-card rounded-lg shadow-md p-6 border border-border">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Menu Master Data
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block p-6 bg-white dark:bg-muted border border-border rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="text-primary">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default withAuth(MasterDashboard);
