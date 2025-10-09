import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MessageCircleMore,
} from "lucide-react";
import { motion } from "framer-motion";

interface ImageData {
  url: string;
  title: string;
  subtitle: string;
  badge: string;
  link: string;
}

interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  description: string;
  accent: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: any;
  label: string;
  bg: string;
}

// Carousel Component com largura completa
const MobileCarousel: React.FC<{
  images: ImageData[];
  onSlideChange: (index: number) => void;
  currentSlide: number;
}> = ({ images, onSlideChange, currentSlide }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onSlideChange((currentSlide + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSlide, images.length, onSlideChange]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      onSlideChange((currentSlide + 1) % images.length);
    }
    if (isRightSwipe) {
      onSlideChange((currentSlide - 1 + images.length) % images.length);
    }
  };

  const nextSlide = () => {
    onSlideChange((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    onSlideChange((currentSlide - 1 + images.length) % images.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 rounded-2xl  shadow-2xl">
      {/* Main carousel container */}
      <div
        ref={containerRef}
        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[40rem] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images container */}
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Badge overlay */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/95 backdrop-blur-sm text-gray-800 border border-white/30 shadow-lg">
                  {image.badge}
                </span>
              </div>

              {/* Content overlay */}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all duration-200 z-10 border border-white/20"
          aria-label="Imagem anterior"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all duration-200 z-10 border border-white/20"
          aria-label="Próxima imagem"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/10 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full hover:bg-white/20 transition-all duration-200 z-10 border border-white/20"
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-8 sm:w-10 h-2 bg-white shadow-lg"
                : "w-2 h-2 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-blue-500 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / images.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

// Main Component
export function Init() {
  const images: ImageData[] = [
    {
      url: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Clorexidina Polarfix",
      subtitle:
        "Eficácia comprovada no controle de infecções hospitalares com tecnologia avançada",
      badge: "Developer",
      link: "https://polarfix.com.br/",
    },
    {
      url: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Curativos Premium Polarfix",
      subtitle:
        "Tecnologia e conforto para uma recuperação segura e eficiente em todos os procedimentos",
      badge: "Technology ",
      link: "https://polarfix.com.br/",
    },
    {
      url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Esterilização de Alto Nível",
      subtitle:
        "Soluções confiáveis para ambientes clínicos exigentes com máxima segurança",
      badge: "Startup",
      link: "https://polarfix.com.br/",
    },
    {
      url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Proteção Antisséptica Polarfix",
      subtitle:
        "Máxima segurança microbiológica para sua instituição com resultados comprovados",
      badge: "Social Networks",
      link: "https://polarfix.com.br/",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const navigationItems: NavigationItem[] = [
    {
      title: "Meus Pedidos",
      url: "/pedidos",
      icon: ShoppingBag,
      description: "Visualize e gerencie seus pedidos",
      accent: "bg-blue-500",
    },
    {
      title: "Boletos",
      url: "/boletos",
      icon: ScanBarcode,
      description: "Visualize e Acompanhe seus pagamentos",
      accent: "bg-emerald-500",
    },
    {
      title: "Rastreamento",
      url: "/rastreio-pedidos",
      icon: Truck,
      description: "Acompanhe processos de suporte e entregas",
      accent: "bg-violet-500",
    },
  ];

  const [_cardAnimations, setCardAnimations] = useState<boolean[]>(
    navigationItems.map(() => false)
  );

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    navigationItems.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCardAnimations((prev) => {
          const newAnimations = [...prev];
          newAnimations[index] = true;
          return newAnimations;
        });
      }, index * 200);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const socialLinks: SocialLink[] = [
    {
      name: "Telefone",
      url: "tel:11999999999",
      icon: Phone,
      label: "(11) 9 0000-9999",
      bg: "bg-gray-700 hover:bg-gray-800",
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/5511999999999",
      icon: MessageCircleMore,
      label: "WhatsApp",
      bg: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Instagram",
      url: "",
      icon: Instagram,
      label: "Instagram",
      bg: "bg-slate-600 hover:bg-slate-700",
    },
    {
      name: "Email",
      url: "",
      icon: Mail,
      label: "E-mail",
      bg: "bg-red-500 hover:bg-red-600",
    },
    {
      name: "LinkedIn",
      url: "",
      icon: Linkedin,
      label: "LinkedIn",
      bg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "YouTube",
      url: "",
      icon: Youtube,
      label: "YouTube",
      bg: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Carousel Section - Largura Completa */}
        <div className="mb-12 lg:mb-16">
          <MobileCarousel
            images={images}
            onSlideChange={setCurrentSlide}
            currentSlide={currentSlide}
          />
        </div>

        {/* Navigation Section */}
        <div className="mb-12 lg:mb-16">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Acesso Rápido
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              Tudo que você precisa em um só lugar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {navigationItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.url}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group"
              >
                {/* Barra superior animada */}
                <motion.div
                  className={`absolute top-0 left-0 right-0 h-1 ${item.accent} rounded-t-2xl`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Conteúdo principal */}
                <div className="flex items-center mb-4">
                  <motion.div
                    className={`${item.accent} p-3 rounded-xl mr-4`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <item.icon size={24} className="text-white" />
                  </motion.div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base hidden md:block">
                  {item.description}
                </p>

                <div className="flex items-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
                  <span className="text-sm font-medium">Acessar</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8 lg:mb-12">
            <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fale Conosco
            </h4>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Estamos sempre prontos para atendê-lo
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-8 lg:mb-12">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : "_self"}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                className={`${link.bg} text-white p-4 lg:p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center gap-2 min-h-20 sm:min-h-24`}
              >
                <link.icon size={20} className="lg:w-6 lg:h-6" />
                <span className="font-medium text-xs sm:text-sm text-center leading-tight">
                  {link.label}
                </span>
              </a>
            ))}
          </div>

          {/* Additional Info */}
          <div className="pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg">
                  Atendimento ao Cliente
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Segunda a quinta-feira: 08h às 18h
                  <br />
                  Sexta-feira: 08h às 17h
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg">
                  Regiões de Atendimento
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Atendemos São Paulo e Santo André
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-base sm:text-lg">
                  Suporte Especializado
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Assistência técnica dedicada para integrações e customizações
                  de software
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
