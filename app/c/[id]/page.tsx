"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { CheckoutProvider } from "@/contexts/checkout-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";
import Script from "next/script";

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Save UTMs to localStorage
    const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const currentUtms: Record<string, string> = {};
    let hasUtms = false;

    utms.forEach(utm => {
      const value = searchParams.get(utm);
      if (value) {
        currentUtms[utm] = value;
        hasUtms = true;
      }
    });

    if (hasUtms) {
      localStorage.setItem('cartfy_utms', JSON.stringify(currentUtms));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCheckout = async () => {
      if (!params.id) return;
      const path = `checkouts/${params.id}`;
      try {
        const docRef = doc(db, "checkouts", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const checkoutConfig = docSnap.data().config;
          setConfig(checkoutConfig);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckout();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF5F00] animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Checkout não encontrado.
      </div>
    );
  }

  return (
    <>
      {/* Facebook Pixel */}
      {config.pixels?.facebook && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.pixels.facebook}');
            fbq('track', 'PageView');
            fbq('track', 'InitiateCheckout');
          `}
        </Script>
      )}

      {/* Google Analytics */}
      {config.pixels?.google && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${config.pixels.google}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${config.pixels.google}');
              gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: ${config.price}
              });
            `}
          </Script>
        </>
      )}

      <CheckoutProvider initialConfig={config}>
        <CheckoutExperience />
      </CheckoutProvider>
    </>
  );
}
