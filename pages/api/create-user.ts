import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../src/firebase/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        try {
            const userRecord = await auth.createUser({
                email,
                password,
            });

            return res.status(200).json({ user: userRecord });

        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}