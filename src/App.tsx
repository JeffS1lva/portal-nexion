// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/Dark-Mode/ThemeProvider";
import CookieConsent from "./components/auth/cookies/CookieConsent";
import { NavegationMenu } from "@/components/pages/NavegationMenu";
import { Init } from "./components/pages/Home";
import { LoginPage } from "./components/auth/LoginForm";
import { Pedidos } from "./components/pages/Pedidos";
import { Boletos } from "./components/pages/Boletos";
import  PedidoTruck  from "./components/pages/Pedidos/PedidoTruck";
import { Dashboard } from "@/components/pages/Dashboard";
import { Chatbot } from "./components/pages/chatbot/ChatBot";
import { useAuth } from "@/components/auth/hooks/useAuth";

export function App() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <ThemeProvider defaultTheme="system" storageKey="system">
      <Router>
        <CookieConsent validityDays={30} policyVersion="1.0" onConsent={() => {}}>
          <Routes>
            {/* LOGIN */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/inicio" replace /> : <LoginPage />}
            />

            {/* ROTAS PROTEGIDAS */}
            <Route
              path="/inicio"
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout user={user} onLogout={logout}>
                    <Init authData={user} />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/pedidos"
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout user={user} onLogout={logout}>
                    <Pedidos />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/boletos"
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout user={user} onLogout={logout}>
                    <Boletos />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/rastreio-pedidos"
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout user={user} onLogout={logout}>
                    <PedidoTruck />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <AuthenticatedLayout user={user} onLogout={logout}>
                    <Dashboard />
                  </AuthenticatedLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* REDIRECIONAMENTOS */}
            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/inicio" : "/login"} replace />}
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </CookieConsent>
      </Router>
    </ThemeProvider>
  );
}

function AuthenticatedLayout({
  children,
  user,
  onLogout,
}: {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavegationMenu onLogout={onLogout} authData={user} />
      <main className="relative">
        <div className="mx-auto px-4 py-6">{children}</div>
      </main>
      <Chatbot />
    </div>
  );
}