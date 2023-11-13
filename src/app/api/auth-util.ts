import {getServerSession} from "next-auth/next";
import {NextRequest} from "next/server";
import prisma from "@/lib/prisma";
import {User} from "@prisma/client";
import {authOptions} from "@/lib/auth-options";

export async function getUser(req: NextRequest) : Promise<User | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return null;
    }
    return await prisma.user.findFirst({where: {email: session.user.email}});
}

export async function hasSession(req: NextRequest) : Promise<boolean> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
        return false;
    }
    return true;
}