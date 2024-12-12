import { NOSTWARD_ADMIN_KEY } from "@/config";
import { useIdentity, useSubscription } from "@lawallet/react";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { useEffect, useState } from "react";

interface CreditLog {
  id: string;
  type: "Compra";
  amount: number;
  date: Date;
}

const useCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [creditsLog, setCreditsLog] = useState<CreditLog[]>([]);

  const identity = useIdentity();

  const { events: balanceEvent } = useSubscription({
    filters: [
      {
        kinds: [31111 as NDKKind],
        authors: [NOSTWARD_ADMIN_KEY],
        "#d": [`credits:${identity.pubkey}`],
      },
    ],
    options: { closeOnEose: false },
    enabled: Boolean(identity.pubkey.length),
  });

  const { events: logEvents } = useSubscription({
    filters: [
      {
        kinds: [1112 as NDKKind],
        authors: [NOSTWARD_ADMIN_KEY],
        "#t": [`buy:credits:${identity.pubkey}`],
      },
    ],
    options: { closeOnEose: false },
    enabled: Boolean(identity.pubkey.length),
  });

  useEffect(() => {
    if (balanceEvent.length) {
      const latestEvent = balanceEvent[0];
      const creditsAmount = Number(
        latestEvent.getMatchingTags("amount")[0]?.[1]
      );

      if (creditsAmount) setCredits(creditsAmount);
    }
  }, [balanceEvent]);

  useEffect(() => {
    if (logEvents.length) {
      const logs: CreditLog[] = [];

      logEvents.forEach((log) => {
        logs.push({
          id: log.id,
          date: new Date(log.created_at! * 1000),
          type: "Compra",
          amount: Number(log.getMatchingTags("amount")[0]?.[1]),
        });
      });

      setCreditsLog(logs);
    }
  }, [logEvents]);

  return { credits, creditsLog };
};

export default useCredits;