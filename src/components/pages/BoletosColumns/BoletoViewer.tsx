import { toast } from "sonner";

// Funções de formatação
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

export const formatDatePtBr = (dateStr: string | number | Date) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
};

export const parseDate = (str: string) => {
  if (!str) return new Date(0);

  // Aceita dd/MM/yyyy ou yyyy-MM-dd
  if (str.includes("/")) {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  } else {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
};

export const formatarValorMoeda = (valor: string | number | null) => {
  if (typeof valor === "number") {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  if (typeof valor === "string") {
    const num = Number.parseFloat(
      valor.replace(/[^\d,.]/g, "").replace(",", ".")
    );
    if (!isNaN(num)) {
      return num.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  return valor?.toString() || "0,00";
};

const generateFicticiousBoletoData = (id: string | number) => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1); // 1-30 dias no futuro

  const companies = [
    { name: "Tech Solutions Ltda", cnpj: "12345678000195" },
    { name: "Inovação Digital S.A.", cnpj: "98765432000123" },
    { name: "Serviços Empresariais ME", cnpj: "11223344000156" },
    { name: "Consultoria Avançada Ltda", cnpj: "55667788000199" },
  ];

  const company = companies[Math.floor(Math.random() * companies.length)];
  const valor = (Math.random() * 5000 + 100).toFixed(2); // R$ 100 - R$ 5100

  return {
    id: id,
    numeroNF: `NF-${String(Math.floor(Math.random() * 99999)).padStart(
      5,
      "0"
    )}`,
    empresa: company,
    valor: Number.parseFloat(valor),
    dataVencimento: dueDate.toISOString(),
    dataEmissao: today.toISOString(),
    descricao: "Prestação de serviços de consultoria e desenvolvimento",
    codigoBarras: "23793.39126 60000.000000 00000.000000 0 00000000000000",
    linhaDigitavel: "23793391266000000000000000000000000000000000000",
    status: Math.random() > 0.1 ? "Pendente" : "Cancelado", // 10% chance de cancelado
    observacoes:
      "Pagamento via PIX disponível. Desconto de 2% para pagamento antecipado.",
  };
};

export const useBoletoViewer = () => {

  const showBoletoViewer = async (
    id: string | number,
    parcelaId: string | number,
    _parcela: any = null
  ) => {
    try {
      const loadingId = `loading-boleto-${id}`;

      // Remover qualquer visualizador existente para evitar duplicações
      const existingViewer = document.getElementById(`boleto-viewer-${id}`);
      if (existingViewer) {
        existingViewer.remove();
      }

      // Mostrar loading com design aprimorado
      const loadingEl = document.createElement("div");
      loadingEl.id = loadingId;
      loadingEl.className =
        "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50";
      loadingEl.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-md">
          <div class="relative mb-4">
            <div class="h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-6 w-6 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
          </div>
          <p class="font-medium text-gray-900 dark:text-white">Carregando seu boleto...</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Aguarde um momento</p>
        </div>
      `;
      document.body.appendChild(loadingEl);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Remover o loading
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement) loadingElement.remove();

      // Gerar dados fictícios
      const boletoData = generateFicticiousBoletoData(id);

      // Criar visualizador com dados fictícios
      createBoletoViewerDOM(id, parcelaId, boletoData);
    } catch (error) {
      const loadingId = `loading-boleto-${id || "-"}`;
      const loadingElement = document.getElementById(loadingId);
      if (loadingElement) loadingElement.remove();

      toast.error("Erro ao visualizar boleto", {
        description:
          "Não foi possível carregar o boleto. Tente novamente mais tarde.",
      });
    }
  };

  return { showBoletoViewer };
};

export const createBoletoViewerDOM = (
  boletoId: string | number,
  _parcelaId: string | number,
  boletoData: any
) => {
  // Calcular dias restantes até vencimento
  const dataVencimentoObj = new Date(boletoData.dataVencimento);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimentoSemHoras = new Date(dataVencimentoObj);
  vencimentoSemHoras.setHours(0, 0, 0, 0);

  const diferencaEmTempo = vencimentoSemHoras.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diferencaEmTempo / (1000 * 60 * 60 * 24));

  let statusVencimento = "";
  let vencimentoColor = "bg-blue-100 text-blue-800";

  if (diasRestantes < 0) {
    statusVencimento = "Vencido";
    vencimentoColor = "bg-red-100 text-red-800";
  } else if (diasRestantes === 0) {
    statusVencimento = "Vence hoje";
    vencimentoColor = "bg-orange-100 text-orange-800";
  } else if (diasRestantes === 1) {
    statusVencimento = "Vence amanhã";
    vencimentoColor = "bg-yellow-100 text-yellow-800";
  } else if (diasRestantes <= 5) {
    statusVencimento = `Vence em ${diasRestantes} dias`;
    vencimentoColor = "bg-yellow-100 text-yellow-800";
  } else {
    statusVencimento = `Vence em ${diasRestantes} dias`;
  }

  const isCanceled = boletoData.status === "Cancelado";

  // Criar container do visualizador
  const viewerContainer = document.createElement("div");
viewerContainer.id = `boleto-viewer-${boletoId}`;
viewerContainer.className =
  "fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50";

viewerContainer.innerHTML = `
  <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] h-full flex flex-col border border-gray-200 dark:border-gray-800 transition-all duration-300 opacity-0 scale-95" id="viewer-container-${boletoId}">
    <!-- Cabeçalho -->
    <div class="bg-gradient-to-r from-sky-900 to-zinc-800 p-5 text-white rounded-tl-2xl rounded-tr-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="bg-white/20 p-3 rounded-lg mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-8 w-8">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold">Boleto Bancário (Ficticio)</h2>
            <p class="text-white/80">Documento de Cobrança</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button id="download-mock-${boletoId}" 
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white text-sky-800 hover:bg-blue-50 shadow-sm gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
          <button id="close-viewer-${boletoId}" 
            class="inline-flex items-center justify-center p-2 rounded-lg text-sm font-medium transition-all bg-white/10 hover:bg-white/20 text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Conteúdo rolável -->
    <div class="p-8 space-y-8 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 relative" id="content-container-${boletoId}">
      <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-400 dark:from-gray-800 to-transparent z-10"></div>
      
      <!-- Informações do Beneficiário -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Beneficiário</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">Empresa</label>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">${boletoData.empresa.name}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400">CNPJ</label>
            <p class="text-lg font-mono text-gray-900 dark:text-white">${formatCNPJ(boletoData.empresa.cnpj)}</p>
          </div>
        </div>
      </div>

      <!-- Informações do Boleto -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Número do Documento</label>
          <p class="text-xl font-bold text-gray-900 dark:text-white">${boletoData.numeroNF}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Data de Emissão</label>
          <p class="text-xl font-bold text-gray-900 dark:text-white">${formatDatePtBr(boletoData.dataEmissao)}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Data de Vencimento</label>
          <div class="flex items-center gap-2">
            <p class="text-xl font-bold text-gray-900 dark:text-white">${formatDatePtBr(boletoData.dataVencimento)}</p>
            <span class="${vencimentoColor} text-xs px-2 py-1 rounded-full font-medium">${statusVencimento}</span>
          </div>
        </div>
      </div>

      <!-- Valor -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
        <div class="text-center">
          <label class="block text-sm font-medium text-green-700 dark:text-green-400 mb-2">Valor do Documento</label>
          <p class="text-4xl font-bold text-green-800 dark:text-green-300">${formatCurrency(boletoData.valor)}</p>
        </div>
      </div>

      <!-- Descrição -->
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Descrição dos Serviços</label>
        <p class="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">${boletoData.descrição}</p>
      </div>

      <!-- Código de Barras -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Linha Digitável</label>
          <p class="font-mono text-lg bg-gray-100 dark:bg-gray-800 p-3 rounded border text-center tracking-wider">${boletoData.linhaDigitavel}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Código de Barras</label>
          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded border">
            <div class="flex justify-center">
              <div class="bg-black h-16 w-full max-w-md" style="background: repeating-linear-gradient(90deg, black 0px, black 2px, white 2px, white 4px);"></div>
            </div>
            <p class="font-mono text-sm text-center mt-2 text-gray-600 dark:text-gray-400">${boletoData.codigoBarras}</p>
          </div>
        </div>
      </div>

      <!-- Status e Observações -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Status</label>
          <div class="flex items-center gap-2">
            <div class="${isCanceled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full text-sm font-medium">
              ${boletoData.status}
            </div>
            ${isCanceled ? '<p class="text-sm text-red-600 dark:text-red-400">Este boleto foi cancelado e não é válido para pagamento</p>' : ''}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Observações</label>
          <p class="text-sm text-gray-700 dark:text-gray-300">${boletoData.observacoes}</p>
        </div>
      </div>

      ${isCanceled ? `
        <!-- Banner de cancelamento -->
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-5 w-5 text-red-500 mr-3">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <p class="font-medium text-red-800 dark:text-red-300">Documento Cancelado</p>
              <p class="text-sm text-red-600 dark:text-red-400">Este boleto não pode ser utilizado para pagamento</p>
            </div>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Rodapé -->
    <div class="bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 py-2 px-4 flex items-center justify-between backdrop-blur-sm rounded-br-2xl rounded-bl-2xl">
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 mr-2 text-orange-500">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Documento fictício • Apenas para demonstração</span>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Mock ID: ${boletoId}
      </div>
    </div>
  </div>
`;

  // Adicionar ao corpo do documento
  document.body.appendChild(viewerContainer);

  // Animar a entrada após um pequeno delay
  setTimeout(() => {
    const viewerEl = document.getElementById(`viewer-container-${boletoId}`);
    if (viewerEl) {
      viewerEl.classList.remove("opacity-0", "scale-95");
      viewerEl.classList.add("opacity-100", "scale-100");
    }
  }, 50);

  // Adicionar evento de fechamento com animação de saída
  const closeButton = document.getElementById(`close-viewer-${boletoId}`);
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      const viewerElement = document.getElementById(
        `viewer-container-${boletoId}`
      );
      if (viewerElement) {
        // Animar saída
        viewerElement.classList.remove("opacity-100", "scale-100");
        viewerElement.classList.add("opacity-0", "scale-95");

        // Remover após animação
        setTimeout(() => {
          const containerElement = document.getElementById(
            `boleto-viewer-${boletoId}`
          );
          if (containerElement) {
            containerElement.remove();
          }
        }, 300);
      } else {
        // Fallback se o elemento não for encontrado
        const containerElement = document.getElementById(
          `boleto-viewer-${boletoId}`
        );
        if (containerElement) {
          containerElement.remove();
        }
      }
    });
  }
};


