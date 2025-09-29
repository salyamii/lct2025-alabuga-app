import { create } from 'zustand';
import { StoreItem } from '../domain/store';
import { storeService } from '../api/services/storeService';
import { StoreItemCreateRequest, StoreItemUpdateRequest, StorePurchaseRequest } from '../api/types/apiTypes';
import { toast } from 'sonner';

interface StoreState {
  // Данные
  items: StoreItem[];
  isLoading: boolean;
  error: string | null;

  // Действия для работы с товарами
  fetchItems: () => Promise<void>;
  getItem: (id: number) => Promise<StoreItem | null>;
  createItem: (itemData: StoreItemCreateRequest) => Promise<StoreItem | null>;
  updateItem: (id: number, itemData: StoreItemUpdateRequest) => Promise<StoreItem | null>;
  deleteItem: (id: number) => Promise<boolean>;
  purchaseItem: (purchaseData: StorePurchaseRequest) => Promise<StoreItem | null>;

  // Вспомогательные методы
  getItemById: (id: number) => StoreItem | undefined;
  getAvailableItems: () => StoreItem[];
  getLowStockItems: (threshold?: number) => StoreItem[];
  searchItems: (query: string) => StoreItem[];
  filterItemsByPrice: (minPrice: number, maxPrice: number) => StoreItem[];

  // Сброс состояния
  reset: () => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  // Начальное состояние
  items: [],
  isLoading: false,
  error: null,

  // Получить все товары
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await storeService.getStoreItems();
      if (response.success && response.data) {
        const items = response.data.values.map(item => StoreItem.fromResponse(item));
        set({ items, isLoading: false });
      } else {
        throw new Error('Не удалось загрузить товары');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при загрузке товаров';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Получить товар по ID
  getItem: async (id: number) => {
    try {
      const response = await storeService.getStoreItem(id);
      if (response.success && response.data) {
        const item = StoreItem.fromResponse(response.data);
        
        // Обновляем товар в списке
        set(state => ({
          items: state.items.map(existingItem => 
            existingItem.id === id ? item : existingItem
          )
        }));
        
        return item;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении товара';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  },

  // Создать товар
  createItem: async (itemData: StoreItemCreateRequest) => {
    try {
      const response = await storeService.createStoreItem(itemData);
      if (response.success && response.data) {
        const newItem = StoreItem.fromResponse(response.data);
        
        set(state => ({
          items: [...state.items, newItem]
        }));
        
        toast.success('Товар успешно создан!');
        return newItem;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании товара';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  },

  // Обновить товар
  updateItem: async (id: number, itemData: StoreItemUpdateRequest) => {
    try {
      const response = await storeService.updateStoreItem(id, itemData);
      if (response.success && response.data) {
        const updatedItem = StoreItem.fromResponse(response.data);
        
        set(state => ({
          items: state.items.map(item => 
            item.id === id ? updatedItem : item
          )
        }));
        
        toast.success('Товар успешно обновлен!');
        return updatedItem;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении товара';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  },

  // Удалить товар
  deleteItem: async (id: number) => {
    try {
      const response = await storeService.deleteStoreItem(id);
      if (response.success) {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
        
        toast.success('Товар успешно удален!');
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении товара';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  },

  // Купить товар
  purchaseItem: async (purchaseData: StorePurchaseRequest) => {
    try {
      const response = await storeService.purchaseStoreItem(purchaseData);
      if (response.success && response.data) {
        const purchasedItem = StoreItem.fromResponse(response.data);
        
        // Обновляем товар в списке (уменьшаем количество)
        set(state => ({
          items: state.items.map(item => 
            item.id === purchasedItem.id ? purchasedItem : item
          )
        }));
        
        toast.success('Товар успешно куплен!');
        return purchasedItem;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при покупке товара';
      set({ error: errorMessage });
      toast.error(errorMessage);
      return null;
    }
  },

  // Получить товар по ID из состояния
  getItemById: (id: number) => {
    return get().items.find(item => item.id === id);
  },

  // Получить доступные товары
  getAvailableItems: () => {
    return get().items.filter(item => item.isAvailable());
  },

  // Получить товары с низким остатком
  getLowStockItems: (threshold = 5) => {
    return get().items.filter(item => item.isLowStock(threshold));
  },

  // Поиск товаров
  searchItems: (query: string) => {
    const lowerQuery = query.toLowerCase();
    return get().items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery)
    );
  },

  // Фильтрация по цене
  filterItemsByPrice: (minPrice: number, maxPrice: number) => {
    return get().items.filter(item => 
      item.price >= minPrice && item.price <= maxPrice
    );
  },

  // Сброс состояния
  reset: () => {
    set({
      items: [],
      isLoading: false,
      error: null
    });
  }
}));
