import { create } from 'zustand';

interface OverlayState {
  // Состояния оверлеев
  missionCreationOpen: boolean;
  missionEditOpen: boolean; // NEW
  badgeCreationOpen: boolean;
  rewardCreationOpen: boolean;
  storeManagementOpen: boolean;
  chainCreationOpen: boolean;
  seasonCreationOpen: boolean;
  seasonEditOpen: boolean;
  
  // Выбранные элементы для редактирования
  selectedChain: any;
  selectedBranch: any;
  selectedMission: any;
  selectedSeason: any;
  
  // Действия для управления оверлеями
  openMissionCreation: () => void;
  closeMissionCreation: () => void;
  openMissionEdit: (mission?: any) => void; // NEW
  closeMissionEdit: () => void; // NEW
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
  openSeasonEdit: (season?: any) => void;
  closeSeasonEdit: () => void;
  
  // Универсальные методы
  closeAllOverlays: () => void;
  setSelectedChain: (chain: any) => void;
  setSelectedBranch: (branch: any) => void;
  setSelectedMission: (mission: any) => void;
  setSelectedSeason: (season: any) => void;
}

export const useOverlayStore = create<OverlayState>()((set, get) => ({
  // Начальное состояние
  missionCreationOpen: false,
  missionEditOpen: false, // NEW
  badgeCreationOpen: false,
  rewardCreationOpen: false,
  storeManagementOpen: false,
  chainCreationOpen: false,
  seasonCreationOpen: false,
  seasonEditOpen: false,
  
  selectedChain: null,
  selectedBranch: null,
  selectedMission: null,
  selectedSeason: null,
  
  // Действия для управления оверлеями
  openMissionCreation: () => set({ missionCreationOpen: true }),
  closeMissionCreation: () => set({ missionCreationOpen: false }),
  
  openMissionEdit: (mission = null) => set({ // NEW
    missionEditOpen: true, 
    selectedMission: mission 
  }),
  closeMissionEdit: () => set({ // NEW
    missionEditOpen: false, 
    selectedMission: null 
  }),
  
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
  
  openSeasonEdit: (season = null) => set({ 
    seasonEditOpen: true, 
    selectedSeason: season 
  }),
  closeSeasonEdit: () => set({ 
    seasonEditOpen: false, 
    selectedSeason: null 
  }),
  
  // Универсальные методы
  closeAllOverlays: () => set({
    missionCreationOpen: false,
    missionEditOpen: false, // NEW
    badgeCreationOpen: false,
    rewardCreationOpen: false,
    storeManagementOpen: false,
    chainCreationOpen: false,
    seasonCreationOpen: false,
    seasonEditOpen: false,
    selectedChain: null,
    selectedBranch: null,
    selectedMission: null,
    selectedSeason: null,
  }),
  
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedMission: (mission) => set({ selectedMission: mission }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),
}));
