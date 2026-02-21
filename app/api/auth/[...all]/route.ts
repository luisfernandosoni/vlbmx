import { getAuth } from "../../../../lib/auth";

export function GET(req: Request) {
  const auth = getAuth();
  return auth.handler(req);
}

export function POST(req: Request) {
  const auth = getAuth();
  return auth.handler(req);
}
