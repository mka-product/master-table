import type { SlideResult, UiResultStatus } from "../types/slides";

export function normalizeResultStatus(result: SlideResult): UiResultStatus {
  if (result.result.status === "Pending") {
    return "pending";
  }

  if (result.result.status === "InProgress") {
    return "processing";
  }

  if (
    result.result.status === "Completed" &&
    result.result.context?.status === "Failed"
  ) {
    return "error";
  }

  if (
    result.result.status === "Completed" &&
    result.result.context?.status === "Completed"
  ) {
    return "success";
  }

  return "processing";
}
