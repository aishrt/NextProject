import LawyerLayout from "@/components/Layout/Lawyer/Layout";
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
  console.log(role, "lawyer role");

  if (!session) {
    redirect("/auth/lawyer/login");
  }

  if (role == "lawyer") {
    return <LawyerLayout>{children}</LawyerLayout>;
  } else if (role == "admin") {
    redirect("/admin/dashboard");
  } else if (role == "client") {
    console.log("789+++++++");
    redirect("/client/dashboard");
  }
}