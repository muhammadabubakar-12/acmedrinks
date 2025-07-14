import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  // Fetch all products
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ProductsTable products={products} />;
}
