import { db } from "@/lib/db"
import Header from "@/components/Header"
import ProductCard from "@/components/ProductCard"
import FeaturedProduct from "@/components/FeaturedProduct"

async function getProducts() {
  try {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Premium Energy Drinks</h1>
          <p className="text-xl text-gray-600">Elevate your energy with our premium collection</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Admin can add products from the admin dashboard.</p>
          </div>
        ) : (
          <>
            {/* Featured Product */}
            {products[0] && <FeaturedProduct product={products[0]} />}

            {/* Product Grid */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
