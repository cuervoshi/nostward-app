"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCredits from "@/hooks/useCredits";
import { buildBuyCreditsEvent } from "@/lib/events";
import { buyCreditsRequest } from "@/lib/interceptors";
import {
  nowInSeconds,
  useConfig,
  useIdentity,
  useSubscription,
} from "@lawallet/react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { copy } from "@/lib/utils";
import { NDKKind, NostrEvent } from "@nostr-dev-kit/ndk";
import { NOSTWARD_ADMIN_KEY } from "@/config";

const creditOptions = [
  { value: "100", label: "100 créditos" },
  { value: "1000", label: "1000 créditos" },
  { value: "10000", label: "10000 créditos" },
];

export default function Credits() {
  const identity = useIdentity();
  const config = useConfig();

  const { credits, creditsLog } = useCredits();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<{ pr: string; createdAt: number }>({
    pr: "",
    createdAt: 0,
  });
  const [selectedCredits, setSelectedCredits] = useState<string>("");

  const { events: zapEvents } = useSubscription({
    filters: [
      {
        kinds: [9735 as NDKKind],
        authors: [config.modulePubkeys.urlx],
        "#p": [NOSTWARD_ADMIN_KEY],
        since: invoice.createdAt,
      },
    ],
    options: { closeOnEose: false },
    enabled: Boolean(invoice.pr.length),
  });

  const calculateSats = (credits: number) => Math.floor(credits / 10);

  const generatePayment = async () => {
    const buyEvent: NostrEvent | undefined = await identity.signEvent(
      buildBuyCreditsEvent(identity.pubkey, selectedCredits) as NostrEvent
    );

    if (buyEvent) {
      const pr = await buyCreditsRequest(buyEvent);
      setInvoice({ pr, createdAt: nowInSeconds() });
    }
  };

  useEffect(() => {
    if (zapEvents.length) {
      zapEvents.forEach((zap) => {
        const boltTag = zap.getMatchingTags("bolt11")[0]?.[1];

        if (boltTag === invoice.pr) {
          setIsDialogOpen(false);
          setInvoice({ pr: "", createdAt: 0 });
        }
      });
    }
  }, [zapEvents, invoice.pr]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Créditos</h1>
      <p className="mb-4 text-gray-300">Créditos disponibles: {credits}</p>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-[#151515] hover:bg-gray-800 text-gray-100 border-none">
            Comprar créditos
          </Button>
        </DialogTrigger>

        {invoice.pr.length ? (
          <DialogContent className="bg-[#151515] text-gray-100 flex flex-col items-center justify-center space-y-4">
            <DialogHeader className="w-full">
              <DialogTitle className="text-left">Realiza el pago</DialogTitle>
              <DialogDescription className="text-left">
                Debes pagar la siguiente factura de Lightning Network
              </DialogDescription>
            </DialogHeader>

            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG size={300} value={invoice.pr} />
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-gray-400 mb-2">Esperando el pago...</p>
              <div className="w-8 h-8 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <DialogFooter className="flex space-x-4">
              <Button
                className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
                onClick={() => {
                  setIsDialogOpen(false);
                  setInvoice({ pr: "", createdAt: 0 });
                }}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
                onClick={() => {
                  copy(invoice.pr);
                }}
              >
                Copiar
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent className="bg-[#151515] text-gray-100">
            <DialogHeader>
              <DialogTitle
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                Comprar créditos
              </DialogTitle>
              <DialogDescription>
                Selecciona la cantidad de créditos que deseas comprar.
              </DialogDescription>
            </DialogHeader>

            <Select
              defaultValue={selectedCredits}
              onValueChange={setSelectedCredits}
            >
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
              <Button
                className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
                onClick={generatePayment}
                disabled={Number(selectedCredits) === 0}
              >
                Generar factura
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
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
          {creditsLog.map((log) => (
            <TableRow key={log.id} className="border-b border-gray-700">
              <TableCell className="text-gray-300">{log.id}</TableCell>
              <TableCell className="text-gray-300">{log.type}</TableCell>
              <TableCell className="text-gray-300">{log.amount}</TableCell>
              <TableCell className="text-gray-300">
                {log.date.toLocaleDateString()} {log.date.toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
