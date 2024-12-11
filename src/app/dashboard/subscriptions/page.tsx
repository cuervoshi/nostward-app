"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Subscriptions() {
  const subscriptions = [
    { id: 1, name: "Subscription 1", status: "Active", eventCount: 100 },
    { id: 2, name: "Subscription 2", status: "Inactive", eventCount: 50 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Subscripciones</h1>
      <Link href="/subscriptions/create">
        <Button className="mb-4 bg-[#151515] hover:bg-gray-800 text-gray-100 border-none">
          Crear subscripción
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#151515] border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Nombre</TableHead>
            <TableHead className="text-gray-300">Estado</TableHead>
            <TableHead className="text-gray-300">Cantidad de eventos</TableHead>
            <TableHead className="text-gray-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id} className="border-b border-gray-700">
              <TableCell className="text-gray-300">{sub.id}</TableCell>
              <TableCell className="text-gray-300">{sub.name}</TableCell>
              <TableCell className="text-gray-300">{sub.status}</TableCell>
              <TableCell className="text-gray-300">{sub.eventCount}</TableCell>
              <TableCell className="text-gray-300">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
