import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      gender?: string | null;
      dob?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      role: string;
      firstName: string;
      phoneNumber: string;
      actions: string;
      password: string;
      isEmailVerified: boolean;
      expireOtp?: string;
      otp: number;
      location: string;
      nationality: string;
      emergencyContact: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      locationName: object;

      rejectReason?:string;
      docStatus?:string;

      createdAt: string;
      updatedAt: string;
      __v: boolean;
    };
  }
}
