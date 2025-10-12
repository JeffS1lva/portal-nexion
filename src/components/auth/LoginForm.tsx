import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Package,
  FileText,
  TruckIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  CheckCircle,
  BarChart3,
  Clock,
  Crown,
  X,
} from "lucide-react"
import { ModeToggle } from "@/components/Dark-Mode/ModeToggle"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      // Extrai o nome do email e capitaliza a primeira letra
      const emailUsername = email.split("@")[0]
      const firstName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1)

      const userData = {
        login: emailUsername,
        email: email,
        firstName: firstName,
        lastName: "",
        token: "mock-token-" + Date.now(),
      }

      // Salva os dados no localStorage
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("authData", JSON.stringify(userData))
      localStorage.setItem("token", userData.token)

      // Dispara evento customizado para notificar o App sobre a mudança de autenticação
      window.dispatchEvent(new Event("authStateChange"))

      setLoading(false)

      // Força a navegação para a página inicial
      navigate("/inicio", { replace: true })

      // Fallback: se o navigate não funcionar, força reload
      setTimeout(() => {
        if (window.location.pathname === "/login") {
          window.location.href = "/inicio"
        }
      }, 100)
    }, 2000)
  }

  const handlePremiumClick = () => {
    setShowPremiumModal(true)
  }

  const features = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Gestão de Pedidos",
      description: "Acompanhe todos os seus pedidos em tempo real",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Controle de Boletos",
      description: "Gerencie pagamentos e vencimentos",
    },
    {
      icon: <TruckIcon className="h-5 w-5" />,
      title: "Rastreamento",
      description: "Monitore entregas em tempo real",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Relatórios",
      description: "Análises detalhadas do seu negócio",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--color-border))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--color-border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Branding and features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-10"
        >
          {/* Logo and title */}
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-lg"
            >
              <div className="p-2 bg-primary/10 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Portal de Gestão</span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Gerencie seu negócio com{" "}
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                inteligência
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed text-pretty max-w-xl">
              Plataforma completa para controle de pedidos, boletos e rastreamento de entregas em tempo real.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1.5 text-foreground">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-8 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-xl">
                <Clock className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground">Suporte</div>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">5000+</div>
                <div className="text-xs text-muted-foreground">Empresas</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="backdrop-blur-xl bg-card/80 border-2 border-border shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              {/* Mobile logo */}
              <div className="lg:hidden flex justify-center mb-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-base font-bold text-foreground">Portal de Gestão</span>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mx-auto"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Bem-vindo de volta</span>
              </motion.div>

              <CardTitle className="text-3xl font-bold text-foreground">Fazer Login</CardTitle>
              <CardDescription className="text-base text-muted-foreground text-pretty">
                Acesse sua conta para gerenciar pedidos e boletos
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.995 }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="seu@email.com"
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      className={`h-12 pl-10 pr-4 text-base transition-all duration-300 border-2 rounded-xl bg-background
                        ${focusedField === "email"
                          ? "border-primary ring-4 ring-primary/10 shadow-lg shadow-primary/5"
                          : "border-border hover:border-primary/50"
                        }
                      `}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </motion.div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-foreground">
                      <Lock className="h-4 w-4 text-primary" />
                      Senha
                    </Label>
                    <Button
                      variant="link"
                      className="px-0 h-auto text-sm font-normal text-primary hover:text-primary/80"
                      type="button"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>

                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.995 }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Digite sua senha"
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className={`h-12 pl-10 pr-12 text-base transition-all duration-300 border-2 rounded-xl bg-background
                        ${focusedField === "password"
                          ? "border-primary ring-4 ring-primary/10 shadow-lg shadow-primary/5"
                          : "border-border hover:border-primary/50"
                        }
                      `}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-muted rounded-lg"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                </div>

                {/* Login button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LogIn className="h-4 w-4" />
                        <span>Acessar Plataforma</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">Primeiro acesso?</span>
                </div>
              </div>

              {/* Request access button - PREMIUM LOCKED */}
              <div className="relative">
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base font-medium rounded-xl border-2 border-border hover:bg-muted/50 bg-background relative overflow-hidden group opacity-60 cursor-not-allowed"
                    type="button"
                    onClick={handlePremiumClick}
                    disabled
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="h-4 w-4 text-premium" />
                      <span>Solicitar Acesso</span>
                      <Lock className="h-3.5 w-3.5 text-premium" />
                    </div>
                  </Button>
                </motion.div>

                {/* Premium badge */}
                <div className="absolute -top-2 -right-2 bg-premium text-premium-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  PREMIUM
                </div>
              </div>

              {/* Premium info text */}
              <p className="text-xs text-center text-muted-foreground text-pretty">
                O cadastro de novos usuários está disponível apenas no plano Premium.{" "}
                <button
                  onClick={handlePremiumClick}
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
                >
                  Saiba mais
                </button>
              </p>

              {/* Mobile features */}
              <div className="lg:hidden grid grid-cols-2 gap-3 pt-2">
                {features.slice(0, 4).map((feature) => (
                  <div
                    key={feature.title}
                    className="p-3 rounded-xl bg-muted/30 backdrop-blur-sm border border-border text-center"
                  >
                    <div className="flex justify-center mb-2 text-primary">{feature.icon}</div>
                    <div className="text-xs font-medium text-foreground">{feature.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPremiumModal(false)}
            >
              <Card
                className="w-full max-w-md bg-card border-2 border-border shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader className="relative pb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPremiumModal(false)}
                    className="absolute right-4 top-4 rounded-full hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-premium/10 rounded-2xl">
                      <Crown className="h-12 w-12 text-premium" />
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-center text-foreground">Recurso Premium</CardTitle>
                  <CardDescription className="text-center text-base text-muted-foreground text-pretty">
                    Desbloqueie todo o potencial da plataforma
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Cadastro ilimitado de usuários</p>
                        <p className="text-xs text-muted-foreground">Adicione toda sua equipe sem restrições</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Suporte prioritário 24/7</p>
                        <p className="text-xs text-muted-foreground">Atendimento dedicado quando precisar</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-foreground">Recursos avançados</p>
                        <p className="text-xs text-muted-foreground">Acesso a todas as funcionalidades premium</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button className="w-full h-12 text-base font-semibold rounded-xl bg-premium hover:bg-premium/90 text-premium-foreground shadow-lg">
                      <Crown className="h-4 w-4 mr-2" />
                      Fazer Upgrade para Premium
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setShowPremiumModal(false)}
                      className="w-full h-10 text-sm font-medium rounded-xl"
                    >
                      Talvez mais tarde
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}