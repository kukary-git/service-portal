"use client";

import { useState } from "react";
import { submitContactForm } from "../actions"; // <--- Import the new Server Action

export default function ContactForm() {
    const [status, setStatus] = useState("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");

        const formData = new FormData(e.currentTarget); // Grab all data from inputs automatically

        // Call the Server Action
        const result = await submitContactForm(formData);

        if (result.success) {
            setStatus("success");
        } else {
            setStatus("error");
        }
    };

    // --- UI (Keep your existing UI code exactly the same) ---
    if (status === "success") {
        return (
            <div className="p-6 bg-green-100 text-green-700 rounded-lg">
                <h2 className="text-xl font-bold">Message Sent!</h2>
                <p>We have received your query.</p>
                <button onClick={() => setStatus("idle")} className="mt-4 underline text-sm">Send another</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 border bg-white rounded-lg shadow-xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>

            {/* Make sure inputs have 'name' attributes - this is how FormData finds them */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" required className="w-full p-3 border rounded text-black" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" required rows={4} className="w-full p-3 border rounded text-black" />
            </div>

            <button type="submit" disabled={status === "submitting"} className="w-full bg-blue-600 text-white py-3 rounded">
                {status === "submitting" ? "Processing..." : "Send Message"}
            </button>
        </form>
    );
}