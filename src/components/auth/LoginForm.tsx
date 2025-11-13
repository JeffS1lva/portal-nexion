import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  UserPlus,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- ADICIONADO

export function LoginPage() {
  const navigate = useNavigate(); // <-- ADICIONADO

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [_mouseX, setMouseX] = useState(0);
  const [_mouseY, setMouseY] = useState(0);
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // Mouse tracking para efeito parallax
  useEffect(() => {
    const handleMouseMove = (e: { clientX: React.SetStateAction<number>; clientY: React.SetStateAction<number>; }) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const API_URL = "/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ← ESSENCIAL para cookies/sessão
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login falhou");

      // SALVA NO localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      // DISPARA EVENTO
      window.dispatchEvent(new Event("authStateChange"));

      // REDIRECIONA
      navigate("/inicio", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validação básica
    if (!firstName || !lastName || !email || !password) {
      setError("Todos os campos são obrigatórios");
      setLoading(false);
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      setSuccess("Cadastro realizado com sucesso! Faça login.");

      // Limpa os campos após sucesso
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      // Opcional: troca para aba de login após 2s
      setTimeout(() => {
        setActiveTab("login");
        setSuccess(null);
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <motion.div
          className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-0 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-rose-400/20 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 cursor-pointer"
            >
              <motion.div
                className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Package className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Portal Nexion
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 leading-tight"
            >
              Gerencie seu negócio com{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                inteligência
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              Plataforma completa para controle de pedidos, boletos e rastreamento de entregas em tempo real.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group relative p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  whileHover={{ scale: 1.1 }}
                />
                <div className="relative flex items-start gap-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1.5 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center gap-6 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            {[
              { icon: CheckCircle, value: "99.9%", label: "Uptime", color: "from-green-500 to-emerald-600" },
              { icon: Clock, value: "24/7", label: "Suporte", color: "from-cyan-500 to-blue-600" },
              { icon: Sparkles, value: "5000+", label: "Empresas", color: "from-purple-500 to-indigo-600" },
            ].map((stat, index) => (
              <React.Fragment key={stat.label}>
                {index > 0 && <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />}
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`p-2.5 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
                    animate={floatingAnimation}
                    transition={{ delay: index * 0.2 }}
                  >
                    <stat.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.div
                      className="text-2xl font-bold text-slate-900 dark:text-slate-100"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Login/Register form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full"
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => setIsHoveringCard(false)}
        >
          <motion.div
            className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden"
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Header */}
            <div className="space-y-4 text-center p-8 pb-6 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
                animate={isHoveringCard ? { scale: 1.1, opacity: 0.8 } : { scale: 1, opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />

              <div className="lg:hidden flex justify-center mb-2 relative z-10">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800"
                  whileHover={{ scale: 1.05 }}
                >
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">Portal de Gestão</span>
                </motion.div>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full border border-blue-200 dark:border-blue-800 mx-auto relative z-10"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                </span>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-slate-900 dark:text-slate-100 relative z-10"
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {activeTab === "login" ? "Fazer Login" : "Criar Conta"}
              </motion.h2>

              <motion.p
                className="text-base text-slate-600 dark:text-slate-400 relative z-10"
                key={`${activeTab}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {activeTab === "login"
                  ? "Acesse sua conta para gerenciar pedidos e boletos"
                  : "Comece agora e gerencie seu negócio com eficiência"}
              </motion.p>
            </div>

            <div className="px-8 pb-8 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {["login", "register"].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all relative ${activeTab === tab
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab === "login" ? "Login" : "Cadastrar"}</span>
                  </motion.button>
                ))}
              </div>

              {/* Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forms */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onSubmit={activeTab === "login" ? handleLogin : handleRegister}
                  className="space-y-4"
                >
                  {activeTab === "register" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {/* First Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-2"
                        >
                          <label className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Users className="h-4 w-4 text-blue-600" />
                            Nome
                          </label>
                          <motion.div
                            className="relative"
                            whileTap={{ scale: 0.995 }}
                          >
                            <input
                              type="text"
                              value={firstName}
                              placeholder="Seu nome"
                              onChange={(e) => setFirstName(e.target.value)}
                              onFocus={() => setFocusedField("firstName")}
                              onBlur={() => setFocusedField(null)}
                              disabled={loading}
                              required
                              className={`w-full h-14 pl-11 pr-4 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950 outline-none ${focusedField === "firstName"
                                ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                            />
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </motion.div>
                        </motion.div>

                        {/* Last Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="space-y-2"
                        >
                          <label className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Users className="h-4 w-4 text-blue-600" />
                            Sobrenome
                          </label>
                          <motion.div
                            className="relative"
                            whileTap={{ scale: 0.995 }}
                          >
                            <input
                              type="text"
                              value={lastName}
                              placeholder="Seu sobrenome"
                              onChange={(e) => setLastName(e.target.value)}
                              onFocus={() => setFocusedField("lastName")}
                              onBlur={() => setFocusedField(null)}
                              disabled={loading}
                              required
                              className={`w-full h-14 pl-11 pr-4 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950 outline-none ${focusedField === "lastName"
                                ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                            />
                            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: activeTab === "register" ? 0.2 : 0.1 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Mail className="h-4 w-4 text-blue-600" />
                      Email
                    </label>
                    <motion.div
                      className="relative"
                      whileTap={{ scale: 0.995 }}
                    >
                      <input
                        type="email"
                        value={email}
                        placeholder="seu@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        required
                        className={`w-full h-14 pl-11 pr-4 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950 outline-none ${focusedField === "email"
                          ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    </motion.div>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: activeTab === "register" ? 0.25 : 0.15 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                        <Lock className="h-4 w-4 text-blue-600" />
                        Senha
                      </label>
                      {activeTab === "login" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setShowPremiumModal(true)}
                          className="group relative px-3 py-1.5 rounded-lg text-xs font-medium overflow-hidden cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                          <div className="relative flex items-center gap-1.5">
                            <span className="text-blue-600 dark:text-blue-300">Esqueceu a Senha?</span>
                            <Crown className="h-3 w-3 text-blue-600" />
                          </div>
                        </motion.button>
                      )}
                    </div>
                    <motion.div
                      className="relative"
                      whileTap={{ scale: 0.995 }}
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Digite sua senha"
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        required
                        className={`w-full h-14 pl-11 pr-12 text-base transition-all duration-300 border-2 rounded-xl bg-white dark:bg-slate-950 outline-none ${focusedField === "password"
                          ? "border-blue-500 dark:border-blue-600 ring-4 ring-blue-500/10 shadow-lg shadow-blue-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div
                          initial={false}
                          animate={{ rotate: showPassword ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          )}
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: activeTab === "register" ? 0.3 : 0.2 }}
                    className="pt-2"
                  >
                    <motion.button
                      type="submit"
                      className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                      disabled={loading}
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>{activeTab === "login" ? "Entrando..." : "Cadastrando..."}</span>
                        </div>
                      ) : (
                        <motion.div
                          className="flex items-center justify-center gap-2 "
                          whileHover={{ x: 5 }}
                        >
                          {activeTab === "login" ? (
                            <>
                              <LogIn className="h-5 w-5" />
                              <span>Acessar Plataforma</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-5 w-5" />
                              <span>Criar Conta</span>
                            </>
                          )}
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </motion.div>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        style={{ transform: "skewX(-12deg)" }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.form>
              </AnimatePresence>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <motion.div
                  className="relative flex justify-center text-xs uppercase"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-medium">
                    {activeTab === "login" ? "Primeiro acesso?" : "Já tem uma conta?"}
                  </span>
                </motion.div>
              </div>

              {/* Switch Tab Button */}
              <motion.button
                type="button"
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                className="group relative w-full h-14 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 100%" }}
                />
                <div className="absolute inset-[2px] rounded-[10px] bg-white dark:bg-slate-900" />
                <div className="relative h-full flex items-center justify-center gap-2 text-base font-semibold">
                  <motion.div
                    className="flex items-center gap-2 text-slate-900 dark:text-slate-100"
                    whileHover={{ scale: 1.05 }}
                  >
                    {activeTab === "login" ? (
                      <>
                        <motion.div
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                        </motion.div>
                        <span>Criar Conta</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ x: [-2, 2, -2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <LogIn className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                        </motion.div>
                        <span>Fazer Login</span>
                      </>
                    )}
                    <Zap className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                  </motion.div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ transform: "skewX(-12deg)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                />
              </motion.button>

              {/* Footer Info */}
              <motion.div
                className="text-center space-y-3 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {activeTab === "login"
                    ? "O cadastro de novos usuários está disponível para todos os planos."
                    : "Já possui uma conta? Faça login para acessar a plataforma."}
                </p>
                <motion.button
                  onClick={() => setShowPremiumModal(true)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
                  Saiba mais sobre o Premium
                </motion.button>
              </motion.div>

              {/* Mobile Features Grid */}
              <motion.div
                className="lg:hidden grid grid-cols-2 gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex justify-center mb-2">
                      <motion.div
                        className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </motion.div>
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                      {feature.title}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
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
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl"
                layoutId="premium-card"
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

                  <motion.button
                    onClick={() => setShowPremiumModal(false)}
                    className="absolute right-4 top-4 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm z-10 w-10 h-10 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.button>

                  <div className="relative px-8 py-12 flex items-center gap-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
                      className="p-5 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl"
                    >
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown className="h-12 w-12 text-white" />
                      </motion.div>
                    </motion.div>
                    <div className="text-white">
                      <motion.h2
                        className="text-4xl font-bold mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Premium
                      </motion.h2>
                      <motion.p
                        className="text-lg text-white/90"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Desbloqueie todo o potencial da plataforma
                      </motion.p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        Recursos Inclusos
                      </h3>
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
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="group relative p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 overflow-hidden cursor-pointer"
                          >
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                            />
                            <motion.div
                              className={`relative p-2 rounded-lg bg-gradient-to-br ${benefit.color} shadow-lg w-fit mb-3`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <benefit.icon className="h-4 w-4 text-white" />
                            </motion.div>
                            <div className="relative">
                              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                                {benefit.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {benefit.description}
                              </p>
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
                          className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-900/50 overflow-hidden"
                        >
                          <motion.div
                            className="absolute top-4 right-4"
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white text-xs font-bold shadow-lg flex items-center gap-1">
                              <Star className="h-3 w-3" fill="currentColor" />
                              POPULAR
                            </div>
                          </motion.div>
                          <div className="relative">
                            <div className="flex items-baseline gap-2 mb-3">
                              <motion.span
                                className="text-5xl font-bold text-slate-900 dark:text-slate-100"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.6 }}
                              >
                                R$ 99
                              </motion.span>
                              <span className="text-xl text-slate-600 dark:text-slate-400">/mês</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                              Cancele quando quiser • Sem taxa de setup
                            </p>
                            <div className="space-y-2">
                              {[
                                "Sem limite de usuários",
                                "Suporte prioritário",
                                "Todas as funcionalidades",
                              ].map((item, i) => (
                                <motion.div
                                  key={i}
                                  className="flex items-center gap-2"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.7 + i * 0.1 }}
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  </motion.div>
                                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="space-y-3 mt-6">
                        <motion.button
                          className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group"
                          whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(139, 92, 246, 0.5)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative flex items-center justify-center gap-2">
                            <Crown className="h-5 w-5" />
                            <span>Fazer Upgrade para Premium</span>
                          </div>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            style={{ transform: "skewX(-12deg)" }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                          />
                        </motion.button>

                        <motion.button
                          onClick={() => setShowPremiumModal(false)}
                          className="w-full h-12 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Talvez mais tarde
                        </motion.button>

                        <motion.div
                          className="pt-2 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                            <Shield className="h-3 w-3" />
                            Pagamento seguro • Garantia de 30 dias
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

  );
}