import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";

// Extend NextAuth User type
interface MyUser extends NextAuthUser {
  _id: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<MyUser | null> {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password");

        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Please login with Google");

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          _id: user._id.toString(),
          role: user.role || "user",
        } as MyUser;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token._id = (user as MyUser)._id;
        token.role = (user as MyUser).role;
      }

      if (account?.provider === "google" && user.email) {
        await connectMongoDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token._id = dbUser._id.toString();
          token.role = dbUser.role || "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        _id: token._id as string,
        role: token.role as string,
      };
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectMongoDB();
          let existingUser = await User.findOne({ email: user.email });

          let imageUrl = user.image || null;

          // Upload Google profile image to Cloudinary
          if (imageUrl) {
            const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
              folder: "users",
              public_id: `user_${Date.now()}`,
            });
            imageUrl = uploadResponse.secure_url;
          }

          if (!existingUser) {
            existingUser = await User.create({
              name: user.name,
              email: user.email,
              image: imageUrl,
              role: "user",
            });
          } else if (!existingUser.image && imageUrl) {
            // Update user image if not set
            existingUser.image = imageUrl;
            await existingUser.save();
          }

          return true;
        } catch (err) {
          console.error("Google signIn error:", err);
          return false;
        }
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
