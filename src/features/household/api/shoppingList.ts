import { apiClient } from '@/config/client';
import type { ShoppingListItem, AddShoppingListItemInput, UpdateShoppingListItemInput } from '../types/shoppingList';

export async function getShoppingList(householdId: string): Promise<ShoppingListItem[]> {
  const response = await apiClient<{ data: ShoppingListItem[] }>(`/households/${householdId}/shopping-list`);
  return response.data;
}

export async function addShoppingListItem(
  householdId: string,
  data: AddShoppingListItemInput
): Promise<ShoppingListItem> {
  const response = await apiClient<{ result: ShoppingListItem }>(`/households/${householdId}/shopping-list`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.result;
}

export async function updateShoppingListItem(
  householdId: string,
  itemId: number,
  data: UpdateShoppingListItemInput
): Promise<ShoppingListItem> {
  const response = await apiClient<{ result: ShoppingListItem }>(
    `/households/${householdId}/shopping-list/${itemId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );
  return response.result;
}

export async function deleteShoppingListItem(householdId: string, itemId: number): Promise<void> {
  await apiClient(`/households/${householdId}/shopping-list/${itemId}`, { method: 'DELETE' });
}
