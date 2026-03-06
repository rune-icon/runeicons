import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";

interface PanelHeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export function PanelHeader({ onExport, onReset }: PanelHeaderProps) {
  const handleResetClick = () => {
    if (window.confirm("Reset all customizations? This cannot be undone.")) {
      onReset();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">Customize</h2>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Export customization settings"
          title="Export settings"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetClick}
          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Reset all customizations"
          title="Reset all"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
