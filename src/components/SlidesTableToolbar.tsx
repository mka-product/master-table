import {
  Button,
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  isSlidesTableColumnVisible,
  type SlidesTableColumnId,
} from "../config/slides-table-columns";
import type { SlidesFilters, UiResultStatus } from "../types/slides";

type FilterOptions = {
  specimenCategories: string[];
  tags: string[];
  statuses: UiResultStatus[];
  resultLabels: string[];
};

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: SlidesFilters;
  onFiltersChange: (filters: SlidesFilters) => void;
  onResetFilters: () => void;
  filterOptions: FilterOptions;
  isLoading: boolean;
  visibleColumns: readonly SlidesTableColumnId[];
};

export function SlidesTableToolbar({
  searchValue,
  onSearchChange,
  filters,
  onFiltersChange,
  onResetFilters,
  filterOptions,
  isLoading,
  visibleColumns,
}: Props) {
  const activeFilters = [
    ...(isSlidesTableColumnVisible(visibleColumns, "specimen_category")
      ? filters.specimenCategories.map((value) => ({
          key: `specimen-${value}`,
          label: `Specimen: ${value}`,
          onRemove: () =>
            onFiltersChange({
              ...filters,
              specimenCategories: filters.specimenCategories.filter((item) => item !== value),
            }),
        }))
      : []),
    ...(isSlidesTableColumnVisible(visibleColumns, "tags")
      ? filters.tags.map((value) => ({
          key: `tag-${value}`,
          label: `Associated Folders: ${value}`,
          onRemove: () =>
            onFiltersChange({
              ...filters,
              tags: filters.tags.filter((item) => item !== value),
            }),
        }))
      : []),
    ...(isSlidesTableColumnVisible(visibleColumns, "analysis_status")
      ? filters.statuses.map((value) => ({
          key: `status-${value}`,
          label: `Status: ${value}`,
          onRemove: () =>
            onFiltersChange({
              ...filters,
              statuses: filters.statuses.filter((item) => item !== value),
            }),
        }))
      : []),
    ...(isSlidesTableColumnVisible(visibleColumns, "results")
      ? filters.resultLabels.map((value) => ({
          key: `result-${value}`,
          label: `Results: ${value}`,
          onRemove: () =>
            onFiltersChange({
              ...filters,
              resultLabels: filters.resultLabels.filter((item) => item !== value),
            }),
        }))
      : []),
  ];

  return (
    <Box p={6} borderBottomWidth="1px">
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by slide name, folder, product, or result"
            bg="white"
          />
        </InputGroup>
        <HStack justify={{ base: "flex-start", lg: "flex-end" }} spacing={3} flexWrap="wrap">
          {isSlidesTableColumnVisible(visibleColumns, "specimen_category") ? (
            <FilterMenu
              label="Specimen"
              options={filterOptions.specimenCategories}
              value={filters.specimenCategories}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  specimenCategories: value as string[],
                })
              }
            />
          ) : null}
          {isSlidesTableColumnVisible(visibleColumns, "tags") ? (
            <FilterMenu
              label="Associated Folders"
              options={filterOptions.tags}
              value={filters.tags}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  tags: value as string[],
                })
              }
            />
          ) : null}
          {isSlidesTableColumnVisible(visibleColumns, "analysis_status") ? (
            <FilterMenu
              label="Status"
              options={filterOptions.statuses}
              value={filters.statuses}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  statuses: value as UiResultStatus[],
                })
              }
            />
          ) : null}
          {isSlidesTableColumnVisible(visibleColumns, "results") ? (
            <FilterMenu
              label="Results"
              options={filterOptions.resultLabels}
              value={filters.resultLabels}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  resultLabels: value as string[],
                })
              }
            />
          ) : null}
          <Button variant="outline" onClick={onResetFilters} isDisabled={isLoading}>
            Reset
          </Button>
        </HStack>
      </SimpleGrid>
      {activeFilters.length > 0 ? (
        <Wrap spacing={2} mt={4}>
          {activeFilters.map((filter) => (
            <Tag
              key={filter.key}
              size="md"
              variant="subtle"
              colorScheme="brand"
              borderRadius="full"
            >
              <TagLabel>{filter.label}</TagLabel>
              <TagCloseButton onClick={filter.onRemove} />
            </Tag>
          ))}
        </Wrap>
      ) : null}
    </Box>
  );
}

type FilterMenuProps = {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string | string[]) => void;
};

function FilterMenu({ label, options, value, onChange }: FilterMenuProps) {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
        <HStack spacing={2}>
          <Text>{label}</Text>
          {value.length > 0 ? (
            <Text color="brand.600" fontSize="sm">
              ({value.length})
            </Text>
          ) : null}
        </HStack>
      </MenuButton>
      <MenuList minW="14rem">
        <MenuOptionGroup
          type="checkbox"
          value={value}
          onChange={onChange}
          title={`Filter by ${label.toLowerCase()}`}
        >
          {options.map((option) => (
            <MenuItemOption key={option} value={option}>
              {option}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
