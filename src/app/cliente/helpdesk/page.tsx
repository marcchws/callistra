"use client"

import { useState } from "react"
import { Plus, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { TicketList } from "@/components/helpdesk/ticket-list"
import { TicketChat } from "@/components/helpdesk/ticket-chat"
import { NewTicketDialog } from "@/components/helpdesk/new-ticket-dialog"
import { useHelpdesk } from "./use-helpdesk"
import { Ticket } from "./types"

export default function HelpdeskPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false)
  const [currentUserType] = useState<"cliente" | "atendente">("atendente") // Pode ser dinâmico baseado no login

  const {
    tickets,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isTyping,
    createTicket,
    sendMessage,
    updateTicketStatus,
    markMessagesAsRead,
    setTypingIndicator,
  } = useHelpdesk()

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    markMessagesAsRead(ticket.id)
  }

  const handleSendMessage = async (content: string, attachments: File[]) => {
    if (!selectedTicket) return
    
    // Simular indicador de digitação do outro lado
    setTimeout(() => {
      setTypingIndicator(selectedTicket.id, true)
    }, 2000)
    
    await sendMessage(
      selectedTicket.id,
      { content, attachments },
      currentUserType
    )
    
    // Atualizar ticket selecionado com nova mensagem
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id)
    if (updatedTicket) {
      setSelectedTicket(updatedTicket)
    }
  }

  const handleStatusChange = async (status: any) => {
    if (!selectedTicket) return
    
    await updateTicketStatus(selectedTicket.id, status)
    
    // Atualizar ticket selecionado com novo status
    const updatedTicket = tickets.find(t => t.id === selectedTicket.id)
    if (updatedTicket) {
      setSelectedTicket(updatedTicket)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden lg:ml-64">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b bg-white">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-semibold tracking-tight">Helpdesk</h1>
                  </div>
                  <p className="text-muted-foreground">
                    Sistema de tickets de suporte com chat em tempo real
                  </p>
                </div>
                <Button 
                  onClick={() => setNewTicketDialogOpen(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Novo Ticket
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 container py-6 overflow-hidden">
            <div className="grid gap-6 h-full lg:grid-cols-[400px_1fr]">
              {/* Lista de Tickets */}
              <Card className="h-full overflow-hidden">
                <div className="p-4 h-full">
                  <TicketList
                    tickets={tickets}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    onTicketSelect={handleTicketSelect}
                    selectedTicketId={selectedTicket?.id}
                  />
                </div>
              </Card>

              {/* Chat do Ticket */}
              {selectedTicket ? (
                <TicketChat
                  ticket={selectedTicket}
                  onSendMessage={handleSendMessage}
                  onStatusChange={handleStatusChange}
                  isTyping={isTyping[selectedTicket.id]}
                  currentUserType={currentUserType}
                  loading={loading}
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Nenhum ticket selecionado</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selecione um ticket da lista ou crie um novo
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Dialog de Novo Ticket */}
      <NewTicketDialog
        open={newTicketDialogOpen}
        onOpenChange={setNewTicketDialogOpen}
        onSubmit={async (data) => {
          const newTicket = await createTicket(data)
          setSelectedTicket(newTicket)
          setNewTicketDialogOpen(false)
        }}
        loading={loading}
      />
    </div>
  )
}
