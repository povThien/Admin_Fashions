"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useAuthGuard() {
  const user = useSelector((state: any) => state.auth.currentUser);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user !== undefined) {
      setIsInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    if (isInitialized && !user) {
      window.location.replace("http://localhost:3003/sign-in");
    }
  }, [isInitialized, user]);

  return null;
}
