import { parseDate } from "@/utils/boletos/formatters";
import type { ReactNode } from "react";
import { AlertCircle, Ban, Check, Package, PackageOpen, PackageSearch } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  dataPagamento?: string | Date | null;
  dataVencimento: string;
}

interface StatusConfig {
  classes: string;
  icon: ReactNode;
  text: string;
}

const statusPagamentoOptions = ["Pago", "Pendente", "Atrasado", "Cancelado"];
const situacaoOptions = ["Normal", "Urgente", "Bloqueado", "Regular"];
const statusOptions = ["Ativo", "Inativo", "Processando", "Concluído"];

export const StatusBadge = ({
  status,
  dataPagamento,
  dataVencimento,
}: StatusBadgeProps) => {
  const { classes, icon, text } = getStatusConfig(status, dataPagamento, dataVencimento);

  return (
    <div className="w-full inline-flex items-center justify-start">
      <span
        className={`w-36 px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${classes}`}
        aria-label={`Status: ${text}`}
      >
        {icon}
        {text}
      </span>
    </div>
  );
};

const getStatusConfig = (
  status: string,
  dataPagamento: string | Date | null | undefined,
  dataVencimento: string
): StatusConfig => {
  const statusLower = status?.toLowerCase() || "";
  let config: StatusConfig = {
    classes: "bg-gray-100 border border-gray-200 text-gray-800 ",
    icon: <PackageSearch className="h-3 w-3 mr-1 text-gray-600" />,
    text: status || "Desconhecido",
  };

  const vencimento = parseDate(dataVencimento);
  if (!vencimento) {
    return {
      classes: "bg-gray-100 border border-gray-200 text-gray-800",
      icon: <AlertCircle className="h-3 w-3 mr-1 text-gray-600" />,
      text: "Data Inválida",
    };
  }

  if (statusPagamentoOptions.map(s => s.toLowerCase()).includes(statusLower)) {
    switch (statusLower) {
      case "pago":
        config = {
          classes: "bg-green-100 border border-green-200 text-green-800",
          icon: <Check className="h-3 w-3 mr-1 text-green-600" />,
          text: "Pago",
        };
        break;
      case "pendente":
        config = {
          classes: "bg-orange-100 border border-orange-200 text-orange-800",
          icon: <PackageOpen className="h-3 w-3 mr-1 text-orange-600" />,
          text: "Pendente",
        };
        break;
      case "atrasado":
        config = {
          classes: "bg-red-100 border border-red-200 text-red-800",
          icon: <AlertCircle className="h-3 w-3 mr-1 text-red-600" />,
          text: "Atrasado",
        };
        break;
      case "cancelado":
        config = {
          classes: "bg-red-100 border border-red-200 text-red-800",
          icon: <Ban className="h-3 w-3 mr-1 text-red-600" />,
          text: "Cancelado",
        };
        break;
    }
  } else if (situacaoOptions.map(s => s.toLowerCase()).includes(statusLower)) {
    switch (statusLower) {
      case "normal":
        config = {
          classes: "bg-blue-100 border border-blue-200 text-blue-800",
          icon: <Package className="h-3 w-3 mr-1 text-blue-600" />,
          text: "Normal",
        };
        break;
      case "urgente":
        config = {
          classes: "bg-orange-100 border border-orange-200 text-orange-800",
          icon: <AlertCircle className="h-3 w-3 mr-1 text-orange-600" />,
          text: "Urgente",
        };
        break;
      case "bloqueado":
        config = {
          classes: "bg-red-100 border border-red-200 text-red-800",
          icon: <Ban className="h-3 w-3 mr-1 text-red-600" />,
          text: "Bloqueado",
        };
        break;
      case "regular":
        config = {
          classes: "bg-teal-100 border border-teal-200 text-teal-800",
          icon: <Check className="h-3 w-3 mr-1 text-teal-600" />,
          text: "Regular",
        };
        break;
    }
  } else if (statusOptions.map(s => s.toLowerCase()).includes(statusLower)) {
    switch (statusLower) {
      case "ativo":
        config = {
          classes: "bg-green-100 border border-green-200 text-green-800",
          icon: <Check className="h-3 w-3 mr-1 text-green-600" />,
          text: "Ativo",
        };
        break;
      case "inativo":
        config = {
          classes: "bg-red-400 border border-gray-200 text-red-100",
          icon: <Ban className="h-3 w-3 mr-1 text-red-100" />,
          text: "Inativo",
        };
        break;
      case "processando":
        config = {
          classes: "bg-yellow-100 border border-yellow-200 text-yellow-800",
          icon: <PackageOpen className="h-3 w-3 mr-1 text-yellow-600" />,
          text: "Processando",
        };
        break;
      case "concluído":
        config = {
          classes: "bg-emerald-100 border border-emerald-200 text-emerald-800",
          icon: <Check className="h-3 w-3 mr-1 text-emerald-600" />,
          text: "Concluído",
        };
        break;
    }
  } else {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (["gerado", "rejeitado", "confirmado", "remessa", "pendente"].includes(statusLower)) {
      if (vencimento < hoje && !dataPagamento) {
        config = {
          classes: "bg-red-100 border border-red-200 text-red-800",
          icon: <AlertCircle className="h-3 w-3 mr-1 text-red-600" />,
          text: "Atrasado",
        };
      } else {
        config = {
          classes: "bg-orange-100 border border-orange-200 text-orange-800",
          icon: <PackageOpen className="h-3 w-3 mr-1 text-orange-600" />,
          text: "Pendente",
        };
      }
    }
  }

  return config;
};