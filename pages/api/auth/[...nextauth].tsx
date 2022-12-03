import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

//Next-auth configuration
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "preview",
      name: "Preview",
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const user = {
          email: process.env.PREVIEW_EMAIL,
          name: "Preview",
        };
        return user as any;
      },
    }),
    // ...add more providers here
  ],
});
