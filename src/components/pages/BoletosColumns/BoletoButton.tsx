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
    // Passar dados iniciais se disponíveis
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
  const isPaid = ["baixado", "pago", "quitado", "liquidado"].some((s) => {
    const includes = statusAtual.includes(s);

    return includes;
  });

  // Verificar status cancelado
  const isCancelled = ["cancelado", "cancelada"].some((s) => {
    const includes = statusAtual.includes(s);

    return includes;
  });

  const hasId = parcelaId !== null && parcelaId !== undefined;
  const hasCodigoBoleto =
    boletoId !== null && boletoId !== undefined && boletoId !== "";

  const isExpired = getVencimentoInfo();

  // Boleto disponível se tiver IDs válidos e não estiver cancelado
  const boletoAvailable = hasId && hasCodigoBoleto && !isCancelled && !loading;

  // Definir tooltip específico para cada situação
  const getTooltipText = () => {
    if (loading) {
      return "Carregando...";
    }

    if (isCancelled) {
      return "Este boleto foi cancelado e não está disponível para visualização.";
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
    e.stopPropagation();

    console.log("[v0] Attempting to visualize boleto:", {
      boletoId,
      parcelaId,
      boletoAvailable,
      loading,
      status: statusAtual,
    });

    // Não executar ação se não estiver disponível ou carregando
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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="bottomPassword"
            size="icon"
            className={`h-8 w-8 ${
              isCancelled
                ? "bg-red-600 hover:bg-red-800 text-white cursor-not-allowed opacity-80"
                : !boletoAvailable
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer "
            } ${loading ? "animate-pulse" : ""}`}
            onClick={handleVisualizarBoleto}
            disabled={!boletoAvailable}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {loading
                ? "Carregando dados do boleto..."
                : !boletoAvailable
                ? isCancelled
                  ? "Boleto indisponível: foi cancelado"
                  : "Boleto indisponível: dados insuficientes"
                : "Visualizar boleto"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
