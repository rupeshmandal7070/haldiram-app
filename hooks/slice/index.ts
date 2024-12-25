import { StateCreator } from "zustand";

export interface ZoneSlice {
  zone: string;
  setZone: (zone: string) => void;
}

export interface WorkSlice {
  work: any;
  setWork: (data: any) => void;
}

export interface ProcessSlice {
  processName: string;
  setProcess: (zone: string) => void;
}

export interface MasterDataSlice {
  masterData: {
    rmProductList: any;
    pmProductList: any;
    pmTypes: any;
    ipqcPorductList: any;
    departmentList: any;
  };
  setMasterData: (data: any) => void;
}

export interface RMPMSlice {
  tabName: string;
  rmTrucks: any;
  pmTrucks: any;
  setRMTrucks: (trucks: any) => void;
  setPMTrucks: (trucks: any) => void;
  setTabName: (tabName: string) => void;
  resetRMPM: () => void;
}

export interface IPQCProductSlice {
  ipqcProducts: any;
  setIPQCProducts: (products: any) => void;
}

export interface PackagingSlice {
  departments: any;
  setPackagingDepartments: (departments: any) => void;
}
export const createWorkSlice: StateCreator<WorkSlice> = (set) => ({
  work: null,
  setWork: (data) => set((state) => ({ work: { ...state.work, ...data } })),
});

export const createMasterDataSlice: StateCreator<MasterDataSlice> = (set) => ({
  masterData: {
    rmProductList: null,
    pmProductList: null,
    pmTypes: null,
    ipqcPorductList: null,
    departmentList: null,
  },
  setMasterData: (masterData) => set({ masterData }),
});

export const createProcessSlice: StateCreator<ProcessSlice> = (set) => ({
  processName: "",
  setProcess: (processName: string) => set({ processName }),
});

export const createZoneSlice: StateCreator<ZoneSlice> = (set) => ({
  zone: "",
  setZone: (zone: string) => set({ zone }),
});

export const createRMPMSlice: StateCreator<RMPMSlice> = (set) => ({
  tabName: "RM",
  rmTrucks: [],
  pmTrucks: [],
  setRMTrucks: (rmTrucks) => set({ rmTrucks }),
  setPMTrucks: (pmTrucks) => set({ pmTrucks }),
  setTabName: (tabName) => set({ tabName }),
  resetRMPM: () => set({ tabName: "RM", rmTrucks: [], pmTrucks: [] }),
});

export const createIPQCProductSlice: StateCreator<IPQCProductSlice> = (
  set
) => ({
  ipqcProducts: [],
  setIPQCProducts: (ipqcProducts) => set({ ipqcProducts }),
});

export const createPackagingSlice: StateCreator<PackagingSlice> = (set) => ({
  departments: [],
  setPackagingDepartments: (departments) => set({ departments }),
});
