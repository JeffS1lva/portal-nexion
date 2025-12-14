"use client";

import type * as React from "react";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { AlertCircle, Ban, Check, Eye, Package, PackageOpen, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { JSX } from "react/jsx-runtime";
import { PedidosCompraCell } from "./PedidosCompras/PedidosModal";

interface Pedido {
  duplicateCount: React.ReactNode;
  hasDuplicates: any;
  status: any;
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
  dataPicking: string | null
  statusPicking: string;
  notaFiscal: string;
  chaveNFe: string;
  statusNotaFiscal?: string;
  pedidosCompra: string;
}

// 🎨 FUNÇÃO getStatusConfig (mantida como fornecida anteriormente)
export const getStatusConfig = (status: string) => {
  const config: {
    classes: string;
    icon: JSX.Element;
    text: string;
  } = {
    classes: "w-32 bg-gray-100 border border-gray-200 text-gray-800",
    icon: <PackageSearch className="h-3 w-3 mr-1 text-gray-600" />,
    text: status || "Desconhecido",
  };

  switch (status) {
    // Status do Pedido
    case "Pendente Ativação":
      config.classes = "w-32 bg-orange-100 border border-orange-200 text-orange-800";
      config.icon = <PackageOpen className="h-3 w-3 mr-1 text-orange-600" />;
      config.text = "Pendente Ativação";
      break;

    case "Ativado":
      config.classes = "w-32 bg-green-100 border border-green-200 text-green-800";
      config.icon = <Check className="h-3 w-3 mr-1 text-green-600" />;
      config.text = "Ativado";
      break;

    case "Renovado":
      config.classes = "w-32 bg-blue-100 border border-blue-200 text-blue-800";
      config.icon = <Package className="h-3 w-3 mr-1 text-blue-600" />;
      config.text = "Renovado";
      break;

    case "Cancelado":
      config.classes = "w-32 bg-red-100 border border-red-200 text-red-800";
      config.icon = <Ban className="h-3 w-3 mr-1 text-red-600" />;
      config.text = "Cancelado";
      break;

    // Status do Picking
    case "Configuração Pendente":
      config.classes = "w-32 bg-yellow-100 border border-yellow-200 text-yellow-800";
      config.icon = <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" />;
      config.text = "Config. Pendente";
      break;

    case "Configurado":
      config.classes = "w-32 bg-teal-100 border border-teal-200 text-teal-800";
      config.icon = <Package className="h-3 w-3 mr-1 text-teal-600" />;
      config.text = "Configurado";
      break;

    case "Pendente":
      config.classes = "w-32 bg-amber-100 border border-amber-200 text-amber-800";
      config.icon = <PackageOpen className="h-3 w-3 mr-1 text-amber-600" />;
      config.text = "Pendente";
      break;

    case "Concluído":
      config.classes = "w-32 bg-emerald-100 border border-emerald-200 text-emerald-800";
      config.icon = <Check className="h-3 w-3 mr-1 text-emerald-600" />;
      config.text = "Concluído";
      break;

    // Status da Nota Fiscal
    case "Autorizada":
      config.classes = "w-32 bg-sky-100 border border-sky-200 text-sky-800";
      config.icon = <Check className="h-3 w-3 mr-1 text-sky-600" />;
      config.text = "Autorizada";
      break;

    case "Cancelada":
      config.classes = "w-32 bg-red-100 border border-red-200 text-red-800";
      config.icon = <Ban className="h-3 w-3 mr-1 text-red-600" />;
      config.text = "Cancelada";
      break;

    case "Pendente":
      config.classes = "w-32 bg-orange-100 border border-orange-200 text-orange-800";
      config.icon = <AlertCircle className="h-3 w-3 mr-1 text-orange-600" />;
      config.text = "Pendente";
      break;

    default:
      config.classes = "w-32 bg-gray-100 border border-gray-200 text-gray-800";
      config.icon = <PackageSearch className="h-3 w-3 mr-1 text-gray-600" />;
      config.text = status || "Desconhecido";
  }

  return config;
};

export const numericFilter: FilterFn<Pedido> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (typeof value === "string" || typeof value === "number") {
    return value.toString().includes(filterValue);
  }
  return false;
};

export const pedidosCompraFilter: FilterFn<Pedido> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (typeof value === "string") {
    return value.toLowerCase().includes(filterValue.toLowerCase());
  }
  return false;
};

export const usePedidosColumns = (): ColumnDef<Pedido>[] => {
  return [
    {
      accessorKey: "numeroPedido",
      header: "Nº Pedido",
      filterFn: numericFilter,
      cell: ({ row }) => {
        const numeroPedido = row.getValue("numeroPedido");
        const hasNotaFiscal = numeroPedido !== null && numeroPedido !== undefined && numeroPedido !== "";

        const handleViewPedido = async (e: React.MouseEvent) => {
          e.preventDefault();
          if (!hasNotaFiscal) return;

          try {
            const pedidoId = numeroPedido.toString();
            const loadingId = `loading-pedido-${pedidoId}`;
            const loadingEl = document.createElement("div");
            loadingEl.id = loadingId;
            loadingEl.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
            loadingEl.innerHTML = `
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md">
                <div class="relative mb-4">
                  <div class="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                </div>
                <p class="font-medium text-gray-900 dark:text-white">Carregando Pedido de Venda... </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Aguarde um momento</p>
              </div>
            `;
            document.body.appendChild(loadingEl);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Pedido de Venda #${pedidoId}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

            const blob = new Blob([pdfContent], { type: "application/pdf" });
            const fileUrl = URL.createObjectURL(blob);
            document.getElementById(loadingId)?.remove();

            const viewerContainer = document.createElement("div");
            viewerContainer.id = `pedido-viewer-${pedidoId}`;
            viewerContainer.className =
              "fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50";
            viewerContainer.innerHTML = `
              <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 opacity-0 scale-95" id="viewer-container-${pedidoId}">
                <div class="bg-gradient-to-r from-sky-900 to-zinc-800 p-5 text-white">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="bg-white/20 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold">Pedido de Venda #${pedidoId} (Fictício)</h3>
                        <div class="flex items-center text-sm text-white/80">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-3 w-3 mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>Documento de demonstração</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <a href="${fileUrl}" download="pedido-${pedidoId}.pdf" 
                        class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-sky-800 hover:bg-blue-50 shadow-sm gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download
                      </a>
                      <button id="close-viewer-${pedidoId}" 
                        class="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all bg-white/10 hover:bg-white/20 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative" id="iframe-container-${pedidoId}">
                  <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-400 dark:from-gray-800 to-transparent z-10"></div>
                  <div id="pdf-content-${pedidoId}" class="w-full h-full">
                    <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <div class="text-center max-w-md p-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mx-auto mb-4 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">Pedido Fictício #${pedidoId}</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Este é um documento de demonstração com dados fictícios.</p>
                        <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left">
                          <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Informações do Pedido:</h4>
                          <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Número: ${pedidoId}</li>
                            <li>• Status: Processando</li>
                            <li>• Data: ${new Date().toLocaleDateString("pt-BR")}</li>
                            <li>• Tipo: Demonstração</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 py-2 px-4 flex items-center justify-between backdrop-blur-sm z-10">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 mr-2 text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <span>Documento fictício • Apenas para demonstração</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: ${pedidoId}
                    </div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(viewerContainer);

            setTimeout(() => {
              const viewerEl = document.getElementById(`viewer-container-${pedidoId}`);
              if (viewerEl) {
                viewerEl.classList.remove("opacity-0", "scale-95");
                viewerEl.classList.add("opacity-100", "scale-100");
              }
            }, 50);

            document.getElementById(`close-viewer-${pedidoId}`)?.addEventListener("click", () => {
              const viewerElement = document.getElementById(`viewer-container-${pedidoId}`);
              if (viewerElement) {
                viewerElement.classList.remove("opacity-100", "scale-100");
                viewerElement.classList.add("opacity-0", "scale-95");
                setTimeout(() => {
                  const containerElement = document.getElementById(`pedido-viewer-${pedidoId}`);
                  if (containerElement) {
                    containerElement.remove();
                  }
                  URL.revokeObjectURL(fileUrl);
                }, 300);
              } else {
                const containerElement = document.getElementById(`pedido-viewer-${pedidoId}`);
                if (containerElement) {
                  containerElement.remove();
                }
                URL.revokeObjectURL(fileUrl);
              }
            });

            toast.success(`Pedido fictício ${pedidoId} carregado!`, {
              description: "Documento de demonstração gerado com sucesso.",
              duration: 3000,
            });
          } catch (error) {
            const loadingId = `loading-pedido-${numeroPedido}`;
            document.getElementById(loadingId)?.remove();
            toast.error("Erro ao carregar pedido fictício", {
              description: "Não foi possível gerar o documento de demonstração.",
            });
          }
        };

        return (
          <div className="flex items-center gap-2">
            <span className="block text-center font-medium min-w-[70px]">
              {hasNotaFiscal ? numeroPedido.toString() : "N/A"}
            </span>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleViewPedido}
                      disabled={!hasNotaFiscal}
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0 cursor-pointer ${!hasNotaFiscal ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Visualizar</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{hasNotaFiscal ? "Visualizar Pedido (Fictício)" : "Pedido não disponível"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "pedidosCompra",
      header: "Pedidos Compra",
      filterFn: pedidosCompraFilter,
      cell: ({ row }) => {
        const pedidos = row.getValue("pedidosCompra") as string;
        return <PedidosCompraCell pedidos={pedidos} />;
      },
    },
    {
      accessorKey: "dataLancamentoPedido",
      header: "Data Lanç.",
      cell: ({ row }) => {
        const dateValue = row.getValue("dataLancamentoPedido");
        if (!dateValue) return "";
        const dateString = String(dateValue);
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue?.start || !filterValue?.end) return true;
        const dateValue = row.getValue(columnId);
        if (!dateValue) return false;
        const dateString = String(dateValue);
        const [cellYear, cellMonth, cellDay] = dateString.split("-").map(Number);
        const [startYear, startMonth, startDay] = filterValue.start.split("-").map(Number);
        const [endYear, endMonth, endDay] = filterValue.end.split("-").map(Number);
        if (cellYear < startYear || cellYear > endYear) return false;
        if (cellYear === startYear && cellMonth < startMonth) return false;
        if (cellYear === endYear && cellMonth > endMonth) return false;
        if (cellYear === startYear && cellMonth === startMonth && cellDay < startDay) return false;
        if (cellYear === endYear && cellMonth === endMonth && cellDay > endDay) return false;
        return true;
      },
    },
    {
      accessorKey: "dataParaEntrega",
      header: "Data Entre.",
      cell: ({ row }) => {
        const dateValue = row.getValue("dataParaEntrega");
        if (!dateValue) return "";
        const dateString = String(dateValue);
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue?.start || !filterValue?.end) return true;
        const dateValue = row.getValue(columnId);
        if (!dateValue) return false;
        const dateString = String(dateValue);
        const [cellYear, cellMonth, cellDay] = dateString.split("-").map(Number);
        const [startYear, startMonth, startDay] = filterValue.start.split("-").map(Number);
        const [endYear, endMonth, endDay] = filterValue.end.split("-").map(Number);
        if (cellYear < startYear || cellYear > endYear) return false;
        if (cellYear === startYear && cellMonth < startMonth) return false;
        if (cellYear === endYear && cellMonth > endMonth) return false;
        if (cellYear === startYear && cellMonth === startMonth && cellDay < startDay) return false;
        if (cellYear === endYear && cellMonth === endMonth && cellDay > endDay) return false;
        return true;
      },
    },
    {
      accessorKey: "statusDoPedido",
      header: "Status Pedido",
      cell: ({ row }) => {
        const { classes, icon, text } = getStatusConfig(row.getValue("statusDoPedido"));
        return (
          <div className={`w-full inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${classes}`}>
            {icon}
            {text || row.getValue("statusDoPedido")}
          </div>
        );
      },
    },
    {
      accessorKey: "statusPicking",
      header: "Status Picking",
      cell: ({ row }) => {
        const statusPedido = row.original.statusDoPedido;
        const statusNF = row.original.statusNotaFiscal || "Pendente";
        const dataEntrega = row.original.dataParaEntrega;

        // 1. Pedido cancelado ou NF cancelada → picking cancelado
        if (statusPedido === "Cancelado" || statusNF === "Cancelada") {
          return (
            <div className="inline-flex w-32 items-center justify-center rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-800 shadow-sm border border-red-200">
              <Ban className="mr-1.5 h-3 w-3" />
              Cancelado
            </div>
          );
        }

        // 2. Ainda pendente ativação → picking nem começou
        if (statusPedido === "Pendente Ativação") {
          return (
            <div className="inline-flex w-32 items-center justify-center rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm border border-gray-200">
              <PackageSearch className="mr-1.5 h-3 w-3" />
              Sem Picking
            </div>
          );
        }

        // 3. Pedido ativado, mas NF ainda pendente → configuração pendente
        if (statusPedido === "Ativado" && statusNF === "Pendente") {
          return (
            <div className="inline-flex w-32 items-center justify-center rounded-full bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-800 shadow-sm border border-yellow-200">
              <AlertCircle className="mr-1.5 h-3 w-3" />
              Config. Pendente
            </div>
          );
        }

        // 4. Pedido ativado + NF autorizada → picking pendente (separação)
        if (statusPedido === "Ativado" && statusNF === "Autorizada") {
          // Bonus: se já passou da data de entrega, consideramos concluído (opcional)
          const hoje = new Date();
          const dataEntregaDate = new Date(dataEntrega);
          const atrasado = hoje > dataEntregaDate;

          if (atrasado) {
            return (
              <div className="inline-flex w-32 items-center justify-center rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm border border-emerald-200">
                <Check className="mr-1.5 h-3 w-3" />
                Concluído
              </div>
            );
          }

          return (
            <div className="inline-flex w-32 items-center justify-center rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 shadow-sm border border-amber-200">
              <PackageOpen className="mr-1.5 h-3 w-3" />
              Pendente
            </div>
          );
        }

        // 5. Qualquer outro caso (Renovado, etc) → tratamos como concluído ou pendente
        return (
          <div className="inline-flex w-32 items-center justify-center rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm border border-gray-200">
            <PackageSearch className="mr-1.5 h-3 w-3" />
            Sem Picking
          </div>
        );
      },
    },
    {
      accessorKey: "statusNotaFiscal",
      header: "Status Nota Fiscal",
      cell: ({ row }) => {
        const { classes, icon, text } = getStatusConfig(row.getValue("statusNotaFiscal"));
        return (
          <div className={`w-full inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${classes}`}>
            {icon}
            {text || row.getValue("statusNotaFiscal") || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "notaFiscal",
      header: "Nota Fiscal",
      filterFn: numericFilter,
      cell: ({ row }) => {
        const notaFiscal = row.getValue("notaFiscal");
        const companyCode = row.original.filial || "";
        const chaveNFe = row.original.chaveNFe || "";
        const statusNotaFiscal = row.original.statusNotaFiscal || "";
        const isNotaCancelled = statusNotaFiscal === "Cancelada";
        const isNotaPending = statusNotaFiscal === "Pendente";
        const hasDownloadAccess = notaFiscal && companyCode && chaveNFe && statusNotaFiscal === "Autorizada";

        const handleDownloadXML = async (e: {
          preventDefault: () => void;
          stopPropagation: () => void;
        }) => {
          e.preventDefault();
          e.stopPropagation();
          if (!hasDownloadAccess) return;

          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveNFe}">
    <ide>
      <cUF>35</cUF>
      <cNF>12345678</cNF>
      <natOp>Venda</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>${notaFiscal}</nNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>0</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>12345678000195</CNPJ>
      <xNome>Empresa Fictícia LTDA</xNome>
      <enderEmit>
        <xLgr>Rua das Flores</xLgr>
        <nro>123</nro>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>São Paulo</xMun>
        <UF>SP</UF>
        <CEP>01234567</CEP>
      </enderEmit>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>001</cProd>
        <cEAN></cEAN>
        <xProd>Produto Fictício</xProd>
        <NCM>12345678</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.00</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib></cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.00</vUnTrib>
        <indTot>1</indTot>
      </prod>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vProd>100.00</vProd>
        <vFreite>0.00</vFreite>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>`;
            const blob = new Blob([xmlContent], { type: "application/xml" });
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `nota-ficticia-${notaFiscal}.xml`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(downloadUrl);

            toast.success(`Download da nota fictícia ${notaFiscal} concluído!`, {
              description: "Arquivo XML de demonstração salvo com sucesso.",
              duration: 5000,
            });
          } catch (error) {
            toast.error("Erro ao baixar XML fictício", {
              description: "Não foi possível gerar o arquivo de demonstração.",
            });
          }
        };

        const handleViewDANFE = async (e: {
          preventDefault: () => void;
          stopPropagation: () => void;
        }) => {
          e.preventDefault();
          e.stopPropagation();
          if (!hasDownloadAccess) return;

          try {
            const notaId = notaFiscal.toString();
            const loadingId = `loading-danfe-${notaId}`;
            const loadingEl = document.createElement("div");
            loadingEl.id = loadingId;
            loadingEl.className = "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
            loadingEl.innerHTML = `
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md">
                <div class="relative mb-4">
                  <div class="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                </div>
                <p class="font-medium text-gray-900 dark:text-white">Carregando sua Danfe Fictícia</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Aguarde um momento</p>
              </div>
            `;
            document.body.appendChild(loadingEl);

            await new Promise((resolve) => setTimeout(resolve, 1500));
            document.getElementById(loadingId)?.remove();

            const viewerContainer = document.createElement("div");
            viewerContainer.id = `danfe-viewer-${notaId}`;
            viewerContainer.className =
              "fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50";
            viewerContainer.innerHTML = `
              <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 opacity-0 scale-95" id="viewer-container-${notaId}">
                <div class="bg-gradient-to-r from-sky-900 to-zinc-800 p-5 text-white">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="bg-white/20 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-bold">DANFE Fictícia - Nota Fiscal #${notaId}</h3>
                        <div class="flex items-center text-sm text-white/80">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-3 w-3 mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>Documento de demonstração</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button id="download-danfe-${notaId}"
                        class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-sky-800 hover:bg-blue-50 shadow-sm gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download
                      </button>
                      <button id="close-viewer-${notaId}" 
                        class="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all bg-white/10 hover:bg-white/20 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative" id="iframe-container-${notaId}">
                  <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div class="text-center max-w-md p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="mx-auto mb-4 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">DANFE Fictícia #${notaId}</h3>
                      <p class="text-gray-600 dark:text-gray-300 mb-4">Este é um documento de demonstração com dados fictícios.</p>
                      <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-left">
                        <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Informações da Nota:</h4>
                        <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Número: ${notaId}</li>
                          <li>• Chave: ${chaveNFe.slice(0, 10)}...</li>
                          <li>• Emissão: ${new Date().toLocaleDateString("pt-BR")}</li>
                          <li>• Status: Demonstração</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 py-2 px-4 flex items-center justify-between backdrop-blur-sm z-10">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 mr-2 text-blue-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <span>Documento fictício • Apenas para demonstração</span>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      Chave: ${chaveNFe.slice(0, 10)}...
                    </div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(viewerContainer);

            setTimeout(() => {
              const viewerEl = document.getElementById(`viewer-container-${notaId}`);
              if (viewerEl) {
                viewerEl.classList.remove("opacity-0", "scale-95");
                viewerEl.classList.add("opacity-100", "scale-100");
              }
            }, 50);

            document.getElementById(`download-danfe-${notaId}`)?.addEventListener("click", () => {
              const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 60
>>
stream
BT
/F1 12 Tf
72 720 Td
(DANFE Fictícia - Nota Fiscal #${notaId}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
315
%%EOF`;
              const blob = new Blob([pdfContent], { type: "application/pdf" });
              const downloadUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = `danfe-ficticia-${notaId}.pdf`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(downloadUrl);

              toast.success(`Download da DANFE fictícia ${notaId} concluído!`, {
                description: "Arquivo PDF de demonstração salvo com sucesso.",
                duration: 3000,
              });
            });

            document.getElementById(`close-viewer-${notaId}`)?.addEventListener("click", () => {
              const viewerElement = document.getElementById(`viewer-container-${notaId}`);
              if (viewerElement) {
                viewerElement.classList.remove("opacity-100", "scale-100");
                viewerElement.classList.add("opacity-0", "scale-95");
                setTimeout(() => {
                  const containerElement = document.getElementById(`danfe-viewer-${notaId}`);
                  if (containerElement) {
                    containerElement.remove();
                  }
                }, 300);
              } else {
                const containerElement = document.getElementById(`danfe-viewer-${notaId}`);
                if (containerElement) {
                  containerElement.remove();
                }
              }
            });

            toast.success(`DANFE fictícia ${notaId} carregada!`, {
              description: "Documento de demonstração gerado com sucesso.",
              duration: 3000,
            });
          } catch (error) {
            const loadingId = `loading-danfe-${notaFiscal.toString()}`;
            document.getElementById(loadingId)?.remove();
            toast.error("Erro ao carregar DANFE fictícia", {
              description: "Não foi possível gerar o documento de demonstração.",
            });
          }
        };

        const textClass = isNotaCancelled
          ? "block text-center font-medium min-w-[70px] text-red-500"
          : isNotaPending
            ? "block text-center font-medium min-w-[70px] text-orange-800"
            : "block text-center font-medium min-w-[70px]";

        const buttonClass = (disabled: boolean) => {
          const baseClass =
            "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background h-8 w-8 p-0";
          if (isNotaCancelled) {
            return baseClass + " bg-red-500 hover:bg-red-600 text-white";
          } else if (isNotaPending) {
            return baseClass + " bg-orange-500 hover:bg-orange-600 text-white";
          } else if (disabled) {
            return baseClass + " bg-primary text-primary-foreground opacity-50 cursor-not-allowed";
          } else {
            return baseClass + " bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer";
          }
        };

        const notaTooltipMessage = isNotaCancelled
          ? "Nota fiscal cancelada"
          : isNotaPending
            ? "Nota fiscal pendente"
            : !notaFiscal || !companyCode || !chaveNFe
              ? "Nota fiscal não disponível"
              : "";

        const danfeTooltipMessage = isNotaCancelled
          ? "DANFE cancelada"
          : isNotaPending
            ? "DANFE pendente"
            : hasDownloadAccess
              ? "Visualizar DANFE (Fictícia)"
              : "DANFE não disponível";

        const xmlTooltipMessage = isNotaCancelled
          ? "XML cancelado"
          : isNotaPending
            ? "XML pendente"
            : hasDownloadAccess
              ? "Baixar XML (Fictício)"
              : "XML não disponível";

        return (
          <div className="flex items-center ">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={textClass} data-status={isNotaCancelled ? "cancelada" : isNotaPending ? "pendente" : ""}>
                  {notaFiscal ? notaFiscal.toString() : "-"}
                </span>
              </TooltipTrigger>
              {notaTooltipMessage && (
                <TooltipContent
                  className={`bg-white border shadow-md px-3 py-1.5 rounded-md text-sm ${isNotaCancelled
                    ? "text-red-800 border-red-200"
                    : isNotaPending
                      ? "text-orange-800 border-orange-200"
                      : "text-gray-800 border-gray-200"
                    }`}
                >
                  <p>{notaTooltipMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>
            <div className="flex px-2 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleViewDANFE}
                    disabled={!hasDownloadAccess}
                    className={buttonClass(!hasDownloadAccess)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Visualizar DANFE</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className={isNotaCancelled
                    ? "bg-white text-red-800 border-red-200"
                    : isNotaPending
                      ? "bg-white text-orange-800 border-orange-200"
                      : ""}
                >
                  <p>{danfeTooltipMessage}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleDownloadXML}
                    disabled={!hasDownloadAccess}
                    className={buttonClass(!hasDownloadAccess)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2V8M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                    <span className="sr-only">Download XML</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className={isNotaCancelled
                    ? "bg-white text-red-800 border-red-200"
                    : isNotaPending
                      ? "bg-white text-orange-800 border-orange-200"
                      : ""}
                >
                  <p>{xmlTooltipMessage}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "nomeCliente",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="whitespace-nowrap overflow-hidden text-ellipsis flex w-56" title={row.getValue("nomeCliente")}>
          {row.getValue("nomeCliente")}
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
    },
    {
      accessorKey: "nomeTransportadora",
      header: "Nome Transp.",
      cell: ({ row }) => {
        const nome: string | null = row.getValue("nomeTransportadora");
        if (!nome) return <>-</>;
        const displayName = nome.length > 10 ? `${nome.slice(0, 23)}...` : nome;
        return <>{displayName}</>;
      },
    },
  ];
};

export type { Pedido };