export type ResultStatus = "Completed" | "Pending" | "InProgress";
export type ContextStatus = "Completed" | "Failed";
export type UiResultStatus = "success" | "processing" | "pending" | "error";

export type SlideTag = {
  id: string;
  name: string;
  slide_count: number;
};

export type SlideResult = {
  id: string;
  product: {
    id: string;
    version: string;
  };
  result: {
    status: ResultStatus;
    context?: {
      status?: ContextStatus;
      analysis_date?: string;
      product?: {
        id: string;
        version: string;
      };
      external_app?: {
        url: string | null;
      };
      model_admin?: {
        product_name?: string;
        product_version?: string;
      };
    };
    output?: {
      kind?: string;
      label?: string | null;
      error_type?: {
        key?: string;
      };
      message?: string;
    };
  };
  slide_id: string;
  created_at: string;
  last_status_update_date: string;
  updated_at: string;
  visible: boolean;
};

export type Slide = {
  id: string;
  name: string;
  external_url: string;
  created_at: string;
  updated_at: string;
  fav: boolean;
  tags: SlideTag[];
  specimen_category: string | null;
  results: SlideResult[];
};

export type SlidesApiResponse = {
  data: Slide[];
  count: number;
  total: number;
  page: number;
  page_count: number;
};

export type SlidesFilters = {
  specimenCategories: string[];
  tags: string[];
  statuses: UiResultStatus[];
  resultLabels: string[];
};

export type SortDirection = "asc" | "desc";

export type SlidesQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string | null;
  sortDirection: SortDirection | null;
  filters: SlidesFilters;
};

export type StatusSummary = {
  success: number;
  processing: number;
  pending: number;
  error: number;
  total: number;
  details: Record<
    UiResultStatus,
    Array<{
      productName: string;
      analysisDate: string | null;
    }>
  >;
};

export type ResultChip = {
  productId: string;
  label: string;
  tone: UiResultStatus;
  rawStatus: ResultStatus;
};

export type SlideRowViewModel = {
  id: string;
  slideName: string;
  isVisible: boolean;
  externalUrl: string | null;
  specimenCategory: string | null;
  tags: Array<{ id: string; name: string }>;
  createdAt: string;
  updatedAt: string;
  statusSummary: StatusSummary;
  resultChips: ResultChip[];
  raw: Slide;
};
