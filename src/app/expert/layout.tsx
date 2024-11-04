import ExpertLayout from "@/components/Layout/Expert/Layout";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "./expert.css";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user) {
    redirect("/auth/expert/login");
  }

  if (role == "expert") {
    return <ExpertLayout>{children}</ExpertLayout>;
  } else if (role == "admin") {
    redirect("/admin/dashboard");
  } else if (role == "client") {
    redirect("/client/dashboard");
  }
}
