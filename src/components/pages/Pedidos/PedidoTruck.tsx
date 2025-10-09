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

// Status possíveis do suporte para a timeline
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
    null, // Alguns tickets sem atribuição inicial
    "Analista SAP",
  ];

  const estados = ["Baixa", "Média", "Alta", "Crítica", "Urgente"];
  const grupos = ["GRUPO_ENTERPRISE", "GRUPO_STARTUP", "GRUPO_CORPORATE"];
  const filiais = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"];

  const pedidos: Pedido[] = [];

  for (let i = 1; i <= 100; i++) {
    // Datas mais realistas para tickets de suporte
    const dataLancamento = new Date();
    dataLancamento.setDate(
      dataLancamento.getDate() - Math.floor(Math.random() * 365)
    );

    const dataResolucao = new Date(dataLancamento);
    dataResolucao.setDate(dataResolucao.getDate() + Math.floor(Math.random() * 30) + 1); // Resolução em até 31 dias

    const dataAtualizacao = new Date(dataLancamento);
    dataAtualizacao.setDate(dataAtualizacao.getDate() + Math.floor(Math.random() * 7) + 1); // Atualização em até 8 dias

    // Gerar ID interno realista
    const chaveNFe = `${Math.floor(
      Math.random() * 100000000000000000000000000000000000000000000
    )}`.padStart(44, "0");

    const parceiro = parceiros[Math.floor(Math.random() * parceiros.length)];
    const statusNotaFiscal =
      statusesNotaFiscal[Math.floor(Math.random() * statusesNotaFiscal.length)];

    pedidos.push({
      grupo: grupos[Math.floor(Math.random() * grupos.length)],
      filial: filiais[Math.floor(Math.random() * filiais.length)],
      codigoTransportadora: parceiro
        ? `T${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`
        : "",
      nomeTransportadora: parceiro,
      estado: estados[Math.floor(Math.random() * estados.length)],
      codigoDoCliente: `CLI${String(Math.floor(Math.random() * 9999)).padStart(
        4,
        "0"
      )}`,
      nomeCliente: nomes[Math.floor(Math.random() * nomes.length)],
      numeroPedido: `TICK${String(i).padStart(6, "0")}`, // Ticket em vez de licença
      dataLancamentoPedido: format(dataLancamento, "yyyy-MM-dd"),
      dataParaEntrega: format(dataResolucao, "yyyy-MM-dd"), // Data prevista de resolução
      statusDoPedido:
        statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      dataPicking: format(dataAtualizacao, "yyyy-MM-dd"), // Data de última atualização
      statusPicking:
        statusesPicking[Math.floor(Math.random() * statusesPicking.length)],
      notaFiscal: `ID${String(Math.floor(Math.random() * 999999)).padStart(
        6,
        "0"
      )}`, // ID do ticket
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

// Componente principal
const PedidosTruck = () => {
  // Estados
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDateRange, setActiveDateRange] = useState<DateRange>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)), // Último mês
    end: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [, setStatusFilter] = useState<string | null>(null);
  const [supportStatus, setSupportStatus] =
    useState<SupportStatus>("ticket_criado");
  const navigate = useNavigate();

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      const fictionalData = generateFictionalPedidos();
      setAllPedidos(fictionalData);
      await fetchPedidosWithDateRange(
        activeDateRange.start,
        activeDateRange.end,
        fictionalData
      );
    };

    fetchInitialData();
  }, []);

  // Efeito para selecionar o primeiro pedido quando a lista é carregada
  useEffect(() => {
    if (pedidos.length > 0 && !selectedPedido) {
      setSelectedPedido(pedidos[0]);
      determineSupportStatus(pedidos[0]);
    }
  }, [pedidos]);

  // Determina o status do suporte baseado nas datas disponíveis
  const determineSupportStatus = (pedido: Pedido) => {
    const hoje = new Date();
    const dataResolucao = new Date(pedido.dataParaEntrega);

    // Lógica adaptada para suporte: criação, análise, resolução
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

    // Removido isTokenExpired pois não há API, mas mantido para compatibilidade
    // if (isTokenExpired(token)) {
    //   localStorage.removeItem("token");
    //   navigate("/login");
    //   return;
    // }
  }, [navigate]);

  // Buscar pedidos da API -> Agora filtra dados fictícios
  const fetchPedidosWithDateRange = async (
    startDate: Date,
    endDate: Date,
    allData: Pedido[]
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Simula delay de carregamento de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Guardar as datas atuais de filtro
      setActiveDateRange({
        start: startDate,
        end: endDate,
      });

      // Filtrar por range de datas
      const pedidosData = allData.filter((pedido) => {
        const pedidoDate = new Date(pedido.dataLancamentoPedido);
        return pedidoDate >= startDate && pedidoDate <= endDate;
      });

      if (Array.isArray(pedidosData)) {
        // Certifique-se de que todos os pedidos tenham as propriedades necessárias
        const processedData = pedidosData.map((pedido) => ({
          ...pedido,
          // Garante que todas as propriedades usadas na busca estejam presentes
          numeroPedido: pedido.numeroPedido || "",
          nomeCliente: pedido.nomeCliente || "",
          notaFiscal: pedido.notaFiscal || "",
          chaveNFe: pedido.chaveNFe || "",
          codigoDoCliente: pedido.codigoDoCliente || "",
        }));

        // Ordenação decrescente por data de lançamento
        processedData.sort(
          (
            a: { dataLancamentoPedido: any },
            b: { dataLancamentoPedido: any }
          ) => {
            if (!a.dataLancamentoPedido || !b.dataLancamentoPedido) {
              return 0;
            }
            // Garantir que estamos trabalhando com strings antes de usar split
            const dataStrA = String(a.dataLancamentoPedido);
            const dataStrB = String(b.dataLancamentoPedido);
            // Criar objeto Date usando split para evitar problemas de timezone
            const [yearA, monthA, dayA] = dataStrA.split("-");
            const [yearB, monthB, dayB] = dataStrB.split("-");
            const dataA = new Date(
              Number(yearA),
              Number(monthA) - 1,
              Number(dayA)
            ).getTime();
            const dataB = new Date(
              Number(yearB),
              Number(monthB) - 1,
              Number(dayB)
            ).getTime();
            return dataB - dataA; // Ordem decrescente
          }
        );

        setAllPedidos(allData); // AllPedidos permanece com todos os dados fictícios
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

  // Filtrar pedidos por termo de busca
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase().trim();
    setSearchTerm(term);

    if (!term) {
      setPedidos(allPedidos);
      return;
    }

    const filtered = allPedidos.filter((pedido) => {
      // Garante que todos os campos sejam tratados como strings ou valores vazios
      const numeroPedido = String(pedido.numeroPedido || "").toLowerCase();
      const nomeCliente = String(pedido.nomeCliente || "").toLowerCase();
      const notaFiscal = String(pedido.notaFiscal || "").toLowerCase();
      const chaveNFe = String(pedido.chaveNFe || "").toLowerCase();
      const codigoDoCliente = String(
        pedido.codigoDoCliente || ""
      ).toLowerCase();

      // Verifica se algum dos campos corresponde exatamente ou contém o termo de busca
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

    // Atualiza o pedido selecionado se não estiver nos resultados filtrados
    if (
      selectedPedido &&
      !filtered.some((p) => p.numeroPedido === selectedPedido.numeroPedido)
    ) {
      setSelectedPedido(filtered.length > 0 ? filtered[0] : null);
    }
  };

  // Métodos para formatar datas
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy ", { locale: ptBR });
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

  // Determina os passos com base no status atual
  const getSupportSteps = (
    status: SupportStatus,
    pedido: Pedido
  ): SupportStep[] => {
    const formatAnaliseDescription = (): React.ReactNode => {
      return (
        <>
          Seu ticket está sendo analisado pela equipe de suporte.
          <Card className="bg-slate-200 dark:bg-sidebar-accent mt-10">
            <CardContent>
              <div className="flex gap-3 text-red-600 dark:text-red-500">
                <BadgeAlert />
                <div>
                  <p className="inline">
                    Caso precise de mais informações ou atualizações, entre em{" "}
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"bottomTrucker"}
                        className="border-0 p-0 h-auto inline"
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
        icon: <MessageCircle size={22} />,
        date: pedido.dataLancamentoPedido
          ? formatDate(pedido.dataLancamentoPedido)
          : undefined,
        isActive: status === "ticket_criado",
        isCompleted: [
          "ticket_criado",
          "atribuido_suporte",
          "em_analise",
          "resolvido",
        ].includes(status),
      },
      {
        id: "atribuido_suporte",
        label: "Atribuído ao Suporte",
        description:
          "Seu ticket foi atribuído a um técnico especializado",
        icon: <UserCheck size={22} />,
        isActive: status === "atribuido_suporte",
        isCompleted: [
          "atribuido_suporte",
          "em_analise",
          "resolvido",
        ].includes(status),
      },
      {
        id: "em_analise",
        label: "Análise em Andamento",
        description: formatAnaliseDescription(),
        icon: <Zap size={22} />,
        isActive: status === "em_analise",
        isCompleted: ["em_analise", "resolvido"].includes(status),
      },
      {
        id: "resolvido",
        label: "Resolvido",
        description: "Seu ticket foi resolvido com sucesso",
        icon: <Headphones size={22} />,
        date: pedido.dataParaEntrega
          ? formatDate(pedido.dataParaEntrega)
          : undefined,
        isActive: status === "resolvido",
        isCompleted: true,
      },
    ];
  };

  // Componente para badges de status
  const StatusBadge = ({
    text,
    type,
  }: {
    text: string;
    type: "success" | "info" | "pending" | "default" | "warning";
  }) => {
    const styles = {
      success: "bg-green-100 text-green-800 border-green-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      warning: "bg-orange-100 text-orange-800 border-orange-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span
        className={`${styles[type]} text-xs font-semibold px-3 py-1 rounded-full border`}
      >
        {text}
      </span>
    );
  };

  // Componente para itens de informação
  const InfoItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }) => {
    return (
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors dark:bg-sidebar dark:border">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-blue-600 ">
          {icon}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium dark:text-gray-500">
            {label}
          </div>
          <div className="font-semibold text-gray-900 dark:text-gray-300">
            {value}
          </div>
        </div>
      </div>
    );
  };

  // Componente para cada pedido na lista
  const PedidoListItem = ({
    pedido,
    isSelected,
    onClick,
  }: {
    pedido: Pedido;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    // Determina o status visual do pedido
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
        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-sidebar-accent ${
          isSelected
            ? "bg-zinc-100 border-l-4 border-l-blue-500 dark:bg-sidebar-accent dark:border-l-blue-500"
            : ""
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-medium text-gray-900 dark:text-zinc-100">
              Ticket: {pedido.numeroPedido}
            </div>
            <div>
              {pedido.notaFiscal ? (
                <span className="flex text-md font-medium text-gray-900 dark:text-zinc-100">
                  ID: #{pedido.notaFiscal}
                </span>
              ) : (
                <span className="flex text-sm font-medium text-red-500 bg-red-100 px-2 mt-1 rounded-sm">
                  ID ainda não gerado
                </span>
              )}
            </div>
          </div>
          <StatusBadge text={status.text} type={status.type} />
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-600 mb-1">
          {pedido.nomeCliente}
        </div>

        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDateOnly(pedido.dataLancamentoPedido)}
          </div>
          <div className="flex items-center gap-1">
            <ChevronRight
              size={16}
              className="text-blue-500 dark:text-gray-500"
            />
          </div>
        </div>
      </div>
    );
  };

  // Componente para o estado vazio
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
      <Headphones size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-600 mb-2">
        Nenhum ticket encontrado
      </h3>
      <p className="text-gray-500 max-w-md">
        Não encontramos tickets de suporte com esses dados. Tente buscar pelo
        número do Ticket, ID ou Nome do Cliente.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        onClick={() => {
          setSearchTerm("");
          setStatusFilter(null);
          setPedidos(allPedidos);
        }}
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  );

  // Componente para o estado de erro
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Erro ao carregar tickets
      </h3>
      <p className="text-gray-500 max-w-md">
        Ocorreu um erro ao tentar carregar os tickets de suporte. Por favor, tente
        novamente mais tarde.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        onClick={() =>
          fetchPedidosWithDateRange(
            activeDateRange.start,
            activeDateRange.end,
            allPedidos
          )
        }
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  );

  // Skeleton para a lista de pedidos
  const SkeletonList = () => (
    <div className="divide-y divide-gray-100">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64 mb-2" />
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  // Skeleton para detalhes
  const SkeletonDetails = () => (
    <div className="space-y-6">
      {/* Info resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-3  p-3 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="w-full relative">
        <div className="flex flex-col relative z-10">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-8 flex flex-col items-start">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="ml-2 mt-4 flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-64 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhes */}
      <div className="bg-white dark:bg-sidebar dark:border-accent rounded-xl shadow-lg p-6 border border-gray-100">
        <Skeleton className="h-6 w-48 mb-5" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
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
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Skeleton para lista */}
          <div className="md:col-span-4  dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden h-6/10">
            <Skeleton className="h-24 w-full" /> {/* Header */}
            <Skeleton className="h-12 w-full mx-4 my-4 rounded-lg" />{" "}
            {/* Search */}
            <SkeletonList />
          </div>

          {/* Skeleton para detalhes */}
          <div className="md:col-span-8 ">
            <div className="w-full  rounded-xl shadow-xl overflow-hidden">
              <Skeleton className="h-24 w-full" />
              <SkeletonDetails />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Caso não haja um pedido selecionado, mostra apenas a lista de pedidos
  if (!selectedPedido) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden ">
        <div className="w-full bg-gradient-to-r from-sky-800 to-zinc-900  py-6 px-8">
          <h2 className="text-white text-2xl font-bold flex items-center gap-2">
            <Headphones size={20} className="text-blue-200" />
            Meus Tickets de Suporte
          </h2>
        </div>

        {error ? (
          <ErrorState />
        ) : pedidos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-4">
            <p className="text-gray-700">
              Selecione um ticket para visualizar o processo de suporte.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Obter os passos de suporte para o pedido selecionado
  const steps = getSupportSteps(supportStatus, selectedPedido);

  return (
    <div className="w-full  mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coluna da lista de pedidos */}
        <div className="md:col-span-4 bg-white dark:bg-sidebar dark:border rounded-xl shadow-lg overflow-hidden h-6/10 ">
          <div className="w-full bg-gradient-to-r from-sky-800 to-zinc-900 dark:bg-gradient-to-r dark:from-sky-900 dark:to-zinc-900 py-4 px-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2 ">
              <Headphones size={18} className="text-blue-200" />
              Meus Tickets
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {pedidos.length} tickets encontrados
            </p>
          </div>

          {/* Barra de pesquisa */}
          <div className="p-4 border-b dark:border-b-gray-700 border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Busque seus tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-accent dark:focus:ring-border"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="h-full overflow-y-auto scrollbar  max-h-screen ">
            {error ? (
              <ErrorState />
            ) : pedidos.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-gray-100">
                {pedidos.map((pedido, index) => (
                  <PedidoListItem
                    key={`${pedido.numeroPedido}-${index}`}
                    pedido={pedido}
                    isSelected={
                      selectedPedido?.numeroPedido === pedido.numeroPedido
                    }
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

        {/* Coluna dos detalhes do pedido */}
        <div className="md:col-span-8">
          <div className="w-full bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl overflow-hidden">
            {/* Cabeçalho com gradiente */}
            <div className="w-full bg-gradient-to-r from-sky-800 to-slate-900 dark:bg-gradient-to-r dark:from-sky-900 dark:to-slate-900 py-6 px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-200" />
                    Processo de Suporte
                  </h2>
                  <p className="text-blue-100 mt-1">
                    Ticket #{selectedPedido.numeroPedido}
                  </p>
                  <p className="text-blue-100">
                    {selectedPedido.notaFiscal ? (
                      `ID #${selectedPedido.notaFiscal}`
                    ) : (
                      <span className="flex items-center text-sm font-medium text-red-500 bg-red-200 rounded-sm p-1 w-full max-w-60 mt-1 gap-1">
                        <BadgeAlert size={18} />
                        ID ainda não gerado
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <StatusBadge
                    text={
                      supportStatus === "resolvido"
                        ? "Resolvido"
                        : supportStatus === "em_analise"
                        ? "Em Análise"
                        : supportStatus === "atribuido_suporte"
                        ? "Atribuído"
                        : "Criado"
                    }
                    type={
                      supportStatus === "resolvido"
                        ? "success"
                        : supportStatus === "em_analise"
                        ? "info"
                        : supportStatus === "atribuido_suporte"
                        ? "pending"
                        : "default"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Informações resumidas do pedido */}
            <div className="p-6 bg-white border-b border-gray-100 dark:bg-sidebar dark:border-b-accent">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <InfoItem
                  label="Cliente"
                  value={selectedPedido.nomeCliente}
                  icon={<MessageCircle size={18} />}
                />
                <InfoItem
                  label="Técnico Atribuído"
                  value={selectedPedido.nomeTransportadora || "Pendente Atribuição"}
                  icon={<Headphones size={18} className="w-12" />}
                />
              </div>
            </div>

            {/* Container para timeline e detalhes */}
            <div className="flex flex-col dark:bg-sidebar dark:border gap-6 p-8">
              {/* Timeline de status */}
              <div className="w-full   relative">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600 " />
                  Progresso do Suporte
                </h3>

                {/* Linha conectora */}
                <div className="absolute left-10 top-16  w-1 bg-gradient-to-b from-blue-100 to-green-100 rounded-full -translate-x-1/2 z-0"></div>

                {/* Passos */}
                <div className="flex flex-col relative z-10">
                  {steps.map((step, index) => (
                    <div key={step.id} className="mb-8 last:mb-0 relative">
                      {/* Linha conectando os passos (exceto o último) */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-10 left-20 right-0 h-1 bg-gray-200 overflow-hidden ">
                          <div
                            className={`h-full ${
                              step.isCompleted ? "bg-green-500" : "bg-gray-300"
                            } transition-all duration-500 ease-in-out`}
                            style={{
                              width: step.isCompleted ? "100%" : "0%",
                              background: step.isCompleted
                                ? "linear-gradient(to right, #4ade80, #22d3ee)"
                                : "#e5e7eb",
                            }}
                          ></div>
                        </div>
                      )}

                      <div className="flex flex-col items-start">
                        {/* Ícone do passo */}
                        <div
                          className={`flex items-center justify-center w-20 h-20 rounded-full shrink-0 border-4 shadow-md transition-all duration-300 relative z-10 ${
                            step.isCompleted
                              ? "bg-gradient-to-br from-green-400 to-green-600 border-green-300 text-white"
                              : step.isActive
                              ? "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-100 text-white"
                              : "bg-gray-100 border-white dark:border-zinc-300 text-gray-400"
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Informações do passo */}
                        <div className="ml-2 mt-4 flex-1">
                          <h3
                            className={`font-semibold text-sm ${
                              step.isActive
                                ? "text-blue-700"
                                : step.isCompleted
                                ? "text-green-700"
                                : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </h3>

                          <p
                            className={`mt-1 ${
                              step.isActive || step.isCompleted
                                ? "text-gray-700 dark:text-gray-600"
                                : "text-gray-500"
                            }`}
                          >
                            {step.description}
                          </p>

                          {step.date && (
                            <p className="text-sm text-gray-500 mt-2 flex items-center">
                              <Clock size={14} className="mr-1" />
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalhes do pedido */}
              <div className="w-full ">
                <div className="bg-white dark:bg-sidebar dark:border-accent rounded-xl shadow-lg p-6 h-full border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Detalhes do Ticket
                  </h3>

                  <div className="space-y-6">
                    {/* Bloco de datas */}
                    <div className="bg-blue-50 dark:bg-sidebar dark:border rounded-lg p-4 border border-blue-100">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Calendar size={14} className="text-blue-600" />
                        Cronograma
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Calendar size={16} className="text-blue-600" />
                            Ticket Criado:
                          </div>
                          <span className="font-medium">
                            {formatDate(selectedPedido.dataLancamentoPedido)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Zap size={16} className="text-blue-600" />
                            Última Atualização:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.dataPicking
                              ? formatDate(selectedPedido.dataPicking)
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bloco de nota fiscal */}
                    <div
                      className={`${
                        selectedPedido.notaFiscal
                          ? "bg-green-50 border-green-100 dark:bg-sidebar dark:border"
                          : "bg-gray-50 border-gray-100 dark:bg-sidebar dark:border"
                      } rounded-lg p-4 border`}
                    >
                      <h4
                        className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                          selectedPedido.notaFiscal
                            ? "text-gray-800 dark:text-gray-500"
                            : "text-gray-600 dark:text-gray-100"
                        }`}
                      >
                        <FileText
                          size={14}
                          className={
                            selectedPedido.notaFiscal
                              ? "text-gray-600"
                              : "text-gray-500"
                          }
                        />
                        ID do Ticket
                      </h4>

                      {selectedPedido.notaFiscal ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-500">
                              Número:
                            </span>
                            <span className="font-medium">
                              {selectedPedido.notaFiscal}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 dark:text-gray-500">
                              Status:
                            </span>
                            <StatusBadge
                              text={
                                selectedPedido.statusNotaFiscal || "Aberto"
                              }
                              type="success"
                            />
                          </div>

                          {selectedPedido.chaveNFe && (
                            <div className="pt-1">
                              <span className="text-sm text-gray-700 dark:text-gray-500">
                                ID Interno:
                              </span>
                              <div className="mt-1 bg-white p-2 rounded border border-green-200 break-all text-xs text-gray-600">
                                {selectedPedido.chaveNFe}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-3">
                          <AlertTriangle
                            size={24}
                            className="text-gray-400 mb-2"
                          />
                          <p className="text-gray-500 text-sm text-center">
                            ID ainda não gerado
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bloco de suporte */}
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 dark:bg-sidebar dark:border">
                      <h4 className="text-sm font-medium text-indigo-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <Headphones size={14} className="text-indigo-600 " />
                        Detalhes do Suporte
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Headphones size={16} className="text-indigo-600" />
                            Técnico:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.nomeTransportadora ||
                              "Pendente Atribuição"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Zap size={16} className="text-indigo-600" />
                            Prioridade:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.estado}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Info size={16} className="text-indigo-600" />
                            Produto:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.filial}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informações adicionais do cliente */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 dark:bg-sidebar dark:border">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <MessageCircle size={14} className="text-amber-600" />
                        Informações do Solicitante
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <MessageCircle size={16} className="text-amber-600" />
                            Nome:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.nomeCliente}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <FileText size={16} className="text-amber-600" />
                            Código:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.codigoDoCliente}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-500">
                            <Sparkles size={16} className="text-amber-600" />
                            Grupo:
                          </div>
                          <span className="font-medium">
                            {selectedPedido.grupo}
                          </span>
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