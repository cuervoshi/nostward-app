"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0c0c0c]">
      <div className="w-full max-w-md space-y-8 p-10 bg-[#151515] rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-100">
          Bienvenido a Nostward
        </h1>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Pega tu clave privada"
              className="flex-grow bg-[#0c0c0c] text-gray-100 placeholder-gray-400 border-gray-700"
            />
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
            >
              Login
            </Button>
          </div>
          <Button
            className="w-full bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Conectarse con la extensión
          </Button>
        </div>
        <p className="text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link
            href="#"
            className="text-gray-300 hover:text-gray-100 hover:underline"
          >
            Crea una ahora
          </Link>
        </p>
      </div>
    </div>
  );
}
