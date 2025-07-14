import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  subDays,
  startOfDay,
  endOfDay,
  format,
  eachDayOfInterval,
} from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "7d";
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    let startDate: Date;
    let endDate: Date;

    switch (filter) {
      case "7d":
        startDate = subDays(new Date(), 7);
        endDate = new Date();
        break;
      case "30d":
        startDate = subDays(new Date(), 30);
        endDate = new Date();
        break;
      case "custom":
        if (fromDate && toDate) {
          startDate = new Date(fromDate);
          endDate = new Date(toDate);
        } else {
          // Fallback to last 30 days if no custom dates provided
          startDate = subDays(new Date(), 30);
          endDate = new Date();
        }
        break;
      default:
        startDate = subDays(new Date(), 7);
        endDate = new Date();
    }

    // Get all days in the range
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Get orders for the date range
    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
        status: { not: "cancelled" },
      },
      include: {
        items: true,
      },
    });

    // Group orders by date and calculate revenue
    const salesData = days.map((day) => {
      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return format(orderDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });

      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = dayOrders.length;

      return {
        date: format(day, "yyyy-MM-dd"),
        revenue,
        orders: orderCount,
      };
    });

    return NextResponse.json(salesData);
  } catch (error) {
    console.error("Sales analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
