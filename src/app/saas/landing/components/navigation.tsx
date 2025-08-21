"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

// Componente Navigation - Menu principal da Landing Page
// Cenários de teste: 3 (Navegação menu), 14 (Menu mobile)
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  // Links de navegação (Cenário 3)
  const navLinks = [
    { title: "Início", href: "#hero" },
    { title: "Sobre", href: "#about" },
    { title: "Serviços", href: "#services" },
    { title: "Contato", href: "#contact" },
  ]

  // Função para scroll suave e fechar menu mobile
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href === "#hero" ? "body" : href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      setIsOpen(false) // Fecha o menu mobile após clicar
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Callistra</span>
          </Link>

          {/* Desktop Navigation (Cenário 3) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* CTAs Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/sistema/auth/login">Entrar</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/cliente/registro">Começar grátis</Link>
            </Button>
          </div>

          {/* Mobile Menu Button (Cenário 14) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                {/* Header do Menu Mobile */}
                <div className="flex items-center justify-between pb-6 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <span className="text-xl font-bold">Callistra</span>
                  </div>
                </div>

                {/* Links Mobile */}
                <nav className="flex-1 py-6">
                  <ul className="space-y-4">
                    {navLinks.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="block py-2 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* CTAs Mobile */}
                <div className="space-y-4 pt-6 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/sistema/auth/login">Entrar</Link>
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/cliente/registro">Começar grátis</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
