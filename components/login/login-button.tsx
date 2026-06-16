// components/login-button.tsx
import { signIn } from "@/auth" // O @/ aponta para a raiz do seu projeto (controle-frota)

export function LoginButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all"
      >
        Entrar com Google
      </button>
    </form>
  )
}