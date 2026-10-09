"use client";

import { StudioPage, ChannelHeader } from "@/components/studio/Studio";
import VaultContent from "@/components/vault/VaultContent";
import type { VaultItem } from "@/lib/vault-items";

export default function VaultUnlocked({ items }: { items: VaultItem[] }) {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 05 · Vault"
        title={
          <>
            Inside the <em>Vault</em>
          </>
        }
        lede="Unreleased music, works in progress and private material. Please keep what's here between us."
      />
      <VaultContent items={items} />
    </StudioPage>
  );
}
