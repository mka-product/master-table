import rawPayload from "../../payload.json";
import type {
  Slide,
  SlidesApiResponse,
  SlidesQueryParams,
  UiResultStatus,
} from "../types/slides";
import { normalizeResultStatus } from "../utils/normalizeResultStatus";

type PayloadLike = SlidesApiResponse;

const payload = rawPayload as PayloadLike;

function hasMatchingStatus(slide: Slide, statuses: UiResultStatus[]) {
  if (statuses.length === 0) {
    return true;
  }

  return slide.results.some(
    (result) =>
      result.visible !== false &&
      statuses.includes(normalizeResultStatus(result)),
  );
}

function matchesSearch(slide: Slide, searchTerm: string) {
  if (!searchTerm) {
    return true;
  }

  const normalized = searchTerm.toLowerCase();
  const haystacks = [
    slide.name,
    slide.specimen_category ?? "",
    ...slide.tags.map((tag) => tag.name),
    ...slide.results.map((result) => result.product.id),
  ];

  return haystacks.some((value) => value.toLowerCase().includes(normalized));
}

function sortSlides(slides: Slide[], sortBy: string | null, direction: "asc" | "desc" | null) {
  if (!sortBy || !direction) {
    return slides;
  }

  const factor = direction === "asc" ? 1 : -1;

  return [...slides].sort((left, right) => {
    const getComparable = (slide: Slide) => {
      switch (sortBy) {
        case "name":
          return slide.name.toLowerCase();
        case "specimen_category":
          return (slide.specimen_category ?? "").toLowerCase();
        case "created_at":
          return new Date(slide.created_at).getTime();
        case "updated_at":
          return new Date(slide.updated_at).getTime();
        default:
          return slide.name.toLowerCase();
      }
    };

    const a = getComparable(left);
    const b = getComparable(right);

    if (a < b) {
      return -1 * factor;
    }

    if (a > b) {
      return 1 * factor;
    }

    return 0;
  });
}

export async function fetchSlides(
  params: SlidesQueryParams,
): Promise<SlidesApiResponse> {
  const filtered = payload.data.filter((slide) => {
    const specimenMatch =
      params.filters.specimenCategories.length === 0 ||
      params.filters.specimenCategories.includes(slide.specimen_category ?? "");
    const tagMatch =
      params.filters.tags.length === 0 ||
      slide.tags.some((tag) => params.filters.tags.includes(tag.name));

    return (
      specimenMatch &&
      tagMatch &&
      hasMatchingStatus(slide, params.filters.statuses) &&
      matchesSearch(slide, params.search.trim())
    );
  });

  const sorted = sortSlides(filtered, params.sortBy, params.sortDirection);
  const pageCount = Math.max(1, Math.ceil(sorted.length / params.pageSize));
  const start = params.page * params.pageSize;
  const end = start + params.pageSize;
  const pageData = sorted.slice(start, end);

  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    data: pageData,
    count: pageData.length,
    total: sorted.length,
    page: params.page,
    page_count: pageCount,
  };
}

export function getFilterOptions() {
  const specimenCategories = [
    ...new Set(
      payload.data.map((slide) => slide.specimen_category).filter(Boolean),
    ),
  ] as string[];
  const tags = [...new Set(payload.data.flatMap((slide) => slide.tags.map((tag) => tag.name)))];

  return {
    specimenCategories: specimenCategories.sort(),
    tags: tags.sort(),
    statuses: ["success", "processing", "error"] as UiResultStatus[],
  };
}
