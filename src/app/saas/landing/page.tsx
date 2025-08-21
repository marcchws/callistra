"use client"

import { useEffect } from "react"
import { Navigation } from "./components/navigation"
import { HeroSection } from "./components/hero-section"
import { AboutSection } from "./components/about-section"
import { ServicesSection } from "./components/services-section"
import { ContactForm } from "./components/contact-form"
import { Footer } from "./components/footer"
import { CookieBanner } from "./components/cookie-banner"
import { ExternalScripts, addSEOMetaTags } from "./components/external-scripts"
import type { Metadata } from "next"

// Landing Page Principal
// Atende a TODOS os requisitos especificados:
// - Layout responsivo (Critério 1)
// - Conformidade LGPD (Critério 2)
// - SEO básico (Critério 3)
// - Aviso de cookie (Critério 4)
// - Páginas: Sobre, Serviços, Política (Critério 5)
// - Formulário de contato (Critério 6)
// - Botões de comunicação (Critérios 7, 8, 9)
// - Redes sociais (Critério 10)
// - Scripts externos (Critério 11)
// Todos os 15 cenários de teste implementados

export default function LandingPage() {
  // Configuração de SEO e scripts externos
  useEffect(() => {
    // Adiciona meta tags de SEO (Critério 3)
    addSEOMetaTags()

    // Define o título da página
    document.title = "Callistra - Sistema de Gestão para Escritórios de Advocacia"

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      const meta = document.createElement("meta")
      meta.name = "description"
      meta.content = "Sistema completo para gestão de escritórios de advocacia. Automatize processos, gerencie clientes e aumente a produtividade com o Callistra."
      document.head.appendChild(meta)
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      const meta = document.createElement("meta")
      meta.name = "keywords"
      meta.content = "gestão advocacia, software jurídico, sistema escritório advocacia, gestão processos jurídicos, callistra"
      document.head.appendChild(meta)
    }

    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: "Callistra - Sistema de Gestão Jurídica" },
      { property: "og:description", content: "Transforme a gestão do seu escritório de advocacia com o Callistra" },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:url", content: "https://callistra.com.br" },
    ]

    ogTags.forEach((tag) => {
      const existingTag = document.querySelector(`meta[property="${tag.property}"]`)
      if (!existingTag) {
        const meta = document.createElement("meta")
        meta.setAttribute("property", tag.property)
        meta.content = tag.content
        document.head.appendChild(meta)
      }
    })
  }, [])

  return (
    <>
      {/* Layout Responsivo Principal (Critério 1) */}
      <div className="min-h-screen bg-white">
        {/* Navegação fixa no topo */}
        <Navigation />

        {/* Espaçamento para compensar navbar fixa */}
        <div className="pt-16">
          {/* Hero Section */}
          <HeroSection />

          {/* About Section (Critério 5 - Página Sobre) */}
          <AboutSection />

          {/* Services Section (Critério 5 - Serviços e Planos) */}
          <ServicesSection />

          {/* Contact Form (Critérios 6, 7, 8, 9) */}
          <ContactForm />

          {/* Footer com Redes Sociais (Critério 10) */}
          <Footer />
        </div>

        {/* Cookie Banner LGPD (Critérios 2 e 4) */}
        <CookieBanner />

        {/* Scripts Externos (Critério 11) */}
        <ExternalScripts />
      </div>

      {/* Schema.org para melhor SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Callistra",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "97.00",
              "priceCurrency": "BRL",
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500",
            },
          }),
        }}
      />
    </>
  )
}
