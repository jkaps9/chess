// src/scripts/chessScroller.ts
import type { TutorialData, VizTrigger } from "../types/chess";

export function initChessScroller(
  tutorialData: TutorialData,
  onUpdate: (data: VizTrigger) => void,
): () => void {
  let currentStep: string | null = null;

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Assert that the target is an HTMLElement to access dataset/getAttribute safely
        const target = entry.target as HTMLElement;
        const stepId = target.getAttribute("data-step");

        if (stepId && currentStep !== stepId) {
          currentStep = stepId;
          const stepData = findDataForStep(tutorialData, stepId);

          if (stepData) {
            onUpdate(stepData);
          }
        }
      }
    });
  }, observerOptions);

  const steps = document.querySelectorAll<HTMLElement>(".step");
  steps.forEach((stepElement) => scrollObserver.observe(stepElement));

  function findDataForStep(
    data: TutorialData,
    stepId: string,
  ): VizTrigger | null {
    const [pieceName, triggerKey] = stepId.split(":");
    if (!pieceName || !triggerKey || !data.pieceTutorial) return null;

    const pieceObj = data.pieceTutorial.find((p) => p.name === pieceName);

    if (pieceObj && pieceObj.vizTriggers && pieceObj.vizTriggers[triggerKey]) {
      return pieceObj.vizTriggers[triggerKey];
    }
    return null;
  }

  // Cleanup function
  return function cleanup() {
    steps.forEach((step) => scrollObserver.unobserve(step));
    scrollObserver.disconnect();
  };
}
