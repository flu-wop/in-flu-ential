import type { Metadata } from "next";
import VaultClient from "@/components/VaultClient";

export const metadata: Metadata = {
  title: "Private Vault",
  description: "Password-protected private vault.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return <VaultClient />;
}
