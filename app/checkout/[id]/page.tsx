import { CheckoutRenderer } from "./checkout-renderer";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckoutRenderer id={id} />;
}
