import { create } from 'zustand';

interface OverlayState {
  // Состояния оверлеев
  missionCreationOpen: boolean;
  missionEditOpen: boolean;
  competencyCreationOpen: boolean;
  competencyEditOpen: boolean;
  rankCreationOpen: boolean;
  rankEditOpen: boolean;
  skillCreationOpen: boolean; // NEW
  skillEditOpen: boolean; // NEW
  taskCreationOpen: boolean;
  taskEditOpen: boolean;
  artifactCreationOpen: boolean;
  artifactEditOpen: boolean;
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
  selectedCompetency: any;
  selectedRank: any;
  selectedSkill: any; // NEW
  selectedTask: any;
  selectedArtifact: any;
  selectedSeason: any;
  
  // Действия для управления оверлеями
  openMissionCreation: () => void;
  closeMissionCreation: () => void;
  openMissionEdit: (mission?: any) => void;
  closeMissionEdit: () => void;
  openCompetencyCreation: () => void;
  closeCompetencyCreation: () => void;
  openCompetencyEdit: (competency?: any) => void;
  closeCompetencyEdit: () => void;
  openRankCreation: () => void;
  closeRankCreation: () => void;
  openRankEdit: (rank?: any) => void;
  closeRankEdit: () => void;
  openSkillCreation: () => void; // NEW
  closeSkillCreation: () => void; // NEW
  openSkillEdit: (skill?: any) => void; // NEW
  closeSkillEdit: () => void; // NEW
  openTaskCreation: () => void;
  closeTaskCreation: () => void;
  openTaskEdit: (task?: any) => void;
  closeTaskEdit: () => void;
  openArtifactCreation: () => void;
  closeArtifactCreation: () => void;
  openArtifactEdit: (artifact?: any) => void;
  closeArtifactEdit: () => void;
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
  setSelectedCompetency: (competency: any) => void;
  setSelectedRank: (rank: any) => void;
  setSelectedSkill: (skill: any) => void; // NEW
  setSelectedTask: (task: any) => void;
  setSelectedArtifact: (artifact: any) => void;
  setSelectedSeason: (season: any) => void;
}

export const useOverlayStore = create<OverlayState>()((set, get) => ({
  // Начальное состояние
  missionCreationOpen: false,
  missionEditOpen: false,
  competencyCreationOpen: false,
  competencyEditOpen: false,
  rankCreationOpen: false,
  rankEditOpen: false,
  skillCreationOpen: false, // NEW
  skillEditOpen: false, // NEW
  taskCreationOpen: false,
  taskEditOpen: false,
  artifactCreationOpen: false,
  artifactEditOpen: false,
  badgeCreationOpen: false,
  rewardCreationOpen: false,
  storeManagementOpen: false,
  chainCreationOpen: false,
  seasonCreationOpen: false,
  seasonEditOpen: false,
  
  selectedChain: null,
  selectedBranch: null,
  selectedMission: null,
  selectedCompetency: null,
  selectedRank: null,
  selectedSkill: null, // NEW
  selectedTask: null,
  selectedArtifact: null,
  selectedSeason: null,
  
  // Действия для управления оверлеями
  openMissionCreation: () => set({ missionCreationOpen: true }),
  closeMissionCreation: () => set({ missionCreationOpen: false }),
  
  openMissionEdit: (mission = null) => set({
    missionEditOpen: true, 
    selectedMission: mission 
  }),
  closeMissionEdit: () => set({
    missionEditOpen: false, 
    selectedMission: null 
  }),
  
  openCompetencyCreation: () => set({ competencyCreationOpen: true }), // NEW
  closeCompetencyCreation: () => set({ competencyCreationOpen: false }), // NEW
  
  openCompetencyEdit: (competency = null) => set({
    competencyEditOpen: true, 
    selectedCompetency: competency 
  }),
  closeCompetencyEdit: () => set({
    competencyEditOpen: false, 
    selectedCompetency: null 
  }),
  
  openRankCreation: () => set({ rankCreationOpen: true }), // NEW
  closeRankCreation: () => set({ rankCreationOpen: false }), // NEW
  
  openRankEdit: (rank = null) => set({
    rankEditOpen: true, 
    selectedRank: rank 
  }),
  closeRankEdit: () => set({
    rankEditOpen: false, 
    selectedRank: null 
  }),
  
  openSkillCreation: () => set({ skillCreationOpen: true }), // NEW
  closeSkillCreation: () => set({ skillCreationOpen: false }), // NEW
  
  openSkillEdit: (skill = null) => set({ // NEW
    skillEditOpen: true, 
    selectedSkill: skill 
  }),
  closeSkillEdit: () => set({ // NEW
    skillEditOpen: false, 
    selectedSkill: null 
  }),
  
  openTaskCreation: () => set({ taskCreationOpen: true }),
  closeTaskCreation: () => set({ taskCreationOpen: false }),
  
  openTaskEdit: (task = null) => set({
    taskEditOpen: true,
    selectedTask: task
  }),
  closeTaskEdit: () => set({
    taskEditOpen: false,
    selectedTask: null
  }),
  
  openArtifactCreation: () => set({ artifactCreationOpen: true }),
  closeArtifactCreation: () => set({ artifactCreationOpen: false }),
  
  openArtifactEdit: (artifact = null) => set({
    artifactEditOpen: true,
    selectedArtifact: artifact
  }),
  closeArtifactEdit: () => set({
    artifactEditOpen: false,
    selectedArtifact: null
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
    missionEditOpen: false,
    competencyCreationOpen: false,
    competencyEditOpen: false,
    rankCreationOpen: false,
    rankEditOpen: false,
    skillCreationOpen: false, // NEW
    skillEditOpen: false, // NEW
    taskCreationOpen: false,
    taskEditOpen: false,
    artifactCreationOpen: false,
    artifactEditOpen: false,
    badgeCreationOpen: false,
    rewardCreationOpen: false,
    storeManagementOpen: false,
    chainCreationOpen: false,
    seasonCreationOpen: false,
    seasonEditOpen: false,
    selectedChain: null,
    selectedBranch: null,
    selectedMission: null,
    selectedCompetency: null,
    selectedRank: null,
    selectedSkill: null, // NEW
    selectedTask: null,
    selectedArtifact: null,
    selectedSeason: null,
  }),
  
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedMission: (mission) => set({ selectedMission: mission }),
  setSelectedCompetency: (competency) => set({ selectedCompetency: competency }),
  setSelectedRank: (rank) => set({ selectedRank: rank }),
  setSelectedSkill: (skill) => set({ selectedSkill: skill }), // NEW
  setSelectedTask: (task) => set({ selectedTask: task }),
  setSelectedArtifact: (artifact) => set({ selectedArtifact: artifact }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),
}));
