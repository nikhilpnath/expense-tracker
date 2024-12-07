import { prisma } from '~/utils/prisma.server'
import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === "production",
        secrets: [process.env.SESSION_SECRET as string],
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30days
        httpOnly: true

    }
})


async function createUserSession(userId: string, redirectPath: string) {
    const session = await sessionStorage.getSession();
    session.set("userId", userId)
    return redirect(redirectPath, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    })
}


export async function getUserFromSession(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"))

    const userId = session.get("userId");

    if (!userId || typeof userId !== 'string') {
        return null;
    }

    return userId

}

export async function destroyUserFromSession(request: Request) {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"))

    return redirect('/auth?mode=login', {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session)
        }
    })

}

export async function requireUserSession(request: Request) {
    const userId = await getUserFromSession(request)

    if (!userId || typeof userId !== 'string') {
        throw redirect('/auth?mode=login')
    }
    return userId;
}



type AuthType = {
    email: string
    password: string

}

const User = prisma.user;

export async function signup({ email, password }: AuthType) {

    const existingUser = await User.findFirst({ where: { email } });

    if (existingUser) {
        const error = new Error("A user with this email is already exists") as Error & { status?: number };
        error.status = 422;
        throw error;
    }

    const hashedPass = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPass
        }
    })

    return createUserSession(user.id, '/expenses')

}

export async function login({ email, password }: AuthType) {

    const existingUser = await User.findFirst({ where: { email } });

    if (!existingUser || !await bcrypt.compare(password, existingUser.password)) {
        const error = new Error("Invalid Credentials") as Error & { status?: number };
        error.status = 401;
        throw error;
    }

    return createUserSession(existingUser.id, '/expenses')
}