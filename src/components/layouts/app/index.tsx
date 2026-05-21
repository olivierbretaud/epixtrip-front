import style from "./appLayout.module.scss";
import Navbar from "./Navbar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={style.app}>
      <Navbar />
      <main>
        <div className={style.map}></div>
        {children}
      </main>
    </div>
  );
}
