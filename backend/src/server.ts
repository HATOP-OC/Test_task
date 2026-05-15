import { createApp } from "./app"
import { env } from "./config/env"
import { prisma } from "./config/prisma"

const app = createApp()

const server = app.listen(env.port, () => {
  console.log(`[server] Listening on http://localhost:${env.port} (${env.nodeEnv})`)
})

async function shutdown(signal: string) {
  console.log(`[server] Received ${signal}, shutting down...`)
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Rejection:", reason)
})

process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught Exception:", err)
  shutdown("uncaughtException")
})
