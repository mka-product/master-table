import { Stack, Tag, TagLabel } from "@chakra-ui/react";
import type { ResultChip } from "../types/slides";

const CHIP_TONES: Record<
  ResultChip["tone"],
  "green" | "orange" | "yellow" | "red"
> = {
  success: "green",
  processing: "orange",
  pending: "yellow",
  error: "red",
};

type Props = {
  chips: ResultChip[];
};

export function ResultChipsCell({ chips }: Props) {
  return (
    <Stack spacing={2} align="flex-start">
      {chips.map((chip) => (
        <Tag key={`${chip.productId}-${chip.label}`} colorScheme={CHIP_TONES[chip.tone]} variant="subtle">
          <TagLabel whiteSpace="normal">{chip.label}</TagLabel>
        </Tag>
      ))}
    </Stack>
  );
}
