import AuthLayout from "@/components/layouts/auth";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthLayout>{children}</AuthLayout>;
}
