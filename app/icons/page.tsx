"use client";

import { HeaderPanel } from "@/components/icon-page/panels/header";
import { WorkspaceShell } from "@/components/icon-page/panels/workspace";
import { TuningProvider } from "@/components/icon-page/tuning";

export default function Home() {
  return (
    <TuningProvider>
      <div className="flex flex-col h-screen bg-background">
        <HeaderPanel />
        <WorkspaceShell />
      </div>
    </TuningProvider>
  );
}
