import styles from "./authLayout.module.scss";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={styles.auth}>
      <div className={styles.content}>
        <h1>EpixTrip</h1>
        {children}
      </div>
    </main>
  );
}
