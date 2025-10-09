// src/features/auth/hooks/useAuth.ts

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData, ApiError } from "../types/auth.types";
import { validateEmail } from "../utils/validation.utils";
import {
  isErrorRequiringModal,
} from "../utils/error.utils";

import { showErrorToast, showSuccessToast } from "@/utils/toast.utils";

export const useAuth = (onLoginSuccess: (userData: UserData) => void) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFirstAccess, setIsFirstAccess] = useState<boolean>(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [showSuggestionAlert, setShowSuggestionAlert] =
    useState<boolean>(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState<boolean>(false);
  const navigate = useNavigate();

  // Reset error count after 10 minutes
  useEffect(() => {
    if (errorCount > 2) {
      const timer = setTimeout(() => {
        setErrorCount(0);
      }, 10 * 60 * 1000); // 10 minutes
      return () => clearTimeout(timer);
    }
  }, [errorCount]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    if (!password) {
      setError("Por favor, insira sua senha");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // MOCK: Simulando uma resposta fictícia de login bem-sucedido
      // Em ambiente de desenvolvimento, sempre retorna sucesso com dados fictícios
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede

      const token = "fake_token_123456789";
      const firstName = email.split("@")[0];
      const lastName = "";

      // Reset error count on successful login
      setErrorCount(0);
      setShowSuggestionAlert(false);

      // Armazenamento seguro do token e dados do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");

      const login = firstName;
      const userData = {
        login,
        email,
        firstName,
        lastName,
        token,
      };

      // Armazenar dados do usuário para persistência
      localStorage.setItem("authData", JSON.stringify(userData));

      // Garantir que o consentimento de cookies existe
      if (!localStorage.getItem("cookieConsent")) {
        localStorage.setItem("cookieConsent", "accepted");
      }

      // Chamar o callback de sucesso
      onLoginSuccess(userData);

      // Mostrar toast de sucesso
      showSuccessToast("Login bem-sucedido", "Bem-vindo ao sistema!");

      // Redirecionamento com pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate("/inicio", { replace: true });
      }, 100);
    } catch (error: any) {
      // MOCK: Em modo fictício, não há erros de API reais, mas mantém estrutura para compatibilidade
      const typedError: ApiError = { message: "Erro fictício no login" };
      const errorMessage = "Falha no login fictício. Tente novamente.";
      setError(errorMessage);
      showErrorToast("Falha no login", errorMessage);

      // Check if it's a timeout or connection error OR a 500 error
      if (isErrorRequiringModal(typedError)) {
        const newCount = errorCount + 1;
        setErrorCount(newCount);

        // Mostrar modal somente após 3 erros consecutivos de timeout ou 500
        if (newCount >= 3) {
          setShowTimeoutModal(true);
        } else {
          // Para menos de 3 erros, mostrar apenas o alerta de sugestão
          setShowSuggestionAlert(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (
    fromModal: boolean = false
  ): Promise<void> => {
    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido");
      showErrorToast(
        "Email inválido",
        "Por favor, insira um email válido para solicitar acesso"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // MOCK: Simulando uma resposta fictícia de solicitação de acesso bem-sucedida
      // Em ambiente de desenvolvimento, sempre retorna sucesso
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay de rede

      setError("");
      showSuccessToast(
        "Solicitação enviada com sucesso!",
        "Verifique seu e-mail para continuar. Redirecionando para o login..."
      );

      // Reset error count on successful request
      setErrorCount(0);
      setShowSuggestionAlert(false);

      // Fechar o modal de timeout se estiver visível
      if (fromModal) {
        setShowTimeoutModal(false);
      }

      // Limpar o campo de email
      setEmail("");

      // Volta para o formulário de login normal após um breve delay
      setTimeout(() => {
        setIsFirstAccess(false);
      }, 1000);
    } catch (error: any) {
      // MOCK: Em modo fictício, não há erros reais, mas mantém estrutura
      const typedError: ApiError = { message: "Erro fictício na solicitação" };
      const errorMessage = "Falha na solicitação fictícia. Tente novamente.";
      setError(errorMessage);
      showErrorToast("Falha na solicitação", errorMessage);

      // Check if it's a timeout or connection error OR a 500 error
      if (isErrorRequiringModal(typedError)) {
        setErrorCount(errorCount + 1);
        // Se estiver no modal, mantém o modal aberto
        if (fromModal) {
          setShowTimeoutModal(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFirstAccessToggle = (value: boolean): void => {
    setIsFirstAccess(value);
    setError(""); // Limpa erros ao alternar modos

    // Hide suggestion alert and timeout modal when toggling
    setShowSuggestionAlert(false);
    setShowTimeoutModal(false);
  };

  const openForgotPassword = (fromModal: boolean = false): void => {
    setForgotPasswordOpen(true);
    setShowSuggestionAlert(false);

    // Fechar o modal de timeout se chamado a partir dele
    if (fromModal) {
      setShowTimeoutModal(false);
    }
  };

  const handleCloseTimeoutModal = (): void => {
    setShowTimeoutModal(false);
  };

  const handleRequestAccessFromModal = (): void => {
    handleRequestAccess(true);
  };

  const handleForgotPasswordFromModal = (): void => {
    openForgotPassword(true);
  };

  const navigateToLoginWithFirstAccess = (email: string) => {
    setEmail(email);
    setIsFirstAccess(true);
    setShowTimeoutModal(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isFirstAccess,
    forgotPasswordOpen,
    setForgotPasswordOpen,
    showSuggestionAlert,
    showTimeoutModal,
    handleLogin,
    handleRequestAccess,
    handleFirstAccessToggle,
    openForgotPassword,
    handleCloseTimeoutModal,
    handleRequestAccessFromModal,
    handleForgotPasswordFromModal,
    navigateToLoginWithFirstAccess,
  };
};