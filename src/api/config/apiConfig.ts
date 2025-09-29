export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export const getApiConfig = (): ApiConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: isDevelopment 
      ? process.env.REACT_APP_API_URL || '/api'  // Используем прокси в dev режиме
      : process.env.REACT_APP_API_URL || 'http://91.219.150.15',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER_HR: '/users/register',
    REGISTER_CANDIDATE: '/mobile/users/register',
    PROFILE: '/users/me',
  },
  ARTIFACTS: {
    LIST: '/artifacts',
    CREATE: '/artifacts',
    GET: (id: number) => `/artifacts/${id}`,
    UPDATE: (id: number) => `/artifacts/${id}`,
    DELETE: (id: number) => `/artifacts/${id}`,
  },
  SEASONS: {
    LIST: '/seasons',
    CREATE: '/seasons',
    GET: (id: number) => `/seasons/${id}`,
    UPDATE: (id: number) => `/seasons/${id}`,
    DELETE: (id: number) => `/seasons/${id}`,
  },
  MISSIONS: {
    LIST: '/missions',
    CREATE: '/missions',
    GET: (id: number) => `/missions/${id}`,
    UPDATE: (id: number) => `/missions/${id}`,
    DELETE: (id: number) => `/missions/${id}`,
    ADD_TASK: (missionId: number, taskId: number) => `/missions/${missionId}/tasks/${taskId}`,
    REMOVE_TASK: (missionId: number, taskId: number) => `/missions/${missionId}/tasks/${taskId}`,
    ADD_COMPETENCY_REWARD: (missionId: number, competencyId: number) => `/missions/${missionId}/competencies/${competencyId}`,
    REMOVE_COMPETENCY_REWARD: (missionId: number, competencyId: number) => `/missions/${missionId}/competencies/${competencyId}`,
    ADD_SKILL_REWARD: (missionId: number, skillId: number) => `/missions/${missionId}/skills/${skillId}`,
    REMOVE_SKILL_REWARD: (missionId: number, skillId: number) => `/missions/${missionId}/skills/${skillId}`,
    ADD_ARTIFACT: (missionId: number, artifactId: number) => `/missions/${missionId}/artifacts/${artifactId}`,
    REMOVE_ARTIFACT: (missionId: number, artifactId: number) => `/missions/${missionId}/artifacts/${artifactId}`,
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: (id: number) => `/tasks/${id}`,
    UPDATE: (id: number) => `/tasks/${id}`,
    DELETE: (id: number) => `/tasks/${id}`,
  },
  COMPETENCIES: {
    LIST: '/competencies',
    CREATE: '/competencies',
    GET: (id: number) => `/competencies/${id}`,
    UPDATE: (id: number) => `/competencies/${id}`,
    DELETE: (id: number) => `/competencies/${id}`,
    ADD_SKILL: (competencyId: number, skillId: number) => `/competencies/${competencyId}/skills/${skillId}`,
    REMOVE_SKILL: (competencyId: number, skillId: number) => `/competencies/${competencyId}/skills/${skillId}`,
  },
  RANKS: {
    LIST: '/ranks',
    CREATE: '/ranks',
    GET: (id: number) => `/ranks/${id}`,
    UPDATE: (id: number) => `/ranks/${id}`,
    DELETE: (id: number) => `/ranks/${id}`,
    ADD_REQUIRED_MISSION: (rankId: number, missionId: number) => `/ranks/${rankId}/missions/${missionId}`,
    REMOVE_REQUIRED_MISSION: (rankId: number, missionId: number) => `/ranks/${rankId}/missions/${missionId}`,
    ADD_REQUIRED_COMPETENCY: (rankId: number, competencyId: number) => `/ranks/${rankId}/competencies/${competencyId}`,
    REMOVE_REQUIRED_COMPETENCY: (rankId: number, competencyId: number) => `/ranks/${rankId}/competencies/${competencyId}`,
  },
  SKILLS: {
    LIST: '/skills',
    CREATE: '/skills',
    GET: (id: number) => `/skills/${id}`,
    UPDATE: (id: number) => `/skills/${id}`,
    DELETE: (id: number) => `/skills/${id}`,
  },
  MEDIA: {
    UPLOAD: '/media',
    DOWNLOAD: (key: string) => `/media/${key}`,
  },
  MISSION_CHAINS: {
    LIST: '/mission-chains',
    CREATE: '/mission-chains',
    GET: (id: number) => `/mission-chains/${id}`,
    UPDATE: (id: number) => `/mission-chains/${id}`,
    DELETE: (id: number) => `/mission-chains/${id}`,
    ADD_MISSION: (chainId: number, missionId: number) => `/mission-chains/${chainId}/missions/${missionId}`,
    REMOVE_MISSION: (chainId: number, missionId: number) => `/mission-chains/${chainId}/missions/${missionId}`,
    UPDATE_MISSION_ORDER: (chainId: number, missionId: number) => `/mission-chains/${chainId}/missions/${missionId}/order`,
    ADD_DEPENDENCY: (chainId: number) => `/mission-chains/${chainId}/dependencies`,
    REMOVE_DEPENDENCY: (chainId: number) => `/mission-chains/${chainId}/dependencies`,
  },
  STORE: {
    ITEMS: '/store',
    ITEM: (id: number) => `/store/${id}`,
    PURCHASE: '/store/purchase',
  },
} as const;
