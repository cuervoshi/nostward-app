"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Credits() {
  const [selectedCredits, setSelectedCredits] = useState<string>("");
  const transactions = [
    { id: 1, type: "Compra", amount: 100, date: "2023-05-01" },
    { id: 2, type: "Gasto", amount: -50, date: "2023-05-15" },
  ];

  const creditOptions = [
    { value: "100", label: "100 créditos" },
    { value: "1000", label: "1000 créditos" },
    { value: "10000", label: "10000 créditos" },
  ];

  const calculateSats = (credits: number) => Math.floor(credits / 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Créditos</h1>
      <p className="mb-4 text-gray-300">Créditos disponibles: 0</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-[#151515] hover:bg-gray-800 text-gray-100 border-none">
            Comprar créditos
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#151515] text-gray-100">
          <DialogHeader>
            <DialogTitle>Comprar créditos</DialogTitle>
            <DialogDescription>
              Selecciona la cantidad de créditos que deseas comprar.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setSelectedCredits}>
            <SelectTrigger className="bg-[#0c0c0c] text-gray-100 border-gray-700">
              <SelectValue placeholder="Selecciona cantidad de créditos" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c0c0c] text-gray-100 border-gray-700">
              {creditOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCredits && (
            <p>Precio: {calculateSats(parseInt(selectedCredits))} sats</p>
          )}
          <DialogFooter>
            <Button className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none">
              Generar factura
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#151515] border-b border-gray-700">
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Tipo</TableHead>
            <TableHead className="text-gray-300">Cantidad</TableHead>
            <TableHead className="text-gray-300">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((trans) => (
            <TableRow key={trans.id} className="border-b border-gray-700">
              <TableCell className="text-gray-300">{trans.id}</TableCell>
              <TableCell className="text-gray-300">{trans.type}</TableCell>
              <TableCell className="text-gray-300">{trans.amount}</TableCell>
              <TableCell className="text-gray-300">{trans.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
