import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getFilterOptions } from "../api/fetchSlides";
import {
  DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS,
  isSlidesTableColumnVisible,
  toggleSlidesTableColumn,
  type SlidesTableColumnId,
} from "../config/slides-table-columns";
import { useSlideRowModels } from "../hooks/useSlideRowModels";
import { useSlidesQuery } from "../hooks/useSlidesQuery";
import { useSlidesTableState } from "../hooks/useSlidesTableState";
import { SlidesPagination } from "./SlidesPagination";
import { SlidesTable } from "./SlidesTable";
import { SlidesTableToolbar } from "./SlidesTableToolbar";

const filterOptions = getFilterOptions();

export function SlidesTablePage() {
  const [visibleColumns, setVisibleColumns] = useState<SlidesTableColumnId[]>([
    ...DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS,
  ]);
  const {
    queryParams,
    page,
    pageSize,
    searchInput,
    sortBy,
    sortDirection,
    filters,
    setPage,
    setPageSize,
    setSearchInput,
    setSort,
    setFilters,
    resetFilters,
  } = useSlidesTableState();

  const query = useSlidesQuery(queryParams);
  const rows = useSlideRowModels(query.data?.data);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      if (event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        setVisibleColumns((currentVisibleColumns) =>
          toggleSlidesTableColumn(currentVisibleColumns, "results"),
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isSlidesTableColumnVisible(visibleColumns, "results")) {
      return;
    }

    if (filters.resultLabels.length === 0) {
      return;
    }

    setFilters({
      ...filters,
      resultLabels: [],
    });
  }, [filters, setFilters, visibleColumns]);

  return (
    <Stack spacing={6}>
      <HStack justify="space-between" align={{ base: "flex-start", md: "flex-end" }} flexWrap="wrap">
        <Box>
          <Heading size="lg">Slides Table</Heading>
        </Box>
      </HStack>

      <Box bg="white" borderRadius="2xl" borderWidth="1px" overflow="hidden" shadow="sm">
        <SlidesTableToolbar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          filters={filters}
          onFiltersChange={setFilters}
          onResetFilters={resetFilters}
          filterOptions={filterOptions}
          isLoading={query.isFetching}
          visibleColumns={visibleColumns}
        />
        <SlidesTable
          rows={rows}
          totalRows={query.data?.total ?? 0}
          sortBy={sortBy}
          sortDirection={sortDirection}
          isLoading={query.isLoading}
          isRefetching={query.isFetching && !query.isLoading}
          error={query.error}
          onSortChange={setSort}
          visibleColumns={visibleColumns}
        />
        <SlidesPagination
          page={query.data?.page ?? page}
          pageCount={query.data?.page_count ?? 1}
          total={query.data?.total ?? 0}
          count={query.data?.count ?? 0}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Box>
    </Stack>
  );
}
