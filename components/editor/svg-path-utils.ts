"use client";

export interface ControlPoint {
  x: number;
  y: number;
  command: string;
  isControl: boolean;
  isMoveTo?: boolean;
  closesSubPath?: boolean;
}

export function parseSvgPath(pathData: string): ControlPoint[] {
  if (!pathData || pathData.trim() === "") {
    throw new Error("Empty path data");
  }

  const points: ControlPoint[] = [];
  const commands = pathData.match(/[a-zA-Z][^a-zA-Z]*/g) || [];

  if (commands.length === 0) {
    throw new Error("No valid commands found in path data");
  }

  let currentX = 0;
  let currentY = 0;
  let subPathStartX = 0;
  let subPathStartY = 0;

  for (const cmd of commands) {
    const command = cmd[0];
    const isRelative = command === command.toLowerCase();
    const params = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number.parseFloat);
    const upper = command.toUpperCase();

    if (
      params.length < 2 &&
      upper !== "Z" &&
      upper !== "H" &&
      upper !== "V"
    ) {
      continue;
    }

    switch (upper) {
      case "M":
        for (let index = 0; index < params.length; index += 2) {
          if (index + 1 >= params.length) {
            break;
          }

          const x = isRelative ? currentX + params[index] : params[index];
          const y = isRelative ? currentY + params[index + 1] : params[index + 1];
          if (Number.isNaN(x) || Number.isNaN(y)) {
            continue;
          }

          const isFirstPair = index === 0;
          points.push({
            x,
            y,
            command,
            isControl: false,
            isMoveTo: isFirstPair ? true : undefined,
          });
          currentX = x;
          currentY = y;
          if (isFirstPair) {
            subPathStartX = x;
            subPathStartY = y;
          }
        }
        break;

      case "L":
        for (let index = 0; index < params.length; index += 2) {
          if (index + 1 >= params.length) {
            break;
          }

          const x = isRelative ? currentX + params[index] : params[index];
          const y = isRelative ? currentY + params[index + 1] : params[index + 1];
          if (Number.isNaN(x) || Number.isNaN(y)) {
            continue;
          }

          points.push({ x, y, command, isControl: false });
          currentX = x;
          currentY = y;
        }
        break;

      case "H":
        for (const value of params) {
          const x = isRelative ? currentX + value : value;
          if (Number.isNaN(x)) {
            continue;
          }

          points.push({ x, y: currentY, command, isControl: false });
          currentX = x;
        }
        break;

      case "V":
        for (const value of params) {
          const y = isRelative ? currentY + value : value;
          if (Number.isNaN(y)) {
            continue;
          }

          points.push({ x: currentX, y, command, isControl: false });
          currentY = y;
        }
        break;

      case "C":
        for (let index = 0; index < params.length; index += 6) {
          if (index + 5 >= params.length) {
            break;
          }

          const x1 = isRelative ? currentX + params[index] : params[index];
          const y1 = isRelative ? currentY + params[index + 1] : params[index + 1];
          const x2 = isRelative ? currentX + params[index + 2] : params[index + 2];
          const y2 = isRelative ? currentY + params[index + 3] : params[index + 3];
          const x = isRelative ? currentX + params[index + 4] : params[index + 4];
          const y = isRelative ? currentY + params[index + 5] : params[index + 5];

          if (
            [x1, y1, x2, y2, x, y].some((value) => Number.isNaN(value))
          ) {
            continue;
          }

          points.push({ x: x1, y: y1, command, isControl: true });
          points.push({ x: x2, y: y2, command, isControl: true });
          points.push({ x, y, command, isControl: false });
          currentX = x;
          currentY = y;
        }
        break;

      case "Q":
        for (let index = 0; index < params.length; index += 4) {
          if (index + 3 >= params.length) {
            break;
          }

          const x1 = isRelative ? currentX + params[index] : params[index];
          const y1 = isRelative ? currentY + params[index + 1] : params[index + 1];
          const x = isRelative ? currentX + params[index + 2] : params[index + 2];
          const y = isRelative ? currentY + params[index + 3] : params[index + 3];

          if ([x1, y1, x, y].some((value) => Number.isNaN(value))) {
            continue;
          }

          points.push({ x: x1, y: y1, command, isControl: true });
          points.push({ x, y, command, isControl: false });
          currentX = x;
          currentY = y;
        }
        break;

      case "Z": {
        for (let i = points.length - 1; i >= 0; i--) {
          if (!points[i].isControl) {
            points[i].closesSubPath = true;
            break;
          }
        }
        currentX = subPathStartX;
        currentY = subPathStartY;
        break;
      }

      default:
        break;
    }
  }

  if (points.length === 0) {
    points.push({ x: 10, y: 10, command: "M", isControl: false, isMoveTo: true });
    points.push({ x: 90, y: 90, command: "L", isControl: false });
  }

  return points;
}

export function pointsToSvgPath(points: ControlPoint[]) {
  if (points.length === 0) {
    return "";
  }

  let result = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  if (points[0].closesSubPath) {
    result += " Z";
  }
  let index = 1;

  while (index < points.length) {
    if (
      index + 2 < points.length &&
      points[index].isControl &&
      points[index + 1].isControl &&
      !points[index + 2].isControl
    ) {
      const anchor = points[index + 2];
      if (anchor.isMoveTo) {
        result += ` M${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}`;
      } else {
        result += ` C${points[index].x.toFixed(2)} ${points[index].y.toFixed(
          2,
        )}, ${points[index + 1].x.toFixed(2)} ${points[index + 1].y.toFixed(
          2,
        )}, ${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}`;
      }
      if (anchor.closesSubPath) {
        result += " Z";
      }
      index += 3;
      continue;
    }

    if (
      index + 1 < points.length &&
      points[index].isControl &&
      !points[index + 1].isControl
    ) {
      const anchor = points[index + 1];
      if (anchor.isMoveTo) {
        result += ` M${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}`;
      } else {
        result += ` Q${points[index].x.toFixed(2)} ${points[index].y.toFixed(
          2,
        )}, ${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)}`;
      }
      if (anchor.closesSubPath) {
        result += " Z";
      }
      index += 2;
      continue;
    }

    const point = points[index];
    if (point.isMoveTo) {
      result += ` M${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    } else {
      result += ` L${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }
    if (point.closesSubPath) {
      result += " Z";
    }
    index += 1;
  }

  return result;
}

export function addControlPointsToAllAnchors(points: ControlPoint[]) {
  if (points.length < 2) {
    return points;
  }

  const result: ControlPoint[] = [];

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    if (point.isControl) {
      result.push(point);
      continue;
    }

    result.push(point);

    if (index >= points.length - 1) {
      continue;
    }

    const nextPoint = points[index + 1];
    if (nextPoint.isControl || nextPoint.isMoveTo || point.closesSubPath) {
      continue;
    }

    const dx = nextPoint.x - point.x;
    const dy = nextPoint.y - point.y;

    result.push({
      x: point.x + dx / 3,
      y: point.y + dy / 3,
      command: "C",
      isControl: true,
    });
    result.push({
      x: point.x + (2 * dx) / 3,
      y: point.y + (2 * dy) / 3,
      command: "C",
      isControl: true,
    });
  }

  return result;
}
