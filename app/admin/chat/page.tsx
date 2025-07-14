import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AdminChatInterface from "@/components/chat/AdminChatInterface";

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  // Fetch all users who have sent messages
  const usersWithMessages = await db.user.findMany({
    where: {
      messages: {
        some: {},
      },
      role: "user", // Only show regular users, not admins
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Get the latest message for preview
      },
    },
    orderBy: {
      messages: {
        _count: "desc",
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
        <p className="text-gray-600 mt-2">
          Manage customer inquiries and provide real-time support
        </p>
      </div>

      <AdminChatInterface usersWithMessages={usersWithMessages} />
    </div>
  );
}
