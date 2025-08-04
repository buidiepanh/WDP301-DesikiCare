import DefaultLayout from "../components/layout/default/DefaultLayout";

export default function DefaultGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
