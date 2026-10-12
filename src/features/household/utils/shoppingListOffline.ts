import { Preferences } from '@capacitor/preferences';
import { NetworkError } from '@/config/client';
import {
  getShoppingList as apiGetShoppingList,
  addShoppingListItem as apiAddShoppingListItem,
  updateShoppingListItem as apiUpdateShoppingListItem,
  deleteShoppingListItem as apiDeleteShoppingListItem,
} from '../api/shoppingList';
import type { ShoppingListItem, AddShoppingListItemInput } from '../types/shoppingList';

type QueuedOperation =
  | { kind: 'add'; localId: number; data: AddShoppingListItemInput; isChecked: boolean }
  | { kind: 'toggle'; targetId: number; isChecked: boolean }
  | { kind: 'delete'; targetId: number };

const cacheKey = (householdId: string) => `shopping_list_cache_${householdId}`;
const queueKey = (householdId: string) => `shopping_list_queue_${householdId}`;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const { value } = await Preferences.get({ key });
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): Promise<void> {
  return Preferences.set({ key, value: JSON.stringify(value) });
}

export function getCachedItems(householdId: string): Promise<ShoppingListItem[]> {
  return readJson(cacheKey(householdId), []);
}

function setCachedItems(householdId: string, items: ShoppingListItem[]): Promise<void> {
  return writeJson(cacheKey(householdId), items);
}

function getQueue(householdId: string): Promise<QueuedOperation[]> {
  return readJson(queueKey(householdId), []);
}

function setQueue(householdId: string, queue: QueuedOperation[]): Promise<void> {
  return writeJson(queueKey(householdId), queue);
}

export async function getPendingCount(householdId: string): Promise<number> {
  return (await getQueue(householdId)).length;
}

let nextLocalId = -1;
function generateLocalId(): number {
  nextLocalId -= 1;
  return nextLocalId;
}

export async function loadShoppingList(
  householdId: string
): Promise<{ items: ShoppingListItem[]; isFromCache: boolean }> {
  try {
    const items = await apiGetShoppingList(householdId);
    await setCachedItems(householdId, items);
    return { items, isFromCache: false };
  } catch (err) {
    if (err instanceof NetworkError) {
      return { items: await getCachedItems(householdId), isFromCache: true };
    }
    throw err;
  }
}

export async function addItemOffline(
  householdId: string,
  user: { id: string; username: string },
  data: AddShoppingListItemInput,
  displayName?: string
): Promise<ShoppingListItem> {
  try {
    const item = await apiAddShoppingListItem(householdId, data);
    const items = await getCachedItems(householdId);
    await setCachedItems(householdId, [item, ...items]);
    return item;
  } catch (err) {
    if (!(err instanceof NetworkError)) throw err;

    const localId = generateLocalId();
    const placeholder: ShoppingListItem = {
      id: localId,
      householdId,
      ingredientId: data.ingredientId ?? null,
      customLabel: data.customLabel ?? null,
      quantity: data.quantity ?? null,
      unitId: data.unitId ?? null,
      isChecked: false,
      addedById: user.id,
      createdAt: new Date().toISOString(),
      ingredient:
        data.ingredientId && displayName
          ? { id: data.ingredientId, translations: [{ name: displayName }] }
          : null,
      unit: null,
      addedBy: user,
    };

    const items = await getCachedItems(householdId);
    await setCachedItems(householdId, [placeholder, ...items]);

    const queue = await getQueue(householdId);
    queue.push({ kind: 'add', localId, data, isChecked: false });
    await setQueue(householdId, queue);

    return placeholder;
  }
}

export async function toggleItemOffline(householdId: string, itemId: number, isChecked: boolean): Promise<void> {
  if (itemId < 0) {
    // Not yet synced: fold the checked state straight into the pending "add".
    const items = await getCachedItems(householdId);
    await setCachedItems(householdId, items.map((i) => (i.id === itemId ? { ...i, isChecked } : i)));
    const queue = await getQueue(householdId);
    const next = queue.map((op) => (op.kind === 'add' && op.localId === itemId ? { ...op, isChecked } : op));
    await setQueue(householdId, next);
    return;
  }

  try {
    await apiUpdateShoppingListItem(householdId, itemId, { isChecked });
  } catch (err) {
    if (!(err instanceof NetworkError)) throw err;
    const queue = await getQueue(householdId);
    const withoutExistingToggle = queue.filter((op) => !(op.kind === 'toggle' && op.targetId === itemId));
    withoutExistingToggle.push({ kind: 'toggle', targetId: itemId, isChecked });
    await setQueue(householdId, withoutExistingToggle);
  }

  // Reached only on success or once the change is safely queued — a genuine
  // (non-network) failure throws above, before the cache is touched.
  const items = await getCachedItems(householdId);
  await setCachedItems(householdId, items.map((i) => (i.id === itemId ? { ...i, isChecked } : i)));
}

export async function deleteItemOffline(householdId: string, itemId: number): Promise<void> {
  if (itemId < 0) {
    // Not yet synced: just drop the pending "add", there's nothing to delete server-side.
    const queue = await getQueue(householdId);
    await setQueue(householdId, queue.filter((op) => !(op.kind === 'add' && op.localId === itemId)));
    const items = await getCachedItems(householdId);
    await setCachedItems(householdId, items.filter((i) => i.id !== itemId));
    return;
  }

  try {
    await apiDeleteShoppingListItem(householdId, itemId);
    const queue = await getQueue(householdId);
    await setQueue(householdId, queue.filter((op) => !('targetId' in op && op.targetId === itemId)));
  } catch (err) {
    if (!(err instanceof NetworkError)) throw err;
    const queue = await getQueue(householdId);
    const withoutStaleToggle = queue.filter((op) => !(op.kind === 'toggle' && op.targetId === itemId));
    withoutStaleToggle.push({ kind: 'delete', targetId: itemId });
    await setQueue(householdId, withoutStaleToggle);
  }

  // Reached only on success or once the deletion is safely queued.
  const items = await getCachedItems(householdId);
  await setCachedItems(householdId, items.filter((i) => i.id !== itemId));
}

// Replays every queued change against the server, in order. Temporary
// negative ids used for items created offline are remapped to their real
// server id as each "add" resolves, so later operations in the same batch
// (a toggle or delete against that same item) target the right row.
export async function syncShoppingList(householdId: string): Promise<ShoppingListItem[]> {
  const queue = await getQueue(householdId);
  if (queue.length === 0) {
    return getCachedItems(householdId);
  }

  const idMap = new Map<number, number>();
  const remaining: QueuedOperation[] = [];

  for (const op of queue) {
    try {
      if (op.kind === 'add') {
        const created = await apiAddShoppingListItem(householdId, op.data);
        idMap.set(op.localId, created.id);
        if (op.isChecked) {
          await apiUpdateShoppingListItem(householdId, created.id, { isChecked: true });
        }
      } else {
        const targetId = idMap.get(op.targetId) ?? op.targetId;
        if (op.kind === 'toggle') {
          await apiUpdateShoppingListItem(householdId, targetId, { isChecked: op.isChecked });
        } else {
          await apiDeleteShoppingListItem(householdId, targetId);
        }
      }
    } catch (err) {
      if (err instanceof NetworkError) {
        remaining.push(op);
        continue;
      }
      // A real server-side rejection (e.g. already deleted elsewhere): drop
      // this one operation and keep going with the rest of the queue.
    }
  }

  await setQueue(householdId, remaining);

  const { items } = await loadShoppingList(householdId);
  return items;
}
