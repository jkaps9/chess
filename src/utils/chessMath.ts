// src/utils/chessMath.ts

interface Point {
  x: number;
  y: number;
}

/**
 * Translates an algebraic chess square (e.g., "d4") into SVG center-point coordinates.
 * @param square - The algebraic notation string (a1 - h8).
 * @param boardSize - The total width/height of the square SVG viewport in pixels.
 */
export function getSquareCenter(
  square: string,
  boardSize: number,
): Point | null {
  if (square.length !== 2) return null;

  const file = square[0].toLowerCase(); // 'a' through 'h'
  const rank = square[1]; // '1' through '8'

  // Convert file letter to column index (0 to 7)
  // 'a'.charCodeAt(0) is 97
  const col = file.charCodeAt(0) - 97;

  // Convert rank number to row index (0 to 7)
  // Chess rank 8 is at the top (row 0 in SVG), rank 1 is at the bottom (row 7 in SVG)
  const row = 8 - parseInt(rank, 10);

  if (col < 0 || col > 7 || row < 0 || row > 7) return null;

  const squareSize = boardSize / 8;

  // Calculate the center point of the target square
  return {
    x: col * squareSize + squareSize / 2,
    y: row * squareSize + squareSize / 2,
  };
}
