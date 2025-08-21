"use client"

import { Card } from "@/components/ui/card"
import { Shield, Users, Zap, BarChart } from "lucide-react"

// Componente About Section - Seção "Sobre"
// Atende ao Requisito: Critério 5 (Página Sobre)
export function AboutSection() {
  const features = [
    {
      icon: Shield,
      title: "Segurança Jurídica",
      description:
        "Sistema desenvolvido especificamente para atender às necessidades e conformidades do setor jurídico, com total proteção de dados sensíveis.",
    },
    {
      icon: Users,
      title: "Gestão de Equipe",
      description:
        "Controle completo sobre advogados associados, funcionários e permissões de acesso, garantindo organização e hierarquia.",
    },
    {
      icon: Zap,
      title: "Automação Inteligente",
      description:
        "Automatize tarefas repetitivas, acompanhe prazos processuais e otimize o fluxo de trabalho do seu escritório.",
    },
    {
      icon: BarChart,
      title: "Análises e Relatórios",
      description:
        "Dashboards completos com métricas de desempenho, faturamento e produtividade para tomada de decisões estratégicas.",
    },
  ]

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Título da Seção */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sobre o Callistra
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa desenvolvida para revolucionar a gestão de
            escritórios de advocacia, trazendo mais eficiência e controle para
            seu negócio.
          </p>
        </div>

        {/* Grid de Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* História/Missão */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Nossa Missão</h3>
              <p className="text-gray-600">
                O Callistra nasceu da necessidade real de escritórios de advocacia
                por uma solução que realmente entendesse suas demandas específicas.
                Nossa missão é simplificar a gestão jurídica através de tecnologia
                de ponta, permitindo que advogados foquem no que realmente importa:
                seus clientes e casos.
              </p>
              <p className="text-gray-600">
                Com anos de experiência no setor jurídico e tecnológico, desenvolvemos
                uma plataforma que não apenas atende, mas supera as expectativas de
                escritórios de todos os tamanhos, desde profissionais autônomos até
                grandes bancas.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">Nossos Valores</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Inovação:</strong>{" "}
                    <span className="text-gray-600">
                      Constantemente evoluindo para atender às demandas do mercado
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Segurança:</strong>{" "}
                    <span className="text-gray-600">
                      Proteção máxima de dados com conformidade LGPD
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Suporte:</strong>{" "}
                    <span className="text-gray-600">
                      Atendimento especializado e humanizado
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-900">Excelência:</strong>{" "}
                    <span className="text-gray-600">
                      Compromisso com a qualidade em cada detalhe
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Números/Estatísticas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "500+", label: "Escritórios Atendidos" },
            { number: "10.000+", label: "Processos Gerenciados" },
            { number: "99.9%", label: "Uptime Garantido" },
            { number: "24/7", label: "Suporte Disponível" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
