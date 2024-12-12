import { STORAGE_KEY } from "@/config";
import {
  parseContent,
  useConfig,
  useIdentity,
  useNostr,
} from "@lawallet/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

interface RouterInfo {
  disconnectedPaths: string[]; // Routes that require you to NOT have a connected account
  connectedPaths: string[]; // Routes that require you to HAVE a connected account
}

const AppRouter: RouterInfo = {
  disconnectedPaths: ["/"],
  connectedPaths: ["/dashboard"],
};

export type StoragedInfo = {
  privateKey: string;
};

const isProtectedRoute = (path: string, paths: string[]): boolean => {
  let isProtected: boolean = false;

  paths.forEach((route) => {
    if (route === path.toLowerCase()) isProtected = true;
  });

  return isProtected;
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { signer, validateRelaysStatus, initializeSigner } = useNostr();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();
  const identity = useIdentity();

  const authenticate = async (privateKey: string) => {
    const initialized: boolean = await identity.initializeFromPrivateKey(
      privateKey
    );

    if (initialized) initializeSigner(identity.signer);

    await config.storage.setItem(STORAGE_KEY, JSON.stringify({ privateKey }));

    setIsLoading(false);
    return true;
  };

  const loadIdentityFromStorage = async () => {
    try {
      const storageIdentity = await config.storage.getItem(STORAGE_KEY);

      const parsedIdentity: StoragedInfo = parseContent(
        storageIdentity as string
      );

      const auth: boolean = await authenticate(parsedIdentity?.privateKey);
      return auth;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    loadIdentityFromStorage();

    const verifyRelaysConnection = () => {
      if (document.visibilityState === "visible") {
        validateRelaysStatus();
      }
    };

    document.addEventListener("visibilitychange", verifyRelaysConnection);

    return () => {
      document.removeEventListener("visibilitychange", verifyRelaysConnection);
    };
  }, []);

  useEffect(() => {
    if (signer && !identity.signer) {
      setIsLoading(true);

      signer.user().then(async (user) => {
        await identity.initializeIdentityFromPubkey(user.pubkey);
        setIsLoading(false);
      });
    }
  }, [signer, identity]);

  useEffect(() => {
    if (!isLoading) {
      const pathSegment = `/${String(pathname.split("/")[1] ?? "")}`;
      const requireAuth = isProtectedRoute(
        pathSegment,
        AppRouter.connectedPaths
      );
      const requireDisconnectedUser = isProtectedRoute(
        pathSegment,
        AppRouter.disconnectedPaths
      );

      const userConnected: boolean = Boolean(identity.pubkey.length);

      switch (true) {
        case !userConnected && requireAuth:
          router.push("/");
          break;

        case userConnected && requireDisconnectedUser:
          router.push("/dashboard");
          break;
      }
    }
  }, [pathname, identity.pubkey, isLoading]);

  const hydrateApp = useMemo((): boolean => {
    if (isLoading) return false;

    const pathSegment = `/${String(pathname.split("/")[1] ?? "")}`;
    const requireAuth: boolean = isProtectedRoute(
      pathSegment,
      AppRouter.connectedPaths
    );
    const requireDisconnectedUser: boolean = isProtectedRoute(
      pathSegment,
      AppRouter.disconnectedPaths
    );

    const userConnected: boolean = Boolean(identity.pubkey.length);

    if (userConnected && requireAuth) return true;
    if (!userConnected && requireDisconnectedUser) return true;

    return Boolean(!requireAuth && !requireDisconnectedUser);
  }, [isLoading, pathname, identity.pubkey]);

  return !hydrateApp ? <div>Loading</div> : children;
};

export default AuthWrapper;
