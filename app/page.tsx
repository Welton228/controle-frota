// app/page.tsx
import { LoginButton } from "@/components/login/login-button"

export default function Home() {
  console.log("Variável AUTH_SECRET:", process.env.AUTH_SECRET);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Controle de Frota</h1>
      
      {/* Aqui estamos usando o componente que você criou na pasta components */}
      <LoginButton />
    </main>
  )
}