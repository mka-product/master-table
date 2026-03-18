import { useMemo, useState } from "react";
import type {
  SlidesFilters,
  SlidesQueryParams,
  SortDirection,
} from "../types/slides";
import { useDebouncedValue } from "./useDebouncedValue";

const DEFAULT_FILTERS: SlidesFilters = {
  specimenCategories: [],
  tags: [],
  statuses: [],
};

export function useSlidesTableState() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection | null>("desc");
  const [filters, setFilters] = useState<SlidesFilters>(DEFAULT_FILTERS);

  const search = useDebouncedValue(searchInput, 300);

  const queryParams = useMemo<SlidesQueryParams>(
    () => ({
      page,
      pageSize,
      search,
      sortBy,
      sortDirection,
      filters,
    }),
    [filters, page, pageSize, search, sortBy, sortDirection],
  );

  return {
    queryParams,
    page,
    pageSize,
    searchInput,
    sortBy,
    sortDirection,
    filters,
    setPage,
    setPageSize: (nextPageSize: number) => {
      setPageSize(nextPageSize);
      setPage(0);
    },
    setSearchInput: (value: string) => {
      setSearchInput(value);
      setPage(0);
    },
    setSort: (nextSortBy: string | null, nextDirection: SortDirection | null) => {
      setSortBy(nextSortBy);
      setSortDirection(nextDirection);
      setPage(0);
    },
    setFilters: (nextFilters: SlidesFilters) => {
      setFilters(nextFilters);
      setPage(0);
    },
    resetFilters: () => {
      setFilters(DEFAULT_FILTERS);
      setPage(0);
    },
  };
}
