export type ShoppingListItem = {
  id: number;
  householdId: string;
  ingredientId: number | null;
  customLabel: string | null;
  quantity: number | null;
  unitId: number | null;
  isChecked: boolean;
  addedById: string;
  createdAt: string;
  ingredient: { id: number; translations: { name: string }[] } | null;
  unit: { id: number; type: string; translations: { name: string }[] } | null;
  addedBy: { id: string; username: string };
};

export type AddShoppingListItemInput = {
  ingredientId?: number;
  customLabel?: string;
  quantity?: number;
  unitId?: number;
};

export type UpdateShoppingListItemInput = {
  quantity?: number;
  unitId?: number;
  isChecked?: boolean;
};
