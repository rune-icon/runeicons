const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const RELATIVE_TIME_UNITS: Array<{
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
}> = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

export function formatRelativeTimestamp(timestamp: string, now = Date.now()) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "just now";
  }

  const diffInSeconds = Math.round((date.getTime() - now) / 1000);
  const absoluteDiff = Math.abs(diffInSeconds);

  for (const { unit, seconds } of RELATIVE_TIME_UNITS) {
    if (absoluteDiff >= seconds || unit === "second") {
      return RELATIVE_TIME_FORMATTER.format(
        Math.round(diffInSeconds / seconds),
        unit,
      );
    }
  }

  return "just now";
}
