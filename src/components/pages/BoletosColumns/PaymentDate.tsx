import { formatDatePtBr } from "@/utils/boletos/formatters";

interface PaymentDateProps {
  status: string;
  dataPagamento?: string | Date | null;
}

export const PaymentDate = ({ status, dataPagamento }: PaymentDateProps) => {
  const statusLower = status?.toLowerCase() || "";
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normaliza para meia-noite no fuso local
  const formattedCurrentDate = formatDatePtBr(currentDate);

  if (statusLower === "concluído") {
    // Verifica se dataPagamento é válida; caso contrário, usa a data atual
    const formattedDate = dataPagamento && !isNaN(new Date(dataPagamento).getTime())
      ? formatDatePtBr(dataPagamento)
      : formattedCurrentDate;
    return <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-1.5 rounded-sm">{formattedDate}</span>;
  } else if (statusLower === "pendente") {
    return <span className="text-zinc-400 ">Aguardando pagamento</span>;
  } else if (statusLower === "inativo") {
    return <span className="text-red-100 p-1.5 bg-red-500 rounded-sm">Cancelado</span>;
  } else {
    return <span className="text-zinc-700  p-1.5 rounded-sm animate-pulse">Aguardando pagamento...</span>;
  }
};