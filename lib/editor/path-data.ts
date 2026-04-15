const EDITABLE_PATH_COMMANDS = new Set(["M", "L", "H", "V", "C", "Q", "Z"]);

function collectPathCommands(value: string) {
  const commands = value.match(/[a-zA-Z][^a-zA-Z]*/g) ?? [];
  return commands.map((command) => command[0].toUpperCase());
}

export function normalizeEditorPathData(value: string) {
  return value.replace(/,/g, " ").replace(/\s+/g, " ").trim();
}

export function ensureEditorPathEditable(value: string) {
  const normalized = normalizeEditorPathData(value);

  if (!normalized) {
    throw new Error("Empty path data");
  }

  const unsupportedCommands = [
    ...new Set(
      collectPathCommands(normalized).filter(
        (command) => !EDITABLE_PATH_COMMANDS.has(command),
      ),
    ),
  ];

  if (unsupportedCommands.length > 0) {
    throw new Error(
      `Unsupported SVG commands: ${unsupportedCommands.join(", ")}`,
    );
  }

  return normalized;
}
