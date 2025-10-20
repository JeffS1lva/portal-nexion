import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  Users,
  MapPin,
  ArrowUp,
  Sparkles,
  Target,
  Award,
  Zap
} from 'lucide-react';
import {

  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

// Tipos (mantidos iguais)
type Pedido = {
  status: string;
  grupo: string;
  filial: string;
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
  statusNotaFiscal: string;
  pedidosCompra: string;
  nomeTransportadora: string | null;
};

// Skeleton Components
const HeaderSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-gray-700 p-8 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-12 w-64" />
        </div>
        <Skeleton className="h-6 w-72" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  </div>
);

const KPICardSkeleton = () => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-2xl transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-12 w-20 mb-2" />
      <Skeleton className="h-4 w-32" />
    </CardContent>
  </Card>
);

const SecondaryCardSkeleton = () => (
  <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-4 w-28" />
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-80 w-full" />
    </CardContent>
  </Card>
);

const EstadoCardSkeleton = ({ }: { index: number }) => (
  <div className="relative group flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-indigo-100 dark:border-gray-600">
    <div className="absolute top-3 right-3">
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-8 mt-4 mb-2 rounded-full" />
    <Skeleton className="h-10 w-12 mb-1" />
    <Skeleton className="h-4 w-16 mb-3" />
    <Skeleton className="w-full h-2" />
  </div>
);

// Função para formatar data (mantida igual)
const formatDate = (date: Date, formatStr: string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthsFull = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  if (formatStr === 'dd/MM/yyyy HH:mm') {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } else if (formatStr === 'dd de MMMM') {
    return `${day} de ${monthsFull[d.getMonth()]}`;
  } else if (formatStr === 'MMM') {
    return months[d.getMonth()];
  }
  return `${day}/${month}/${year}`;
};

// Gerar dados fictícios (mantido igual)
const generateFictionalPedidos = (): Pedido[] => {
  // ... (código idêntico ao anterior - mantido igual)
  const statusesPedido = ["Pendente Ativação", "Ativado", "Renovado", "Cancelado"];
  const statusesPicking = ["Configuração Pendente", "Configurado", "Pendente", "Concluído"];
  const statusesNotaFiscal = ["Autorizada", "Cancelada", "Pendente"];

  const nomes = [
    "TechNova Softwares Ltda", "DigitalFlow Soluções SA", "CodeMaster Desenvolvimento EIRELI",
    "ByteSolutions ME", "SoftPeak Enterprise EPP", "InnoTech & Cia", "DataWave Importadora Digital",
    "CloudForge Atacado Tech", "NetCore Varejo Digital", "AlgoRhythm Licenças Ltda",
  ];

  const parceiros = [
    "Parceiro Microsoft", "Revenda AWS", "Venda Direta", "Parceiro Google Cloud",
    "Revenda Oracle", "Parceiro Salesforce", "Integração Interna", "Revenda IBM", null, "Parceiro SAP",
  ];

  const estados = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "PE", "CE"];
  const grupos = ["GRUPO_ENTERPRISE", "GRUPO_STARTUP", "GRUPO_CORPORATE"];
  const filiais = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"];

  const produtos = [
    "ERP Enterprise Pro", "CRM Cloud Suite", "Office Productivity Pack",
    "Database Manager Advanced", "Analytics BI Tool", "Security Firewall Software",
    "DevOps Pipeline Manager", "HR Management System", "E-commerce Platform", "Mobile App Builder",
  ];

  const pedidos: Pedido[] = [];

  for (let i = 1; i <= 100; i++) {
    const dataLancamento = new Date();
    dataLancamento.setDate(dataLancamento.getDate() - Math.floor(Math.random() * 365));

    const dataExpiracao = new Date(dataLancamento);
    dataExpiracao.setMonth(dataExpiracao.getMonth() + Math.floor(Math.random() * 12) + 6);

    const dataConfiguracao = new Date(dataLancamento);
    dataConfiguracao.setDate(dataConfiguracao.getDate() + Math.floor(Math.random() * 7) + 1);

    const chaveNFe = `${Math.floor(Math.random() * 100000000000000000000000000000000000000000000)}`.padStart(44, "0");

    const parceiro = parceiros[Math.floor(Math.random() * parceiros.length)];
    const statusNotaFiscal = statusesNotaFiscal[Math.floor(Math.random() * statusesNotaFiscal.length)];
    const produto = produtos[Math.floor(Math.random() * produtos.length)];

    const formatDateToString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    pedidos.push({
      status: statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      grupo: grupos[Math.floor(Math.random() * grupos.length)],
      filial: filiais[Math.floor(Math.random() * filiais.length)],
      nomeTransportadora: parceiro,
      estado: estados[Math.floor(Math.random() * estados.length)],
      codigoDoCliente: `CLI${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      nomeCliente: nomes[Math.floor(Math.random() * nomes.length)],
      numeroPedido: `LIC${String(i).padStart(6, "0")}`,
      dataLancamentoPedido: formatDateToString(dataLancamento),
      dataParaEntrega: formatDateToString(dataExpiracao),
      statusDoPedido: statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      dataPicking: formatDateToString(dataConfiguracao),
      statusPicking: statusesPicking[Math.floor(Math.random() * statusesPicking.length)],
      notaFiscal: `NF${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      chaveNFe: chaveNFe,
      statusNotaFiscal: statusNotaFiscal,
      pedidosCompra: produto,
    });
  }

  return pedidos.sort((a, b) => new Date(b.dataLancamentoPedido).getTime() - new Date(a.dataLancamentoPedido).getTime());
};

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Simula carregamento de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setPedidos(generateFictionalPedidos());
      setIsLoading(false);
    }, 4000); // 4 segundos

    return () => clearTimeout(timer);
  }, []);

  // Cores premium para os gráficos
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  // Estatísticas gerais (só calcula se não estiver carregando)
  const stats = useMemo(() => {
    if (isLoading) return null;
    const total = pedidos.length;
    const ativados = pedidos.filter(p => p.statusDoPedido === 'Ativado').length;
    const pendentes = pedidos.filter(p => p.statusDoPedido === 'Pendente Ativação').length;
    const cancelados = pedidos.filter(p => p.statusDoPedido === 'Cancelado').length;
    const renovados = pedidos.filter(p => p.statusDoPedido === 'Renovado').length;
    const notasAutorizadas = pedidos.filter(p => p.statusNotaFiscal === 'Autorizada').length;
    const clientesUnicos = new Set(pedidos.map(p => p.codigoDoCliente)).size;

    const crescimentoPedidos = 12.5;
    const crescimentoAtivacao = 8.3;
    const crescimentoClientes = 15.2;

    return {
      total,
      ativados,
      pendentes,
      cancelados,
      renovados,
      notasAutorizadas,
      clientesUnicos,
      taxaAtivacao: ((ativados / total) * 100).toFixed(1),
      taxaCancelamento: ((cancelados / total) * 100).toFixed(1),
      crescimentoPedidos,
      crescimentoAtivacao,
      crescimentoClientes,
      eficienciaOperacional: 94.5
    };
  }, [pedidos, isLoading]);

  // Dados para gráficos (só calcula se não estiver carregando)
  const statusData = useMemo(() => {
    if (isLoading) return [];
    const statusCount: Record<string, number> = {};
    pedidos.forEach(p => {
      statusCount[p.statusDoPedido] = (statusCount[p.statusDoPedido] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  }, [pedidos, isLoading]);

  const monthlyData = useMemo(() => {
    if (isLoading) return [];
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const pedidosDoMes = pedidos.filter(p => {
        const date = new Date(p.dataLancamentoPedido);
        return date >= month && date < nextMonth;
      });

      months.push({
        mes: formatDate(month, 'MMM'),
        total: pedidosDoMes.length,
        ativados: pedidosDoMes.filter(p => p.statusDoPedido === 'Ativado').length,
        cancelados: pedidosDoMes.filter(p => p.statusDoPedido === 'Cancelado').length,
        renovados: pedidosDoMes.filter(p => p.statusDoPedido === 'Renovado').length,
      });
    }

    return months;
  }, [pedidos, isLoading]);

  const topProdutos = useMemo(() => {
    if (isLoading) return [];
    const produtoCount: Record<string, number> = {};
    pedidos.forEach(p => {
      produtoCount[p.pedidosCompra] = (produtoCount[p.pedidosCompra] || 0) + 1;
    });
    return Object.entries(produtoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [pedidos, isLoading]);

  const estadoData = useMemo(() => {
    if (isLoading) return [];
    const estadoCount: Record<string, number> = {};
    pedidos.forEach(p => {
      estadoCount[p.estado] = (estadoCount[p.estado] || 0) + 1;
    });
    return Object.entries(estadoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [pedidos, isLoading]);

  const grupoData = useMemo(() => {
    if (isLoading) return [];
    const grupoCount: Record<string, number> = {};
    pedidos.forEach(p => {
      grupoCount[p.grupo] = (grupoCount[p.grupo] || 0) + 1;
    });
    return Object.entries(grupoCount).map(([name, value]) => ({
      name: name.replace('GRUPO_', ''),
      value
    }));
  }, [pedidos, isLoading]);

  // Renderização condicional
  if (isLoading) {
    return (
      <div className="w-full min-h-screen  dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-4 md:p-6 lg:p-8">
        <div className="mx-auto space-y-6">
          {/* Header Skeleton */}
          <HeaderSkeleton />

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <KPICardSkeleton key={i} />
            ))}
          </div>

          {/* Secondary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SecondaryCardSkeleton key={i} />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ChartSkeleton key={i} />
            ))}
          </div>

          {/* Estados Skeleton */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-7 w-48 mb-1" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <EstadoCardSkeleton key={i} index={i} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-12 w-16 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Renderização do conteúdo real (código anterior mantido igual)
  return (
    <div className="w-full min-h-screen  dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="mx-auto space-y-6">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-gray-700 p-8 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="absolute inset-0 bg-black dark:bg-white opacity-5"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-8 w-8 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Nexion Insights
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Inteligência corporativa e análise estratégica de resultados
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="bg-white/20 dark:bg-gray-700/50 backdrop-blur-sm border-white/30 dark:border-gray-600 w-fit px-4 py-2 text-gray-900 dark:text-white">
                  <Clock className="h-4 w-4 mr-2 inline text-indigo-500" />
                  Atualizado: {formatDate(new Date(), 'dd de MMMM')}, {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                </Badge>
                <Badge className="bg-green-500/90 hover:bg-green-600 border-0 text-white w-fit px-4 py-2">
                  <Zap className="h-4 w-4 mr-2 inline" />
                  Sistema operacional
                </Badge>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <Target className="h-48 w-48 text-indigo-400 dark:text-indigo-500" />
          </div>
        </div>

        {/* KPI Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-50">Total de Pedidos</CardTitle>
              <Package className="h-8 w-8 opacity-80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats!.total}</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{stats!.crescimentoPedidos}%</span>
                </div>
                <span className="text-blue-100">vs. mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-50">Taxa de Ativação</CardTitle>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats!.taxaAtivacao}%</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{stats!.crescimentoAtivacao}%</span>
                </div>
                <span className="text-green-100">{stats!.ativados} ativados</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-purple-50">Clientes Ativos</CardTitle>
              <Users className="h-8 w-8 opacity-80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats!.clientesUnicos}</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{stats!.crescimentoClientes}%</span>
                </div>
                <span className="text-purple-100">crescimento</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-orange-50">Eficiência</CardTitle>
              <Award className="h-8 w-8 opacity-80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats!.eficienciaOperacional}%</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center bg-white/20 rounded-full px-2 py-1">
                  <Target className="h-4 w-4 mr-1" />
                  <span className="font-semibold">Excelente</span>
                </div>
                <span className="text-orange-100">performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards secundários */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Renovações</CardTitle>
              <RefreshCw className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats!.renovados}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contratos renovados</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">Pendentes</CardTitle>
              <Clock className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats!.pendentes}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aguardando processamento</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">NFs Emitidas</CardTitle>
              <FileText className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats!.notasAutorizadas}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Documentos autorizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Evolução Mensal</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Performance dos últimos 6 meses</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAtivados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:#374151" />
                  <XAxis dataKey="mes" stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff dark:#1f2937',
                      border: '1px solid #e5e7eb dark:#374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827 dark:#f9fafb'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#6b7280 dark:#d1d5db' }} />
                  <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Total" />
                  <Area type="monotone" dataKey="ativados" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtivados)" name="Ativados" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Status dos Pedidos</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribuição por categoria</p>
                </div>
                <Package className="h-6 w-6 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient${index % COLORS.length})`} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff dark:#1f2937',
                      border: '1px solid #e5e7eb dark:#374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827 dark:#f9fafb'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Produtos Mais Vendidos</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ranking de performance</p>
                </div>
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topProdutos} layout="vertical">
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:#374151" />
                  <XAxis type="number" stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="name" type="category" width={180} stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff dark:#1f2937',
                      border: '1px solid #e5e7eb dark:#374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827 dark:#f9fafb'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#colorBar)" name="Vendas" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Distribuição por Grupo</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Segmentação de clientes</p>
                </div>
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={grupoData}>
                  <defs>
                    <linearGradient id="colorGrupo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb dark:#374151" />
                  <XAxis dataKey="name" stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280 dark:#d1d5db" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff dark:#1f2937',
                      border: '1px solid #e5e7eb dark:#374151',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      color: '#111827 dark:#f9fafb'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#colorGrupo)" name="Pedidos" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Estados */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-rose-500" />
                  Distribuição Geográfica
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Top 5 estados com maior volume</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {estadoData.map((estado, index) => (
                <div
                  key={estado.name}
                  className="relative group flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-100 dark:border-gray-600"
                >
                  <div className="absolute top-3 right-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600' :
                            'bg-gradient-to-br from-indigo-400 to-purple-500'
                      }`}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="mt-4 text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{estado.name}</div>
                  <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">{estado.value}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">pedidos</div>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(estado.value / estadoData[0].value) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer com insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-100 text-sm font-semibold mb-2">Taxa de Sucesso</p>
                  <p className="text-4xl font-bold mb-1">{stats!.taxaAtivacao}%</p>
                  <p className="text-green-100 text-sm">Conversão excelente</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-semibold mb-2">Renovações</p>
                  <p className="text-4xl font-bold mb-1">{stats!.renovados}</p>
                  <p className="text-blue-100 text-sm">Contratos estendidos</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <RefreshCw className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-semibold mb-2">Taxa de Cancelamento</p>
                  <p className="text-4xl font-bold mb-1">{stats!.taxaCancelamento}%</p>
                  <p className="text-orange-100 text-sm">Dentro da meta</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <XCircle className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};