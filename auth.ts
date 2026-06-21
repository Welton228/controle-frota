import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // Importa a instância única definida acima

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Adicione esta linha!
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { prompt: "login" },
      },
    }),
  ],
  callbacks: {
    // 1. Validação de Acesso (Segurança)
    async signIn({ user }) {
      if (!user.email) return false;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { status: true },
      });

      // Bloqueia usuários marcados como "INATIVO"
      return dbUser?.status !== "INATIVO";
    },

    // 2. Persistência do ID na Sessão (O que corrige o seu loop)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Injeta o ID do banco no token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; // Garante que o ID esteja na sessão
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Define a home como página de login
  },
});