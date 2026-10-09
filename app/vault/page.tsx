import { cookies } from "next/headers";
import VaultGate from "@/components/vault/VaultGate";
import VaultUnlocked from "@/components/vault/VaultUnlocked";
import { VAULT_ITEMS } from "@/lib/vault-items";
import { VAULT_COOKIE, hasVaultAccess } from "@/lib/vault-access";

// Checked on the server for every request: the private items are only sent to
// a browser that holds a valid signed vault cookie.
export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const jar = await cookies();
  if (!hasVaultAccess(jar.get(VAULT_COOKIE)?.value)) return <VaultGate />;
  return (
    <main className="bg-[#060606] min-h-screen overflow-x-hidden">
      <VaultUnlocked items={VAULT_ITEMS} />
    </main>
  );
}
