// app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Shield, Loader2 } from 'lucide-react'

// Routes de dashboard par rôle
const DASHBOARD_ROUTES: Record<string, string> = {
  admin: '/admin/dashboard',
  agent: '/agent/dashboard',
  expert: '/expert/dashboard',
  assure: '/assure/dashboard',
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Attendre que l'authentification soit vérifiée
    if (loading) return

    // Si pas authentifié, rediriger vers login
    if (!isAuthenticated || !user) {
      console.log('🔒 Utilisateur non authentifié, redirection vers /login')
      router.replace('/login')
      return
    }

    // Récupérer la route du dashboard selon le rôle
    const dashboardRoute = DASHBOARD_ROUTES[user.role]

    if (dashboardRoute) {
      console.log(`✅ Redirection vers le dashboard ${user.role}: ${dashboardRoute}`)
      // Utiliser replace pour éviter de pouvoir revenir à /dashboard
      router.replace(dashboardRoute)
    } else {
      console.error(`❌ Rôle non reconnu: ${user.role}`)
      // Fallback : rediriger vers une page d'erreur ou login
      router.replace('/login?error=invalid_role')
    }
  }, [user, isAuthenticated, loading, router])

  // Page de chargement pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        {/* Animation de chargement */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6">
            <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
          </div>
          <Shield className="w-12 h-12 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Chargement de votre espace
        </h2>
        <p className="text-gray-600">
          Redirection vers votre dashboard personnalisé...
        </p>

        {/* Indicateur de progression */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Message de fallback si la redirection tarde */}
        <p className="mt-8 text-sm text-gray-500">
          Si la redirection ne fonctionne pas,{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium underline">
            cliquez ici pour vous connecter
          </a>
        </p>
      </div>
    </div>
  )
}