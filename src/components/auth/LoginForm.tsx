import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomCardPremium,
} from "@/components/ui/card";
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
  Zap,
  Shield,
  Users,
  
} from "lucide-react";
import { ModeToggle } from "@/components/Dark-Mode/ModeToggle";
import { useNavigate } from "react-router-dom";

export function LoginPage(): React.ReactNode {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const emailUsername = email.split("@")[0];
      const firstName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);

      const userData = {
        login: emailUsername,
        email: email,
        firstName: firstName,
        lastName: "",
        token: "mock-token-" + Date.now(),
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authData", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      window.dispatchEvent(new Event("authStateChange"));

      setLoading(false);
      navigate("/inicio", { replace: true });

      setTimeout(() => {
        if (window.location.pathname === "/login") {
          window.location.href = "/inicio";
        }
      }, 100);
    }, 2000);
  };

  const handlePremiumClick = () => {
    setShowPremiumModal(true);
  };

  const features = [
    {
      icon: <Package className="h-5 w-5" />,
      title: "Gestão de Pedidos",
      description: "Acompanhe todos os seus pedidos em tempo real",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Controle de Boletos",
      description: "Gerencie pagamentos e vencimentos",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <TruckIcon className="h-5 w-5" />,
      title: "Rastreamento",
      description: "Monitore entregas em tempo real",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Relatórios",
      description: "Análises detalhadas do seu negócio",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5"
            >
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Portal Nexion
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Gerencie seu negócio com{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                inteligência
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Plataforma completa para controle de pedidos, boletos e rastreamento de entregas em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group relative p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="relative flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1.5 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-6 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/30">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">99.9%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">24/7</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Suporte</div>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">5000+</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Empresas</div>
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
          <Card className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-6">
              <div className="lg:hidden flex justify-center mb-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">Portal de Gestão</span>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 dark:border-blue-800 mx-auto"
              >
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Bem-vindo de volta</span>
              </motion.div>

              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-slate-100">Fazer Login</CardTitle>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400">
                Acesse sua conta para gerenciar pedidos e boletos
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Email
                  </Label>
                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.995 }}
                  >
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="seu@email.com"
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                      className={`h-14 pl-11 pr-4 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950
                        ${focusedField === "email"
                          ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Lock className="h-4 w-4 text-blue-600" />
                      Senha
                    </Label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePremiumClick}
                      className="group relative px-3 py-1.5 rounded-lg text-xs font-medium overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-blue-500/20" />
                      <div className="relative flex items-center gap-1.5">
                        <span className="text-blue-600 dark:text-blue-300 ">Esqueceu a senha?</span>
                        <Crown className="h-3 w-3 text-blue-600 dark:text-blue-500" />
                      </div>
                      <div className="absolute inset-0 border border-indigo-200 dark:border-blue-800/50 rounded-lg" />
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                        <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Crown className="h-3 w-3 text-amber-400" />
                            <span>Recurso Premium</span>
                          </div>
                          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 dark:bg-slate-800" />
                        </div>
                      </div>
                    </motion.button>
                  </div>

                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.995 }}
                  >
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Digite sua senha"
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                      className={`h-14 pl-11 pr-12 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950
                        ${focusedField === "password"
                          ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      )}
                    </Button>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full pt-2">
                  <Button
                    type="submit"
                    className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden group"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LogIn className="h-5 w-5" />
                        <span>Acessar Plataforma</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                </motion.div>
              </form>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-medium">
                    Primeiro acesso?
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handlePremiumClick}
                className="group relative w-full h-14 rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] opacity-70" />
                <div className="absolute inset-[2px] rounded-[10px] bg-white dark:bg-slate-900" />
                <div className="relative h-full flex items-center justify-center gap-2 text-base font-semibold">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <Crown className="h-5 w-5 text-blue-600 dark:text-blue-500 group-hover:animate-pulse" />
                    <span>Solicitar Acesso</span>
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              </motion.button>

              <div className="text-center space-y-3 pt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  O cadastro de novos usuários está disponível apenas no plano Premium.
                </p>
                <button
                  onClick={handlePremiumClick}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Saiba mais sobre o Premium
                </button>
              </div>

              <div className="lg:hidden grid grid-cols-2 gap-3 pt-4">
                {features.slice(0, 4).map((feature) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                        <div className="text-white">{feature.icon}</div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100">{feature.title}</div>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <CustomCardPremium
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl"
                onClick={(e: { stopPropagation: () => any }) => e.stopPropagation()}
              >
                <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent)]" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPremiumModal(false)}
                    className="absolute right-4 top-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm z-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="relative px-8 py-12 flex items-center gap-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                      className="p-5 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl"
                    >
                      <Crown className="h-12 w-12 text-white" />
                    </motion.div>
                    <div className="text-white">
                      <h2 className="text-4xl font-bold mb-2">Premium</h2>
                      <p className="text-lg text-white/90">Desbloqueie todo o potencial da plataforma</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">Recursos Inclusos</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          {
                            icon: Users,
                            title: "Usuários ilimitados",
                            description: "Adicione toda equipe",
                            color: "from-blue-500 to-cyan-500",
                          },
                          {
                            icon: Zap,
                            title: "Suporte 24/7",
                            description: "Atendimento prioritário",
                            color: "from-amber-500 to-orange-500",
                          },
                          {
                            icon: Shield,
                            title: "Recursos avançados",
                            description: "Todas funcionalidades",
                            color: "from-purple-500 to-pink-500",
                          },
                          {
                            icon: BarChart3,
                            title: "Relatórios detalhados",
                            description: "Análises profundas",
                            color: "from-green-500 to-emerald-500",
                          },
                        ].map((benefit, index) => (
                          <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                            className="group relative p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 overflow-hidden"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <div className={`relative p-2 rounded-lg bg-gradient-to-br ${benefit.color} shadow-lg w-fit mb-3`}>
                              <benefit.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="relative">
                              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{benefit.title}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{benefit.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-blue-200 dark:border-amber-900/50 overflow-hidden"
                        >
                          <div className="absolute top-4 right-4">
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white text-xs font-bold shadow-lg">
                              POPULAR
                            </div>
                          </div>
                          <div className="relative">
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">R$ 99</span>
                              <span className="text-xl text-slate-600 dark:text-slate-400">/mês</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                              Cancele quando quiser • Sem taxa de setup
                            </p>
                            <div className="space-y-2">
                              {["Sem limite de usuários", "Suporte prioritário", "Todas as funcionalidades"].map(
                                (item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      <div className="space-y-3 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                        >
                          <div className="relative flex items-center justify-center gap-2">
                            <Crown className="h-5 w-5" />
                            <span>Fazer Upgrade para Premium</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.button>
                        <Button
                          variant="ghost"
                          onClick={() => setShowPremiumModal(false)}
                          className="w-full h-12 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          Talvez mais tarde
                        </Button>
                        <div className="pt-2 text-center">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <Shield className="inline h-3 w-3 mr-1" />
                            Pagamento seguro • Garantia de 30 dias
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CustomCardPremium>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}