import { db } from "../lib/db"

const products = [
  {
    title: "ACME ASCENT - Premium Energy Drink",
    header: "(4.5 / 120 reviews) $49.99",
    description:
      "Elevate your energy game with ACME ASCENT. Crafted for those who demand both style and a powerful boost. Packed with essential nutrients and a clean, crisp taste, it's the perfect companion for your gym sessions or busy workdays.",
    price: 49.99,
    image: "/images/acme-ascent-black.png",
    specs: {
      Capacity: "500ml",
      Material: "Aluminum Can",
      Flavor: "Citrus Mint",
      Energy: "120mg Natural Caffeine",
      "Cold Retention": "Up to 8 hours",
    },
    reviews: [
      { initials: "JD", name: "John Doe", comment: "Fantastic taste, and gave me a smooth energy lift." },
      { initials: "LS", name: "Laura Smith", comment: "Love the can design, feels premium!" },
    ],
  },
  {
    title: "ACME EUFORIA - Intense Red Energy Drink",
    header: "(4.7 / 98 reviews) $54.99",
    description:
      "Fuel your passion and power through the day with ACME EUFORIA. Its vibrant red color and rich berry flavor reflect pure energy and excitement, perfect for intense workouts or lively nights out.",
    price: 54.99,
    image: "/images/euforia-red.png",
    specs: {
      Capacity: "500ml",
      Material: "Aluminum Can",
      Flavor: "Wild Berry",
      Energy: "150mg Natural Caffeine",
      "Cold Retention": "Up to 8 hours",
    },
    reviews: [
      { initials: "MG", name: "Michael Green", comment: "Exactly what I needed before my evening run." },
      { initials: "EK", name: "Emily Knight", comment: "Tastes amazing and keeps me going!" },
    ],
  },
  {
    title: "ACME AZURA - Blueberry Energy Drink",
    header: "(4.6 / 110 reviews) $52.99",
    description:
      "Stay cool and refreshed with ACME AZURA. This blueberry-infused energy drink combines subtle sweetness with an elegant blue can design, giving you a sophisticated boost whenever you need it.",
    price: 52.99,
    image: "/images/azura-blueberry.png",
    specs: {
      Capacity: "500ml",
      Material: "Aluminum Can",
      Flavor: "Blueberry",
      Energy: "130mg Natural Caffeine",
      "Cold Retention": "Up to 8 hours",
    },
    reviews: [
      { initials: "RT", name: "Ryan Taylor", comment: "Light and refreshing, not too sweet. Love it." },
      { initials: "AD", name: "Ava Daniels", comment: "Beautiful can and great taste!" },
    ],
  },
  {
    title: "ACME XNOVA - Green Energy Drink",
    header: "(4.8 / 140 reviews) $56.99",
    description:
      "Boost your day with ACME XNOVA. Its striking green and black design signals powerful energy, while the crisp apple-kiwi flavor keeps you coming back for more. Perfect for busy days or long nights.",
    price: 56.99,
    image: "/images/xnova-energy-green.png",
    specs: {
      Capacity: "500ml",
      Material: "Aluminum Can",
      Flavor: "Apple Kiwi",
      Energy: "160mg Natural Caffeine",
      "Cold Retention": "Up to 8 hours",
    },
    reviews: [
      { initials: "SM", name: "Sara Malik", comment: "Incredible kick of energy with a super clean finish." },
      { initials: "WB", name: "Will Brown", comment: "My favorite by far, awesome flavor!" },
    ],
  },
]

async function main() {
  console.log("Seeding database...")

  for (const product of products) {
    const slug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    await db.product.create({
      data: {
        ...product,
        slug,
      },
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
