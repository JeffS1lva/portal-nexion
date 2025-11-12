import { format } from "date-fns";

export const formatCNPJ = (cnpj: string) => {
  if (!cnpj || cnpj.length !== 14) return cnpj;
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
};

export const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatDatePtBr = (dateStr: string | number | Date | null | undefined): string => {
  if (!dateStr) return "";
  const date = typeof dateStr === "string" || typeof dateStr === "number" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return "";
  return format(date, "dd/MM/yyyy");
};

export const parseDate = (str: string | null | undefined): Date => {
  if (!str) return new Date(0);

  // Aceita dd/MM/yyyy ou yyyy-MM-dd
  if (str.includes("/")) {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day); // Cria no fuso horário local
  } else {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // Cria no fuso horário local
  }
};