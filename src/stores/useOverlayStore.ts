import { create } from 'zustand';

interface OverlayState {
  // Состояния оверлеев
  missionCreationOpen: boolean;
  badgeCreationOpen: boolean;
  rewardCreationOpen: boolean;
  storeManagementOpen: boolean;
  chainCreationOpen: boolean;
  seasonCreationOpen: boolean;
  
  // Выбранные элементы для редактирования
  selectedChain: any;
  selectedBranch: any;
  selectedMission: any;
  
  // Действия для управления оверлеями
  openMissionCreation: () => void;
  closeMissionCreation: () => void;
  openBadgeCreation: () => void;
  closeBadgeCreation: () => void;
  openRewardCreation: () => void;
  closeRewardCreation: () => void;
  openStoreManagement: () => void;
  closeStoreManagement: () => void;
  openChainCreation: (chain?: any) => void;
  closeChainCreation: () => void;
  openSeasonCreation: () => void;
  closeSeasonCreation: () => void;
  
  // Универсальные методы
  closeAllOverlays: () => void;
  setSelectedChain: (chain: any) => void;
  setSelectedBranch: (branch: any) => void;
  setSelectedMission: (mission: any) => void;
}

export const useOverlayStore = create<OverlayState>()((set, get) => ({
  // Начальное состояние
  missionCreationOpen: false,
  badgeCreationOpen: false,
  rewardCreationOpen: false,
  storeManagementOpen: false,
  chainCreationOpen: false,
  seasonCreationOpen: false,
  
  selectedChain: null,
  selectedBranch: null,
  selectedMission: null,
  
  // Действия для управления оверлеями
  openMissionCreation: () => set({ missionCreationOpen: true }),
  closeMissionCreation: () => set({ missionCreationOpen: false }),
  
  openBadgeCreation: () => set({ badgeCreationOpen: true }),
  closeBadgeCreation: () => set({ badgeCreationOpen: false }),
  
  openRewardCreation: () => set({ rewardCreationOpen: true }),
  closeRewardCreation: () => set({ rewardCreationOpen: false }),
  
  openStoreManagement: () => set({ storeManagementOpen: true }),
  closeStoreManagement: () => set({ storeManagementOpen: false }),
  
  openChainCreation: (chain = null) => set({ 
    chainCreationOpen: true, 
    selectedChain: chain 
  }),
  closeChainCreation: () => set({ 
    chainCreationOpen: false, 
    selectedChain: null 
  }),
  
  openSeasonCreation: () => set({ seasonCreationOpen: true }),
  closeSeasonCreation: () => set({ seasonCreationOpen: false }),
  
  // Универсальные методы
  closeAllOverlays: () => set({
    missionCreationOpen: false,
    badgeCreationOpen: false,
    rewardCreationOpen: false,
    storeManagementOpen: false,
    chainCreationOpen: false,
    seasonCreationOpen: false,
    selectedChain: null,
    selectedBranch: null,
    selectedMission: null,
  }),
  
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedMission: (mission) => set({ selectedMission: mission }),
}));
