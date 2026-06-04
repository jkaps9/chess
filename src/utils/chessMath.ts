interface Point {
  x: number;
  y: number;
}

/**
 * Translates an algebraic chess square (e.g., "d4") into SVG center-point coordinates.
 */
export function getSquareCenter(square: string, squareSize: number): Point {
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square[1], 10);

  return {
    x: col * squareSize + squareSize / 2,
    y: row * squareSize + squareSize / 2,
  };
}

/**
 * Translates an algebraic chess square (e.g., "d4") into its top-left pixel coordinates.
 * This is used for drawing square overlays like highlights.
 */
export function getSquareTopLeft(square: string, squareSize: number): Point {
  const col = square.charCodeAt(0) - 97;
  const row = 8 - parseInt(square[1], 10);

  return {
    x: col * squareSize,
    y: row * squareSize,
  };
}

/**
 * Calculates the start and end points for an arrow, offset from the exact centers
 * so it doesn't overlap the SVG pieces.
 */
export function getArrowVector(
  fromSquare: string,
  toSquare: string,
  squareSize: number,
): { x1: number; y1: number; x2: number; y2: number } {
  const start = getSquareCenter(fromSquare, squareSize);
  const target = getSquareCenter(toSquare, squareSize);

  // The offset distances
  const START_OFFSET = squareSize * 0.35;
  const END_OFFSET = squareSize * 0.15;

  // Trigonometry to find the angle
  const angle = Math.atan2(target.y - start.y, target.x - start.x);

  return {
    x1: start.x + START_OFFSET * Math.cos(angle),
    y1: start.y + START_OFFSET * Math.sin(angle),
    x2: target.x - END_OFFSET * Math.cos(angle),
    y2: target.y - END_OFFSET * Math.sin(angle),
  };
}
