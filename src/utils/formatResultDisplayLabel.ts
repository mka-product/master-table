import type { SlideResult } from "../types/slides";
import { normalizeResultStatus } from "./normalizeResultStatus";
import { translateResultLabel } from "./resultLabelDictionary";

export function getProductDisplayParts(result: SlideResult) {
  const productName = result.result.context?.model_admin?.product_name ?? result.product.id;
  const productVersion = result.result.context?.model_admin?.product_version ?? result.product.version;

  return {
    productName,
    productVersion: productVersion ?? null,
  };
}

export function formatProductDisplayName(result: SlideResult) {
  const { productName, productVersion } = getProductDisplayParts(result);
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

export function formatAnalysisLabel(result: SlideResult) {
  const rawLabel = getRawResultLabel(result);
  return translateResultLabel(rawLabel) ?? rawLabel;
}

export function formatResultDisplayLabel(result: SlideResult) {
  return `${formatProductDisplayName(result)}: ${formatAnalysisLabel(result)}`;
}
