import { create } from "zustand";

interface SidebarState {
  open: boolean;
  toggleSidebar: () => void;
}

const sidebarStore = create<SidebarState>((set, get) => ({
  open: true,
  toggleSidebar: () => set((state) => ({ open: !state.open })),
}));

export default sidebarStore;