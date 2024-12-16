// lib/auth-utils.ts
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type AuthContext =
  | {
      req: GetServerSidePropsContext["req"];
      res: GetServerSidePropsContext["res"];
    }
  | { req: NextApiRequest; res: NextApiResponse }
  | undefined;

export async function auth(context?: AuthContext) {
  return getServerSession(authOptions);
}
