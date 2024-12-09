import { create } from 'zustand';

type DriveItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  createdAt: string;
  icon: string;
};

type DriveState = {
  items: DriveItem[];
  newFolderName: string;
  path: string;
  setNewFolderName: (name: string) => void;
  addItem: (item: DriveItem) => void;
  setPath: (path: string) => void;
  handleCreateFolder: () => void;
  navigateToFolder: (folderName: string) => void;
  getCurrentPath: () => string;
};

const useDriveState = create<DriveState>((set, get) => ({
  items: [],
  newFolderName: '',
  path: '',
  
  // Función para obtener el path actual normalizado
  getCurrentPath: () => {
    const state = get();
    if (!state.path) return '';
    return state.path.startsWith('/') ? state.path : `/${state.path}`;
  },

  setPath: (newPath) => set({ 
    path: newPath === '/' ? '' : newPath 
  }),

  navigateToFolder: (folderName) =>
    set((state) => ({
      path: !state.path ? folderName : `${state.path}/${folderName}`
    })),

  setNewFolderName: (name) => set({ newFolderName: name }),

  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),

  handleCreateFolder: () => set((state) => {
    if (state.newFolderName.trim() !== "") {
      const newFolder: DriveItem = {
        id: Date.now().toString(),
        name: state.newFolderName,
        type: "folder",
        createdAt: new Date().toLocaleDateString(),
        icon: "/icons/foldericon.svg"
      };
      return { 
        items: [...state.items, newFolder], 
        newFolderName: '' 
      };
    }
    return state;
  })
}));

export default useDriveState;