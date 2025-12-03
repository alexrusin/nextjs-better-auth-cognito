import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {}),
  user: {
    additionalFields: {
      sub: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
      },
      permissions: {
        type: "string",
      },
    },
  },
  socialProviders: {
    cognito: {
      clientId: process.env.COGNITO_CLIENT_ID as string,
      clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
      domain: process.env.COGNITO_DOMAIN as string,
      region: process.env.COGNITO_REGION as string,
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
      scope: ["email", "openid", "profile", "aws.cognito.signin.user.admin"],
      getUserInfo: async (token) => {
        const userInfoResponse = await fetch(
          `https://${process.env.COGNITO_DOMAIN}/oauth2/userInfo`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          },
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info from Cognito");
        }

        const userInfo = await userInfoResponse.json();

        const decoded = jwt.decode(token.accessToken as string) as Record<
          string,
          string | number
        >;

        return {
          user: {
            id: userInfo.sub,
            sub: userInfo.sub,
            username: userInfo.username || "",
            name: userInfo.name,
            email: userInfo.email,
            emailVerified: userInfo.email_verified === "true" || false,
            role: userInfo["custom:role"] || "user",
            permissions: decoded?.scope || "",
          },
          data: userInfo,
        };
      },
    },
  },
});
