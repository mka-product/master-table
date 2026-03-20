import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Checkbox,
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  Tag,
  Wrap,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { getFilterOptions } from "../api/fetchSlides";
import {
  isSlidesTableColumnVisible,
  type SlidesTableColumnId,
} from "../config/slides-table-columns";
import type { SlideRowViewModel } from "../types/slides";
import { ResultChipsCell } from "./ResultChipsCell";
import { StatusSummaryCell } from "./StatusSummaryCell";

type Props = {
  rows: SlideRowViewModel[];
  totalRows: number;
  sortBy: string | null;
  sortDirection: "asc" | "desc" | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: Error | null;
  onSortChange: (sortBy: string | null, direction: "asc" | "desc" | null) => void;
  visibleColumns: readonly SlidesTableColumnId[];
  onToggleVisibility: (slideId: string) => void;
};

const columnHelper = createColumnHelper<SlideRowViewModel>();
const allFolders = getFilterOptions().tags;

function RowActionsMenu({ row }: { row: SlideRowViewModel }) {
  const [submenu, setSubmenu] = useState<"add" | "remove" | null>(null);
  const currentFolders = row.tags.map((tag) => tag.name);
  const remainingFolders = allFolders.filter((folder) => !currentFolders.includes(folder));
  const submenuItems = submenu === "add" ? remainingFolders : currentFolders;

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label="Open row actions"
        icon={
          <Flex
            align="center"
            justify="center"
            w="100%"
            h="100%"
            fontSize="xl"
            lineHeight="1"
          >
            &hellip;
          </Flex>
        }
        size="sm"
        variant="ghost"
        borderRadius="full"
      />
      <Portal>
        <MenuList zIndex={1600} position="relative" onMouseLeave={() => setSubmenu(null)}>
          <Box px={3} py={2}>
            <Text fontWeight="semibold">More actions</Text>
          </Box>
          <MenuItem
            onMouseEnter={() => setSubmenu("add")}
            icon={<ChevronLeftIcon color="gray.400" />}
          >
            Add to folder
          </MenuItem>
          <MenuItem
            onMouseEnter={() => setSubmenu("remove")}
            icon={<ChevronLeftIcon color="gray.400" />}
          >
            Remove from folder
          </MenuItem>
          <MenuItem
            onMouseEnter={() => setSubmenu(null)}
            color="red.500"
            icon={<DeleteIcon />}
          >
            Delete slide
          </MenuItem>
          {submenu ? (
            <Box
              position="absolute"
              top={submenu === "add" ? "3rem" : "5rem"}
              right="calc(100% - 0.25rem)"
              minW="13rem"
              bg="white"
              borderWidth="1px"
              borderRadius="md"
              boxShadow="lg"
              py={2}
              onMouseEnter={() => setSubmenu(submenu)}
            >
              <Box px={3} py={1}>
                <Text fontSize="sm" fontWeight="semibold">
                  {submenu === "add" ? "Add to folder" : "Remove from folder"}
                </Text>
              </Box>
              {submenuItems.length === 0 ? (
                <Box px={3} py={2}>
                  <Text fontSize="sm" color="gray.500">
                    No folders available
                  </Text>
                </Box>
              ) : (
                submenuItems.map((folder) => (
                  <Box key={folder} px={3} py={2} _hover={{ bg: "gray.50" }} cursor="pointer">
                    <Text fontSize="sm">{folder}</Text>
                  </Box>
                ))
              )}
            </Box>
          ) : null}
        </MenuList>
      </Portal>
    </Menu>
  );
}

function RowVisibilityButton({
  row,
  onToggleVisibility,
}: {
  row: SlideRowViewModel;
  onToggleVisibility: (slideId: string) => void;
}) {
  return (
    <Box
      opacity={0}
      pointerEvents="none"
      transition="opacity 0.15s ease"
      _groupHover={{
        opacity: 1,
        pointerEvents: "auto",
      }}
    >
      <IconButton
        size="sm"
        aria-label={row.isVisible ? "Mark slide hidden" : "Mark slide visible"}
        icon={
          <Flex align="center" justify="center" w="100%" h="100%">
            {row.isVisible ? <ViewOffIcon boxSize={4} /> : <ViewIcon boxSize={4} />}
          </Flex>
        }
        onClick={(event) => {
          event.stopPropagation();
          onToggleVisibility(row.id);
        }}
        variant="ghost"
        borderRadius="full"
      />
    </Box>
  );
}

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        isChecked={table.getIsAllPageRowsSelected()}
        isIndeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        isChecked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select row ${row.original.slideName}`}
      />
    ),
  }),
  columnHelper.accessor("slideName", {
    id: "name",
    header: "Slide Name",
    cell: (info) => (
      <Tooltip label={info.getValue()} hasArrow>
        <Flex align="center" gap={2} maxW="100%">
          {!info.row.original.isVisible ? (
            <Box
              w="0.625rem"
              h="0.625rem"
              borderRadius="full"
              bg="blue.500"
              flexShrink={0}
            />
          ) : null}
          <Text
            fontWeight="semibold"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            maxW="100%"
          >
            {info.getValue()}
          </Text>
        </Flex>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("specimenCategory", {
    id: "specimen_category",
    header: "Specimen",
    cell: (info) => info.getValue() ?? "Unspecified",
  }),
  columnHelper.accessor("statusSummary", {
    id: "analysis_status",
    header: "Status",
    cell: (info) => <StatusSummaryCell summary={info.getValue()} />,
  }),
  columnHelper.accessor("resultChips", {
    id: "results",
    header: "Results",
    cell: (info) => <ResultChipsCell chips={info.getValue()} />,
  }),
  columnHelper.accessor("updatedAt", {
    id: "updated_at",
    header: "Updated At",
    cell: (info) => (
      <Text whiteSpace="nowrap">{new Date(info.getValue()).toLocaleString()}</Text>
    ),
  }),
  columnHelper.accessor("tags", {
    id: "tags",
    header: "Associated Folders",
    cell: (info) => (
      <Wrap spacing={2}>
        {info.getValue().map((tag) => (
          <Tag key={tag.id} colorScheme="blue" variant="subtle">
            {tag.name}
          </Tag>
        ))}
      </Wrap>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => null,
  }),
];

export function SlidesTable({
  rows,
  totalRows,
  sortBy,
  sortDirection,
  isLoading,
  isRefetching,
  error,
  onSortChange,
  visibleColumns,
  onToggleVisibility,
}: Props) {
  const sorting: SortingState =
    sortBy && sortDirection ? [{ id: sortBy, desc: sortDirection === "desc" }] : [];
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectionScope, setSelectionScope] = useState<"page" | "all" | null>(null);
  const activeColumns = columns.filter((column) =>
    isSlidesTableColumnVisible(visibleColumns, column.id),
  );

  const table = useReactTable({
    data: rows,
    columns: activeColumns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectionScope !== "all") {
      return;
    }

    table.toggleAllPageRowsSelected(true);
  }, [rows, selectionScope, table]);

  useEffect(() => {
    if (!table.getIsAllPageRowsSelected() && selectionScope !== null) {
      setSelectionScope(null);
    }
  }, [rowSelection, selectionScope, table]);

  const visibleRowCount = rows.length;
  const hasHiddenMatches = totalRows > visibleRowCount;
  const allVisibleSelected = table.getIsAllPageRowsSelected() && visibleRowCount > 0;

  if (error) {
    return (
      <Box p={10}>
        <Text color="red.500" fontWeight="medium">
          Failed to load slides: {error.message}
        </Text>
      </Box>
    );
  }

  return (
    <TableContainer position="relative">
      {isRefetching ? (
        <Box position="absolute" insetX={0} top={0} h="1" bg="brand.500" opacity={0.5} />
      ) : null}
      {allVisibleSelected ? (
        <Box
          px={6}
          py={3}
          bg="blue.50"
          borderBottomWidth="1px"
          borderColor="blue.100"
        >
          <Flex align="center" gap={2} wrap="wrap" fontSize="sm" color="blue.900">
            <Text>
              {selectionScope === "all"
                ? `All ${totalRows} matching slides are selected.`
                : `All ${visibleRowCount} visible slides are selected.`}
            </Text>
            {selectionScope !== "all" && hasHiddenMatches ? (
              <Text
                as="button"
                type="button"
                fontWeight="semibold"
                textDecoration="underline"
                onClick={() => setSelectionScope("all")}
              >
                Select all {totalRows} matching slides
              </Text>
            ) : null}
            {selectionScope === "all" ? (
              <Text
                as="button"
                type="button"
                fontWeight="semibold"
                textDecoration="underline"
                onClick={() => {
                  setSelectionScope(null);
                  table.resetRowSelection();
                }}
              >
                Clear selection
              </Text>
            ) : null}
          </Flex>
        </Box>
      ) : null}
      <Table variant="simple">
        <Thead bg="gray.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort =
                  ["name", "specimen_category", "updated_at"].includes(header.column.id) &&
                  isSlidesTableColumnVisible(visibleColumns, header.column.id);
                const currentSort = sorting.find((item) => item.id === header.column.id);
                const isSlideNameColumn = header.column.id === "name";
                const isSelectionColumn = header.column.id === "select";

                return (
                  <Th
                    key={header.id}
                    w={isSelectionColumn ? "3.5rem" : isSlideNameColumn ? "22rem" : undefined}
                    minW={isSelectionColumn ? "3.5rem" : isSlideNameColumn ? "22rem" : undefined}
                    maxW={isSelectionColumn ? "3.5rem" : isSlideNameColumn ? "22rem" : undefined}
                  >
                    <Flex align="center" gap={2}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort ? (
                        <IconButton
                          aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                          size="xs"
                          variant="ghost"
                          icon={
                            currentSort ? (
                              currentSort.desc ? <ArrowDownIcon /> : <ArrowUpIcon />
                            ) : (
                              <ArrowUpIcon opacity={0.35} />
                            )
                          }
                          onClick={() => {
                            if (!currentSort) {
                              onSortChange(header.column.id, "asc");
                              return;
                            }

                            if (!currentSort.desc) {
                              onSortChange(header.column.id, "desc");
                              return;
                            }

                            onSortChange(null, null);
                          }}
                        />
                      ) : null}
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Tr key={`loading-${index}`}>
                  {activeColumns.map((column) => (
                    <Td
                      key={`${column.id}-${index}`}
                      w={column.id === "select" ? "3.5rem" : column.id === "name" ? "22rem" : undefined}
                      minW={column.id === "select" ? "3.5rem" : column.id === "name" ? "22rem" : undefined}
                      maxW={column.id === "select" ? "3.5rem" : column.id === "name" ? "22rem" : undefined}
                    >
                      <Skeleton h="5" />
                    </Td>
                  ))}
                </Tr>
              ))
            : table.getRowModel().rows.map((row) => (
                <Tr
                  key={row.id}
                  bg={row.original.isVisible ? undefined : "blue.50"}
                  _hover={{
                    bg: row.original.isVisible ? "gray.50" : "blue.100",
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      verticalAlign="middle"
                      position={cell.column.id === "name" ? "relative" : undefined}
                      w={cell.column.id === "select" ? "3.5rem" : cell.column.id === "name" ? "22rem" : undefined}
                      minW={cell.column.id === "select" ? "3.5rem" : cell.column.id === "name" ? "22rem" : undefined}
                      maxW={cell.column.id === "select" ? "3.5rem" : cell.column.id === "name" ? "22rem" : undefined}
                    >
                      {cell.column.id === "actions" ? (
                        <Flex justify="flex-end" align="center" gap={2} role="group">
                          <RowVisibilityButton
                            row={row.original}
                            onToggleVisibility={onToggleVisibility}
                          />
                          <RowActionsMenu row={row.original} />
                        </Flex>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
        </Tbody>
      </Table>
      {!isLoading && rows.length === 0 ? (
        <Box p={10}>
          <Text color="gray.500">No slides matched the current query.</Text>
        </Box>
      ) : null}
    </TableContainer>
  );
}
