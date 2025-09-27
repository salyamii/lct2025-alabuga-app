import { create } from 'zustand';
import { Artifact } from '../domain';
import artifactService from '../api/services/artifactService';



interface ArtifactState {
  artifacts: Artifact[];
  isLoading: boolean;
  error: string | null;
}

interface ArtifactActions {
  fetchArtifacts: () => Promise<void>;
  fetchArtifactById: (id: number) => Promise<void>;
  createArtifact: (artifact: Artifact) => Promise<void>;
  updateArtifact: (artifact: Artifact) => Promise<void>;
  deleteArtifact: (id: number) => Promise<void>;
  clearArtifacts: () => void;
}

export const useArtifactStore = create<ArtifactState & ArtifactActions>((set: (partial: Partial<ArtifactState & ArtifactActions>) => void, get: () => ArtifactState & ArtifactActions) => ({
  artifacts: [],
  isLoading: false,
  error: null,

  fetchArtifacts: async () => {
    try {
      set({ isLoading: true, error: null });
      const artifacts = await artifactService.getArtifacts();
      set({ artifacts: artifacts.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить артефакты', isLoading: false });
    }
  },

  fetchArtifactById: async (id: number) => {
    try {
      const artifact = await artifactService.getArtifact(id);
      const currentArtifacts = get().artifacts;
      const exists = currentArtifacts.some((a: Artifact) => a.id === artifact.data.id);
      if (!exists) {
        set({ artifacts: [...currentArtifacts, artifact.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить артефакт' });
    }
  },

  createArtifact: async (artifact: Artifact) => {
    try {
      const newArtifact = await artifactService.createArtifact(artifact);
      set({ artifacts: [...get().artifacts, newArtifact.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать артефакт' });
    }
  },

  updateArtifact: async (artifact: Artifact) => {
    try {
      const updatedArtifact = await artifactService.updateArtifact(artifact.id, artifact);
      set({ artifacts: get().artifacts.map((a: Artifact) => a.id === artifact.id ? updatedArtifact.data : a) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить артефакт' });
    }
  },

  deleteArtifact: async (id: number) => {
    try {
      await artifactService.deleteArtifact(id);
      set({ artifacts: get().artifacts.filter((a: Artifact) => a.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить артефакт' });
    }
  },

  clearArtifacts: () => {
    set({ artifacts: [], isLoading: false, error: null });
  },
}));
