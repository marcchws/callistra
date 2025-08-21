"use client"

import { Sidebar } from "@/components/sidebar"
import { TicketList } from "./components/ticket-list"
import { TicketFiltersComponent } from "./components/ticket-filters"
import { useTickets } from "./use-tickets"

export default function TicketsSuportePage() {
  const {
    tickets,
    attendants,
    loading,
    filters,
    setFilters,
    currentUser,
    stats,
    assumeTicket
  } = useTickets()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Gestão de Tickets de Suporte
              </h1>
              <p className="text-muted-foreground">
                Visualize, assuma e gerencie tickets de suporte dos escritórios clientes
              </p>
            </div>

            {/* Filters */}
            <TicketFiltersComponent
              filters={filters}
              setFilters={setFilters}
              attendants={attendants}
              stats={stats}
            />

            {/* Tickets List */}
            <TicketList
              tickets={tickets}
              loading={loading}
              onAssumeTicket={assumeTicket}
              currentUserName={currentUser.name}
            />
          </div>
        </div>
      </main>
    </div>
  )
}