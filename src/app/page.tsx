import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">Service Portal</h1>

        {/* Here is our custom Lego Brick */}
        <ContactForm />

      </div>
    </main>
  );
}