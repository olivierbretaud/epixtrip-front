"use client";

import TravelContent from "../../components/TravelContent";
import styles from "./Travel.module.scss";

const CreateTravel = () => {
  return (
    <div className={styles.travel}>
      <TravelContent />
    </div>
  );
};

export default CreateTravel;
