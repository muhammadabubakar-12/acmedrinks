import { execSync } from "child_process"

async function generateClient() {
  try {
    console.log("🔄 Generating Prisma client...")

    // Generate the Prisma client
    execSync("npx prisma generate", { stdio: "inherit" })

    console.log("✅ Prisma client generated successfully!")
    console.log("📝 You can now run your Next.js application")
  } catch (error) {
    console.error("❌ Error generating Prisma client:", error)
    process.exit(1)
  }
}

generateClient()
