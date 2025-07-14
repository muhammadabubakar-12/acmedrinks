import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import DashboardContent from "@/components/DashboardContent";
import CartClearer from "@/components/CartClearer";

async function getUserOrders(userId: string) {
  console.log("🔍 Getting orders for user ID:", userId);

  const orders = await db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("📦 Found orders:", orders.length);
  console.log(
    "📋 Orders:",
    orders.map((o) => ({ id: o.id, status: o.status, total: o.total }))
  );

  return orders;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  console.log("👤 Dashboard - User ID:", session.user.id);
  console.log("📧 Dashboard - User email:", session.user.email);

  const orders = await getUserOrders(session.user.id);

  // Convert Date objects to strings for the frontend
  const formattedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    ...(order.completedAt && { completedAt: order.completedAt.toISOString() }),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartClearer />
      <DashboardContent orders={formattedOrders} />
    </div>
  );
}
