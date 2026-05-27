"use client";

import { createContext, useContext, useState } from "react";

type TravelMapContextValue = {
  travelId: number | undefined;
  setTravelId: (id: number | undefined) => void;
  isEditMobile: boolean;
  setIsEditMobile: (value: boolean) => void;
};

const TravelMapContext = createContext<TravelMapContextValue>({
  travelId: undefined,
  setTravelId: () => {},
  isEditMobile: false,
  setIsEditMobile: () => {},
});

export function TravelMapProvider({ children }: { children: React.ReactNode }) {
  const [travelId, setTravelId] = useState<number | undefined>(undefined);
  const [isEditMobile, setIsEditMobile] = useState(false);
  return (
    <TravelMapContext.Provider
      value={{ travelId, setTravelId, isEditMobile, setIsEditMobile }}
    >
      {children}
    </TravelMapContext.Provider>
  );
}

export function useTravelMap() {
  return useContext(TravelMapContext);
}
