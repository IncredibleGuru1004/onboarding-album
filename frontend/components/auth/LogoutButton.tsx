"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface LogoutButtonProps {
  onLogout?: () => Promise<void>;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (onLogout) {
        await onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" isLoading={isLoading} onClick={handleLogout}>
      Logout
    </Button>
  );
};
