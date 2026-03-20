import type { ResultChip, SlideResult } from "../types/slides";
import { normalizeResultStatus } from "./normalizeResultStatus";
import { formatResultDisplayLabel } from "./formatResultDisplayLabel";

export function deriveResultChip(result: SlideResult): ResultChip {
  const tone = normalizeResultStatus(result);

  return {
    productId: result.product.id,
    label: formatResultDisplayLabel(result),
    tone,
    rawStatus: result.result.status,
  };
}
