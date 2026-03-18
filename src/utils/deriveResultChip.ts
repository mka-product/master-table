import type { ResultChip, SlideResult } from "../types/slides";
import { normalizeResultStatus } from "./normalizeResultStatus";
import { translateResultLabel } from "./resultLabelDictionary";

export function deriveResultChip(result: SlideResult): ResultChip {
  const tone = normalizeResultStatus(result);
  const productName =
    result.result.context?.model_admin?.product_name ?? result.product.id;
  const rawLabel =
    result.result.output?.label ??
    result.result.output?.error_type?.key ??
    (tone === "success"
      ? "Completed"
      : tone === "error"
        ? "Failed"
        : result.result.status);
  const label = translateResultLabel(rawLabel) ?? rawLabel;

  return {
    productId: result.product.id,
    label: `${productName}: ${label}`,
    tone,
    rawStatus: result.result.status,
  };
}
