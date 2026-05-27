import Image from "next/image";
import Link from "next/link";
import type { Travel } from "@/types/travels";
import styles from "./TravelCard.module.scss";

function getBlurUrl(url: string): string {
  return url.replace("/upload/", "/upload/w_20,q_1,e_blur:1000/");
}

const TravelCard = ({ travel }: { travel: Travel }) => {
  return (
    <Link href={`/travel/${travel.id}`} className={styles.card}>
      <h2>{travel?.title}</h2>
      {travel?.cover && (
        <div className={styles.cover}>
          <Image
            fill
            src={travel.cover.url}
            alt={`${travel.cover.city}-${travel?.title}-${travel?.id}`}
            className="object-cover object-center"
            placeholder="blur"
            sizes="(max-width: 767px) 100vw, 341px"
            blurDataURL={getBlurUrl(travel.cover.url)}
          />
        </div>
      )}
    </Link>
  );
};

export default TravelCard;
