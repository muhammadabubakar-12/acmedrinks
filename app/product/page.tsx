import Image from "next/image"
import { Star, Heart, ArrowRight, Truck, RefreshCw, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Header from "@/components/Header"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3, 4].map((i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={`/placeholder.svg?height=800&width=800&text=Product${i}`}
                        alt={`Product image ${i}`}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-black"
                >
                  <Image
                    src={`/placeholder.svg?height=200&width=200&text=View${i}`}
                    alt={`Thumbnail ${i}`}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-center object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight">Essential Cotton T-Shirt</h1>
              <p className="text-2xl font-light text-gray-500">Comfort meets style</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-500">(125 reviews)</span>
            </div>

            <p className="text-4xl font-bold">$49.99</p>

            <p className="text-xl text-gray-600 leading-relaxed">
              Our Essential Cotton T-Shirt is the perfect blend of comfort and style. Made from 100% organic cotton,
              it's soft, breathable, and designed to last. An everyday staple that elevates your casual wardrobe.
            </p>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <RadioGroup defaultValue="white" className="flex gap-3">
                {["white", "black", "gray", "blue"].map((color) => (
                  <RadioGroupItem
                    key={color}
                    value={color}
                    id={`color-${color}`}
                    className={`w-12 h-12 rounded-full bg-${color === "white" ? "gray-200" : color}-500 border-2 border-gray-300 cursor-pointer transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-black`}
                  />
                ))}
              </RadioGroup>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <Select>
                <SelectTrigger className="w-full text-lg">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <SelectItem key={size} value={size.toLowerCase()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold">1</span>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart and Wishlist */}
            <div className="flex space-x-4">
              <Button className="flex-1 bg-black hover:bg-gray-800 text-white py-8 text-xl font-semibold">
                Add to Bag
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-gray-500 hover:text-black border-gray-200 w-16 h-16"
              >
                <Heart className="w-8 h-8" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>

            {/* Shipping and Returns */}
            <div className="flex items-center space-x-8 text-lg font-medium">
              <div className="flex items-center">
                <Truck className="w-6 h-6 mr-2" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <RefreshCw className="w-6 h-6 mr-2" />
                Free Returns
              </div>
            </div>

            {/* Additional Information */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-xl font-semibold">Product Details</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                    <li>100% organic cotton</li>
                    <li>Regular fit</li>
                    <li>Crew neck</li>
                    <li>Short sleeves</li>
                    <li>Pre-shrunk fabric</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger className="text-xl font-semibold">Care Instructions</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                    <li>Machine wash cold</li>
                    <li>Tumble dry low</li>
                    <li>Do not bleach</li>
                    <li>Iron on low heat if needed</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xl font-semibold">Shipping & Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-lg text-gray-600">
                    Free standard shipping on orders over $75. Express shipping available at checkout. Returns accepted
                    within 30 days of delivery.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold mb-8">You May Also Like</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {[1, 2, 3, 4].map((product) => (
                <CarouselItem key={product} className="md:basis-1/2 lg:basis-1/3">
                  <div className="group cursor-pointer p-4">
                    <div className="aspect-square relative mb-4 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=400&width=400&text=Product${product}`}
                        alt={`Product ${product}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-xl">Essential Product {product}</h3>
                    <p className="text-gray-600 mt-1 text-lg font-medium">$39.99</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <h2 className="text-5xl font-bold mb-6">Explore the Collection</h2>
          <Button variant="outline" size="lg" className="text-xl py-8 px-12 font-semibold">
            View All Products
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </main>
    </div>
  )
}
