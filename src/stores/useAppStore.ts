import { useArtifactStore } from './useArtifactStore';
import { useCompetencyStore } from './useCompetencyStore';
import { useMissionStore } from './useMissionStore';
import { useRankStore } from './useRankStore';
import { useSeasonStore } from './useSeasonStore';
import { useSkillStore } from './useSkillStore';
import { useTaskStore } from './useTaskStore';
import { useUserStore } from './useUserStore';

export const useAppStore = () => ({
  user: useUserStore(),
  artifacts: useArtifactStore(),
  competencies: useCompetencyStore(),
  missions: useMissionStore(),
  ranks: useRankStore(),
  seasons: useSeasonStore(),
  skills: useSkillStore(),
  tasks: useTaskStore(),
});