import { Webhook } from "@creem_io/nextjs";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onGrantAccess: async ({ customer, metadata }) => {
    // Grant access logic here
    console.log("Grant access to", customer.email, metadata);
  },
  onRevokeAccess: async ({ customer, metadata }) => {
    // Revoke access logic here
    console.log("Revoke access from", customer.email, metadata);
  },
});
