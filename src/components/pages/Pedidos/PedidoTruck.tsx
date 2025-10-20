import { useState, useEffect, type ReactNode } from "react";
import {
  Clock,
  Headphones,
  MessageCircle,
  Calendar,
  Sparkles,
  Search,
  FileText,
  AlertTriangle,
  RefreshCw,
  Info,
  ChevronRight,
  BadgeAlert,
  UserCheck,
  Zap,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useNavigate } from "react-router-dom";


// Interfaces
interface Pedido {
  grupo: string;
  filial: string;
  codigoTransportadora: string;
  nomeTransportadora: string | null;
  estado: string;
  codigoDoCliente: string;
  nomeCliente: string;
  numeroPedido: string;
  dataLancamentoPedido: string;
  dataParaEntrega: string;
  statusDoPedido: string;
  dataPicking: string;
  statusPicking: string;
  notaFiscal: string;
  chaveNFe: string;
  statusNotaFiscal?: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface SupportStep {
  id: SupportStatus;
  label: string;
  description: ReactNode;
  icon: React.ReactNode;
  date?: string;
  isActive: boolean;
  isCompleted: boolean;
}

type SupportStatus =
  | "ticket_criado"
  | "atribuido_suporte"
  | "em_analise"
  | "resolvido";

const generateFictionalPedidos = (): Pedido[] => {
  const statusesPedido = ["Novo", "Em Análise", "Aguardando Cliente", "Resolvido"];
  const statusesPicking = ["Aberto", "Em Progresso", "Fechado", "Cancelado"];
  const statusesNotaFiscal = ["Aberto", "Em Análise", "Resolvido"];

  const nomes = [
    "TechNova Softwares Ltda",
    "DigitalFlow Soluções SA",
    "CodeMaster Desenvolvimento EIRELI",
    "ByteSolutions ME",
    "SoftPeak Enterprise EPP",
    "InnoTech & Cia",
    "DataWave Importadora Digital",
    "CloudForge Atacado Tech",
    "NetCore Varejo Digital",
    "AlgoRhythm Licenças Ltda",
  ];

  const parceiros = [
    "Técnico João Silva",
    "Analista Maria Santos",
    "Suporte Level 1",
    "Especialista em Cloud",
    "Técnico Oracle",
    "Consultor Salesforce",
    "Equipe Interna",
    "Suporte IBM",
    null,
    "Analista SAP",
  ];

  const estados = ["Baixa", "Média", "Alta", "Crítica", "Urgente"];
  const grupos = ["GRUPO_ENTERPRISE", "GRUPO_STARTUP", "GRUPO_CORPORATE"];
  const filiais = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"];

  const pedidos: Pedido[] = [];

  for (let i = 1; i <= 100; i++) {
    const dataLancamento = new Date();
    dataLancamento.setDate(dataLancamento.getDate() - Math.floor(Math.random() * 365));

    const dataResolucao = new Date(dataLancamento);
    dataResolucao.setDate(dataResolucao.getDate() + Math.floor(Math.random() * 30) + 1);

    const dataAtualizacao = new Date(dataLancamento);
    dataAtualizacao.setDate(dataAtualizacao.getDate() + Math.floor(Math.random() * 7) + 1);

    const chaveNFe = `${Math.floor(Math.random() * 100000000000000000000000000000000000000000000)}`.padStart(44, "0");

    const parceiro = parceiros[Math.floor(Math.random() * parceiros.length)];
    const statusNotaFiscal = statusesNotaFiscal[Math.floor(Math.random() * statusesNotaFiscal.length)];

    pedidos.push({
      grupo: grupos[Math.floor(Math.random() * grupos.length)],
      filial: filiais[Math.floor(Math.random() * filiais.length)],
      codigoTransportadora: parceiro ? `T${String(Math.floor(Math.random() * 999)).padStart(3, "0")}` : "",
      nomeTransportadora: parceiro,
      estado: estados[Math.floor(Math.random() * estados.length)],
      codigoDoCliente: `CLI${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      nomeCliente: nomes[Math.floor(Math.random() * nomes.length)],
      numeroPedido: `TICK${String(i).padStart(6, "0")}`,
      dataLancamentoPedido: format(dataLancamento, "yyyy-MM-dd"),
      dataParaEntrega: format(dataResolucao, "yyyy-MM-dd"),
      statusDoPedido: statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      dataPicking: format(dataAtualizacao, "yyyy-MM-dd"),
      statusPicking: statusesPicking[Math.floor(Math.random() * statusesPicking.length)],
      notaFiscal: `ID${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      chaveNFe: chaveNFe,
      statusNotaFiscal: statusNotaFiscal,
    });
  }

  return pedidos.sort(
    (a, b) =>
      new Date(b.dataLancamentoPedido).getTime() -
      new Date(a.dataLancamentoPedido).getTime()
  );
};

const PedidosTruck = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDateRange, setActiveDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [, setStatusFilter] = useState<string | null>(null);
  const [supportStatus, setSupportStatus] = useState<SupportStatus>("ticket_criado");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const fictionalData = generateFictionalPedidos();
      setAllPedidos(fictionalData);
      await fetchPedidosWithDateRange(activeDateRange.start, activeDateRange.end, fictionalData);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (pedidos.length > 0 && !selectedPedido) {
      setSelectedPedido(pedidos[0]);
      determineSupportStatus(pedidos[0]);
    }
  }, [pedidos]);

  const determineSupportStatus = (pedido: Pedido) => {
    const hoje = new Date();
    const dataResolucao = new Date(pedido.dataParaEntrega);
    if (pedido.statusDoPedido === "Resolvido" || dataResolucao < hoje) {
      setSupportStatus("resolvido");
    } else if (pedido.statusDoPedido === "Em Análise") {
      setSupportStatus("em_analise");
    } else if (pedido.statusPicking === "Em Progresso") {
      setSupportStatus("atribuido_suporte");
    } else {
      setSupportStatus("ticket_criado");
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const fetchPedidosWithDateRange = async (
    startDate: Date,
    endDate: Date,
    allData: Pedido[]
  ) => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setActiveDateRange({ start: startDate, end: endDate });
      const pedidosData = allData.filter((pedido) => {
        const pedidoDate = new Date(pedido.dataLancamentoPedido);
        return pedidoDate >= startDate && pedidoDate <= endDate;
      });

      if (Array.isArray(pedidosData)) {
        const processedData = pedidosData.map((pedido) => ({
          ...pedido,
          numeroPedido: pedido.numeroPedido || "",
          nomeCliente: pedido.nomeCliente || "",
          notaFiscal: pedido.notaFiscal || "",
          chaveNFe: pedido.chaveNFe || "",
          codigoDoCliente: pedido.codigoDoCliente || "",
        }));

        processedData.sort(
          (a, b) => {
            if (!a.dataLancamentoPedido || !b.dataLancamentoPedido) return 0;
            const dataStrA = String(a.dataLancamentoPedido);
            const dataStrB = String(b.dataLancamentoPedido);
            const [yearA, monthA, dayA] = dataStrA.split("-");
            const [yearB, monthB, dayB] = dataStrB.split("-");
            const dataA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA)).getTime();
            const dataB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB)).getTime();
            return dataB - dataA;
          }
        );

        setAllPedidos(allData);
        setPedidos(processedData);
      } else {
        setAllPedidos([]);
        setPedidos([]);
        setError("empty");
      }
      setError(null);
    } catch (err) {
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);
    if (!term) {
      setPedidos(allPedidos);
      return;
    }

    const filtered = allPedidos.filter((pedido) => {
      const numeroPedido = String(pedido.numeroPedido || "").toLowerCase();
      const nomeCliente = String(pedido.nomeCliente || "").toLowerCase();
      const notaFiscal = String(pedido.notaFiscal || "").toLowerCase();
      const chaveNFe = String(pedido.chaveNFe || "").toLowerCase();
      const codigoDoCliente = String(pedido.codigoDoCliente || "").toLowerCase();
      return (
        numeroPedido === term ||
        numeroPedido.includes(term) ||
        nomeCliente.includes(term) ||
        notaFiscal.includes(term) ||
        chaveNFe.includes(term) ||
        codigoDoCliente.includes(term)
      );
    });

    setPedidos(filtered);
    if (selectedPedido && !filtered.some((p) => p.numeroPedido === selectedPedido.numeroPedido)) {
      setSelectedPedido(filtered.length > 0 ? filtered[0] : null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data indisponível";
    }
  };

  const formatDateOnly = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data indisponível";
    }
  };

  const getSupportSteps = (status: SupportStatus, pedido: Pedido): SupportStep[] => {
    const formatAnaliseDescription = (): React.ReactNode => {
      return (
        <>
          Seu ticket está sendo analisado pela equipe de suporte.
          <Card className="bg-slate-200 dark:bg-sidebar-accent mt-6 sm:mt-10">
            <CardContent className="p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-3 text-red-600 dark:text-red-500">
                <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                  <BadgeAlert size={14} />
                </span>
                <div>
                  <p className="inline text-xs sm:text-sm">
                    Caso precise de mais informações ou atualizações, entre em{" "}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"bottomTrucker"}
                        className="border-0 p-0 h-auto inline text-xs sm:text-sm"
                      >
                        <a
                          href="https://mail.google.com/mail/?view=cm&fs=1&to=suporte@software.com&cc=suporte@software.com&su=Dúvida%20sobre%20Ticket%20de%20Suporte&body=Olá%20equipe%20de%20Suporte%2C%0A%0AGostaria%20de%20obter%20informações%20sobre%20o%20meu%20ticket.%0A%0ADados%20do%20ticket%3A%0A-%20Número%20do%20ticket%3A%0A-%20Data%20de%20abertura%3A%0A%0AFico%20no%20aguardo%20do%20retorno.%0A%0AAtenciosamente%2C%0A"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:underline-offset-2"
                          title="Enviar email"
                        >
                          contato.
                        </a>
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    };

    return [
      {
        id: "ticket_criado",
        label: "Ticket Criado",
        description: "Seu ticket de suporte foi registrado e está na fila inicial",
        icon: <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><MessageCircle size={14} /></span>,
        date: pedido.dataLancamentoPedido ? formatDate(pedido.dataLancamentoPedido) : undefined,
        isActive: status === "ticket_criado",
        isCompleted: ["ticket_criado", "atribuido_suporte", "em_analise", "resolvido"].includes(status),
      },
      {
        id: "atribuido_suporte",
        label: "Atribuído ao Suporte",
        description: "Seu ticket foi atribuído a um técnico especializado",
        icon: <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><UserCheck size={14} /></span>,
        isActive: status === "atribuido_suporte",
        isCompleted: ["atribuido_suporte", "em_analise", "resolvido"].includes(status),
      },
      {
        id: "em_analise",
        label: "Análise em Andamento",
        description: formatAnaliseDescription(),
        icon: <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><Zap size={14} /></span>,
        isActive: status === "em_analise",
        isCompleted: ["em_analise", "resolvido"].includes(status),
      },
      {
        id: "resolvido",
        label: "Resolvido",
        description: "Seu ticket foi resolvido com sucesso",
        icon: <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><Headphones size={14} /></span>,
        date: pedido.dataParaEntrega ? formatDate(pedido.dataParaEntrega) : undefined,
        isActive: status === "resolvido",
        isCompleted: true,
      },
    ];
  };

  const StatusBadge = ({ text, type }: { text: string; type: "success" | "info" | "pending" | "default" | "warning" }) => {
    const styles = {
      success: "bg-green-100 text-green-800 border-green-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      warning: "bg-orange-100 text-orange-800 border-orange-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`${styles[type]} text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full border touch-target`}
      >
        {text}
      </span>
    );
  };

  const InfoItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => {
    return (
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors dark:bg-sidebar dark:border">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm text-blue-600">
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium dark:text-gray-500">
            {label}
          </div>
          <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-300 truncate">
            {value}
          </div>
        </div>
      </div>
    );
  };

  const PedidoListItem = React.memo(({ pedido, isSelected, onClick }: { pedido: Pedido; isSelected: boolean; onClick: () => void }) => {
    const getStatusInfo = (pedido: Pedido) => {
      if (pedido.statusDoPedido === "Resolvido") {
        return { text: "Resolvido", type: "success" as const };
      } else if (pedido.statusDoPedido === "Em Análise") {
        return { text: "Em Análise", type: "info" as const };
      } else if (pedido.statusPicking === "Em Progresso") {
        return { text: "Em Progresso", type: "pending" as const };
      } else {
        return { text: "Novo", type: "default" as const };
      }
    };
    const status = getStatusInfo(pedido);

    return (
      <div
        className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-sidebar-accent touch-target ${
          isSelected ? "bg-zinc-100 border-l-4 border-l-blue-500 dark:bg-sidebar-accent dark:border-l-blue-500" : ""
        }`}
        onClick={onClick}
        role="listitem"
        aria-selected={isSelected}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-zinc-100 truncate">
              Ticket: {pedido.numeroPedido}
            </div>
            <div>
              {pedido.notaFiscal ? (
                <span className="flex text-sm font-medium text-gray-900 dark:text-zinc-100">
                  ID: #{pedido.notaFiscal}
                </span>
              ) : (
                <span className="flex text-xs sm:text-sm font-medium text-red-500 bg-red-100 px-2 mt-1 rounded-sm">
                  ID ainda não gerado
                </span>
              )}
            </div>
          </div>
          <StatusBadge text={status.text} type={status.type} />
        </div>
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 mb-1 truncate">
          {pedido.nomeCliente}
        </div>
        <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
              <Calendar size={12} />
            </span>
            {formatDateOnly(pedido.dataLancamentoPedido)}
          </div>
          <div className="flex items-center gap-1">
            <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    );
  });

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-4 sm:p-6 text-center">
      <span className="icon-wrapper w-9 h-9 sm:w-12 sm:h-12">
        <Headphones size={36} />
      </span>
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-600 mb-2">
        Nenhum ticket encontrado
      </h3>
      <p className="text-sm text-gray-500 max-w-xs sm:max-w-md">
        Não encontramos tickets de suporte com esses dados. Tente buscar pelo número do Ticket, ID ou Nome do Cliente.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors touch-target"
        onClick={() => {
          setSearchTerm("");
          setStatusFilter(null);
          setPedidos(allPedidos);
        }}
        aria-label="Tentar novamente"
      >
        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
          <RefreshCw size={12} />
        </span>
        Tentar novamente
      </button>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-4 sm:p-6 text-center">
      <span className="icon-wrapper w-9 h-9 sm:w-12 sm:h-12">
        <AlertTriangle size={36} />
      </span>
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
        Erro ao carregar tickets
      </h3>
      <p className="text-sm text-gray-500 max-w-xs sm:max-w-md">
        Ocorreu um erro ao tentar carregar os tickets de suporte. Por favor, tente novamente mais tarde.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors touch-target"
        onClick={() => fetchPedidosWithDateRange(activeDateRange.start, activeDateRange.end, allPedidos)}
        aria-label="Tentar novamente"
      >
        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
          <RefreshCw size={12} />
        </span>
        Tentar novamente
      </button>
    </div>
  );

  const SkeletonList = () => (
    <div className="divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="p-3 sm:p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 mb-2" />
              <Skeleton className="h-3 sm:h-4 w-32 sm:w-48" />
            </div>
            <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mb-2" />
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-3 w-20 sm:w-24" />
            <Skeleton className="h-3 w-12 sm:w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonDetails = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg">
            <Skeleton className="h-8 sm:h-10 w-8 sm:w-10 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24 sm:w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full relative">
        <div className="flex flex-col relative z-10">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-6 sm:mb-8 flex flex-col items-start">
              <Skeleton className="h-16 sm:h-20 w-16 sm:w-20 rounded-full" />
              <div className="ml-2 mt-4 flex-1">
                <Skeleton className="h-4 w-20 sm:w-24 mb-1" />
                <Skeleton className="h-3 w-48 sm:w-64 mb-2" />
                <Skeleton className="h-3 w-24 sm:w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-sidebar dark:border-accent rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-4 sm:mb-5" />
        <div className="space-y-4 sm:space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <Skeleton className="h-4 w-20 sm:w-24" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16 sm:w-20" />
                  <Skeleton className="h-3 w-12 sm:w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12 sm:w-16" />
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-4 bg-white dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden">
            <Skeleton className="h-20 sm:h-24 w-full" />
            <Skeleton className="h-10 sm:h-12 w-[calc(100%-2rem)] mx-4 my-3 sm:my-4 rounded-lg" />
            <SkeletonList />
          </div>
          <div className="md:col-span-8">
            <div className="w-full rounded-xl shadow-xl overflow-hidden">
              <Skeleton className="h-20 sm:h-24 w-full" />
              <SkeletonDetails />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPedido) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden">
        <div className="w-full bg-gradient-to-r from-sky-800 to-zinc-900 py-4 sm:py-6 px-4 sm:px-8">
          <h2 className="text-white text-lg sm:text-2xl font-bold flex items-center gap-2">
            <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
              <Headphones size={16} />
            </span>
            Meus Tickets de Suporte
          </h2>
        </div>
        {error ? (
          <ErrorState />
        ) : pedidos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-4">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-600">
              Selecione um ticket para visualizar o processo de suporte.
            </p>
          </div>
        )}
      </div>
    );
  }

  const steps = getSupportSteps(supportStatus, selectedPedido);

  return (
    <div className="w-full mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        <div className="md:col-span-4 bg-white dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden">
          <div className="w-full bg-gradient-to-r from-sky-800 to-zinc-900 dark:from-sky-900 dark:to-zinc-900 py-3 sm:py-4 px-4 sm:px-6">
            <h2 className="text-white text-base sm:text-xl font-bold flex items-center gap-2">
              <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                <Headphones size={14} />
              </span>
              Meus Tickets
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              {pedidos.length} tickets encontrados
            </p>
          </div>
          <div className="p-3 sm:p-4 border-b dark:border-b-gray-700 border-gray-200">
            <div className="relative">
              <span className="absolute left-3 top-2.5 sm:top-3 text-gray-400 icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Busque seus tickets..."
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-accent dark:focus:ring-border text-sm sm:text-base touch-target"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Buscar tickets"
              />
            </div>
          </div>
          <div className="overflow-y-auto scrollbar max-h-[calc(100vh-12rem)] sm:max-h-[calc(100vh-14rem)]">
            {error ? (
              <ErrorState />
            ) : pedidos.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-gray-100" role="list">
                {pedidos.map((pedido, index) => (
                  <PedidoListItem
                    key={`${pedido.numeroPedido}-${index}`}
                    pedido={pedido}
                    isSelected={selectedPedido?.numeroPedido === pedido.numeroPedido}
                    onClick={() => {
                      setSelectedPedido(pedido);
                      determineSupportStatus(pedido);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-8">
          <div className="w-full bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl overflow-hidden">
            <div className="w-full bg-gradient-to-r from-sky-800 to-slate-900 dark:from-sky-900 dark:to-slate-900 py-4 sm:py-6 px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-white text-lg sm:text-2xl font-bold flex items-center gap-2">
                    <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                      <Sparkles size={16} />
                    </span>
                    Processo de Suporte
                  </h2>
                  <p className="text-blue-100 text-sm sm:text-base mt-1">
                    Ticket #{selectedPedido.numeroPedido}
                  </p>
                  <p className="text-blue-100">
                    {selectedPedido.notaFiscal ? (
                      `ID #${selectedPedido.notaFiscal}`
                    ) : (
                      <span className="flex items-center text-xs sm:text-sm font-medium text-red-500 bg-red-200 rounded-sm p-1 w-full max-w-48 sm:max-w-60 mt-1 gap-1">
                        <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                          <BadgeAlert size={14} />
                        </span>
                        ID ainda não gerado
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <StatusBadge
                    text={
                      supportStatus === "resolvido" ? "Resolvido" :
                      supportStatus === "em_analise" ? "Em Análise" :
                      supportStatus === "atribuido_suporte" ? "Atribuído" : "Criado"
                    }
                    type={
                      supportStatus === "resolvido" ? "success" :
                      supportStatus === "em_analise" ? "info" :
                      supportStatus === "atribuido_suporte" ? "pending" : "default"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-white border-b border-gray-100 dark:bg-sidebar dark:border-b-accent">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <InfoItem
                  label="Cliente"
                  value={selectedPedido.nomeCliente}
                  icon={<span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><MessageCircle size={14} /></span>}
                />
                <InfoItem
                  label="Técnico Atribuído"
                  value={selectedPedido.nomeTransportadora || "Pendente Atribuição"}
                  icon={<span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5"><Headphones size={14} /></span>}
                />
              </div>
            </div>
            <div className="flex flex-col dark:bg-sidebar dark:border gap-4 sm:gap-6 p-4 sm:p-8">
              <div className="w-full relative">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                    <Clock size={14} />
                  </span>
                  Progresso do Suporte
                </h3>
                <div className="absolute timeline-connector left-8 sm:left-10 top-12 sm:top-16 w-1 bg-gradient-to-b from-blue-100 to-green-100 rounded-full -translate-x-1/2 z-0"></div>
                <div className="flex flex-col relative z-10">
                  {steps.map((step, index) => (
                    <div key={step.id} className="mb-6 sm:mb-8 last:mb-0 relative timeline-step">
                      {index < steps.length - 1 && (
                        <div className="absolute top-8 sm:top-10 left-16 sm:left-20 right-0 h-1 bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full ${step.isCompleted ? "bg-green-500" : "bg-gray-300"} transition-all duration-500 ease-in-out`}
                            style={{
                              width: step.isCompleted ? "100%" : "0%",
                              background: step.isCompleted ? "linear-gradient(to right, #4ade80, #22d3ee)" : "#e5e7eb",
                            }}
                          ></div>
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <div
                          className={`flex items-center justify-center timeline-icon w-16 sm:w-20 h-16 sm:h-20 rounded-full shrink-0 border-4 shadow-md transition-all duration-300 relative z-10 ${
                            step.isCompleted
                              ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white"
                              : step.isActive
                              ? "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-100 text-white"
                              : "bg-gray-100 border-white dark:border-zinc-300 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="ml-2 mt-3 sm:mt-4 flex-1">
                          <h3
                            className={`font-semibold text-sm sm:text-base ${
                              step.isActive ? "text-blue-700" : step.isCompleted ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p
                            className={`mt-1 text-sm sm:text-base ${
                              step.isActive || step.isCompleted ? "text-gray-700 dark:text-gray-600" : "text-gray-500"
                            }`}
                          >
                            {step.description}
                          </p>
                          {step.date && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                              <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                                <Clock size={12} />
                              </span>
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <div className="bg-white dark:bg-sidebar dark:border-accent rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-5 flex items-center gap-2">
                    <span className="icon-wrapper w-4 h-4 sm:w-5 sm:h-5">
                      <FileText size={14} />
                    </span>
                    Detalhes do Ticket
                  </h3>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-blue-50 dark:bg-sidebar dark:border rounded-lg p-3 sm:p-4 border border-blue-100">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-gray-100 mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                          <Calendar size={12} />
                        </span>
                        Cronograma
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Calendar size={12} />
                            </span>
                            Ticket Criado:
                          </div>
                          <span className="font-medium">{formatDate(selectedPedido.dataLancamentoPedido)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Zap size={12} />
                            </span>
                            Última Atualização:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.dataPicking ? formatDate(selectedPedido.dataPicking) : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`${
                      selectedPedido.notaFiscal ? "bg-green-50 border-green-100 dark:bg-sidebar dark:border" : "bg-gray-50 border-gray-100 dark:bg-sidebar dark:border"
                    } rounded-lg p-3 sm:p-4 border`}>
                      <h4 className={`text-sm font-medium mb-2 sm:mb-3 flex items-center gap-2 ${
                        selectedPedido.notaFiscal ? "text-gray-800 dark:text-gray-500" : "text-gray-600 dark:text-gray-100"
                      }`}>
                        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                          <FileText size={12} />
                        </span>
                        ID do Ticket
                      </h4>
                      {selectedPedido.notaFiscal ? (
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 dark:text-gray-500">Número:</span>
                            <span className="font-medium">{selectedPedido.notaFiscal}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 dark:text-gray-500">Status:</span>
                            <StatusBadge text={selectedPedido.statusNotaFiscal || "Aberto"} type="success" />
                          </div>
                          {selectedPedido.chaveNFe && (
                            <div className="pt-1">
                              <span className="text-sm text-gray-700 dark:text-gray-500">ID Interno:</span>
                              <div className="mt-1 bg-white p-2 rounded border border-green-200 break-all text-xs sm:text-sm text-gray-600">
                                {selectedPedido.chaveNFe}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-3">
                          <span className="icon-wrapper w-5 h-5 sm:w-6 sm:h-6">
                            <AlertTriangle size={20} />
                          </span>
                          <p className="text-sm text-gray-500 text-center">ID ainda não gerado</p>
                        </div>
                      )}
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3 sm:p-4 border border-indigo-100 dark:bg-sidebar dark:border">
                      <h4 className="text-sm font-medium text-indigo-800 dark:text-gray-200 mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                          <Headphones size={12} />
                        </span>
                        Detalhes do Suporte
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Headphones size={12} />
                            </span>
                            Técnico:
                          </div>
                          <span className="font-medium">{selectedPedido.nomeTransportadora || "Pendente Atribuição"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Zap size={12} />
                            </span>
                            Prioridade:
                          </div>
                          <span className="font-medium">{selectedPedido.estado}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Info size={12} />
                            </span>
                            Produto:
                          </div>
                          <span className="font-medium">{selectedPedido.filial}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-100 dark:bg-sidebar dark:border">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-gray-200 mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                          <MessageCircle size={12} />
                        </span>
                        Informações do Solicitante
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <MessageCircle size={12} />
                            </span>
                            Nome:
                          </div>
                          <span className="font-medium">{selectedPedido.nomeCliente}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <FileText size={12} />
                            </span>
                            Código:
                          </div>
                          <span className="font-medium">{selectedPedido.codigoDoCliente}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-500">
                            <span className="icon-wrapper w-3 h-3 sm:w-4 sm:h-4">
                              <Sparkles size={12} />
                            </span>
                            Grupo:
                          </div>
                          <span className="font-medium">{selectedPedido.grupo}</span>
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
  );
};

export default PedidosTruck;