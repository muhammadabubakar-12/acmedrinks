import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import ProductDetail from "@/components/ProductDetail"

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug },
  })

  if (!product) {
    notFound()
  }

  return product
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ProductDetail product={product} />
    </div>
  )
}
