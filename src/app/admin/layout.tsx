import AdminLayout from "@/components/Layout/Admin/Layout";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const isAdmin = session?.user?.isAdmin;

  if (!session?.user) {
    redirect("/auth/admin/login");
  }

  if (role == "admin" || isAdmin == true) {
    return <AdminLayout>{children}</AdminLayout>;
  } else if (role == "client") {
    redirect("/client/dashboard");
  } else if (role == "expert") {
    redirect("/expert/dashboard");
  }
}
