"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User2, Upload, CheckCircle, Save, AlertCircle, Camera, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Interface para armazenar o estado do usuário
interface UserState {
  name: string
  avatarUrl: string | null
}

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: {
    name: string
    email: string
    avatarUrl: string | null
  }
  onSaveChanges: (userData: {
    name: string
    avatarUrl: string | null
  }) => Promise<boolean>
}

// Chave padronizada para localStorage
const getUserStorageKey = (email: string) => `userProfile_${email}`

export function ProfileSelector({ isOpen, onClose, currentUser, onSaveChanges }: UserProfileModalProps) {
  // Estados para dados do usuário
  const [userName, setUserName] = useState(currentUser.name)
  const [_avatarUrl, setAvatarUrl] = useState<string | null>(currentUser.avatarUrl)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.avatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar dados do usuário do localStorage ao iniciar
  useEffect(() => {
    const storageKey = getUserStorageKey(currentUser.email)
    const storedUserData = localStorage.getItem(storageKey)

    if (storedUserData) {
      try {
        const userData: UserState = JSON.parse(storedUserData)
        setUserName(userData.name)
        setAvatarUrl(userData.avatarUrl)
        setAvatarPreview(userData.avatarUrl)
      } catch (error) {}
    }
  }, [currentUser.email])

  // Resetar estados quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      // Carregar dados atualizados do localStorage quando o modal abrir
      const storageKey = getUserStorageKey(currentUser.email)
      const storedUserData = localStorage.getItem(storageKey)

      if (storedUserData) {
        try {
          const userData: UserState = JSON.parse(storedUserData)
          setUserName(userData.name)
          setAvatarUrl(userData.avatarUrl)
          setAvatarPreview(userData.avatarUrl)
        } catch (error) {}
      } else {
        // Se não houver dados no localStorage, use os dados atuais
        setUserName(currentUser.name)
        setAvatarUrl(currentUser.avatarUrl)
        setAvatarPreview(currentUser.avatarUrl)
      }

      setSaveSuccess(false)
      setSaveError(null)
    }
  }, [isOpen, currentUser])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)

      // Simular upload - em produção, isto seria uma chamada API real
      setTimeout(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const preview = reader.result as string
          setAvatarPreview(preview)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 800)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Salvar o estado do usuário no localStorage
  const saveUserStateToStorage = (name: string, avatarUrl: string | null) => {
    const userState: UserState = {
      name,
      avatarUrl,
    }

    const storageKey = getUserStorageKey(currentUser.email)
    localStorage.setItem(storageKey, JSON.stringify(userState))

    // Dispara um evento personalizado para notificar outras partes da aplicação
    const event = new CustomEvent("userProfileUpdated", {
      detail: { email: currentUser.email, name, avatarUrl },
    })
    window.dispatchEvent(event)
  }

  const saveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      const success = await onSaveChanges({
        name: userName,
        avatarUrl: avatarPreview,
      })

      if (success) {
        setAvatarUrl(avatarPreview)
        setSaveSuccess(true)

        // Salvar no localStorage
        saveUserStateToStorage(userName, avatarPreview)

        // Reset success message after delay
        setTimeout(() => {
          setSaveSuccess(false)
        }, 3000)
      } else {
        setSaveError("Não foi possível salvar as alterações. Tente novamente.")
      }
    } catch (error) {
      setSaveError("Erro ao salvar as alterações: " + (error instanceof Error ? error.message : "Erro desconhecido"))
    } finally {
      setIsSaving(false)
    }
  }

  // Opções de avatar pré-definidas
  const avatarOptions = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=6",
    "https://i.pravatar.cc/150?img=7",
    "https://i.pravatar.cc/150?img=8",
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent className="sm:max-w-md overflow-y-auto bg-gradient-to-br from-sidebar via-sidebar to-card border-l-2 border-primary/20">
            <SheetHeader className="pb-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-semibold text-foreground">Editar Perfil</SheetTitle>
                  <p className="text-sm text-muted-foreground mt-1">Personalize suas informações</p>
                </div>
              </div>
            </SheetHeader>

            <div className="py-6 px-4 space-y-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <Avatar className="relative h-28 w-28 border-4 border-white shadow-xl ring-2 ring-primary/20">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar" className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                          <User2 className="h-14 w-14" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={triggerFileInput}
                      className="absolute -bottom-2 -right-2 bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </motion.button>
                  </motion.div>

                  {isUploading && (
                    <motion.div
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      className="absolute -top-2 -left-2 bg-accent text-white p-2 rounded-full shadow-lg"
                    >
                      <Upload className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                <div className="w-full space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Escolha um avatar</p>
                    <p className="text-xs text-muted-foreground">Ou faça upload da sua foto</p>
                  </div>
                  <div className="grid grid-cols-4 gap-3 p-4 bg-card/50 rounded-xl border border-border/50">
                    {avatarOptions.map((avatar, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Avatar
                          className={`h-14 w-14 cursor-pointer shadow-2xl shadow-black transition-all duration-300 border-2 ${
                            avatarPreview === avatar
                              ? "border-primary shadow-lg ring-2 ring-primary/30"
                              : "border-border/50 hover:border-primary/50 hover:shadow-md"
                          }`}
                          onClick={() => setAvatarPreview(avatar)}
                        >
                          <AvatarImage src={avatar || "/placeholder.svg"} alt={`Avatar opção ${i + 1}`} />
                        </Avatar>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4 p-6 bg-card/30 rounded-xl border border-border/50">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User2 className="h-4 w-4 text-primary" />
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="h-12 bg-background border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className="h-4 w-4 text-muted-foreground">@</span>
                      Email
                    </Label>
                    <div className="h-12 px-3 py-2 bg-muted/50 border border-border/50 rounded-md flex items-center">
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="w-full"
                    >
                      <Alert className="bg-green-50 border-green-200 text-green-800 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Perfeito!</AlertTitle>
                        <AlertDescription className="text-green-700">
                          Suas alterações foram salvas com sucesso.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {saveError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="w-full"
                    >
                      <Alert variant="destructive" className="shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Ops! Algo deu errado</AlertTitle>
                        <AlertDescription>{saveError}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <SheetFooter className="pt-6 border-t border-border/50 gap-3 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto h-11 border-border/50 hover:bg-muted/50 transition-colors bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveChanges}
                disabled={isSaving}
                className="w-full sm:w-auto h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar alterações
                  </span>
                )}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  )
}
