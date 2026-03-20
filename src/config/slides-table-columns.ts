export const DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS = [
  "select",
  "name",
  "results",
  "updated_at",
  "tags",
  "actions",
] as const;

export type SlidesTableColumnId =
  (typeof DEFAULT_VISIBLE_SLIDES_TABLE_COLUMNS)[number] | "specimen_category" | "results";

export function isSlidesTableColumnVisible(
  visibleColumns: readonly SlidesTableColumnId[],
  columnId: string,
) {
  return visibleColumns.includes(columnId as SlidesTableColumnId);
}

export function toggleSlidesTableColumn(
  visibleColumns: readonly SlidesTableColumnId[],
  columnId: SlidesTableColumnId,
) {
  if (visibleColumns.includes(columnId)) {
    return visibleColumns.filter((visibleColumn) => visibleColumn !== columnId);
  }

  return [...visibleColumns, columnId];
}
