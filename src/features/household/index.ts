// Context
export { HouseholdProvider } from './context';

// Hooks
export { useHousehold } from './hooks';

// Components
export { HouseholdManager } from './components';

// API
export { getMyHouseholds, createHousehold, updateHousehold, deleteHousehold, addHouseholdMember, removeHouseholdMember } from './api/households';
export { getShoppingList, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem } from './api/shoppingList';
export {
  loadShoppingList,
  addItemOffline,
  toggleItemOffline,
  deleteItemOffline,
  syncShoppingList,
  getPendingCount,
} from './utils/shoppingListOffline';

// Types
export type { Household, HouseholdMember, HouseholdRole, CreateHouseholdInput } from './types/household';
export type { ShoppingListItem, AddShoppingListItemInput, UpdateShoppingListItemInput } from './types/shoppingList';
