"use client";

import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/checkout-store";
import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { CheckoutProvider } from "@/contexts/checkout-context";
import { motion } from "motion/react";

export default function CheckoutPreview() {
  const router = useRouter();
  const { checkoutConfig: config } = useCheckoutStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <CheckoutProvider initialConfig={config}>
        <CheckoutExperience />
      </CheckoutProvider>
    </motion.div>
  );
}
