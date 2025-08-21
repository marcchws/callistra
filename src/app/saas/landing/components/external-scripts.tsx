"use client"

import { useEffect } from "react"
import { ExternalScript } from "../types"

// Componente para gerenciar scripts externos
// Atende ao Requisito: Critério 11 (Scripts externos - PIXEL, CHAT WIDGET, TAGS)
export function ExternalScripts() {
  useEffect(() => {
    // Verifica consentimento de cookies antes de carregar scripts
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) return

    const preferences = JSON.parse(cookieConsent)
    
    // Lista de scripts externos configuráveis
    const scripts: ExternalScript[] = [
      // Google Analytics (Analytics)
      {
        id: "google-analytics",
        type: "analytics",
        src: "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID",
        async: true,
      },
      // Facebook Pixel (Marketing)
      {
        id: "facebook-pixel",
        type: "pixel",
        innerHTML: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'YOUR_PIXEL_ID');
          fbq('track', 'PageView');
        `,
      },
      // Chat Widget (Functional) - Exemplo: Crisp, Intercom, etc
      {
        id: "chat-widget",
        type: "chat",
        innerHTML: `
          window.$crisp=[];window.CRISP_WEBSITE_ID="YOUR_WEBSITE_ID";
          (function(){d=document;s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);})();
        `,
      },
    ]

    // Carrega scripts baseado nas preferências de cookies
    scripts.forEach((script) => {
      // Verifica se o tipo de script está autorizado
      const canLoad = 
        (script.type === "analytics" && preferences.analytics) ||
        (script.type === "pixel" && preferences.marketing) ||
        (script.type === "chat" && preferences.functional) ||
        (script.type === "tag" && preferences.marketing)

      if (!canLoad) return

      // Verifica se o script já foi carregado
      if (document.getElementById(script.id)) return

      const scriptElement = document.createElement("script")
      scriptElement.id = script.id
      
      if (script.src) {
        scriptElement.src = script.src
        scriptElement.async = script.async || false
        scriptElement.defer = script.defer || false
      }
      
      if (script.innerHTML) {
        scriptElement.innerHTML = script.innerHTML
      }

      document.head.appendChild(scriptElement)
    })

    // Google Analytics configuration (se autorizado)
    if (preferences.analytics && (window as any).gtag) {
      (window as any).dataLayer = (window as any).dataLayer || []
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(arguments)
      }
      gtag("js", new Date())
      gtag("config", "GA_MEASUREMENT_ID")
    }

    // Cleanup function
    return () => {
      // Remove scripts quando componente é desmontado (se necessário)
    }
  }, [])

  // Função para adicionar scripts customizados dinamicamente
  const addCustomScript = (script: ExternalScript) => {
    if (document.getElementById(script.id)) return

    const scriptElement = document.createElement("script")
    scriptElement.id = script.id
    
    if (script.src) {
      scriptElement.src = script.src
      scriptElement.async = script.async || false
    }
    
    if (script.innerHTML) {
      scriptElement.innerHTML = script.innerHTML
    }

    document.head.appendChild(scriptElement)
  }

  // Este componente não renderiza nada visualmente
  return null
}

// Função helper para adicionar Meta Tags de SEO
export function addSEOMetaTags() {
  // Verifica se estamos no cliente
  if (typeof window === "undefined") return

  // Meta tags básicas para SEO (Requisito: Critério 3)
  const metaTags = [
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Callistra" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Callistra" },
    { property: "og:locale", content: "pt_BR" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "format-detection", content: "telephone=no" },
  ]

  metaTags.forEach((tag) => {
    const existingTag = document.querySelector(
      `meta[${tag.property ? "property" : "name"}="${
        tag.property || tag.name
      }"]`
    )

    if (!existingTag) {
      const meta = document.createElement("meta")
      
      if (tag.name) {
        meta.name = tag.name
        meta.content = tag.content
      }
      
      if (tag.property) {
        meta.setAttribute("property", tag.property)
        meta.content = tag.content
      }

      document.head.appendChild(meta)
    }
  })

  // Schema.org structured data para melhor SEO
  const schemaScript = document.createElement("script")
  schemaScript.type = "application/ld+json"
  schemaScript.innerHTML = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Callistra",
    "description": "Sistema de gestão para escritórios de advocacia",
    "url": "https://callistra.com.br",
    "logo": "https://callistra.com.br/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    }
  })

  if (!document.querySelector('script[type="application/ld+json"]')) {
    document.head.appendChild(schemaScript)
  }
}
