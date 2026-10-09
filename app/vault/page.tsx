import { cookies } from "next/headers";
import VaultGate from "@/components/vault/VaultGate";
import VaultUnlocked from "@/components/vault/VaultUnlocked";
import { CONTACT_SHEET, VAULT_ITEMS, WALL } from "@/lib/vault-items";
import { VAULT_COOKIE, hasVaultAccess } from "@/lib/vault-access";

// Checked on the server for every request: the private items are only sent to
// a browser that holds a valid signed vault cookie.
export const dynamic = "force-dynamic";
export const metadata = { title: "Vault | IN-FLU-ENTIAL LLC", robots: { index: false } };

export default async function VaultPage() {
  const jar = await cookies();
  if (!hasVaultAccess(jar.get(VAULT_COOKIE)?.value)) return <VaultGate />;
  return <VaultUnlocked items={VAULT_ITEMS} contactSheet={CONTACT_SHEET} wall={WALL} />;
}
