import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session?.user?.role, "auth session**");

  if (session) {

    //redirect('/user/profile');
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center login-layout w-100">
        <div className='container-login'>
          {/* <div className="text-center">
            <img alt="" src="/logo.png" className='logo' />
          </div> */}
          {children}
        </div>
      </div>
    </>
  );
}
