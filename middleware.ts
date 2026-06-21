import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  console.log("Middleware - Logado:", isLoggedIn);
  console.log("Middleware - Caminho:", nextUrl.pathname);
  
  // Rotas que não precisam de login (Home e API de Auth)
  const isAuthRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/api/auth")

  // Se o usuário está logado e tenta acessar a Home, manda pro dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Se o usuário NÃO está logado e tenta acessar o dashboard, manda pra Home
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Ignora arquivos estáticos e imagens, mas analisa todas as rotas
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}