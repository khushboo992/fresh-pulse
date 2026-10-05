import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login", // Redirects unauthenticated users to /login
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Directs users to homepage after signout if no specific url is set
      if (url.includes("/api/auth/signout")) return baseUrl;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
