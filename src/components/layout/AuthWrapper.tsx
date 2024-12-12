import { STORAGE_KEY } from "@/config";
import { parseContent, useConfig, useNostr } from "@lawallet/react";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import AppLoader from "./AppLoader";

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
  const { validateRelaysStatus, initializeSigner, signerInfo } = useNostr();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();

  const authenticate = async (privateKey: string) => {
    const tmpSigner = new NDKPrivateKeySigner(privateKey);
    await tmpSigner.blockUntilReady();

    if (tmpSigner) initializeSigner(tmpSigner);

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

  // useEffect(() => {
  //   if (signer && !identity.signer) {
  //     setIsLoading(true);

  //     signer.user().then(async (user) => {
  //       setIsLoading(false);
  //     });
  //   }
  // }, [signer, signerInfo]);

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

      const userConnected: boolean = Boolean(signerInfo?.pubkey.length);

      switch (true) {
        case !userConnected && requireAuth:
          router.push("/");
          break;

        case userConnected && requireDisconnectedUser:
          router.push("/dashboard");
          break;
      }
    }
  }, [pathname, signerInfo, isLoading]);

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

    const userConnected: boolean = Boolean(signerInfo?.pubkey.length);

    if (userConnected && requireAuth) return true;
    if (!userConnected && requireDisconnectedUser) return true;

    return Boolean(!requireAuth && !requireDisconnectedUser);
  }, [isLoading, pathname, signerInfo]);

  return !hydrateApp ? <AppLoader /> : children;
};

export default AuthWrapper;
