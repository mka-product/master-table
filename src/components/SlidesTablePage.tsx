import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { getFilterOptions } from "../api/fetchSlides";
import { useSlideRowModels } from "../hooks/useSlideRowModels";
import { useSlidesQuery } from "../hooks/useSlidesQuery";
import { useSlidesTableState } from "../hooks/useSlidesTableState";
import { SlidesPagination } from "./SlidesPagination";
import { SlidesTable } from "./SlidesTable";
import { SlidesTableToolbar } from "./SlidesTableToolbar";

const filterOptions = getFilterOptions();

export function SlidesTablePage() {
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

  return (
    <Stack spacing={6}>
      <HStack justify="space-between" align={{ base: "flex-start", md: "flex-end" }} flexWrap="wrap">
        <Box>
          <Heading size="lg">Slides Table</Heading>
          <Text mt={1} color="gray.600">
            React + Chakra UI + TanStack Query/Table using the existing payload contract.
          </Text>
        </Box>
        <Text color="gray.500" fontSize="sm">
          Server-driven search, filter, sort, and pagination
        </Text>
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
