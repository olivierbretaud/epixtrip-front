import Link from "next/link";
import type { Travel } from "@/types/travels";
import styles from "./TravelCard.module.scss";

const TravelCard = ({ travel }: { travel: Travel }) => {
  return (
    <Link href={`/travel/${travel.id}`} className={styles.card}>
      <h2>{travel?.title}</h2>
    </Link>
  );
};

export default TravelCard;
