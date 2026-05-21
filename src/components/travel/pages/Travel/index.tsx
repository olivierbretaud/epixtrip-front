"use client";

import { Spinner } from "@/components/ui/shadcn/spinner";
import TravelContent from "../../components/TravelContent";
import { useGetTravel } from "../../hooks/travels";
import styles from "./Travel.module.scss";

const Travel = ({ id }: { id: string }) => {
  const { data: travel, isLoading } = useGetTravel(id);
  return (
    <div className={styles.travel}>
      {isLoading && (
        <div className={styles.loading}>
          <Spinner />
        </div>
      )}
      {travel && <TravelContent travel={travel} />}
    </div>
  );
};

export default Travel;
