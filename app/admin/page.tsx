import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DashboardOverview from "@/components/admin/DashboardOverview";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch dashboard stats
  const [totalOrders, totalRevenue, totalProducts, totalCustomers] =
    await Promise.all([
      db.order.count(),
      db.order.aggregate({
        where: { status: { not: "cancelled" } },
        _sum: { total: true },
      }),
      db.product.count(),
      db.user.count({ where: { role: "user" } }),
    ]);

  const stats = {
    totalOrders: totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts: totalProducts,
    totalCustomers: totalCustomers,
  };

  return <DashboardOverview stats={stats} />;
}
