import type { SlideResult } from "../types/slides";
import { normalizeResultStatus } from "./normalizeResultStatus";
import { translateResultLabel } from "./resultLabelDictionary";

function formatProductDisplayName(result: SlideResult) {
  const productName =
    result.result.context?.model_admin?.product_name ?? result.product.id;
  const productVersion =
    result.result.context?.model_admin?.product_version ?? result.product.version;

  return productVersion ? `${productName} (${productVersion})` : productName;
}

function getRawResultLabel(result: SlideResult) {
  const tone = normalizeResultStatus(result);

  return (
    result.result.output?.label ??
    result.result.output?.error_type?.key ??
    (tone === "success"
      ? "Completed"
      : tone === "error"
        ? "Failed"
        : result.result.status)
  );
}

export function formatResultDisplayLabel(result: SlideResult) {
  const rawLabel = getRawResultLabel(result);
  const label = translateResultLabel(rawLabel) ?? rawLabel;

  return `${formatProductDisplayName(result)}: ${label}`;
}
