import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Package, Eye, FileText, MapPin, Sparkles, AlertCircle, CheckCircle, Paperclip, Truck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'pedido' | 'problema' | 'duvida' | 'rastreio' | 'boleto' | 'telaBranca';
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onScrollToBottom: () => void;
  awaitingErrorType?: boolean;
  pendingErrorMessage?: string | null;
  ticketOptions?: null | { ticketNumber: string; screen: string; originalMessage: string };
  showTextarea?: boolean;
  descriptionValue?: string;
  setShowTextarea?: (show: boolean) => void;
  setDescriptionValue?: (value: string) => void;
  sendTicket?: (description?: string) => void;
  resetTicketFlow?: () => void;
  handleFileUploadDescription?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsOpen?: (open: boolean) => void;
  setPendingErrorMessage?: (value: string | null) => void;
  setAwaitingErrorType?: (value: boolean) => void;
  inputValue?: string;
}

export function ChatMessages({
  messages,
  isTyping,
  scrollAreaRef,
  onScrollToBottom,
  awaitingErrorType,
  pendingErrorMessage,
  ticketOptions,
  showTextarea,
  descriptionValue,
  setShowTextarea,
  setDescriptionValue,
  sendTicket,
  resetTicketFlow,
  handleFileUploadDescription,
  setIsOpen,
  inputValue,
}: ChatMessagesProps) {
  const [closingMessage, setClosingMessage] = useState<Message | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => onScrollToBottom(), 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping, showTextarea, awaitingErrorType, inputValue, onScrollToBottom]);

  const isProblemaMessage = (text: string) => text.includes('PROBLEMA') || text.includes('⚠️');
  const isPedidoMessage = (text: string) => text.includes('TELA DE PEDIDOS') || text.includes('📦');
  const isBoletoMessage = (text: string) => text.includes('BOLETOS') || text.includes('💰');
  const isRastreioMessage = (text: string) => text.includes('RASTREIO') || text.includes('🚚');

  const handleCloseSupport = () => {
    const thankYouMessage: Message = {
      id: `bot-thankyou-${Date.now()}`,
      text: '🙏 Obrigado pelo contato! Encerrando suporte...',
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal',
    };

    setClosingMessage(thankYouMessage);

    setTimeout(() => {
      setClosingMessage(null);
      resetTicketFlow?.();
      setIsOpen?.(false);
    }, 3000);
  };

  return (
    <ScrollArea ref={scrollAreaRef} className="scroll-area flex-1 px-3 py-3 min-h-0 sm:px-4 sm:py-4">
      <div className="space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`message-bubble max-w-[85%] sm:max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 transition-all duration-300 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : message.type === 'problema'
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-2 border-gradient-to-r from-red-600 to-pink-600 shadow-md dark:border-2 dark:border-red-500'
                  : message.type === 'pedido'
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-gray-800 dark:text-gray-200 border border-emerald-300 dark:border-emerald-700 shadow-sm'
                  : message.type === 'telaBranca'
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-yellow-700 shadow-sm'
                  : message.type === 'rastreio'
                  ? 'bg-green-50 dark:bg-green-900/30 text-gray-800 dark:text-gray-200 border border-green-300 dark:border-green-700 shadow-sm'
                  : message.type === 'boleto'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200 border border-blue-300 dark:border-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm'
              } animate-in fade-in duration-300`}
            >
              {isProblemaMessage(message.text) && message.sender === 'bot' && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600 animate-pulse sm:h-5 sm:w-5" />
                    <span className="font-bold text-red-800 dark:text-red-400 text-xs sm:text-sm">⚠️ URGENTE!</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line">{message.text}</p>
                </div>
              )}

              {isPedidoMessage(message.text) && message.sender === 'bot' && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Package className="h-3 w-3 text-emerald-600 dark:text-emerald-400 sm:h-4 sm:w-4" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-400 text-xs sm:text-sm">Tela Pedidos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[0.65rem] sm:text-xs">
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Eye className="h-2 w-2 text-blue-600 dark:text-blue-400 sm:h-3 sm:w-3" />
                      <span>👁️ Ver + PDF</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <FileText className="h-2 w-2 text-purple-600 dark:text-purple-400 sm:h-3 sm:w-3" />
                      <span>📄 NF + XML</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <MapPin className="h-2 w-2 text-green-600 dark:text-green-400 sm:h-3 sm:w-3" />
                      <span>🚚 Rastreio</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Sparkles className="h-2 w-2 text-amber-600 dark:text-amber-400 sm:h-3 sm:w-3" />
                      <span>🔍 Filtros</span>
                    </div>
                  </div>
                </div>
              )}

              {isRastreioMessage(message.text) && message.sender === 'bot' && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Truck className="h-3 w-3 text-green-600 dark:text-green-400 sm:h-4 sm:w-4" />
                    <span className="font-bold text-green-800 dark:text-green-400 text-xs sm:text-sm">Rastreio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line">{message.text}</p>
                </div>
              )}

              {isBoletoMessage(message.text) && message.sender === 'bot' && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400 sm:h-4 sm:w-4" />
                    <span className="font-bold text-blue-800 dark:text-blue-400 text-xs sm:text-sm">Boletos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[0.65rem] sm:text-xs">
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <CheckCircle className="h-2 w-2 text-green-600 dark:text-green-400 sm:h-3 sm:w-3" />
                      <span>✅ Baixar</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <FileText className="h-2 w-2 text-purple-600 dark:text-purple-400 sm:h-3 sm:w-3" />
                      <span>📄 2ª Via</span>
                    </div>
                  </div>
                </div>
              )}

              {!isProblemaMessage(message.text) &&
                !isPedidoMessage(message.text) &&
                !isRastreioMessage(message.text) &&
                !isBoletoMessage(message.text) && (
                  <p
                    className={`text-xs sm:text-sm font-medium whitespace-pre-line ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.text}
                  </p>
                )}

              <span
                className={`text-[0.65rem] sm:text-xs opacity-70 mt-1 sm:mt-2 block text-right ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {closingMessage && (
          <div className="flex justify-start">
            <div className="message-bubble max-w-[85%] sm:max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all animate-in fade-in duration-300">
              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line">{closingMessage.text}</p>
              <span className="text-[0.65rem] sm:text-xs opacity-70 mt-1 sm:mt-2 block text-gray-500 dark:text-gray-400">
                {closingMessage.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm transition-all duration-300 animate-in fade-in">
              <div className="flex space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        {awaitingErrorType && pendingErrorMessage && !ticketOptions && (
          <div className="flex justify-start">
            <div className="message-bubble max-w-[85%] sm:max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-700 shadow-md transition-all animate-in fade-in duration-300">
              {!showTextarea ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs sm:text-sm font-semibold text-orange-800 dark:text-orange-400 mb-2">Como prefere continuar?</p>
                  <Button
                    onClick={() => setShowTextarea?.(true)}
                    variant="outline"
                    className="w-full border-orange-300 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-800/30 text-xs sm:text-sm"
                  >
                    ✍️ Quero descrever o problema
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm font-semibold text-orange-800 dark:text-orange-400">Descreva o problema:</p>
                  <Textarea
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue?.(e.target.value)}
                    placeholder="Ex: Quando clico em 'Ver Pedido', aparece tela branca..."
                    className="resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-xs sm:text-sm"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button asChild size="icon" variant="ghost" className="hover:bg-orange-100 dark:hover:bg-orange-800/30">
                      <label htmlFor="file-upload-textarea" className="cursor-pointer">
                        <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-gray-800 dark:text-gray-200" />
                        <input
                          id="file-upload-textarea"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUploadDescription}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    <Button
                      onClick={() => sendTicket?.(descriptionValue)}
                      className="flex-1 bg-gradient-to-bl from-indigo-900 to-slate-900/90 hover:from-indigo-700 hover:to-slate-700 text-xs sm:text-sm"
                      disabled={!descriptionValue?.trim()}
                    >
                      📤 Enviar Descrição
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {ticketOptions && (
          <div className="flex justify-center">
            <Button
              onClick={handleCloseSupport}
              className="border-gray-300 dark:border-gray-800 hover:bg-gray-950 dark:hover:bg-gray-300 w-full cursor-pointer text-xs sm:text-sm"
              disabled={!!closingMessage}
            >
              ✅ Encerrar suporte
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}