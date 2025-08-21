"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

// Componente Footer - Rodapé da Landing Page
// Atende aos Requisitos: Critério 10 (Redes Sociais)
// Cenários de teste: 8 (Redes sociais), 13 (Links do rodapé)
export function Footer() {
  const currentYear = new Date().getFullYear()

  // Links de navegação (Cenário 13)
  const navigationLinks = [
    { title: "Sobre", href: "#about" },
    { title: "Serviços", href: "#services" },
    { title: "Contato", href: "#contact" },
    { title: "Política de Privacidade", href: "/saas/landing/privacy-policy" },
  ]

  // Redes sociais (Cenário 8)
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/company/callistra",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/callistra",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/callistra",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/callistra",
    },
  ]

  // Função para scroll suave (Cenário 13)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-white">Callistra</span>
            </div>
            <p className="text-sm">
              Sistema completo para gestão de escritórios de advocacia. 
              Transforme a forma como você gerencia seu negócio jurídico.
            </p>
            {/* Redes Sociais (Cenário 8) */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Links Rápidos</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Tutoriais
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="block">Telefone:</span>
                <a
                  href="tel:+551199999999"
                  className="hover:text-blue-400 transition-colors"
                >
                  (11) 9999-9999
                </a>
              </li>
              <li>
                <span className="block">E-mail:</span>
                <a
                  href="mailto:contato@callistra.com.br"
                  className="hover:text-blue-400 transition-colors"
                >
                  contato@callistra.com.br
                </a>
              </li>
              <li>
                <span className="block">Horário:</span>
                <span>Seg-Sex: 9h às 18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Callistra. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/saas/landing/privacy-policy"
                className="hover:text-blue-400 transition-colors"
              >
                Política de Privacidade
              </Link>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                Termos de Uso
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
              >
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
