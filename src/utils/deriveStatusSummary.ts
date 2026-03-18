import type { SlideResult, StatusSummary, UiResultStatus } from "../types/slides";
import { normalizeResultStatus } from "./normalizeResultStatus";

const EMPTY_DETAILS: StatusSummary["details"] = {
  success: [],
  processing: [],
  pending: [],
  error: [],
};

export function deriveStatusSummary(results: SlideResult[]): StatusSummary {
  const visibleResults = results.filter((result) => result.visible !== false);

  return visibleResults.reduce<StatusSummary>(
    (summary, result) => {
      const status = normalizeResultStatus(result);
      const productName =
        result.result.context?.model_admin?.product_name ?? result.product.id;
      const analysisDate = result.result.context?.analysis_date ?? null;

      summary[status] += 1;
      summary.total += 1;
      summary.details[status].push({
        productName,
        analysisDate,
      });

      return summary;
    },
    {
      success: 0,
      processing: 0,
      pending: 0,
      error: 0,
      total: 0,
      details: {
        success: [...EMPTY_DETAILS.success],
        processing: [...EMPTY_DETAILS.processing],
        pending: [...EMPTY_DETAILS.pending],
        error: [...EMPTY_DETAILS.error],
      },
    },
  );
}
