"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4 text-gray-300">
        Bienvenido al sistema Nostward. Aquí podrás gestionar tus subscripciones
        y créditos.
      </p>
      <div className="space-y-4 flex flex-col">
        <Link href="/dashboard/subscriptions" className="mb-2">
          <Button className="w-full bg-[#151515] hover:bg-gray-800 text-gray-100">
            Gestionar subscripciones
          </Button>
        </Link>
        <Link href="/dashboard/credits" className="mb-2">
          <Button className="w-full bg-[#151515] hover:bg-gray-800 text-gray-100">
            Gestionar créditos
          </Button>
        </Link>
      </div>
    </div>
  );
}
