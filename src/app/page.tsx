"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { ChangeEvent, useState } from "react";
import { useConfig, useIdentity, useNostr } from "@lawallet/react";
import { useRouter } from "next/navigation";
import { STORAGE_KEY } from "@/config";
import { bytesToHex } from "@noble/hashes/utils";
import { generateSecretKey } from "nostr-tools";

const hexRegex = /^[0-9a-fA-F]+$/;

export default function Home() {
  const { authWithExtension, initializeSigner } = useNostr();
  const [inputKey, setInputKey] = useState<string>("");

  const router = useRouter();
  const identity = useIdentity();
  const config = useConfig();

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
  };

  const handleLoginWithSecretKey = async (secretKey: string) => {
    if (!hexRegex.test(secretKey)) {
      return;
    }

    const initialized: boolean = await identity.initializeFromPrivateKey(
      secretKey
    );

    if (initialized) {
      initializeSigner(identity.signer);

      await config.storage.setItem(
        STORAGE_KEY,
        JSON.stringify({ privateKey: secretKey })
      );

      router.push("/dashboard");
    }
  };

  const handleCreateAccount = async () => {
    const randomSecretKey = generateSecretKey();
    const skToHex: string = bytesToHex(randomSecretKey);
    handleLoginWithSecretKey(skToHex);
  };

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
              onChange={handleChangeInput}
              value={inputKey}
            />
            <Button
              onClick={() => handleLoginWithSecretKey(inputKey)}
              className="bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
            >
              Login
            </Button>
          </div>
          <Button
            className="w-full bg-[#0c0c0c] hover:bg-gray-800 text-gray-100 border-none"
            variant="outline"
            onClick={authWithExtension}
          >
            Conectarse con la extensión
          </Button>
        </div>
        <p className="text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <span
            className="text-gray-300 hover:text-gray-100 hover:underline"
            onClick={handleCreateAccount}
          >
            Crea una ahora
          </span>
        </p>
      </div>
    </div>
  );
}
