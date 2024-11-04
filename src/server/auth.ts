import User from "@/models/user.model";
import {
  DefaultSession,
  getServerSession,
  ISODateString,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/utils/connectDB";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";

const days = (i: number) => i * 24 * 60 * 60;
let userRole: string;
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", //(1) the default is jwt when no adapter defined, we redefined here to make it obvious what strategy that we use
    maxAge: days(1),
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("-----in jwt------");
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId; // this is Id that coming from authorize() callback
        token.role = userRole;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("-----in session------");
      await db.connectDB();
      // const findUser = await User.findById(token.userId);
      //const findUser = await Expert.findById(token.userId);

      let findUser;
      switch (token.role) {
        case "client":
        case "admin":
          findUser = await User.findById(token.userId);
          break;
        case "expert":
          findUser = await Expert.findById(token.userId);
          break;
        case "lawyer":
          findUser = await Lawyer.findById(token.userId);
          break;
        default:
          throw new Error("Unknown role");
      }
      session.user = findUser;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", //(4) custom signin page path
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text", placeholder: "role" },
      },
      async authorize(credentials, req) {
        db.connectDB();
        const { username, password, role } = credentials as {
          username: string;
          password: string;
          role: string;
        };

        const model = (() => {
          switch (role) {
            case "client":
            case "admin":
              return User;
            case "expert":
              return Expert;
            case "lawyer":
              return Lawyer;
            default:
              return null;
          }
        })();

        if (model) {
          const findUser = await model.findOne({ email: username });
          if (!findUser) {
            throw new Error("user-not-found");
          }
          if (!(await bcrypt.compare(password, findUser.password))) {
            throw new Error("invalid-credentials");
          }
          // if (
          //   (role === "user" || role === "client") &&
          //   (findUser.role !== "client" || findUser.isAdmin !== false)
          // ) {
          //   throw new Error(`invalid-role-client`);
          // }
          // if (
          //   role === "expert" &&
          //   (findUser.role !== "expert" || findUser.isAdmin !== false)
          // ) {
          //   throw new Error(`invalid-role-expert`);
          // }
          // if (
          //   role === "lawyer" &&
          //   (findUser.role !== "lawyer" || findUser.isAdmin !== false)
          // ) {
          //   throw new Error(`invalid-role-lawyer`);
          // }
          // if (role === "admin" && findUser.isAdmin !== true) {
          //   throw new Error("invalid-role-admin");
          // }

          if (
            (role === "client" &&
              (findUser.role !== "client" || findUser.isAdmin)) ||
            (role === "expert" &&
              (findUser.role !== "expert" || findUser.isAdmin)) ||
            (role === "lawyer" &&
              (findUser.role !== "lawyer" || findUser.isAdmin)) ||
            (role === "admin" && !findUser.isAdmin)
          ) {
            throw new Error(`Invalid role! You are not a ${role}`);
          }
          userRole = role || findUser?.role;
          return findUser;
        } else {
          console.error("Invalid role:", role);
        }
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)
