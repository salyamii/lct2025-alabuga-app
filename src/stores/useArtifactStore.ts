import { create } from 'zustand';
import { Artifact } from '../domain';
import artifactService from '../api/services/artifactService';
import { ArtifactCreateRequest, ArtifactUpdateRequest } from '../api/types/apiTypes';



interface ArtifactState {
  artifacts: Artifact[];
  isLoading: boolean;
  error: string | null;
}

interface ArtifactActions {
  fetchArtifacts: () => Promise<void>;
  fetchArtifactById: (id: number) => Promise<void>;
  createArtifact: (artifactData: ArtifactCreateRequest) => Promise<Artifact>;
  updateArtifact: (id: number, artifactData: ArtifactUpdateRequest) => Promise<Artifact>;
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

  createArtifact: async (artifactData: ArtifactCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newArtifact = await artifactService.createArtifact(artifactData);
      set({ artifacts: [...get().artifacts, newArtifact.data], isLoading: false });
      return newArtifact.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать артефакт', isLoading: false });
      throw error;
    }
  },

  updateArtifact: async (id: number, artifactData: ArtifactUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedArtifact = await artifactService.updateArtifact(id, artifactData);
      set({ 
        artifacts: get().artifacts.map((a: Artifact) => a.id === id ? updatedArtifact.data : a),
        isLoading: false 
      });
      return updatedArtifact.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить артефакт', isLoading: false });
      throw error;
    }
  },

  deleteArtifact: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await artifactService.deleteArtifact(id);
      set({ 
        artifacts: get().artifacts.filter((a: Artifact) => a.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить артефакт', isLoading: false });
      throw error;
    }
  },

  clearArtifacts: () => {
    set({ artifacts: [], isLoading: false, error: null });
  },
}));
