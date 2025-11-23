"use server";

import { supabase } from "./lib/supabaseClient";
import { Resend } from "resend";
import twilio from "twilio"; // <--- New Import

// Initialize Agents
const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function submitContactForm(formData: FormData) {
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    console.log("Processing submission for:", email);

    // 1. Save to Database
    const { error: dbError } = await supabase
        .from("submissions")
        .insert([{ email, message }]);

    if (dbError) {
        console.error("Database Error:", dbError);
        return { success: false, message: "Database failure" };
    }

    // 2. Run Notifications in Parallel (Faster)
    try {
        await Promise.all([

            // Task A: Send Email to Admin
            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'aryankukreja.work@gmail.com', // <--- CHECK THIS IS STILL YOUR EMAIL
                subject: 'New Service Portal Lead',
                html: `<p>New message from <strong>${email}</strong>: ${message}</p>`
            }).then(result => {
                console.log("Email sent result:", result);
                if (result.error) {
                    console.error("Resend returned error:", result.error);
                }
            }),

            // Task B: Send WhatsApp Alert (To You)
            twilioClient.messages.create({
                body: `🔔 New Lead!\nFrom: ${email}\nMessage: ${message}`,
                from: process.env.TWILIO_WHATSAPP_NUMBER, // The Sandbox Number
                to: process.env.MY_PHONE_NUMBER!         // Your Verified Number
            })

        ]);

    } catch (error) {
        console.error("Notification System Error:", error);
        // We don't stop the success message just because a notification failed
    }

    return { success: true, message: "Saved and Notified" };
}