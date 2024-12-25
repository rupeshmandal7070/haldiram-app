import { create } from "zustand";
import {
  createZoneSlice,
  ZoneSlice,
  RMPMSlice,
  WorkSlice,
  createRMPMSlice,
  createProcessSlice,
  ProcessSlice,
  IPQCProductSlice,
  createIPQCProductSlice,
  PackagingSlice,
  createPackagingSlice,
  MasterDataSlice,
  createMasterDataSlice,
  createWorkSlice,
} from "./slice";

const useAppStore = create<
  ZoneSlice &
    WorkSlice &
    ProcessSlice &
    RMPMSlice &
    IPQCProductSlice &
    PackagingSlice &
    MasterDataSlice
>()((...a) => ({
  ...createZoneSlice(...a),
  ...createWorkSlice(...a),
  ...createProcessSlice(...a),
  ...createMasterDataSlice(...a),
  ...createRMPMSlice(...a),
  ...createIPQCProductSlice(...a),
  ...createPackagingSlice(...a),
}));

export default useAppStore;
