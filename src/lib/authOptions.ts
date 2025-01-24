import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import connect from "@/app/utils/db";

export const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // Credentials provider for email and password
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        // Authorize the user
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
          return null;
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GithubProvider({
      // Github provider for OAuth
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      // Google provider for OAuth
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Callbacks for handling user data
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      await connect();
      if (account.provider === "credentials") {
        return true;
      }

      try {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            name: user.name, // Save the name from the provider
            isVerified: true,
          });
          await newUser.save();
        } else {
          // Update the user's name if it has changed
          if (existingUser.name !== user.name) {
            existingUser.name = user.name;
            await existingUser.save();
          }
        }
        return true;
      } catch (err) {
        console.log("Error Saving User", err);
        return false;
      }
    },
    async session({ session }: { session: any }) {
      // Session callback
      await connect();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        session.user.isVerified = dbUser.isVerified;
        session.user.name = dbUser.name;
        session.user.id = dbUser._id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/account/signin",
  },
};
