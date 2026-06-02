import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "./mongodb";
import User from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignup: { label: "isSignup", type: "text" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        
        if (!credentials?.email) {
          throw new CredentialsSignin("Email is required");
        }

        const user = await User.findOne({ email: credentials.email });

        if (credentials.isSignup === "true") {
          if (user) throw new CredentialsSignin("User already exists");
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
          const newUser = await User.create({
            email: credentials.email,
            name: credentials.name || "User",
            password: hashedPassword,
          });
          return { id: newUser._id.toString(), email: newUser.email, name: newUser.name };
        } else {
          if (!user || !user.password) throw new CredentialsSignin("Invalid credentials");
          const isMatch = await bcrypt.compare(credentials.password as string, user.password);
          if (!isMatch) throw new CredentialsSignin("Invalid credentials");
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
            name: user.name || "Google User",
            avatarUrl: user.image,
          });
          user.id = newUser._id.toString();
        } else {
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
