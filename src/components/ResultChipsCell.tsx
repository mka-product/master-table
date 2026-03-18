import { Tag, TagLabel, Tooltip, Wrap } from "@chakra-ui/react";
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
    <Wrap spacing={2}>
      {chips.map((chip) => (
        <Tooltip key={`${chip.productId}-${chip.label}`} label={chip.label} hasArrow>
          <Tag colorScheme={CHIP_TONES[chip.tone]} variant="subtle" maxW="14rem">
            <TagLabel overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {chip.label}
            </TagLabel>
          </Tag>
        </Tooltip>
      ))}
    </Wrap>
  );
}
