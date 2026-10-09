"use client";

import { StudioPage, ChannelHeader, Panel } from "@/components/studio/Studio";
import VaultContent from "@/components/vault/VaultContent";
import PolaroidBoard from "@/components/polaroid/PolaroidBoard";
import type { VaultItem } from "@/lib/vault-items";
import type { PolaroidItem } from "@/lib/polaroids";

export default function VaultUnlocked({ items, contactSheet }: { items: VaultItem[]; contactSheet: PolaroidItem[] }) {
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
      <Panel title="Contact Sheet" meta="Tap a Polaroid to flip it">
        <PolaroidBoard items={contactSheet} layout="sheet" />
      </Panel>
    </StudioPage>
  );
}
