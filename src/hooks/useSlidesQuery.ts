import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchSlides } from "../api/fetchSlides";
import type { SlidesQueryParams } from "../types/slides";

export function useSlidesQuery(params: SlidesQueryParams) {
  return useQuery({
    queryKey: ["slides", params],
    queryFn: () => fetchSlides(params),
    placeholderData: keepPreviousData,
  });
}
