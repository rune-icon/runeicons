import { EditorShell } from "@/components/editor/EditorShell";
import { getEditorAssets } from "@/lib/editor/assets";

export default async function EditorPage() {
  const assets = await getEditorAssets();

  return <EditorShell assets={assets} />;
}
