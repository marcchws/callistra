"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie, X, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CookiePreferences } from "../types"

// Componente de Banner de Cookies LGPD
// Atende aos Requisitos: Critério 2 (LGPD) e 4 (Aviso de Cookie)
// Cenário de teste 4: Aceite de cookies
export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre ativo
    analytics: false,
    marketing: false,
    functional: false,
  })

  // Verifica se o usuário já aceitou os cookies
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      // Pequeno delay para melhor UX
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  // Aceitar todos os cookies (Cenário 4)
  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    
    setShowBanner(false)
    
    // Aqui você pode inicializar scripts de analytics, pixel, etc
    initializeExternalScripts(allAccepted)
  }

  // Aceitar apenas necessários
  const acceptNecessary = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    
    setShowBanner(false)
  }

  // Salvar preferências personalizadas
  const savePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    
    setShowSettings(false)
    setShowBanner(false)
    
    initializeExternalScripts(preferences)
  }

  // Inicializar scripts externos baseado nas preferências
  const initializeExternalScripts = (prefs: CookiePreferences) => {
    // Analytics (Google Analytics, etc)
    if (prefs.analytics) {
      // Exemplo: Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': 'granted'
        })
      }
    }

    // Marketing (Facebook Pixel, etc)
    if (prefs.marketing) {
      // Exemplo: Facebook Pixel
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('consent', 'grant')
      }
    }

    // Functional (Chat widgets, etc)
    if (prefs.functional) {
      // Exemplo: Intercom, Crisp, etc
      console.log("Cookies funcionais aceitos")
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Banner Principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Utilizamos cookies para melhorar sua experiência
                </p>
                <p className="text-xs text-muted-foreground">
                  Usamos cookies próprios e de terceiros para personalizar conteúdo, 
                  analisar tráfego e exibir anúncios. Ao clicar em "Aceitar todos", 
                  você concorda com nosso uso de cookies.{" "}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Personalizar cookies
                  </button>
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={acceptNecessary}
                className="flex-1 md:flex-initial"
              >
                Apenas necessários
              </Button>
              <Button
                size="sm"
                onClick={acceptAll}
                className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-initial"
              >
                Aceitar todos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de Configurações Detalhadas */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurações de Cookies</DialogTitle>
            <DialogDescription>
              Gerencie suas preferências de cookies. Alguns cookies são necessários
              para o funcionamento do site e não podem ser desativados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Cookies Necessários */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="necessary" className="font-medium">
                  Cookies Necessários
                </Label>
                <p className="text-xs text-muted-foreground">
                  Essenciais para o funcionamento do site. Não podem ser desativados.
                </p>
              </div>
              <Switch
                id="necessary"
                checked={true}
                disabled
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Cookies de Analytics */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="analytics" className="font-medium">
                  Cookies de Analytics
                </Label>
                <p className="text-xs text-muted-foreground">
                  Nos ajudam a entender como você usa nosso site e melhorar sua experiência.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Cookies de Marketing */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="marketing" className="font-medium">
                  Cookies de Marketing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Usados para exibir anúncios relevantes e campanhas de marketing.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Cookies Funcionais */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="functional" className="font-medium">
                  Cookies Funcionais
                </Label>
                <p className="text-xs text-muted-foreground">
                  Habilitam funcionalidades como chat ao vivo e personalização.
                </p>
              </div>
              <Switch
                id="functional"
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, functional: checked })
                }
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={savePreferences}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Salvar preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
