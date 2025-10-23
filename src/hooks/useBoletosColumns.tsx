"use client";

import type React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  formatCNPJ,
  formatCurrency,
  formatDatePtBr,
} from "@/utils/boletos/formatters";
import { numericFilter, dateRangeFilter } from "@/utils/boletos/filters";
import { PaymentDate } from "@/components/pages/BoletosColumns/PaymentDate";
import { BoletoButton } from "@/components/pages/BoletosColumns/BoletoButton";
import { StatusBadge } from "@/components/pages/BoletosColumns/StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo } from "react";
import { PedidosCompraCell } from "@/components/pages/Pedidos/PedidosCompras/PedidosModal";

interface Parcela {
  codigoBoleto: number;
  codigoPN: string;
  nomePN: string;
  cnpj: string;
  numNF: string;
  notaFiscal: string;
  parcela: string;
  valorParcela: number;
  dataVencimento: string;
  dataPagamento: string;
  status: string;
  filial: string;
  chaveNFe: string;
  statusNotaFiscal?: string;
  id: number;
  pedidosCompra?: string;
}

export const useBoletosColumns = () => {
  const createLoadingModal = useCallback((notaId: string) => {
    const loadingId = `loading-danfe-${notaId}`;
    const loadingEl = document.createElement("div");
    loadingEl.id = loadingId;
    loadingEl.className =
      "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
    loadingEl.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md">
        <div class="relative mb-4">
          <div class="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6 text-blue-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
        <p class="font-medium text-gray-900 dark:text-white">Carregando sua Danfe</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Aguarde um momento</p>
      </div>
    `;
    document.body.appendChild(loadingEl);
    return loadingId;
  }, []);

  const removeLoadingModal = useCallback((loadingId: string) => {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
      loadingElement.remove();
    }
  }, []);

  const createErrorModal = useCallback((message: string) => {
    const errorEl = document.createElement("div");
    errorEl.className =
      "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
    errorEl.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md">
        <div class="bg-red-100 dark:bg-red-900/30 p-4 rounded-full inline-flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-10 w-10 text-red-500">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Não foi possível carregar a DANFE
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6 text-center">
          ${message}
        </p>
        <button id="close-error" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
          Fechar
        </button>
      </div>
    `;

    document.body.appendChild(errorEl);

    const closeButton = document.getElementById("close-error");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        errorEl.remove();
      });
    }
  }, []);

  const createMockViewer = useCallback((fileUrl: string, notaId: string) => {
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold">DANFE FICTÍCIA - Nota Fiscal #${notaId}</h3>
                <div class="flex items-center text-sm text-white/80">
                  <span>Documento de demonstração</span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button id="download-mock-${notaId}" 
                class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-sky-800 hover:bg-blue-50 shadow-sm gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
              </button>
              <button id="close-viewer-${notaId}" 
                class="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all bg-white/10 hover:bg-white/20 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative" id="iframe-container-${notaId}">
          <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-400 dark:from-gray-800 to-transparent z-10"></div>
          
          <div class="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 py-2 px-4 flex items-center justify-between backdrop-blur-sm z-10">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 mr-2 text-orange-500">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Documento fictício • Apenas para demonstração</span>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Mock ID: ${notaId}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(viewerContainer);

    const iframeContainer = document.getElementById(
      `iframe-container-${notaId}`
    );

    if (iframeContainer) {
      const iframeElement = document.createElement("iframe");
      iframeElement.setAttribute("src", fileUrl);
      iframeElement.setAttribute("frameborder", "0");
      iframeElement.setAttribute("allow", "fullscreen");
      iframeElement.className = "w-full h-full";
      iframeContainer.appendChild(iframeElement);
    }

    setTimeout(() => {
      const viewerEl = document.getElementById(`viewer-container-${notaId}`);
      if (viewerEl) {
        viewerEl.classList.remove("opacity-0", "scale-95");
        viewerEl.classList.add("opacity-100", "scale-100");
      }
    }, 50);

    const downloadButton = document.getElementById(`download-mock-${notaId}`);
    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `danfe-mock-${notaId}.html`;
        link.click();
      });
    }

    const closeButton = document.getElementById(`close-viewer-${notaId}`);
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        const viewerElement = document.getElementById(
          `viewer-container-${notaId}`
        );
        if (viewerElement) {
          viewerElement.classList.remove("opacity-100", "scale-100");
          viewerElement.classList.add("opacity-0", "scale-95");

          setTimeout(() => {
            const containerElement = document.getElementById(
              `danfe-viewer-${notaId}`
            );
            if (containerElement) {
              containerElement.remove();
            }
            URL.revokeObjectURL(fileUrl);
          }, 300);
        }
      });
    }
  }, []);

  const handleViewDANFE = useCallback(
    async (
      _companyCode: string,
      chaveNFe: string,
      notaId: string,
      isNotaCancelled: boolean
    ) => {
      if (isNotaCancelled) return;

      const loadingId = createLoadingModal(notaId);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        removeLoadingModal(loadingId);

        const mockPDFContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>DANFE Mock - Nota Fiscal #${notaId}</title>
            <meta charset="UTF-8">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                font-size: 12px;
                line-height: 1.4;
                background: #fff;
                color: #333;
              }
              .page {
                max-width: 210mm;
                margin: 0 auto;
                padding: 10mm;
                background: white;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              .header {
                border: 2px solid #000;
                margin-bottom: 5px;
              }
              .header-top {
                background: #f8f9fa;
                padding: 8px;
                text-align: center;
                border-bottom: 1px solid #000;
              }
              .header-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 2px;
              }
              .header-subtitle {
                font-size: 12px;
                color: #666;
              }
              .company-info {
                display: flex;
                border-bottom: 1px solid #000;
              }
              .company-left {
                flex: 1;
                padding: 10px;
                border-right: 1px solid #000;
              }
              .company-right {
                width: 200px;
                padding: 10px;
                text-align: center;
              }
              .danfe-info {
                padding: 8px;
                background: #f8f9fa;
                text-align: center;
              }
              .section {
                border: 1px solid #000;
                margin-bottom: 5px;
              }
              .section-header {
                background: #e9ecef;
                padding: 4px 8px;
                font-weight: bold;
                font-size: 10px;
                border-bottom: 1px solid #000;
              }
              .section-content {
                padding: 8px;
              }
              .row {
                display: flex;
                margin-bottom: 8px;
              }
              .field {
                margin-right: 20px;
              }
              .field-label {
                font-size: 9px;
                color: #666;
                display: block;
                margin-bottom: 2px;
              }
              .field-value {
                font-weight: bold;
                font-size: 11px;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              .table th, .table td {
                border: 1px solid #000;
                padding: 4px;
                text-align: left;
                font-size: 10px;
              }
              .table th {
                background: #e9ecef;
                font-weight: bold;
              }
              .totals {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
              }
              .total-box {
                border: 1px solid #000;
                padding: 8px;
                width: 48%;
              }
              .qr-code {
                width: 80px;
                height: 80px;
                border: 1px solid #000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                text-align: center;
                margin: 0 auto;
              }
              .warning {
                background: #fff3cd;
                border: 2px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                text-align: center;
              }
              .warning-title {
                font-size: 14px;
                font-weight: bold;
                color: #856404;
                margin-bottom: 5px;
              }
              .warning-text {
                color: #856404;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div class="header">
                <div class="header-top">
                  <div class="header-title">DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA</div>
                  <div class="header-subtitle">0 - ENTRADA | 1 - SAÍDA</div>
                </div>
                
                <div class="company-info">
                  <div class="company-left">
                    <div class="field">
                      <span class="field-label">RAZÃO SOCIAL / NOME</span>
                      <span class="field-value">TECHNOVA SOFTWARES LTDA</span>
                    </div>
                    <div class="row">
                      <div class="field">
                        <span class="field-label">ENDEREÇO</span>
                        <span class="field-value">RUA DAS TECNOLOGIAS, 456 - JARDIM DIGITAL</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="field">
                        <span class="field-label">MUNICÍPIO</span>
                        <span class="field-value">SÃO PAULO</span>
                      </div>
                      <div class="field">
                        <span class="field-label">UF</span>
                        <span class="field-value">SP</span>
                      </div>
                      <div class="field">
                        <span class="field-label">CEP</span>
                        <span class="field-value">01234-567</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="field">
                        <span class="field-label">CNPJ</span>
                        <span class="field-value">12.345.678/0001-90</span>
                      </div>
                      <div class="field">
                        <span class="field-label">INSCRIÇÃO ESTADUAL</span>
                        <span class="field-value">123.456.789.012</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="company-right">
                    <div class="field">
                      <span class="field-label">DANFE</span>
                      <span class="field-value" style="font-size: 14px;">DOCUMENTO AUXILIAR DA<br>NOTA FISCAL ELETRÔNICA</span>
                    </div>
                    <div class="field" style="margin-top: 10px;">
                      <span class="field-label">Nº</span>
                      <span class="field-value" style="font-size: 16px;">${notaId}</span>
                    </div>
                    <div class="field">
                      <span class="field-label">SÉRIE</span>
                      <span class="field-value">001</span>
                    </div>
                  </div>
                </div>
                
                <div class="danfe-info">
                  <div style="font-size: 10px; margin-bottom: 5px;">CHAVE DE ACESSO</div>
                  <div style="font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 1px;">
                    ${
                      chaveNFe ||
                      "3524 1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 12"
                    }
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-header">DESTINATÁRIO / REMETENTE</div>
                <div class="section-content">
                  <div class="row">
                    <div class="field">
                      <span class="field-label">NOME / RAZÃO SOCIAL</span>
                      <span class="field-value">DIGITALFLOW SOLUÇÕES SA</span>
                    </div>
                    <div class="field">
                      <span class="field-label">CNPJ / CPF</span>
                      <span class="field-value">98.765.432/0001-10</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="field">
                      <span class="field-label">ENDEREÇO</span>
                      <span class="field-value">AV. INOVAÇÃO, 789 - TECH PARK</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="field">
                      <span class="field-label">MUNICÍPIO</span>
                      <span class="field-value">SÃO PAULO</span>
                    </div>
                    <div class="field">
                      <span class="field-label">UF</span>
                      <span class="field-value">SP</span>
                    </div>
                    <div class="field">
                      <span class="field-label">CEP</span>
                      <span class="field-value">01310-100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-header">DADOS DA NOTA FISCAL</div>
                <div class="section-content">
                  <div class="row">
                    <div class="field">
                      <span class="field-label">NATUREZA DA OPERAÇÃO</span>
                      <span class="field-value">VENDA DE BENS E SERVIÇOS (SOFTWARE)</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="field">
                      <span class="field-label">DATA DE EMISSÃO</span>
                      <span class="field-value">${new Date().toLocaleDateString(
                        "pt-BR"
                      )}</span>
                    </div>
                    <div class="field">
                      <span class="field-label">DATA DE SAÍDA</span>
                      <span class="field-value">${new Date().toLocaleDateString(
                        "pt-BR"
                      )}</span>
                    </div>
                    <div class="field">
                      <span class="field-label">HORA DE SAÍDA</span>
                      <span class="field-value">${new Date().toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-header">DADOS DOS PRODUTOS / SERVIÇOS</div>
                <div class="section-content">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>CÓDIGO</th>
                        <th>DESCRIÇÃO DO PRODUTO / SERVIÇO</th>
                        <th>NCM/SH</th>
                        <th>CFOP</th>
                        <th>UN</th>
                        <th>QTDE</th>
                        <th>VL. UNIT</th>
                        <th>VL. TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>001</td>
                        <td>ERP ENTERPRISE PRO - LICENÇA ANUAL</td>
                        <td>85238000</td>
                        <td>5102</td>
                        <td>LIC</td>
                        <td>1,00</td>
                        <td>950,00</td>
                        <td>950,00</td>
                      </tr>
                      <tr>
                        <td>002</td>
                        <td>CRM CLOUD SUITE - MÓDULO BÁSICO</td>
                        <td>85238000</td>
                        <td>5102</td>
                        <td>LIC</td>
                        <td>1,00</td>
                        <td>450,00</td>
                        <td>450,00</td>
                      </tr>
                      <tr>
                        <td>003</td>
                        <td>SUPORTE TÉCNICO - CONFIGURAÇÃO INICIAL</td>
                        <td>99831400</td>
                        <td>5949</td>
                        <td>SV</td>
                        <td>20,00</td>
                        <td>25,00</td>
                        <td>500,00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="totals">
                <div class="total-box">
                  <div class="field">
                    <span class="field-label">BASE DE CÁLCULO DO ICMS</span>
                    <span class="field-value">R$ 1.900,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">VALOR DO ICMS</span>
                    <span class="field-value">R$ 342,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">BASE DE CÁLCULO ICMS ST</span>
                    <span class="field-value">R$ 0,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">VALOR ICMS SUBSTITUIÇÃO</span>
                    <span class="field-value">R$ 0,00</span>
                  </div>
                </div>
                
                <div class="total-box">
                  <div class="field">
                    <span class="field-label">VALOR TOTAL DOS PRODUTOS</span>
                    <span class="field-value">R$ 1.900,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">VALOR DO FRETE</span>
                    <span class="field-value">R$ 0,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">VALOR DO SEGURO</span>
                    <span class="field-value">R$ 0,00</span>
                  </div>
                  <div class="field">
                    <span class="field-label">OUTRAS DESPESAS</span>
                    <span class="field-value">R$ 0,00</span>
                  </div>
                  <div class="field" style="border-top: 1px solid #000; padding-top: 5px; margin-top: 5px;">
                    <span class="field-label">VALOR TOTAL DA NOTA</span>
                    <span class="field-value" style="font-size: 14px;">R$ 1.900,00</span>
                  </div>
                </div>
              </div>

              <div class="section" style="margin-top: 10px;">
                <div class="section-header">CONSULTA VIA LEITOR DE QR CODE</div>
                <div class="section-content" style="display: flex; align-items: center;">
                  <div class="qr-code">
                    QR CODE<br>
                    (Simulado)
                  </div>
                  <div style="margin-left: 20px; flex: 1;">
                    <div class="field">
                      <span class="field-label">URL DE CONSULTA</span>
                      <span class="field-value">https://www.fazenda.sp.gov.br/nfe</span>
                    </div>
                    <div class="field">
                      <span class="field-label">PROTOCOLO DE AUTORIZAÇÃO</span>
                      <span class="field-value">135240001234567 - ${new Date().toLocaleDateString(
                        "pt-BR"
                      )} ${new Date().toLocaleTimeString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="warning">
                <div class="warning-title">⚠️ DOCUMENTO FICTÍCIO</div>
                <div class="warning-text">
                  Este documento foi gerado apenas para fins de demonstração e não possui validade fiscal.<br>
                  Todos os dados apresentados são fictícios e não representam uma operação real.
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const blob = new Blob([mockPDFContent], { type: "text/html" });
        const fileUrl = URL.createObjectURL(blob);

        createMockViewer(fileUrl, notaId);
      } catch (error) {
        removeLoadingModal(loadingId);

        const errorMessage =
          "Erro ao carregar dados fictícios. Tente novamente.";

        createErrorModal(errorMessage);
      }
    },
    [createLoadingModal, removeLoadingModal, createErrorModal, createMockViewer]
  );

  const columns: ColumnDef<Parcela, any>[] = useMemo(
    () => [
      {
        accessorKey: "codigoBoleto",
        header: "Código",
        filterFn: numericFilter,
        cell: ({ row }) => {
          const codigoBoleto = row.getValue("codigoBoleto") as string | number | null | undefined;
          const id = row.original.id;
          const dataVencimento = row.getValue("dataVencimento") as string;
          const status = row.getValue("status") as string;

          const textClass = status.toLowerCase() === "inativo" ? "text-red-100 bg-red-500 px-2 rounded-sm py-1" : "dark:text-gray-200";

          return (
            <div className="flex items-center gap-1 ">
              <span className={`block font-medium min-w-[60px] px-2 rounded-sm py-1  ${textClass}`}>
                {codigoBoleto ? String(codigoBoleto) : "-"}
              </span>
              <div className="flex gap-1">
                <BoletoButton
                  boletoId={codigoBoleto}
                  parcelaId={id}
                  dataVencimento={dataVencimento}
                  status={status}
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "nomePN",
        header: "Nome",
        cell: ({ row }) => (
          <div
            className="whitespace-nowrap overflow-hidden text-ellipsis flex w-56 dark:text-gray-200"
            title={row.getValue("nomePN")}
          >
            {row.getValue("nomePN")}
          </div>
        ),
      },
      {
        accessorKey: "cnpj",
        header: "CNPJ",
        cell: ({ row }) => (
          <span className="dark:text-gray-200">
            {formatCNPJ(row.getValue("cnpj"))}
          </span>
        ),
      },
      {
        accessorKey: "pedidosCompra",
        header: "Pedidos Compra",
        cell: ({ row }) => {
          const pedidos = row.getValue("pedidosCompra") as string;
          return <PedidosCompraCell pedidos={pedidos} />;
        },
      },
      {
        accessorKey: "numNF",
        header: "Nota Fiscal",
        filterFn: "includesString",
        cell: ({ row }) => {
          const numNF = row.getValue("numNF") as string | number | null;
          const notaFiscal = row.original.notaFiscal;
          const companyCode = row.original.filial || "";
          const chaveNFe = row.original.chaveNFe || "";
          const status =
            row.original.status || row.original.statusNotaFiscal || "";

          const isNotaCancelled = ["cancelado", "cancelada"].some((s) =>
            status.toLowerCase().includes(s)
          );

          const hasDANFEData = Boolean(
            (notaFiscal || numNF) &&
              companyCode &&
              companyCode.trim() !== "" &&
              chaveNFe &&
              chaveNFe.trim() !== ""
          );

          const textClass = isNotaCancelled
            ? "text-center font-medium min-w-[70px] text-red-500 line-through"
            : "text-center font-medium min-w-[70px] dark:text-gray-200";

          const getTooltipText = () => {
            if (isNotaCancelled) {
              return "Esta nota fiscal está indisponível, por isso, não está disponível para visualização.";
            }
            if (!hasDANFEData) {
              return "DANFE não disponível para boletos";
            }
            return "Visualizar DANFE";
          };

          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (isNotaCancelled || !hasDANFEData) {
              return;
            }
            const notaId = (notaFiscal || numNF || "").toString();
            handleViewDANFE(companyCode, chaveNFe, notaId, isNotaCancelled);
          };

          return (
            <TooltipProvider>
              <div className="flex items-center gap-2 min-h-[2rem]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={textClass}>
                      {numNF ? numNF.toString() : "-"}
                    </span>
                  </TooltipTrigger>
                  {isNotaCancelled && (
                    <TooltipContent className="bg-white text-red-800 border border-red-200 shadow-md px-3 py-1.5 rounded-md text-sm">
                      <p>Nota fiscal indisponível.</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                {numNF && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="bottomPassword"
                        size="icon"
                        className={`h-8 w-8 ${
                          isNotaCancelled
                            ? "bg-red-600 hover:bg-red-800 text-white cursor-not-allowed opacity-80"
                            : !hasDANFEData
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handleClick}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">
                          {isNotaCancelled
                            ? "DANFE indisponível: foi cancelada"
                            : !hasDANFEData
                            ? "DANFE indisponível"
                            : "Visualizar DANFE"}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getTooltipText()}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: "parcela",
        header: "Parcela",
        cell: ({ row }) => (
          <span className="dark:text-gray-200">{row.getValue("parcela")}</span>
        ),
      },
      {
        accessorKey: "valorParcela",
        header: "Valor",
        cell: ({ row }) => (
          <span className="dark:text-gray-200">
            {formatCurrency(row.getValue("valorParcela"))}
          </span>
        ),
      },
      {
        accessorKey: "dataVencimento",
        header: "Vencimento",
        cell: ({ row }) => {
          const value = row.getValue("dataVencimento") as string;
          return (
            <span className="dark:text-gray-200">{formatDatePtBr(value)}</span>
          );
        },
        filterFn: dateRangeFilter,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const dataVencimento = row.getValue("dataVencimento") as string;
          const dataPagamento = row.getValue("dataPagamento") as string | null;

          if (!status || !dataVencimento) {
            return <div className="text-gray-500">Dados inválidos</div>;
          }

          return (
            <StatusBadge
              status={status}
              dataPagamento={dataPagamento}
              dataVencimento={dataVencimento}
            />
          );
        },
      },
      {
        accessorKey: "dataPagamento",
        header: "Data Pagamento",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const dataPagamento = row.getValue("dataPagamento") as string;

          return <PaymentDate status={status} dataPagamento={dataPagamento} />;
        },
        filterFn: dateRangeFilter,
      },
    ],
    [handleViewDANFE]
  );

  return columns;
};