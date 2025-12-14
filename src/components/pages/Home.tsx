import { useState } from "react";
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
  ShoppingBag,
  ScanBarcode,
  Truck,
  ArrowRight,
  MessageCircleMore,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  Award,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  description: string;
  gradient: string;
  stats: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: any;
  label: string;
  gradient: string;
}

interface FeatureCard {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface InitProps {
  authData?: {
    name: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

export function Init({ authData }: InitProps) {
  const [_hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [_hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const user = authData ?? { name: "Usuário", firstName: "", lastName: "" };


  const navigationItems: NavigationItem[] = [

    {
      title: "Meus Pedidos",
      url: "/pedidos",
      icon: ShoppingBag,
      description:
        "Gerencie todos os seus pedidos com rastreamento completo, histórico detalhado e atualizações automáticas",
      gradient: "from-blue-500 to-cyan-500",
      stats: "Gestão Total",
    },
    {
      title: "Boletos",
      url: "/boletos",
      icon: ScanBarcode,
      description:
        "Acesse, emita e acompanhe pagamentos com segurança máxima, histórico completo e notificações",
      gradient: "from-emerald-500 to-teal-500",
      stats: "Financeiro",
    },
    {
      title: "Rastreamento",
      url: "/rastreio-pedidos",
      icon: Truck,
      description:
        "Monitore entregas em tempo real com GPS, previsões precisas e notificações de status automáticas",
      gradient: "from-violet-500 to-purple-500",
      stats: "Tempo Real",
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: TrendingUp,
      description:
        "Visualize métricas, estatísticas e indicadores de desempenho em tempo real com gráficos interativos",
      gradient: "from-indigo-500 to-purple-500",
      stats: "Visão Geral",
    },
  ];

  const features: FeatureCard[] = [
    {
      icon: TrendingUp,
      title: "Alta Performance",
      description:
        "Sistema otimizado para máxima velocidade com carregamento instantâneo e resposta em tempo real",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description:
        "Proteção avançada com criptografia de ponta a ponta, SSL e conformidade com LGPD",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Suporte 24/7",
      description:
        "Atendimento contínuo com tempo de resposta garantido e equipe especializada sempre disponível",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Award,
      title: "Qualidade Premium",
      description:
        "Certificações ISO, padrões internacionais e compromisso com excelência operacional",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "Telefone",
      url: "tel:11999999999",
      icon: Phone,
      label: "(11) 9 0000-9999",
      gradient: "from-gray-700 to-gray-900",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/5511999999999",
      icon: MessageCircleMore,
      label: "WhatsApp",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      name: "Instagram",
      url: "",
      icon: Instagram,
      label: "Instagram",
      gradient: "from-purple-600 via-pink-600 to-orange-500",
    },
    {
      name: "Email",
      url: "",
      icon: Mail,
      label: "E-mail",
      gradient: "from-red-500 to-rose-600",
    },
    {
      name: "LinkedIn",
      url: "",
      icon: Linkedin,
      label: "LinkedIn",
      gradient: "from-blue-600 to-blue-800",
    },
    {
      name: "YouTube",
      url: "",
      icon: Youtube,
      label: "YouTube",
      gradient: "from-red-600 to-red-800",
    },
  ];

  return (
    <div className="w-full min-h-screen overflow-hidden">
      {/* Floating orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="mb-20">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl mb-12">
            <div className="absolute -inset-1 bg-gradient-to-bl from-indigo-900 to-zinc-900/80 rounded-3xl blur-lg opacity-20" />
            <div className="relative bg-gradient-to-bl from-indigo-900 to-zinc-900 p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full" />
                <div className="absolute top-20 right-32 w-20 h-20 border-2 border-white rounded-full" />
                <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-white rounded-full" />
              </div>

              <div className="relative">
                <div className="max-w-full">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                          Seja Bem-Vindo ao Nexion, {user.name.split(" ") [0] }!
                        </span>
                      </div>

                      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                        Tudo que você precisa,
                        <br />
                        <span className="text-white/90">em um só lugar</span>
                      </h1>

                      <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                        Gerencie pedidos, pagamentos e rastreamentos com eficiência
                        e praticidade. Tenha controle total das suas operações com
                        ferramentas inteligentes e intuitivas.
                      </p>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        <a
                          href="/pedidos"
                          className="group inline-flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-indigo-600 font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          <span>Ver Pedidos</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <Link
                          to="/dashboard"
                          className="group inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-bold transition-all duration-300 border-2 border-white/30"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                      </div>
                    </div>

                    {/* Right Stats */}
                    <div className="lg:w-80">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 px-6 py-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/25 transition-all duration-300 group">
                          <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-3xl font-black text-white">
                              100%
                            </div>
                            <div className="text-sm text-white/80 font-medium">
                              Ambiente Seguro
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/25 transition-all duration-300 group">
                          <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-3xl font-black text-white">
                              24/7
                            </div>
                            <div className="text-sm text-white/80 font-medium">
                              Suporte Disponível
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/25 transition-all duration-300 group">
                          <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-3xl font-black text-white">
                              Premium
                            </div>
                            <div className="text-sm text-white/80 font-medium">
                              Qualidade Garantida
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative"
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition duration-500`}
                />
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1">
                  <div
                    className={`inline-flex p-3 bg-gradient-to-br ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full mb-4 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Dashboard Principal
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
              Acesso Rápido
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Navegue pelas principais funcionalidades da plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.url}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative block"
              >
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition duration-500`}
                />
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3 overflow-hidden min-h-80">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  {/* Stats badge */}
                  <div className="absolute top-6 right-6">
                    <div className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {item.stats}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`inline-flex p-5 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <item.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-base">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white font-bold transition-colors duration-300">
                    <span className="text-lg">Acessar</span>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div
                    className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-500`}
                  />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-600/10 dark:to-purple-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 dark:from-indigo-600/10 dark:to-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-indigo-400/10 dark:from-purple-600/10 dark:to-indigo-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-full mb-4 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Suporte Dedicado
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
                  Conecte-se Conosco
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Escolha o canal ideal para sua necessidade
                </p>
              </div>

              {/* Social Links Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : "_self"}
                    rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                    className="group relative"
                  >
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${link.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition duration-500`}
                    />
                    <div
                      className={`relative bg-gradient-to-br ${link.gradient} text-white p-6 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-2xl flex flex-col items-center justify-center gap-3 min-h-32`}
                    >
                      <link.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold text-sm text-center leading-tight">
                        {link.label}
                      </span>
                      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                {[
                  {
                    icon: Clock,
                    title: "Horário de Atendimento",
                    content: "Segunda a Quinta: 08h às 18h\nSexta-feira: 08h às 17h",
                    gradient: "from-indigo-500 to-purple-500",
                  },
                  {
                    icon: Users,
                    title: "Cobertura Regional",
                    content: "Atendemos São Paulo e Santo André com excelência",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    icon: Award,
                    title: "Suporte Técnico",
                    content:
                      "Assistência especializada para integrações e customizações",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                ].map((info, index) => (
                  <div
                    key={index}
                    className="group text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`inline-flex p-3 bg-gradient-to-br ${info.gradient} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                      {info.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}