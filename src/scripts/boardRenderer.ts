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
  const highlightLayer = document.getElementById("board-highlights");
  if (!highlightLayer) return;

  squares.forEach((square) => {
    // 1. Find the base square we generated earlier (e.g., "square-d4")
    const baseSquare = document.getElementById(`square-${square}`);

    if (baseSquare) {
      // 2. Grab its exact pixel coordinates
      const x = baseSquare.getAttribute("x") || "0";
      const y = baseSquare.getAttribute("y") || "0";

      // 3. Create the highlight overlay
      const highlightRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      highlightRect.setAttribute("x", x);
      highlightRect.setAttribute("y", y);
      highlightRect.setAttribute("width", SQUARE_SIZE.toString());
      highlightRect.setAttribute("height", SQUARE_SIZE.toString());

      // Add a CSS class so we can style it easily
      highlightRect.classList.add("highlight-overlay");

      // 4. Add it to the highlight layer
      highlightLayer.appendChild(highlightRect);
    }
  });
}

export function drawArrows(arrows: Arrow[]) {
  const arrowLayer = document.getElementById("board-arrows");
  if (!arrowLayer) return;

  // The distance from the center to start the arrow.
  // SQUARE_SIZE / 2 is the exact edge of the square.
  // 0.35 leaves a nice gap in the middle for your SVG piece icon.
  const START_OFFSET = SQUARE_SIZE * 0.45;

  // Optional: A smaller offset for the end of the line so the arrowhead doesn't cross dead center
  const END_OFFSET = SQUARE_SIZE * 0.15;

  arrows.forEach((arrow) => {
    // 1. Get the true center coordinates of the 'From' square
    const fromCol = arrow.from.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(arrow.from[1], 10);
    const startX = fromCol * SQUARE_SIZE + SQUARE_SIZE / 2;
    const startY = fromRow * SQUARE_SIZE + SQUARE_SIZE / 2;

    // 2. Get the true center coordinates of the 'To' square
    const toCol = arrow.to.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(arrow.to[1], 10);
    const targetX = toCol * SQUARE_SIZE + SQUARE_SIZE / 2;
    const targetY = toRow * SQUARE_SIZE + SQUARE_SIZE / 2;

    // 3. Vector Math: Calculate the angle between the two centers in radians
    const angle = Math.atan2(targetY - startY, targetX - startX);

    // 4. Shift X1 and Y1 outward along that angle
    const x1 = startX + START_OFFSET * Math.cos(angle);
    const y1 = startY + START_OFFSET * Math.sin(angle);

    // 5. Shift X2 and Y2 inward along that angle (so the arrowhead stops slightly short)
    const x2 = targetX - END_OFFSET * Math.cos(angle);
    const y2 = targetY - END_OFFSET * Math.sin(angle);

    // 6. Create the SVG line using the new offset coordinates
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());

    line.classList.add("vector-arrow");
    line.setAttribute("marker-end", "url(#arrowhead)");

    arrowLayer.appendChild(line);
  });
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
