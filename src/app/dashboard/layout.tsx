"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CreditCard, Bell, LogOut } from "lucide-react";
import { STORAGE_KEY } from "@/config";
import { useConfig, useNostr } from "@lawallet/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeSigner } = useNostr();
  const config = useConfig();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmation: boolean = confirm(
      "¿Estás seguro que quieres cerrar sesión?"
    );

    if (confirmation) {
      await config.storage.removeItem(STORAGE_KEY);
      initializeSigner(undefined);
      router.push("/");
    }
  };

  return (
    <div className="flex h-screen bg-[#0c0c0c]">
      <aside className="w-64 bg-[#151515] text-gray-100 shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Nostward</h1>
        </div>
        <nav className="mt-8">
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#252525] hover:text-gray-100"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/subscriptions"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#252525] hover:text-gray-100"
          >
            <Bell className="mr-2 h-4 w-4" />
            Subscripciones
          </Link>
          <Link
            href="/dashboard/credits"
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#252525] hover:text-gray-100"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Créditos
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button
            className="w-full flex items-center justify-center bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-10 bg-[#0c0c0c] text-gray-100">{children}</main>
    </div>
  );
}
