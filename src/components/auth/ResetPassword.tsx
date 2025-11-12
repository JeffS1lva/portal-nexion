import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, BadgeAlert, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ResetPasswordProps {
  closeModal: () => void;
  userEmail?: string;
}

export function ResetPassword({
  closeModal,
  userEmail = "",
}: ResetPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>(userEmail || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    if (value.length <= 8) {
      setter(value);
    }
  };

  const handleSaveChanges = async () => {
    if (!email || !currentPassword || !newPassword) {
      toast.error("Email, senha atual e nova senha são obrigatórios.", {
        style: {
          backgroundColor: "white",
          color: "red",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
        },
      });
      return;
    }

    if (newPassword === confirmPassword && newPassword.length === 8) {
      try {
        setIsLoading(true);

        const payload = {
          currentPassword,
          newPassword,
          email,
        };

        const response = await fetch("/api/external/Auth/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const responseData = await response.text();
        setApiResponse(responseData);

        if (!response.ok) {
          throw new Error(
            `Falha ao alterar a senha: ${response.status} - ${responseData}`
          );
        }

        closeModal();
        toast.success("Sua senha foi alterada com sucesso!", {
          style: {
            backgroundColor: "white",
            color: "green",
            boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
          },
        });

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error(
          `Erro ao redefinir a senha: ${
            error instanceof Error
              ? error.message
              : "Tente novamente mais tarde."
          }`,
          {
            style: {
              backgroundColor: "white",
              color: "red",
              boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
            },
            duration: 5000,
          }
        );
      } finally {
        setIsLoading(false);
      }
    } else if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem. Tente novamente.", {
        style: {
          backgroundColor: "white",
          color: "red",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
        },
      });
    } else if (newPassword.length !== 8) {
      toast.error("A senha deve ter exatamente 8 caracteres.", {
        style: {
          backgroundColor: "white",
          color: "red",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.4)",
        },
      });
    }
  };

  const isPasswordValid = newPassword.length === 8;
  const isPasswordMismatch =
    newPassword !== confirmPassword && confirmPassword.length > 0;
  const isButtonDisabled =
    !email ||
    currentPassword.length === 0 ||
    newPassword.length !== 8 ||
    confirmPassword.length !== 8 ||
    newPassword !== confirmPassword ||
    isLoading;

  const buttonText = isLoading
    ? "Processando..."
    : isButtonDisabled
    ? "Bloqueado"
    : "Salvar Alterações";

  const getButtonTitle = () => {
    if (isLoading) {
      return "Processando sua solicitação";
    } else if (!email) {
      return "Informe seu email";
    } else if (currentPassword.length === 0) {
      return "Preencha sua senha atual";
    } else if (newPassword.length === 0 || confirmPassword.length === 0) {
      return "Preencha todos os campos de senha";
    } else if (newPassword.length !== 8) {
      return "A senha deve ter exatamente 8 caracteres";
    } else if (isPasswordMismatch) {
      return "As senhas não coincidem";
    }
    return "Clique para salvar as alterações";
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && closeModal()}>
      <SheetContent className="sm:max-w-[480px] px-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 -mx-0 -mt-0 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <SheetTitle className="text-white text-2xl font-bold">
              Redefinir Senha
            </SheetTitle>
          </div>
          <SheetDescription className="text-blue-100 text-base">
            Atualize sua senha de forma segura e protegida
          </SheetDescription>
        </div>

        <div className="px-6 space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                className="pl-4 pr-4 py-6 text-base border-2 focus:border-blue-500 transition-all rounded-xl"
                placeholder="seu@email.com"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!userEmail}
              />
            </div>
          </div>

          {/* Current Password Field */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha Atual
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                className="pl-4 pr-12 py-6 text-base border-2 focus:border-blue-500 transition-all rounded-xl"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                autoComplete="off"
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="off"
                className={`pl-4 pr-12 py-6 text-base border-2 transition-all rounded-xl ${
                  newPassword.length > 0 && newPassword.length !== 8
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-blue-500"
                }`}
                placeholder="Digite sua nova senha"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e, setNewPassword)}
                disabled={isLoading}
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {/* Character counter */}
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                {newPassword.length}/8 caracteres
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className={`pl-4 pr-12 py-6 text-base border-2 transition-all rounded-xl ${
                  isPasswordMismatch
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-blue-500"
                }`}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => handlePasswordChange(e, setConfirmPassword)}
                disabled={isLoading}
                autoComplete="off"
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Validation Messages */}
          <div className="space-y-3 pt-4">
            {newPassword.length > 0 && newPassword.length !== 8 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <BadgeAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700 font-medium">
                  A senha precisa ter exatamente 8 caracteres.
                </span>
              </div>
            )}

            {isPasswordMismatch && (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <BadgeAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700 font-medium">
                  As senhas não coincidem.
                </span>
              </div>
            )}

            {isPasswordValid &&
              !isPasswordMismatch &&
              confirmPassword.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700 font-medium">
                    Senhas válidas e correspondentes!
                  </span>
                </div>
              )}
          </div>

          {apiResponse && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-24">
              <strong className="block mb-1">Resposta API (debug):</strong>
              <code className="text-xs">{apiResponse}</code>
            </div>
          )}
        </div>

        {/* Footer com botões */}
        <SheetFooter className="px-6 pt-8 pb-6 gap-3 flex-row sm:flex-row">
          <Button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            variant="outline"
            className="flex-1 py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSaveChanges}
            disabled={isButtonDisabled}
            className={`flex-1 py-6 text-base font-semibold rounded-xl transition-all ${
              isButtonDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
            title={getButtonTitle()}
          >
            {buttonText}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}