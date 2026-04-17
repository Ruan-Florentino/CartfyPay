"use client"
import { CheckoutProvider } from "@/contexts/checkout-context"
import CheckoutBuilder from "@/components/checkout-builder"
import CheckoutPreview from "@/components/checkout-preview"

export default function CheckoutDemo() {
  return (
    <CheckoutProvider>
      <div className="flex h-screen">
        <div className="w-1/3 p-4 bg-zinc-950 overflow-y-auto">
          <CheckoutBuilder />
        </div>
        <div className="w-2/3 overflow-y-auto">
          <CheckoutPreview />
        </div>
      </div>
    </CheckoutProvider>
  )
}
