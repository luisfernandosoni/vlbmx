import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

const reconstructRequest = async (request: Request) => {
  const headersList = await headers();
  return new Request(request.url, {
    method: request.method,
    headers: headersList,
    body: request.body,
    duplex: "half"
  } as RequestInit);
};

export async function POST(request: Request) {
  const auth = getAuth();
  const handler = toNextJsHandler(auth.handler);
  const modifiedRequest = await reconstructRequest(request);
  return handler.POST(modifiedRequest);
}

export async function GET(request: Request) {
  const auth = getAuth();
  const handler = toNextJsHandler(auth.handler);
  const modifiedRequest = await reconstructRequest(request);
  return handler.GET(modifiedRequest);
}
