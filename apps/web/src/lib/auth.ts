import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * NextAuth v5 configuration.
 *
 * Supports:
 * - Google OAuth (primary — for team members with @doemedia.com accounts)
 * - Credentials (fallback — email/password for development)
 *
 * In production, restrict to your Google Workspace domain:
 * Set ALLOWED_EMAIL_DOMAIN=doemedia.com in env vars.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials provider for development/testing
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In development, accept any email with password "demo"
        if (
          process.env.NODE_ENV === "development" &&
          credentials?.password === "demo"
        ) {
          return {
            id: "dev-user",
            email: credentials.email as string,
            name: "Dev User",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Restrict to allowed email domain if configured
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
      if (allowedDomain && user.email) {
        const domain = user.email.split("@")[1];
        if (domain !== allowedDomain) {
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
