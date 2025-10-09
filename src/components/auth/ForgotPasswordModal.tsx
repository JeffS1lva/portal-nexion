// src/features/auth/components/ForgotPasswordModal.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ForgotPasswordModalProps } from "./types/auth.types";
import { validateEmail } from "./utils/validation.utils";
import { makeApiCallWithFallback } from "./utils/api.utils";
import { handleFirstAccessError } from "./utils/error.utils";
import { showErrorToast, showSuccessToast } from "@/utils/toast.utils";
import { Mail, Send, AlertCircle, CheckCircle2, Lock, Sparkles } from "lucide-react";

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  onClose,
  defaultEmail = "",
}) => {
  const [email, setEmail] = useState<string>(defaultEmail);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleForgotPassword = async (): Promise<void> => {
    let emailToReset = email;
    setError(""); // Limpar erro anterior

    // Validate email
    if (!emailToReset || !validateEmail(emailToReset)) {
      setError("Por favor, insira um e-mail válido para continuar");
      showErrorToast(
        "E-mail inválido",
        "Por favor, insira um e-mail válido para continuar"
      );
      return;
    }

    setIsProcessing(true);

    try {
      const response = await makeApiCallWithFallback(
        "/api/internal/Auth/reset-password",
        "/api/external/Auth/reset-password",
        { email: emailToReset },
        30000
      );

      if (response.status === 200) {
        showSuccessToast(
          "Solicitação enviada",
          "Link de acesso enviado com sucesso. Verifique seu e-mail."
        );
        onClose();
      } else {
        throw new Error("Resposta inesperada do servidor");
      }
    } catch (error: any) {
      const errorMessage = handleFirstAccessError(error);
      setError(errorMessage);
      showErrorToast("Falha na solicitação", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-yellow-400/20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-8 left-6 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Header with Glass Effect */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" style={{ animation: 'spin 20s linear infinite' }}></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" style={{ animation: 'bounce 3s ease-in-out infinite' }}></div>
        
        <div className="relative z-10">
          <DialogHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="relative p-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <Lock className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-yellow-900" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight">
              Recuperar Senha
            </DialogTitle>
            <DialogDescription className="text-indigo-100 text-sm leading-relaxed max-w-xs mx-auto">
              Não se preocupe! Vamos ajudá-lo a recuperar o acesso à sua conta de forma rápida e segura.
            </DialogDescription>
          </DialogHeader>
        </div>
      </div>

      {/* Form Content with Glass Morphism */}
      <div className="relative p-8 space-y-6">
        <div className="space-y-4">
          <Label 
            htmlFor="reset-email" 
            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
          >
            <div className="p-1 bg-blue-100 rounded-full">
              <Mail className="h-3 w-3 text-blue-600" />
            </div>
            Seu endereço de e-mail
          </Label>
          
          <div className="relative group">
            <Input
              id="reset-email"
              type="email"
              value={email}
              placeholder="exemplo@dominio.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isProcessing}
              className={`
                pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 
                bg-white/80 backdrop-blur-sm font-medium text-gray-800
                focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                group-hover:bg-white/90 group-hover:shadow-lg
                ${error ? 'border-red-300 bg-red-50/80 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-blue-300'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            
            {/* Input Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            
            {/* Success Icon */}
            {email && validateEmail(email) && !error && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Error Message */}
        {error && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50 to-blue-50 border border-red-200 p-5 animate-in slide-in-from-top-2 duration-300">
            <div className="absolute inset-0 bg-red-100/30"></div>
            <div className="relative flex items-start gap-3">
              <div className="p-1 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">Ops! Algo deu errado</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <DialogFooter className="p-8 pt-0">
        <div className="w-full space-y-4">
          <Button
            type="button"
            variant="bottomPassword"
            onClick={handleForgotPassword}
            disabled={isProcessing || !email || !validateEmail(email)}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            {/* Button Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {isProcessing ? (
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                </div>
                <span className="relative">Enviando solicitação...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 relative">
                <Send className="h-5 w-5" />
                <span>Enviar Solicitação</span>
              </div>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Suas informações estão protegidas e seguras
            </p>
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

export default ForgotPasswordModal;