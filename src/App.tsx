import type React from "react"
import { useEffect, useState } from "react"
import { NavegationMenu } from "@/components/pages/NavegationMenu"
import { Boletos } from "./components/pages/Boletos"
import { Pedidos } from "./components/pages/Pedidos"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { Init } from "./components/pages/Home"
import { LoginPage } from "./components/auth/LoginForm"
import { Dashboard } from "@/components/pages/Dashboard"
import { Toaster } from "sonner"
import { ThemeProvider } from "./components/Dark-Mode/ThemeProvider"
import CookieConsent from "./components/auth/cookies/CookieConsent"
import PedidoTruck from "./components/pages/Pedidos/PedidoTruck"
import { Chatbot } from "./components/pages/chatbot/ChatBot"

// Interface para os dados do usuário
interface UserData {
  login: string
  email: string
  firstName: string
  lastName: string
  token?: string
}

export function App() {
  const [authData, setAuthData] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("token")
    const authFlag = localStorage.getItem("isAuthenticated")
    return token !== null && authFlag === "true"
  })

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("authData")
    localStorage.removeItem("token")
    sessionStorage.clear()
    setIsAuthenticated(false)
    setAuthData(null)
  }

  // Carrega os dados de autenticação uma vez no início
  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData")
    const token = localStorage.getItem("token")
    const authFlag = localStorage.getItem("isAuthenticated")

    if (storedAuthData && token && authFlag === "true") {
      try {
        const userData = JSON.parse(storedAuthData)
        setAuthData(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao carregar dados de autenticação:", error)
        handleLogout()
      }
    } else {
      if (storedAuthData || token || authFlag) {
        handleLogout()
      }
    }
  }, [])

  const handleCookieConsent = (preferences: Record<string, boolean>) => {
    console.log("Cookie consent given with preferences:", preferences)
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="system">
      <Router>
        <CookieConsent validityDays={30} policyVersion="1.0" onConsent={handleCookieConsent}>
          <Routes>
            {/* ROTA PÚBLICA - Login */}
            <Route 
              path="/login" 
              element={
                isAuthenticated 
                  ? <Navigate to="/inicio" replace /> 
                  : <LoginPage />
              } 
            />

            {/* ROTAS PROTEGIDAS - Layout com Navegação */}
            <Route 
              path="/inicio" 
              element={
                isAuthenticated 
                  ? <AuthenticatedLayout authData={authData} onLogout={handleLogout}>
                      <Init />
                    </AuthenticatedLayout>
                  : <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/pedidos" 
              element={
                isAuthenticated 
                  ? <AuthenticatedLayout authData={authData} onLogout={handleLogout}>
                      <Pedidos />
                    </AuthenticatedLayout>
                  : <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/boletos" 
              element={
                isAuthenticated 
                  ? <AuthenticatedLayout authData={authData} onLogout={handleLogout}>
                      <Boletos />
                    </AuthenticatedLayout>
                  : <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/rastreio-pedidos" 
              element={
                isAuthenticated 
                  ? <AuthenticatedLayout authData={authData} onLogout={handleLogout}>
                      <PedidoTruck />
                    </AuthenticatedLayout>
                  : <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated 
                  ? <AuthenticatedLayout authData={authData} onLogout={handleLogout}>
                      <Dashboard />
                    </AuthenticatedLayout>
                  : <Navigate to="/login" replace />
              } 
            />

            {/* Redirecionamentos */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/inicio" replace /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Toaster />
        </CookieConsent>
      </Router>
    </ThemeProvider>
  )
}

// Layout autenticado SIMPLIFICADO
function AuthenticatedLayout({
  children,
  onLogout,
  authData,
}: {
  children: React.ReactNode
  onLogout: () => void
  authData: UserData | null
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Navigation */}
      <NavegationMenu onLogout={onLogout} authData={authData} />

      {/* Main Content */}
      <main className="relative">
        <div className="mx-auto px-4 py-6">{children}</div>
      </main>
      <Chatbot />
    </div>
  )
}