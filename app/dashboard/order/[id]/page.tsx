import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import Header from "@/components/Header";
import OrderDetailContent from "@/components/OrderDetailContent";

async function getOrder(orderId: string, userId: string) {
  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const order = await getOrder(params.id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <OrderDetailContent order={order} />
    </div>
  );
}
