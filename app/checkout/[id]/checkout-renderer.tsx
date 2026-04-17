"use client";
import { useEffect, useState } from "react";
import { CheckoutProvider } from "@/contexts/checkout-context";
import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function CheckoutRenderer({ id }: { id: string }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        const docRef = doc(db, 'checkouts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data());
        }
      } catch (e) {
        console.error("Failed to fetch checkout from Firestore", e);
      }
      setLoading(false);
    };
    fetchCheckout();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Carregando checkout...</div>;
  }

  if (!config) {
    return <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">Checkout não encontrado.</div>;
  }

  return (
    <CheckoutProvider initialConfig={config}>
      <CheckoutExperience />
    </CheckoutProvider>
  );
}
