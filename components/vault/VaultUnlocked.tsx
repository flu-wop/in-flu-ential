"use client";

import { StudioPage, ChannelHeader, Panel } from "@/components/studio/Studio";
import VaultContent from "@/components/vault/VaultContent";
import PolaroidBoard from "@/components/polaroid/PolaroidBoard";
import DemoWall from "@/components/vault/DemoWall";
import type { VaultItem, WallClip } from "@/lib/vault-items";
import type { PolaroidItem } from "@/lib/polaroids";

export default function VaultUnlocked({ items, contactSheet, wall, clips }: { items: VaultItem[]; contactSheet: PolaroidItem[]; wall: PolaroidItem[]; clips: WallClip[] }) {
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
      <Panel title="On the Wall" meta="Studio and Behind the Scenes">
        <PolaroidBoard items={wall} />
      </Panel>
      <Panel title="Demolition Wall" meta="Ten Years on the Job · Clips">
        <DemoWall clips={clips} />
      </Panel>
      <Panel title="Contact Sheet" meta="Tap a Polaroid to flip it">
        <PolaroidBoard items={contactSheet} layout="sheet" />
      </Panel>
    </StudioPage>
  );
}
