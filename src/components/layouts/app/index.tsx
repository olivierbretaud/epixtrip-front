"use client";

import { TravelMap } from "@/components/travel/components/TravelMap";
import style from "./appLayout.module.scss";
import Navbar from "./Navbar";
import { TravelMapProvider, useTravelMap } from "./TravelMapContext";

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { travelId } = useTravelMap();
  return (
    <div className={style.app}>
      <Navbar />
      <main>
        <TravelMap travelId={travelId} />
        {children}
      </main>
    </div>
  );
}

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TravelMapProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </TravelMapProvider>
  );
}
