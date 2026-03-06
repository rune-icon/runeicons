import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface SectionCardProps {
  id: string;
  title: string;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  description?: string;
  className?: string;
}

export function SectionCard({
  id,
  title,
  isCollapsed,
  onToggle,
  children,
  headerRight,
  description,
  className,
}: SectionCardProps) {
  return (
    <Card className={cn("bg-card border-border py-0", className)}>
      <div className="flex items-center justify-between p-3 rounded-t-xl hover:bg-muted/50 transition-colors">
        <button
          onClick={() => onToggle(id)}
          className="flex items-center gap-2 flex-1 text-left"
          aria-expanded={!isCollapsed}
        >
          {description ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          ) : (
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          )}
          {!headerRight && (
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform ml-auto",
                isCollapsed && "rotate-180",
              )}
            />
          )}
        </button>
        {headerRight && (
          <div className="flex items-center ml-2">
            {headerRight}
            <button onClick={() => onToggle(id)}>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform ml-2",
                  isCollapsed && "rotate-180",
                )}
              />
            </button>
          </div>
        )}
      </div>
      {!isCollapsed && <div className="px-4 pb-3 space-y-3">{children}</div>}
    </Card>
  );
}
