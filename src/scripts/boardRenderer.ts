import type { Arrow } from "../types/chess";

const SQUARE_SIZE = 400 / 8; // Assuming a 400x400 viewBox

export function updateBoardState(fen: string) {
  const pieceLayer = document.getElementById("board-pieces");
  if (!pieceLayer) return;

  pieceLayer.innerHTML = ""; // Clear previous pieces

  // A FEN string looks like: "8/8/8/8/3R4/8/8/8 w - - 0 1"
  // We only care about the first part (the board layout) before the space
  const boardPart = fen.split(" ")[0];
  const rows = boardPart.split("/"); // Splits into an array of 8 row strings

  // Loop through the 8 rows
  for (let rowIndex = 0; rowIndex < 8; rowIndex++) {
    let colIndex = 0;
    const rowString = rows[rowIndex];

    // Loop through the characters in the row
    for (let charIndex = 0; charIndex < rowString.length; charIndex++) {
      const char = rowString[charIndex];

      // If it's a number (1-8), it represents empty squares. Skip them.
      if (!isNaN(parseInt(char))) {
        colIndex += parseInt(char);
      }
      // If it's a letter, it's a piece.
      else {
        // Uppercase letters are White, Lowercase are Black
        const color = char === char.toUpperCase() ? "w" : "b";
        const type = char.toLowerCase();

        const x = colIndex * SQUARE_SIZE;
        const y = rowIndex * SQUARE_SIZE;

        // e.g., 'w' + 'r' = "icon-rook-w"
        const iconId = `icon-${getPieceName(type)}-${color}`;

        const useElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "use",
        );
        useElement.setAttribute("href", `#${iconId}`);
        useElement.setAttribute("x", x.toString());
        useElement.setAttribute("y", y.toString());
        useElement.setAttribute("width", SQUARE_SIZE.toString());
        useElement.setAttribute("height", SQUARE_SIZE.toString());
        useElement.classList.add("chess-piece");

        pieceLayer.appendChild(useElement);

        colIndex++; // Move to the next square
      }
    }
  }
}

export function clearVisuals() {
  const highlightLayer = document.getElementById("board-highlights");
  const arrowLayer = document.getElementById("board-arrows");
  if (highlightLayer) highlightLayer.innerHTML = "";
  if (arrowLayer) arrowLayer.innerHTML = "";
}
// 3. Highlight and Arrow Functions
export function drawHighlights(squares: string[]) {
  // Logic to append <rect> elements to #board-highlights
}

export function drawArrows(arrows: Arrow[]) {
  // Logic to append <line> elements to #board-arrows
}

// Helper to map chess.js single letters to your sprite IDs
function getPieceName(type: string): string {
  const map: Record<string, string> = {
    p: "pawn",
    n: "knight",
    b: "bishop",
    r: "rook",
    q: "queen",
    k: "king",
  };
  return map[type];
}

export function drawGrid() {
  const squareLayer = document.getElementById("board-squares");
  if (!squareLayer) return;

  // Only draw the grid once. If it already has children, skip it.
  if (squareLayer.childNodes.length > 0) return;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * SQUARE_SIZE;
      const y = row * SQUARE_SIZE;

      // The Even/Odd math trick for alternating colors
      const isLightSquare = (row + col) % 2 === 0;
      const colorClass = isLightSquare ? "square-light" : "square-dark";

      // Convert coordinates back to algebraic notation for the ID
      // col 0 = 'a', col 1 = 'b', etc. (97 is the ASCII code for 'a')
      const file = String.fromCharCode(97 + col);
      // row 0 = '8', row 7 = '1'
      const rank = (8 - row).toString();
      const squareId = `square-${file}${rank}`; // e.g., "square-e4"

      // Create the SVG rectangle
      const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      rect.setAttribute("id", squareId);
      rect.setAttribute("x", x.toString());
      rect.setAttribute("y", y.toString());
      rect.setAttribute("width", SQUARE_SIZE.toString());
      rect.setAttribute("height", SQUARE_SIZE.toString());

      // We use classes for colors so we can theme it easily in CSS
      rect.classList.add("chess-square", colorClass);

      squareLayer.appendChild(rect);
    }
  }
}
