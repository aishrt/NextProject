import ClientLayout from "@/components/Layout/Client/Layout";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "./client.css";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  const role = session?.user?.role;
  if (!session?.user) {
    redirect("/auth/client/login");
  }

  if (role == "client") {
    return <ClientLayout>{children}</ClientLayout>;
  } else if (role == "admin") {
    redirect("/admin/dashboard");
  } else if (role == "expert") {
    redirect("/expert/dashboard");
  } else if (role == "lawyer") {
    redirect("/lawyer/dashboard");
  }
}
