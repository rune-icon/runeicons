import type { Metadata } from "next";
import { EditorShell } from "@/components/editor/EditorShell";
import { getEditorAssets } from "@/lib/editor/assets";

export const metadata: Metadata = {
  title: "Editor | RuneIcons",
  description: "Create and edit custom SVG icons with the RuneIcons editor.",
};

export default async function EditorPage() {
  const assets = await getEditorAssets();

  return <EditorShell assets={assets} />;
}
