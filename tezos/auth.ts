
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub],
    callbacks: {
        jwt({ token, user, profile }) {
            if (user) token.user = user;
            if (profile) token.profile = profile;
            return token;
        },
        session({ session, token, user }) {
            if (session.user)
                session.user = {
                    ...session.user,
                    username: (token.profile as any).login,
                } as any;
            return session;
        },
    },
})