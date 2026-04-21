import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState<any>(null);

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  return { toast, showToast };
};