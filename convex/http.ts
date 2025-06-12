import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/clerkwebhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        // Check headers
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error occurred - missing svix headers", {
                status: 400,
            });
        }

        // Read body
        const payload = await request.json();
        const body = JSON.stringify(payload);

        // Verify webhook
        const webhook = new Webhook(webhookSecret);
        let event: any;
        
        try {
            event = webhook.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            });
        } catch (error) {
            console.error("Webhook verification failed:", error);
            return new Response("Error occurred - webhook verification failed", {
                status: 400,
            });
        }

        // Handle user creation event
        const eventType = event.type;
        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = event.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullname: name,
                    image: image_url,
                    clerkId: id,
                    username: email.split("@")[0],
                });
            } catch (error) {
                console.error("Error creating user in Convex:", error);
                return new Response("Error occurred - failed to create user in Convex", {
                    status: 500,
                });
            }
        }

        return new Response("Webhook processed successfully", {
            status: 200,
        });
    }),
});

export default http;