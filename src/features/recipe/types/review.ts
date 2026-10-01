export type Review = {
  userId: string;
  recipeId: number;
  languageId: number;
  note: number;
  description: string;
  createdAt: string;
  modifiedAt: string | null;
  user: {
    id: string;
    username: string;
  };
};

export type ReviewsPage = {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    average: number | null;
  };
};

export type UpsertReviewInput = {
  note: number;
  description: string;
};
