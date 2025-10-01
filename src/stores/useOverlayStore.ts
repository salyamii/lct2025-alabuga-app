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
  storeItemCreationOpen: boolean;
  storeItemEditOpen: boolean;
  badgeCreationOpen: boolean;
  rewardCreationOpen: boolean;
  storeManagementOpen: boolean;
  chainCreationOpen: boolean;
  chainEditOpen: boolean;
  missionChainViewOpen: boolean;
  seasonCreationOpen: boolean;
  seasonEditOpen: boolean;
  userPreviewOpen: boolean;
  userEditOpen: boolean;
  
  // Выбранные элементы для редактирования
  selectedChain: any;
  selectedMissionChainId: string | null;
  selectedBranch: any;
  selectedMission: any;
  selectedCompetency: any;
  selectedRank: any;
  selectedSkill: any; // NEW
  selectedTask: any;
  selectedArtifact: any;
  selectedStoreItem: any;
  selectedSeason: any;
  selectedUserLogin: string | null;
  
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
  openStoreItemCreation: () => void;
  closeStoreItemCreation: () => void;
  openStoreItemEdit: (storeItem?: any) => void;
  closeStoreItemEdit: () => void;
  openBadgeCreation: () => void;
  closeBadgeCreation: () => void;
  openRewardCreation: () => void;
  closeRewardCreation: () => void;
  openStoreManagement: () => void;
  closeStoreManagement: () => void;
  openChainCreation: (chain?: any) => void;
  closeChainCreation: () => void;
  openChainEdit: (chain?: any) => void;
  closeChainEdit: () => void;
  openMissionChainView: (chainId: string) => void;
  closeMissionChainView: () => void;
  openSeasonCreation: () => void;
  closeSeasonCreation: () => void;
  openSeasonEdit: (season?: any) => void;
  closeSeasonEdit: () => void;
  openUserPreview: (userLogin: string) => void;
  closeUserPreview: () => void;
  openUserEdit: (userLogin: string) => void;
  closeUserEdit: () => void;
  
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
  setSelectedStoreItem: (storeItem: any) => void;
  setSelectedSeason: (season: any) => void;
  setSelectedUserLogin: (userLogin: string | null) => void;
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
  storeItemCreationOpen: false,
  storeItemEditOpen: false,
  badgeCreationOpen: false,
  rewardCreationOpen: false,
  storeManagementOpen: false,
  chainCreationOpen: false,
  chainEditOpen: false,
  missionChainViewOpen: false,
  seasonCreationOpen: false,
  seasonEditOpen: false,
  userPreviewOpen: false,
  userEditOpen: false,
  
  selectedChain: null,
  selectedMissionChainId: null,
  selectedBranch: null,
  selectedMission: null,
  selectedCompetency: null,
  selectedRank: null,
  selectedSkill: null, // NEW
  selectedTask: null,
  selectedArtifact: null,
  selectedStoreItem: null,
  selectedSeason: null,
  selectedUserLogin: null,
  
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
  
  openStoreItemCreation: () => set({ storeItemCreationOpen: true }),
  closeStoreItemCreation: () => set({ storeItemCreationOpen: false }),
  openStoreItemEdit: (storeItem) => set({
    storeItemEditOpen: true,
    selectedStoreItem: storeItem
  }),
  closeStoreItemEdit: () => set({
    storeItemEditOpen: false,
    selectedStoreItem: null
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
  
  openChainEdit: (chain = null) => set({ 
    chainEditOpen: true, 
    selectedChain: chain 
  }),
  closeChainEdit: () => set({ 
    chainEditOpen: false, 
    selectedChain: null 
  }),
  
  openMissionChainView: (chainId: string) => set({ 
    missionChainViewOpen: true, 
    selectedMissionChainId: chainId 
  }),
  closeMissionChainView: () => set({ 
    missionChainViewOpen: false, 
    selectedMissionChainId: null 
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
  
  openUserPreview: (userLogin: string) => set({ 
    userPreviewOpen: true, 
    selectedUserLogin: userLogin 
  }),
  closeUserPreview: () => set({ 
    userPreviewOpen: false, 
    selectedUserLogin: null 
  }),
  
  openUserEdit: (userLogin: string) => set({ 
    userEditOpen: true, 
    selectedUserLogin: userLogin 
  }),
  closeUserEdit: () => set({ 
    userEditOpen: false, 
    selectedUserLogin: null 
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
    storeItemCreationOpen: false,
    storeItemEditOpen: false,
    badgeCreationOpen: false,
    rewardCreationOpen: false,
    storeManagementOpen: false,
    chainCreationOpen: false,
    chainEditOpen: false,
    missionChainViewOpen: false,
    seasonCreationOpen: false,
    seasonEditOpen: false,
    userPreviewOpen: false,
    userEditOpen: false,
    selectedChain: null,
    selectedMissionChainId: null,
    selectedBranch: null,
    selectedMission: null,
    selectedCompetency: null,
    selectedRank: null,
    selectedSkill: null, // NEW
    selectedTask: null,
    selectedArtifact: null,
    selectedStoreItem: null,
    selectedSeason: null,
    selectedUserLogin: null,
  }),
  
  setSelectedChain: (chain) => set({ selectedChain: chain }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setSelectedMission: (mission) => set({ selectedMission: mission }),
  setSelectedCompetency: (competency) => set({ selectedCompetency: competency }),
  setSelectedRank: (rank) => set({ selectedRank: rank }),
  setSelectedSkill: (skill) => set({ selectedSkill: skill }), // NEW
  setSelectedTask: (task) => set({ selectedTask: task }),
  setSelectedArtifact: (artifact) => set({ selectedArtifact: artifact }),
  setSelectedStoreItem: (storeItem) => set({ selectedStoreItem: storeItem }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),
  setSelectedUserLogin: (userLogin) => set({ selectedUserLogin: userLogin }),
}));
