import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/lib/token-storage";

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const hasToken = tokenStorage.hasToken();
    setIsAuthenticated(hasToken);
    setIsLoading(false);

    if (!hasToken && typeof window !== "undefined") {
      // Redirect to login if no token
      router.push("/auth/login");
    }
  }, [router]);

  return { isAuthenticated, isLoading };
}
