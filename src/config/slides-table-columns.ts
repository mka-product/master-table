export const VISIBLE_SLIDES_TABLE_COLUMNS = [
  "select",
  "name",
  "analysis_status",
  "updated_at",
  "tags",
  "actions",
] as const;

export function isSlidesTableColumnVisible(columnId: string) {
  return VISIBLE_SLIDES_TABLE_COLUMNS.includes(
    columnId as (typeof VISIBLE_SLIDES_TABLE_COLUMNS)[number],
  );
}
