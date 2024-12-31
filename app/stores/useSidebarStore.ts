import { create } from "zustand";

interface SidebarState {
  open: boolean;
  toggleSidebar: () => void;
}

const sidebarStore = create<SidebarState>((set) => ({
  open: false,
  toggleSidebar: () => set((state) => ({ open: !state.open })),
}));

export default sidebarStore;