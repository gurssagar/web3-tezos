import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub({
        profile(profile, tokens) {
            return {
                ...profile,
                role: tokens.role || 'user',
            }
        },
    })],
    callbacks: {
        jwt({ token, user, profile, account }) {
            if (user) token.user = user;
            if (profile) token.profile = profile;
            if (account) token.role = account.role;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    username: (token.profile as any).login,
                    role: token.role as string,
                } as any;

                try {
                    const response = await fetch('http://localhost:3001/api/user-roles', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: session.user.username,
                            role: session.user.role,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    console.log('User role uploaded successfully:', result);
                } catch (error) {
                    console.error('Failed to upload user role:', error);
                }
            }
            return session;
        },    },
});
