"use client"

import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TicketDetails } from "../components/ticket-details"
import { useTickets } from "../use-tickets"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TicketDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string

  const {
    getTicketById,
    attendants,
    currentUser,
    changeStatus,
    changeResponsible,
    addInteraction,
    assumeTicket,
    loading
  } = useTickets()

  const ticket = getTicketById(ticketId)

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
              
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Skeleton className="h-[400px] w-full" />
                </div>
                <div>
                  <Skeleton className="h-[300px] w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <Card className="max-w-md mx-auto mt-20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <AlertCircle className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Ticket não encontrado</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      O ticket {ticketId} não foi encontrado ou você não tem permissão para visualizá-lo.
                    </p>
                  </div>
                  <Button 
                    onClick={() => router.push('/saas/tickets-suporte')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Voltar para Lista de Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <TicketDetails
            ticket={ticket}
            attendants={attendants}
            currentUser={currentUser}
            onChangeStatus={(status) => changeStatus(ticketId, status)}
            onChangeResponsible={(responsible) => changeResponsible(ticketId, responsible)}
            onAddInteraction={(message, attachments) => addInteraction(ticketId, message, attachments)}
            onAssumeTicket={() => assumeTicket(ticketId)}
          />
        </div>
      </main>
    </div>
  )
}