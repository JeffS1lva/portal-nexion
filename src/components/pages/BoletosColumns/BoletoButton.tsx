"use client";

import type React from "react";
import { useCallback } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBoletoViewer } from "@/components/pages/BoletosColumns/BoletoViewer";
import { useParcelaData } from "@/hooks/useParcelaData";
import { parseDate } from "@/utils/boletos/formatters";

// Define status options to match StatusBadge
const statusPagamentoOptions = ["Pago", "Pendente", "Atrasado", "Cancelado"];
const situacaoOptions = ["Normal", "Urgente", "Bloqueado", "Regular"];
const statusOptions = ["Ativo", "Inativo", "Processando", "Concluído"];

interface BoletoButtonProps {
  boletoId: string | number | null | undefined;
  parcelaId: string | number | null | undefined;
  dataVencimento?: string | Date | null;
  status?: string;
}

export function BoletoButton({
  boletoId,
  parcelaId,
  dataVencimento,
  status,
}: BoletoButtonProps) {
  const { showBoletoViewer } = useBoletoViewer();

  // Usar o hook customizado para gerenciar dados da parcela
  const { parcelaData, loading } = useParcelaData(
    parcelaId,
    boletoId,
    (dataVencimento !== null && dataVencimento !== undefined) || status
      ? {
        dataVencimento: dataVencimento === null ? undefined : dataVencimento,
        statusPagamento: status,
      }
      : null
  );

  // Determinar se o boleto está vencido
  const getVencimentoInfo = useCallback(() => {
    let vencimento: Date;
    let isExpired = false;

    try {
      const dataParaVerificar = parcelaData?.dataVencimento || dataVencimento;

      if (dataParaVerificar instanceof Date) {
        vencimento = dataParaVerificar;
      } else if (typeof dataParaVerificar === "string" && dataParaVerificar) {
        try {
          vencimento = parseDate(dataParaVerificar as any);
        } catch {
          vencimento = new Date(dataParaVerificar);
        }
      } else {
        vencimento = new Date(0);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      isExpired = vencimento < today;
    } catch (error) {
      isExpired = true;
    }

    return isExpired;
  }, [parcelaData, dataVencimento]);

  const statusAtual = (parcelaData?.statusPagamento || status || "")
    .toLowerCase()
    .trim();

  // Verificar status de pagamento
  const isPaid = statusPagamentoOptions
    .map((s) => s.toLowerCase())
    .includes(statusAtual) && statusAtual === "pago";

  // Verificar status cancelado, bloqueado ou inativo
  const isUnavailable =
    (statusPagamentoOptions
      .map((s) => s.toLowerCase())
      .includes(statusAtual) &&
      statusAtual === "cancelado") ||
    (situacaoOptions
      .map((s) => s.toLowerCase())
      .includes(statusAtual) &&
      statusAtual === "bloqueado") ||
    (statusOptions
      .map((s) => s.toLowerCase())
      .includes(statusAtual) &&
      statusAtual === "inativo");

  const isInactive = statusOptions
    .map((s) => s.toLowerCase())
    .includes(statusAtual) && statusAtual === "inativo";

  const hasId = parcelaId !== null && parcelaId !== undefined;
  const hasCodigoBoleto =
    boletoId !== null && boletoId !== undefined && boletoId !== "";

  const isExpired = getVencimentoInfo();

  // Boleto disponível se tiver IDs válidos, não estiver indisponível e não estiver carregando
  const boletoAvailable = hasId && hasCodigoBoleto && !isUnavailable && !loading;

  // Definir tooltip específico para cada situação
  const getTooltipText = () => {
    if (loading) {
      return "Carregando...";
    }
    if (isInactive) {
      return "Este boleto está inativo e não está disponível para visualização.";
    }
    if (statusAtual === "cancelado" || statusAtual === "bloqueado") {
      return "Este boleto está indisponível para visualização.";
    }
    if (!hasId || !hasCodigoBoleto) {
      return "Boleto não disponível - dados insuficientes";
    }
    if (isPaid) {
      return "Visualizar boleto (já pago)";
    }
    if (isExpired) {
      return "Visualizar boleto (vencido)";
    }
    return "Visualizar boleto";
  };

  const handleVisualizarBoleto = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("[v0] Attempting to visualize boleto:", {
      boletoId,
      parcelaId,
      boletoAvailable,
      loading,
      status: statusAtual,
    });

    if (!boletoAvailable || loading) {
      console.log("[v0] Boleto visualization blocked:", {
        boletoAvailable,
        loading,
      });
      return;
    }

    if (
      boletoId !== undefined &&
      boletoId !== null &&
      parcelaId !== undefined &&
      parcelaId !== null
    ) {
      console.log("[v0] Calling showBoletoViewer with:", {
        boletoId: String(boletoId),
        parcelaId: String(parcelaId),
        parcelaData,
      });

      showBoletoViewer(
        String(boletoId),
        String(parcelaId),
        parcelaData || {
          dataVencimento: dataVencimento,
          statusPagamento: status,
        }
      );
    }
  };

  return (
    // Ensure TooltipProvider is used higher in the component tree if possible
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Wrap Button in a div to allow tooltip on disabled button */}
          <div className="inline-flex">
            <Button
              variant="bottomPassword"
              size="icon"
              className={`h-8 w-8 ${isInactive
                  ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
                  : statusAtual === "cancelado" || statusAtual === "bloqueado"
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
                    : !boletoAvailable
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                } ${loading ? "animate-pulse" : ""}`}
              onClick={handleVisualizarBoleto}
              disabled={!boletoAvailable}
              aria-label={getTooltipText()}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">{getTooltipText()}</span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent
          className={`p-2 rounded-md shadow-lg z-[1000] ${isInactive || statusAtual === "cancelado" || statusAtual === "bloqueado"
              ? "bg-white text-red-800 border border-red-200 shadow-md   rounded-md text-sm"
              : "bg-gray-800 text-white border-gray-700"
            }`}
          side="top"
          align="center"
        >
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}