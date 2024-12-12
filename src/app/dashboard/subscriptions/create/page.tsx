"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateNDKFilter } from "@/lib/utils";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import {
  InteractionProps,
  ReactJsonViewProps,
  ThemeKeys,
} from "react-json-view";

const DefaultJsonViewOptions: Partial<ReactJsonViewProps> = {
  name: false,
  theme: "chalk" as ThemeKeys,
  displayObjectSize: false,
  displayDataTypes: false,
  collapseStringsAfterLength: 25,
};

const DynamicJSONView = dynamic(() => import("react-json-view"), {
  ssr: false,
});

export default function CreateSubscription() {
  const [JSONQuery, setJSONQuery] = useState<NDKFilter>({
    ids: undefined,
    kinds: undefined,
    authors: undefined,
    since: undefined,
    until: undefined,
    "#t": undefined,
    "#d": undefined,
    "#p": undefined,
    "#e": undefined,
    "#a": undefined,
    limit: 1000,
  });
  const [relay, setRelay] = useState("");
  const [webhook, setWebhook] = useState("");

  const handleEditQuery = (newQuery: InteractionProps) => {
    if (!newQuery || !newQuery.updated_src) return;

    setJSONQuery(
      validateNDKFilter(newQuery.updated_src as NDKFilter) as NDKFilter
    );
  };

  const handleCreateSubscription = () => {
    console.log("Creating subscription with:", {
      JSONQuery,
      relay,
      webhook,
    });
    // Aquí iría la lógica para crear la suscripción.
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Crear una nueva subscripción</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <DynamicJSONView
          src={JSONQuery}
          onEdit={handleEditQuery}
          onAdd={handleEditQuery}
          onDelete={handleEditQuery}
          {...DefaultJsonViewOptions}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="relay" className="block text-sm font-medium mb-1">
            Relay
          </label>
          <Input
            id="relay"
            value={relay}
            onChange={(e) => setRelay(e.target.value)}
            placeholder="wss://relay.example.com"
          />
        </div>

        <div>
          <label htmlFor="webhook" className="block text-sm font-medium mb-1">
            Webhook
          </label>
          <Input
            id="webhook"
            value={webhook}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWebhook(e.target.value)
            }
            placeholder="https://webhook.example.com"
          />
        </div>
      </div>

      <Button
        className="bg-[#151515] hover:bg-gray-800 text-gray-100 border-none"
        onClick={handleCreateSubscription}
      >
        Crear Subscripción
      </Button>
    </div>
  );
}
