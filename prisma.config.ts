import { config } from "dotenv";
// Only load from .env.local if NOT on Vercel/CI
if (!process.env.VERCEL) {
  config({ path: ".env.local" });
}
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
