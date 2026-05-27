"use client";

import { useEffect } from "react";
import { useTravelMap } from "@/components/layouts/app/TravelMapContext";
import { Spinner } from "@/components/ui/shadcn/spinner";
import { useWindowSize } from "@/hooks/useWindowSize";
import TravelContent from "../../components/TravelContent";
import { TravelMobile } from "../../components/TravelMobile";
import { useGetTravel } from "../../hooks/travels";
import styles from "./Travel.module.scss";

const Travel = ({ id }: { id: string }) => {
  const { data: travel, isLoading } = useGetTravel(id);
  const { setTravelId, isEditMobile, setIsEditMobile } = useTravelMap();
  const { width } = useWindowSize();
  const isMobile = width > 0 && width < 768;

  useEffect(() => {
    if (travel?.id) {
      setTravelId(travel.id);
      return () => setTravelId(undefined);
    }
  }, [travel?.id, setTravelId]);

  return (
    <>
      {(!isMobile || isEditMobile) && (
        <div className={styles.travel}>
          {isLoading && (
            <div className={styles.loading}>
              <Spinner />
            </div>
          )}
          {travel && (!isMobile || isEditMobile) && (
            <TravelContent travel={travel} />
          )}
        </div>
      )}
      {!isEditMobile && isMobile && travel && <TravelMobile travel={travel} />}
    </>
  );
};

export default Travel;
