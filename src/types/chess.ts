// src/types/chess.ts

export interface Arrow {
  from: string;
  to: string;
}

export interface VizTrigger {
  fen: string;
  highlightSquares?: string[];
  arrows?: Arrow[];
  // Strict literal types so you can't misspell actions
  action:
    | "highlight"
    | "place"
    | "highlight_and_arrow"
    | "animate_move"
    | "animate_capture_fade";
}

export interface PieceTutorial {
  name: string;
  icon: string;
  movementId: string;
  narrative: {
    movement?: string;
    placement?: string;
    setup?: string;
    execution?: string;
  };
  vizTriggers: Record<string, VizTrigger>;
}

export interface TutorialData {
  pieceTutorial: PieceTutorial[];
  specialMoves?: PieceTutorial[];
}
