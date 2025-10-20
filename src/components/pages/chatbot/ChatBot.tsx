import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Minimize2, Maximize2, AlertCircle, FileText, AlertTriangle, BarChart3, Truck, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessages } from '@/components/pages/chatbot/ChatMessages';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'pedido' | 'problema' | 'duvida' | 'rastreio' | 'boleto' | 'telaBranca';
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 Oi! Sou o Assistente Nexion - 24h online 

💬 Me fala o que tá rolando:
• Erro na tela de pedidos 
• Boleto não carrega 
• Dashboard sumiu 
• Rastreio falhou

🎯 OU CLIQUE nos ícones ao lado 

Te ajudo em 2s 😊`,
      sender: 'bot',
      type: 'normal',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAssistantText, setShowAssistantText] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [awaitingErrorType, setAwaitingErrorType] = useState(false);
  const [pendingErrorMessage, setPendingErrorMessage] = useState<string | null>(null);
  const [ticketOptions, setTicketOptions] = useState<null | { ticketNumber: string; screen: string; originalMessage: string }>(null);
  const [showTextarea, setShowTextarea] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => scrollToBottom(), [messages, isTyping, scrollToBottom]);
  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  useEffect(() => {
    setShowAssistantText(true);
    textTimeoutRef.current = setTimeout(() => {
      setShowAssistantText(false);
    }, 3000);

    return () => {
      if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
    };
  }, []);

  const classifyMessage = (text: string): 'normal' | 'problema' | 'duvida' | 'telaBranca' => {
    const lower = text.toLowerCase();
    if (lower.includes('tela branca') || lower.includes('tela não carrega')) return 'telaBranca';
    const problemaKeywords = ['erro', 'bug', 'falha', 'quebrou', 'não funciona', 'não carrega', 'não abre', 'sumiu', 'branco', 'crash', 'parou', 'travou', 'lento', '500', '404', 'deu erro', 'está com erro', 'tá dando erro', 'não tá funcionando'];
    if (problemaKeywords.some((k) => lower.includes(k))) return 'problema';
    const duvidaKeywords = ['como', 'onde', 'explicar', 'funciona', 'fazer', 'ver', 'encontrar', 'como uso'];
    if (duvidaKeywords.some((k) => lower.includes(k))) return 'duvida';
    return 'normal';
  };

  const detectScreen = (message: string) => {
    const lower = message.toLowerCase();
    if (
      lower.includes('rastreio') ||
      lower.includes('encomenda') ||
      lower.includes('entrega') ||
      lower.includes('rastrear') ||
      lower.includes('status entrega') ||
      lower.includes('código rastreio') ||
      lower.includes('localização') ||
      lower.includes('rastreamento') ||
      lower.includes('pacote') ||
      lower.includes('produto comprado') ||
      lower.includes('compra') ||
      lower.includes('onde está') ||
      lower.includes('chegou') ||
      lower.includes('tracking')
    )
      return 'Rastreio';
    if (
      lower.includes('pedido') ||
      lower.includes('pedidos') ||
      lower.includes('código do pedido') ||
      lower.includes('xml') ||
      lower.includes('nf') ||
      lower.includes('nota fiscal') ||
      lower.includes('pdf pedido') ||
      lower.includes('detalhes pedido') ||
      lower.includes('ordem') ||
      lower.includes('compra realizada') ||
      lower.includes('item comprado')
    )
      return 'Tela de Pedidos';
    if (
      lower.includes('dashboard') ||
      lower.includes('relatório') ||
      lower.includes('gráfico') ||
      lower.includes('insights') ||
      lower.includes('análise') ||
      lower.includes('estatísticas') ||
      lower.includes('dados') ||
      lower.includes('visão geral') ||
      lower.includes('grafico') ||
      lower.includes('relatorio') ||
      lower.includes('painel') ||
      lower.includes('estatistica') ||
      lower.includes('analise')
    )
      return 'Dashboard';
    if (
      lower.includes('boleto') ||
      lower.includes('pagamento') ||
      lower.includes('2ª via') ||
      lower.includes('baixar boleto') ||
      lower.includes('fatura') ||
      lower.includes('conta') ||
      lower.includes('débito') ||
      lower.includes('debito') ||
      lower.includes('faturamento') ||
      lower.includes('pagar') ||
      lower.includes('vencimento') ||
      lower.includes('boleto vencido')
    )
      return 'Tela de Boletos';
    return 'sua tela';
  };

  const getQuickFixes = (tela: string) => {
    const fixes: { [key: string]: string } = {
      'Tela de Pedidos': `• Atualizar página\n• Limpar cache\n• Tentar outro navegador`,
      'Tela de Boletos': `• Atualizar tela\n• Verificar internet\n• Abrir em outro navegador`,
      Rastreio: `• Verificar internet\n• Confirme o número do pedido\n• Aguarde atualização`,
      Dashboard: `• Salvar e atualizar (F5)\n• Aguarde carregamento\n• Tela cheia (F11)`,
      'sua tela': `• Atualizar agora\n• Tente outro navegador\n• Limpar cache`,
    };
    return fixes[tela] || fixes['sua tela'];
  };

  const handleFileUploadDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: `📸 Screenshot anexada! Você ainda precisa enviar a descrição para criar o ticket.`,
        sender: 'bot',
        type: 'problema',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      e.target.value = '';
    }
  };

  const resetTicketFlow = () => {
    setAwaitingErrorType(false);
    setPendingErrorMessage(null);
    setShowTextarea(false);
    setDescriptionValue('');
    setTicketOptions(null);
  };

  const sendTicket = (userErrorType?: string) => {
    if (!pendingErrorMessage) return;
    const ticketNumber = Date.now().toString().slice(-6);
    const screen = detectScreen(pendingErrorMessage.toLowerCase());
    const errorTypeText = userErrorType ? `Tipo de erro: "${userErrorType}"\n` : '';

    const botMessage: Message = {
      id: Date.now().toString(),
      text: `⚠️ Recebido! ${errorTypeText}Já identifiquei o problema em ${screen} ✅\n\nSoluções rápidas:\n${getQuickFixes(screen)}\n\n📸 Pode enviar screenshot se quiser\n⏰ Retorno em 30min no seu email`,
      sender: 'bot',
      type: 'problema',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setTicketOptions({ ticketNumber, screen, originalMessage: pendingErrorMessage });
    setAwaitingErrorType(false);
    setPendingErrorMessage(null);
    setShowTextarea(false);
    setDescriptionValue('');
  };

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    sendUserMessage(inputValue);
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendUserMessage = (text: string, openTextarea = false) => {
    if (!text.trim()) return;

    const messageType = classifyMessage(text);
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: messageType,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    const dynamicBotResponse = async () => {
      setIsTyping(true);
      const partials = [
        '🤔 Pensando... vamos descobrir juntos!',
        '🔍 Verificando todos os detalhes...',
        '⚡ Analisando rapidamente...',
      ];

      const botMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          text: partials[0],
          sender: 'bot',
          type: 'normal',
          timestamp: new Date(),
        },
      ]);

      for (let i = 1; i < partials.length; i++) {
        await new Promise((r) => setTimeout(r, 900));
        setMessages((prev) =>
          prev.map((m) => (m.id === botMessageId ? { ...m, text: partials[i] } : m))
        );
      }

      await new Promise((r) => setTimeout(r, 800));

      if (messageType === 'problema' && ticketOptions) {
        setTicketOptions(null);
      }

      if (openTextarea || messageType === 'problema' || messageType === 'telaBranca') {
        setPendingErrorMessage(text);
        setAwaitingErrorType(true);
        setShowTextarea(true);
        const screen = detectScreen(text.toLowerCase());
        const screenshotInstructions =
          messageType === 'telaBranca'
            ? `\n\n📸 Para nos ajudar a entender melhor, envie uma captura da tela:\n• Windows: Pressione Print Screen ou Win + Shift + S, cole (Ctrl+V) em um editor (ex.: Paint) e salve.\n• Mac: Pressione Cmd + Shift + 4, selecione a área, e a imagem será salva na área de trabalho.\n• Navegador: Use extensões como GoFullPage ou pressione F12 para inspecionar e capturar.`
            : '';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  text: `⚠️ Entendi! Vamos criar um ticket rapidinho. Descreva o problema na ${screen} para que eu possa te ajudar da melhor forma ✨${screenshotInstructions}`,
                  type: messageType === 'telaBranca' ? 'telaBranca' : 'problema',
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? {
                  ...m,
                  text: `🤔 Não sei se entendi direito. Me conta mais ou clique nos ícones para escolher uma opção 😊`,
                  type: 'normal',
                }
              : m
          )
        );
      }

      setIsTyping(false);
    };

    dynamicBotResponse();
  };

  const quickActions = [
    { icon: AlertCircle, value: 'erro no pedido', tooltip: 'Erro Pedidos', color: 'text-red-600', openTextarea: true },
    { icon: FileText, value: 'como vejo boleto', tooltip: 'Boleto', color: 'text-blue-600', openTextarea: true },
    { icon: BarChart3, value: 'erro dashboard', tooltip: 'Dashboard', color: 'text-purple-600', openTextarea: true },
    { icon: Truck, value: 'problema rastreio', tooltip: 'Rastreio', color: 'text-green-600', openTextarea: true },
    { icon: AlertTriangle, value: 'tela não carrega', tooltip: 'Tela Branca', color: 'text-yellow-600', openTextarea: true },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setMessages([
      {
        id: '1',
        text: `👋 Oi! Sou o Assistente Nexion - 24h online 

💬 Me fala o que tá rolando:
• Erro na tela de pedidos 
• Boleto não carrega 
• Dashboard sumiu 
• Rastreio falhou

🎯 OU CLIQUE nos ícones para escolher uma opção 

Te ajudo em 2s 😊`,
        sender: 'bot',
        type: 'normal',
        timestamp: new Date(),
      },
    ]);
    setAwaitingErrorType(false);
    setPendingErrorMessage(null);
    setShowTextarea(false);
    setDescriptionValue('');
    setTicketOptions(null);

    sendUserMessage(action.value, action.openTextarea);
  };

  const chatbotVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };

  const textBubbleVariants = {
    hidden: {
      opacity: 0,
      x: 10,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const contentVariants = {
    minimized: {
      opacity: 0,
      scale: 0.95,
      height: 0,
      display: 'none',
      transition: { duration: 0.2, ease: 'easeInOut', when: 'afterChildren' },
    },
    maximized: {
      opacity: 1,
      scale: 1,
      height: 'auto',
      display: 'flex',
      transition: { duration: 0.2, ease: 'easeInOut', when: 'beforeChildren' },
    },
  };

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.div
          key="chatbot-button"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6 z-50"
          onMouseEnter={() => {
            setShowAssistantText(true);
            if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
          }}
          onMouseLeave={() => {
            textTimeoutRef.current = setTimeout(() => {
              setShowAssistantText(false);
            }, 1000);
          }}
        >
          <motion.div
            variants={textBubbleVariants}
            initial="hidden"
            animate={showAssistantText ? 'visible' : 'hidden'}
            className="hidden sm:block bg-indigo-900 text-white text-xs rounded-lg px-3 py-2 shadow-md max-w-[500px]"
          >
             Assistente Nexion — suporte rápido e profissional para a plataforma. 🚀
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: [1, 1.05, 1],
              transition: { repeat: 3, duration: 0.8, ease: 'easeInOut' },
            }}
          >
            <Button
              onClick={() => {
                setIsOpen(true);
                setMessages([
                  {
                    id: '1',
                    text: `👋 Oi! Sou o Assistente Nexion - 24h online 

💬 Me fala o que tá rolando:
• Erro na tela de pedidos 
• Boleto não carrega 
• Dashboard sumiu 
• Rastreio falhou

🎯 OU CLIQUE nos ícones para escolher uma opção 

Te ajudo em 2s 😊`,
                    sender: 'bot',
                    type: 'normal',
                    timestamp: new Date(),
                  },
                ]);
                setIsMinimized(false);
                setAwaitingErrorType(false);
                setPendingErrorMessage(null);
                setShowTextarea(false);
                setDescriptionValue('');
                setTicketOptions(null);
                setShowAssistantText(false);
              }}
              className="h-12 w-12 rounded-full shadow-2xl shadow-indigo-700 bg-gradient-to-bl from-indigo-800 to-slate-800/90 hover:from-indigo-700 hover:to-slate-700 transition-all duration-300 sm:h-14 sm:w-14 z-50 cursor-pointer"
              size="icon"
              aria-label="Abrir Assistente Nexion"
            >
              <Bot className="h-6 w-6 sm:h-7 sm:w-7 dark:text-white" />
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="chatbot-container"
          variants={chatbotVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed bottom-4 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 z-50 chatbot-container
            sm:bottom-6 sm:right-3
            ${isMinimized ? 'w-64 h-10 sm:w-80 sm:h-11' : showTextarea ? 'w-[90vw] h-[80vh] sm:w-[640px] sm:h-[700px]' : 'w-[90vw] h-[80vh] sm:w-[520px] sm:h-[700px]'}
            max-w-[100vw] max-h-[100vh] transition-all duration-200`}
        >
          <style>
            {`
              @media (max-width: 640px) {
                .chatbot-container {
                  bottom: 0;
                  right: 0;
                  border-radius: 0;
                  width: 100vw !important;
                  height: 100vh !important;
                  max-height: 100vh !important;
                }
                .chatbot-container.minimized {
                  width: 100% !important;
                  height: 48px !important;
                  border-radius: 0;
                }
                .quick-actions {
                  flex-direction: row;
                  justify-content: space-around;
                  padding: 0.5rem;
                  width: 100%;
                  border-left: none;
                  border-top: 1px solid theme('colors.gray.200');
                }
                .quick-actions button {
                  width: 48px;
                  height: 48px;
                }
                .tooltip-content {
                  display: none;
                }
                .input-container {
                  padding: 0.5rem;
                }
                .input-container input {
                  font-size: 0.875rem;
                }
                .scroll-area {
                  padding: 0.5rem;
                }
                .message-bubble {
                  max-width: 95%;
                }
              }
            `}
          </style>

          <div className="flex items-center justify-between p-3 bg-gradient-to-bl from-indigo-900 to-slate-900/90 text-white rounded-t-lg shrink-0 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Avatar className="h-7 w-7 bg-white sm:h-8 sm:w-8">
                <AvatarFallback className="bg-white text-indigo-600 text-xs font-bold">
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">Assistente Nexion</h3>
                <p className="text-[0.65rem] sm:text-xs"> • Erros + Dúvidas</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                onClick={() => setIsMinimized(!isMinimized)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20 cursor-pointer sm:h-8 sm:w-8"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20 cursor-pointer sm:h-8 sm:w-8"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            <motion.div
              key="chatbot-content"
              variants={contentVariants}
              animate={isMinimized ? 'minimized' : 'maximized'}
              initial={isMinimized ? 'minimized' : 'maximized'}
              className="flex flex-1 overflow-hidden flex-col"
            >
              <div className="flex flex-1 overflow-hidden flex-col-reverse sm:flex-row">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ChatMessages
                    messages={messages}
                    isTyping={isTyping}
                    scrollAreaRef={scrollAreaRef}
                    onScrollToBottom={scrollToBottom}
                    awaitingErrorType={awaitingErrorType}
                    pendingErrorMessage={pendingErrorMessage}
                    ticketOptions={ticketOptions}
                    showTextarea={showTextarea}
                    descriptionValue={descriptionValue}
                    setShowTextarea={setShowTextarea}
                    setDescriptionValue={setDescriptionValue}
                    sendTicket={sendTicket}
                    resetTicketFlow={resetTicketFlow}
                    handleFileUploadDescription={handleFileUploadDescription}
                    setIsOpen={setIsOpen}
                    setPendingErrorMessage={setPendingErrorMessage}
                    setAwaitingErrorType={setAwaitingErrorType}
                    inputValue={inputValue}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="quick-actions w-full sm:w-20 bg-gray-500/10 dark:bg-gray-700 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-600 p-2 sm:p-3 flex sm:flex-col justify-around sm:space-y-3"
                >
                  <TooltipProvider>
                    {quickActions.map((action, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-10 w-10 rounded-full p-0 hover:bg-gray-200 dark:hover:bg-gray-600 sm:h-12 sm:w-12"
                            onClick={() => handleQuickAction(action)}
                          >
                            <action.icon className={`h-5 w-5 ${action.color} sm:h-6 sm:w-6`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="tooltip-content w-48 sm:w-auto">
                          <p>{action.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </motion.div>
              </div>

              <div className="input-container p-3 border-t border-gray-200 dark:border-gray-700 shrink-0 sm:p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ex: erro no dashboard..."
                    className="flex-1 text-sm sm:text-base dark:border-1 dark:border-slate-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-gradient-to-bl from-indigo-900 to-slate-900/90 hover:from-indigo-700 hover:to-slate-700 h-10 w-10 sm:h-10 sm:w-10"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4 dark:text-white" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}