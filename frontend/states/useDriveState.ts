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
  currentView: string;
  setNewFolderName: (name: string) => void;
  addItem: (item: DriveItem) => void;
  setCurrentView: (view: string) => void;
  handleCreateFolder: () => void;
};

const initialItems: DriveItem[] = [
  { id: "1", name: "Documentos", type: "folder", createdAt: "02/09/2024", icon: "/icons/foldericon.svg" },
  { id: "2", name: "Imágenes", type: "folder", createdAt: "03/09/2024", icon: "/icons/foldericon.svg" },
  { id: "3", name: "Música", type: "folder", createdAt: "03/09/2024", icon: "/icons/foldericon.svg" },
  { id: "4", name: "Videos", type: "folder", createdAt: "03/09/2024", icon: "/icons/foldericon.svg" }
];

const useDriveState = create<DriveState>((set) => ({
  items: initialItems,
  newFolderName: '',
  currentView: 'folders',
  setNewFolderName: (name) => set({ newFolderName: name }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  setCurrentView: (view) => set({ currentView: view }),
  handleCreateFolder: () => set((state) => {
    if (state.newFolderName.trim() !== "") {
      const newFolder: DriveItem = {
        id: Date.now().toString(),
        name: state.newFolderName,
        type: "folder",
        createdAt: new Date().toLocaleDateString(),
        icon: "/icons/foldericon.svg"
      };
      return { items: [...state.items, newFolder], newFolderName: '' };
    }
    return state;
  })
}));

export default useDriveState;