// Базовые типы для API ответов
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Типы для авторизации из реального API
export interface UserLoginRequest {
  login: string;
  password: string;
}

export interface UserTokenResponse {
  token: string;
}

export interface UserResponse {
  login: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Типы для регистрации HR пользователей
export interface HRUserRegistrationRequest {
  login: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
}

// Типы для регистрации кандидатов
export interface CandidateUserRegistrationRequest {
  login: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
}

// Типы для HTTP методов
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Типы для обработки ошибок
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
  status: number;
}

// ===== ВАЛИДАЦИЯ =====
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// ===== ENUM ТИПЫ =====
export enum MissionCategoryEnum {
  QUEST = 'quest',
  RECRUITING = 'recruiting',
  LECTURE = 'lecture',
  SIMULATOR = 'simulator'
}

export enum ArtifactRarityEnum {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

// ===== СЕЗОНЫ =====
export interface SeasonResponse {
  id: number;
  name: string;
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
}

export interface SeasonCreateRequest {
  name: string;
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
}

export interface SeasonUpdateRequest {
  name: string;
  startDate: string; // ISO date-time
  endDate: string; // ISO date-time
}

export interface SeasonsResponse {
  values: SeasonResponse[];
}

// ===== МИССИИ =====
export interface MissionResponse {
  id: number;
  title: string;
  description: string;
  rewardXp: number;
  rewardMana: number;
  rankRequirement: number;
  seasonId: number;
  category: string;
  tasks?: MissionTaskResponse[];
  rewardArtifacts?: ArtifactResponse[];
  rewardCompetencies?: CompetencyRewardResponse[];
  rewardSkills?: SkillRewardResponse[];
}

export interface MissionCreateRequest {
  title: string;
  description: string;
  rewardXp: number; // minimum: 0
  rewardMana: number;
  rankRequirement: number;
  seasonId: number;
  category: MissionCategoryEnum;
}

export interface MissionUpdateRequest {
  title: string;
  description: string;
  rewardXp: number; // minimum: 0
  rewardMana: number;
  rankRequirement: number;
  seasonId: number;
  category: MissionCategoryEnum;
  chainId?: number | null; // ID цепочки миссий
}

export interface MissionsResponse {
  values: MissionResponse[];
}

// ===== ЦЕПОЧКИ МИССИЙ =====
export interface MissionChainResponse {
  id: number;
  name: string;
  description: string;
  rewardXp: number;
  rewardMana: number;
  missions?: MissionResponse[];
  dependencies?: MissionDependencyResponse[];
  missionOrders?: MissionChainMissionResponse[];
}

export interface MissionChainCreateRequest {
  name: string;
  description: string;
  rewardXp: number; // minimum: 0
  rewardMana: number; // minimum: 0
}

export interface MissionChainUpdateRequest {
  name: string;
  description: string;
  rewardXp: number; // minimum: 0
  rewardMana: number; // minimum: 0
}

export interface MissionChainsResponse {
  values: MissionChainResponse[];
}

// ===== ЗАВИСИМОСТИ МИССИЙ =====
export interface MissionDependencyResponse {
  missionId: number;
  prerequisiteMissionId: number;
}

export interface MissionChainMissionResponse {
  missionId: number;
  order: number;
}

// ===== РАНГИ =====
export interface RankResponse {
  id: number;
  name: string;
  requiredXp: number;
  requiredMissions?: MissionResponse[];
  requiredCompetencies?: RankCompetencyRequirementResponse[];
}

export interface RankCreateRequest {
  name: string;
  requiredXp: number; // minimum: 0
}

export interface RankUpdateRequest {
  name: string;
  requiredXp: number; // minimum: 0
}

export interface RanksResponse {
  values: RankResponse[];
}

// ===== КОМПЕТЕНЦИИ =====
export interface CompetencyResponse {
  id: number;
  name: string;
  maxLevel: number;
  skills?: SkillResponse[];
}

export interface CompetencyCreateRequest {
  name: string;
  maxLevel: number; // minimum: 2, maximum: 10000
}

export interface CompetencyUpdateRequest {
  name: string;
  maxLevel: number; // minimum: 2, maximum: 10000
}

export interface CompetenciesResponse {
  values: CompetencyResponse[];
}

export interface RankCompetencyRequirementResponse {
  competency: CompetencyResponse;
  minLevel: number;
}

// ===== НАВЫКИ =====
export interface SkillResponse {
  id: number;
  name: string;
  maxLevel: number;
}

export interface SkillCreateRequest {
  name: string;
  maxLevel: number; // minimum: 1, maximum: 10000
}

export interface SkillUpdateRequest {
  name: string;
  maxLevel: number; // minimum: 1, maximum: 10000
}

export interface SkillsResponse {
  values: SkillResponse[];
}

export interface SkillRewardResponse {
  skill: SkillResponse;
  levelIncrease: number;
}

export interface SkillRewardAddRequest {
  levelIncrease: number; // minimum: 1
}

// ===== ЗАДАЧИ =====
export interface TaskResponse {
  id: number;
  title: string;
  description: string;
}

export interface TaskCreateRequest {
  title: string;
  description: string;
}

export interface TaskUpdateRequest {
  title: string;
  description: string;
}

export interface TasksResponse {
  values: TaskResponse[];
}

// ===== АРТЕФАКТЫ =====
export interface ArtifactResponse {
  id: number;
  title: string;
  description: string;
  rarity: ArtifactRarityEnum;
  imageUrl: string;
}

export interface ArtifactCreateRequest {
  title: string;
  description: string;
  rarity: ArtifactRarityEnum;
  imageUrl: string;
}

export interface ArtifactUpdateRequest {
  title: string;
  description: string;
  rarity: ArtifactRarityEnum;
  imageUrl: string;
}

export interface ArtifactsResponse {
  values: ArtifactResponse[];
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ТИПЫ ИЗ OPENAPI =====

// Типы для добавления компетенций к рангу
export interface AddRequiredCompetencyToRankRequest {
  minLevel: number; // minimum: 1
}

// Типы для наград компетенций
export interface CompetencyRewardResponse {
  competency: CompetencyResponse;
  levelIncrease: number;
}

export interface CompetencyRewardAddRequest {
  levelIncrease: number; // minimum: 1
}

// Типы для задач миссий
export interface MissionTaskResponse {
  id: number;
  title: string;
  description: string;
}

// Типы для загрузки файлов
export interface BodyUploadFileMediaPost {
  file: string; // binary format
}

export interface Body_upload_file_media_post {
  file: string; // binary format
}

export interface FileObjectResponse {
  key: string;
  url: string;
  size: number | null;
  etag: string;
  contentType: string | null;
}

// ===== МАГАЗИН =====
export interface StoreItemResponse {
  id: number;
  title: string;
  price: number;
  stock: number;
}

export interface StoreItemCreateRequest {
  title: string;
  price: number; // minimum: 0
  stock: number; // minimum: 0
}

export interface StoreItemUpdateRequest {
  title: string;
  price: number; // minimum: 0
  stock: number; // minimum: 0
}

export interface StoreItemsResponse {
  values: StoreItemResponse[];
}

export interface StorePurchaseRequest {
  storeItemId: number;
}

// ===== ПОЛЬЗОВАТЕЛЬСКИЕ МИССИИ =====
export interface UserMissionResponse {
  id: number;
  title: string;
  description: string;
  rewardXp: number;
  rewardMana: number;
  rankRequirement: number;
  seasonId: number;
  category: string;
  isCompleted: boolean;
  tasks?: UserTaskResponse[];
  rewardArtifacts?: ArtifactResponse[];
  rewardCompetencies?: CompetencyRewardResponse[];
  rewardSkills?: SkillRewardResponse[];
}

export interface UserTaskResponse {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}