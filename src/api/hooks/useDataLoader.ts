import { useCallback } from 'react';
import { useAppStore } from '../../stores/useAppStore';

interface DataLoaderState {
  isLoading: boolean;
  error: string | null;
  loadedStores: Set<string>;
}

interface DataLoaderActions {
  loadAllData: () => Promise<void>;
  loadSpecificData: (storeNames: string[]) => Promise<void>;
  clearAllData: () => void;
  reset: () => void;
}

export function useDataLoader() {
  const appStore = useAppStore();

  const loadAllData = useCallback(async () => {
    const stores = [
      { name: 'skills', loader: appStore.skills.fetchSkills },
      { name: 'missions', loader: appStore.missions.fetchMissions },
      { name: 'tasks', loader: appStore.tasks.fetchTasks },
      { name: 'competencies', loader: appStore.competencies.fetchCompetencies },
      { name: 'ranks', loader: appStore.ranks.fetchRanks },
      { name: 'seasons', loader: appStore.seasons.fetchSeasons },
      { name: 'artifacts', loader: appStore.artifacts.fetchArtifacts },
    ];

    // Загружаем данные параллельно для лучшей производительности
    const loadPromises = stores.map(async (store) => {
      try {
        await store.loader();
        console.log(`✅ Данные для ${store.name} успешно загружены`);
        return { name: store.name, success: true };
      } catch (error) {
        console.error(`❌ Ошибка загрузки данных для ${store.name}:`, error);
        return { name: store.name, success: false, error };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    
    // Логируем результаты загрузки
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { name, success, error } = result.value;
        if (success) {
          console.log(`✅ Стор ${name} загружен успешно`);
        } else {
          console.error(`❌ Ошибка загрузки стора ${name}:`, error);
        }
      } else {
        console.error(`❌ Критическая ошибка загрузки стора ${stores[index].name}:`, result.reason);
      }
    });

    const failedStores = results
      .map((result, index) => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success) 
          ? stores[index].name 
          : null
      )
      .filter(Boolean);

    if (failedStores.length > 0) {
      console.warn(`⚠️ Не удалось загрузить данные для сторов: ${failedStores.join(', ')}`);
    } else {
      console.log('🎉 Все данные успешно загружены');
    }
  }, [appStore]);

  const loadSpecificData = useCallback(async (storeNames: string[]) => {
    const storeMap: Record<string, () => Promise<void>> = {
      skills: appStore.skills.fetchSkills,
      missions: appStore.missions.fetchMissions,
      tasks: appStore.tasks.fetchTasks,
      competencies: appStore.competencies.fetchCompetencies,
      ranks: appStore.ranks.fetchRanks,
      seasons: appStore.seasons.fetchSeasons,
      artifacts: appStore.artifacts.fetchArtifacts,
    };

    const validStoreNames = storeNames.filter(name => storeMap[name]);
    const invalidStoreNames = storeNames.filter(name => !storeMap[name]);

    if (invalidStoreNames.length > 0) {
      console.warn(`⚠️ Неизвестные сторы: ${invalidStoreNames.join(', ')}`);
    }

    const loadPromises = validStoreNames.map(async (storeName) => {
      try {
        await storeMap[storeName]();
        console.log(`✅ Данные для ${storeName} успешно загружены`);
        return { name: storeName, success: true };
      } catch (error) {
        console.error(`❌ Ошибка загрузки данных для ${storeName}:`, error);
        return { name: storeName, success: false, error };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { name, success, error } = result.value;
        if (success) {
          console.log(`✅ Стор ${name} загружен успешно`);
        } else {
          console.error(`❌ Ошибка загрузки стора ${name}:`, error);
        }
      } else {
        console.error(`❌ Критическая ошибка загрузки стора ${validStoreNames[index]}:`, result.reason);
      }
    });
  }, [appStore]);

  const clearAllData = useCallback(() => {
    // Очищаем все сторы от данных
    try {
      appStore.skills.clearSkills?.();
      appStore.missions.clearMissions?.();
      appStore.tasks.clearTasks?.();
      appStore.competencies.clearCompetencies?.();
      appStore.ranks.clearRanks?.();
      appStore.seasons.clearSeasons?.();
      appStore.artifacts.clearArtifacts?.();
      console.log('🧹 Все сторы очищены');
    } catch (error) {
      console.error('❌ Ошибка при очистке сторов:', error);
    }
  }, [appStore]);

  const reset = useCallback(() => {
    clearAllData();
    console.log('🔄 Состояние загрузчика данных сброшено');
  }, [clearAllData]);

  return {
    loadAllData,
    loadSpecificData,
    clearAllData,
    reset,
  };
}
