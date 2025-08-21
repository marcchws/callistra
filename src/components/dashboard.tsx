"use client"

import { Sidebar } from "@/components/sidebar"
import Content from "./content"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Visão geral do seu escritório jurídico</p>
            </div>
            <Content />
          </div>
        </div>
      </main>
    </div>
  )
}
