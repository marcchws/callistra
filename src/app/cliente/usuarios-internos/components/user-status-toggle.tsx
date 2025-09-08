"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { User, UserStatus } from "../types"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface UserStatusToggleProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function UserStatusToggle({ 
  user, 
  open, 
  onOpenChange, 
  onConfirm 
}: UserStatusToggleProps) {
  if (!user) return null

  const isActivating = user.status === UserStatus.INATIVO
  const actionText = isActivating ? "Ativar" : "Desativar"
  const actionDescription = isActivating 
    ? "O usuário poderá fazer login no sistema novamente."
    : "O usuário não poderá fazer login no sistema e suas atividades serão transferidas ao Admin Master."

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {isActivating ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            {actionText} usuário
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Você tem certeza que deseja {actionText.toLowerCase()} o usuário{" "}
              <span className="font-medium text-foreground">{user.nome}</span>?
            </p>
            <p>{actionDescription}</p>
            {!isActivating && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Ao desativar este usuário:
                </p>
                <ul className="text-sm text-yellow-800 list-disc list-inside mt-1 space-y-1">
                  <li>O login será bloqueado imediatamente</li>
                  <li>Todas as atividades serão transferidas ao Admin Master</li>
                  <li>O usuário permanecerá na listagem por 1 ano</li>
                  <li>Após 1 ano sem movimentação, será arquivado</li>
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={isActivating ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
