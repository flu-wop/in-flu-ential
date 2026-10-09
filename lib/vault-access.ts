import { createHmac, timingSafeEqual } from "crypto";

// The vault cookie holds an HMAC derived from the server-only VAULT_PASSWORD,
// so it can't be forged by setting a cookie by hand, and changing the password
// signs everyone out.
export const VAULT_COOKIE = "vault_access";

export function vaultToken(): string | null {
  const secret = process.env.VAULT_PASSWORD;
  if (!secret) return null;
  return createHmac("sha256", secret).update("in-flu-ential-vault-v1").digest("hex");
}

export function hasVaultAccess(cookieValue: string | undefined): boolean {
  const token = vaultToken();
  if (!token || !cookieValue || cookieValue.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(cookieValue), Buffer.from(token));
}
