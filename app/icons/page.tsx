import { HeaderPanel } from "@/components/icon-page/panels/header";
import { WorkspaceShell } from "@/components/icon-page/panels/workspace";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <HeaderPanel />
      <WorkspaceShell />
    </div>
  );
}
