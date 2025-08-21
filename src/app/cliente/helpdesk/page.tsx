"use client"

import { useState } from "react"
import { TicketsList } from "./components/tickets-list"
import { TicketChat } from "./components/ticket-chat"
import { CreateTicketDialog } from "./components/create-ticket-dialog"
import { useHelpdesk } from "./use-helpdesk"

export default function HelpdeskPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const {
    tickets,
    filteredTickets,
    selectedTicket,
    interactions,
    loading,
    searchTerm,
    statusFilter,
    createTicket,
    sendMessage,
    updateTicketStatus,
    searchTickets,
    selectTicket
  } = useHelpdesk()

  // Handlers baseados nos cenários de uso
  const handleNewTicket = () => {
    setShowCreateDialog(true)
  }

  const handleCreateTicket = async (data: any) => {
    const ticket = await createTicket(data)
    if (ticket) {
      selectTicket(ticket)
    }
  }

  const handleSearch = (term: string) => {
    searchTickets({ searchTerm: term, status: statusFilter })
  }

  const handleStatusFilter = (status: string) => {
    searchTickets({ searchTerm, status: status as any })
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header baseado no layout template global */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Helpdesk</h1>
          <p className="text-muted-foreground">
            Gerencie tickets de suporte com comunicação em tempo real via chat
          </p>
        </div>

        {/* Layout principal baseado na densidade balanceada */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 h-[700px]">
          {/* Lista de tickets - AC6: busca e filtro */}
          <div className="xl:col-span-1">
            <TicketsList
              tickets={filteredTickets}
              selectedTicket={selectedTicket}
              onSelectTicket={selectTicket}
              onNewTicket={handleNewTicket}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
            />
          </div>

          {/* Chat do ticket - AC2: interface de chat */}
          <div className="lg:col-span-1 xl:col-span-2">
            {selectedTicket ? (
              <TicketChat
                ticket={selectedTicket}
                interactions={interactions[selectedTicket.id] || []}
                onSendMessage={sendMessage}
                onUpdateStatus={updateTicketStatus}
                loading={loading}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="text-center space-y-3">
                  <div className="text-gray-400 text-4xl">💬</div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Selecione um ticket
                    </h3>
                    <p className="text-gray-500">
                      Escolha um ticket da lista para iniciar o chat de suporte
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dialog para criar novo ticket - Cenário 1 */}
        <CreateTicketDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTicket}
          loading={loading}
        />
      </div>
    </div>
  )
}
