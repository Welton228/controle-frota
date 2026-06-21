// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Importa de onde definimos o NextAuth
export const { GET, POST } = handlers