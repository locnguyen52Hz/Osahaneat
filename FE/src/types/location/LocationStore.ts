import { Location } from "./Location";

export interface LocationStore {
  currentLocation: Location | null;
  selectedAddress: Location | null;
  savedAddresses: Location[];
  loading: boolean;
  error: string | null;

  setSelectedAddress: (address: Location | null) => void;
  setSavedAddresses: (addresses: Location[]) => void;
  resetLocation: () => void;
  detectCurrentLocation: () => Promise<void>;
}
