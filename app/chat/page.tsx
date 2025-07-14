import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ChatInterface from "@/components/chat/ChatInterface";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-900">
                Customer Support
              </h1>
              <p className="text-gray-600 mt-1">
                Chat with our support team for any questions or assistance
              </p>
            </div>
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
