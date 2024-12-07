import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { destroyUserFromSession, requireUserSession } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserSession(request)
}

export async function action({ request }: ActionFunctionArgs) {

    if (request.method !== 'POST') {
        throw json("Invalid Request Method", { status: 400 })
    }

    return await destroyUserFromSession(request)
}