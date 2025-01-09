import { create } from "zustand";

interface SidebarState {
  open: boolean;
  activeLink: string;
  setActiveLink: (link: string) => void;
  toggleSidebar: () => void;
}

const sidebarStore = create<SidebarState>((set) => ({
  open: false,
  activeLink: 'Dashboard',
  setActiveLink: (link: string) => set(() => ({ activeLink: link })),
  toggleSidebar: () => set((state) => ({ open: !state.open })),
}));

export default sidebarStore;