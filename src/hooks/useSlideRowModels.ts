import { useMemo } from "react";
import type { Slide, SlideRowViewModel } from "../types/slides";
import { deriveResultChip } from "../utils/deriveResultChip";
import { deriveStatusSummary } from "../utils/deriveStatusSummary";
import { normalizeResultStatus } from "../utils/normalizeResultStatus";

export function useSlideRowModels(slides: Slide[] | undefined) {
  return useMemo<SlideRowViewModel[]>(() => {
    if (!slides) {
      return [];
    }

    return slides.map((slide) => ({
      id: slide.id,
      slideName: slide.name,
      externalUrl: slide.external_url ?? null,
      specimenCategory: slide.specimen_category ?? null,
      tags: slide.tags.map(({ id, name }) => ({ id, name })),
      createdAt: slide.created_at,
      updatedAt: slide.updated_at,
      statusSummary: deriveStatusSummary(slide.results),
      resultChips: slide.results
        .filter((result) => result.visible !== false)
        .filter((result) => normalizeResultStatus(result) !== "pending")
        .map(deriveResultChip),
      raw: slide,
    }));
  }, [slides]);
}
