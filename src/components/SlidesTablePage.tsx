import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { getFilterOptions } from "../api/fetchSlides";
import {
  DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS,
} from "../config/slides-table-columns";
import { useSlideRowModels } from "../hooks/useSlideRowModels";
import { useSlidesQuery } from "../hooks/useSlidesQuery";
import { useSlidesTableState } from "../hooks/useSlidesTableState";
import { SlidesPagination } from "./SlidesPagination";
import { SlidesTable } from "./SlidesTable";
import { SlidesTableToolbar } from "./SlidesTableToolbar";

const filterOptions = getFilterOptions();

export function SlidesTablePage() {
  const visibleColumns = DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS;
  const [visibilityOverrides, setVisibilityOverrides] = useState<Record<string, boolean>>({});
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
  const rows = useSlideRowModels(query.data?.data, visibilityOverrides);

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
          onToggleVisibility={(slideId) =>
            setVisibilityOverrides((currentOverrides) => {
              const nextVisible = !(currentOverrides[slideId] ?? rows.find((row) => row.id === slideId)?.isVisible ?? true);
              return {
                ...currentOverrides,
                [slideId]: nextVisible,
              };
            })
          }
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
