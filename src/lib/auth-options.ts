import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import {compare, hash} from "bcrypt";

export const authOptions: NextAuthOptions = {
    // pages: { //todo: add custom login page
    //     signIn: '/login',
    // },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const {email, password} = credentials ?? {}
                if (!email || !password) {
                    throw new Error("Missing username or password");
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                        provider: 'local'
                    },
                });
                // if user doesn't exist or password doesn't match
                if (!user || !(await compare(password, user.password))) {
                    throw new Error("Invalid username or password");
                }
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({token, user, account, profile}) {
            if (user) {
                if (!user.id) {
                    const dbUser = await prisma.user.findUnique({where: {email: user.email!}})
                    token.userId = dbUser?.id
                } else {
                    token.userId = user.id
                }
            }
            return token
        },
        async session({session, token}) {
            let newSession: any & { userId: string | undefined }
            newSession = {...session, userId: token.sub}
            return Promise.resolve(newSession);
        },
    }
};