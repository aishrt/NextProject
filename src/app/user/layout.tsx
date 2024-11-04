import Header from "@/components/Layout/User/Header";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }
  
  const role = session?.user?.role;
  if (role == "user") {
    return (
      <>
        <Header />
        {children}
      </>
    );
  } else if (role == "client") {
    redirect("/client/dashboard");
  } else if (role == "expert") {
    redirect("/expert/dashboard");
  } else if (role == "admin") {
    redirect("/admin/dashboard");
  }
}
