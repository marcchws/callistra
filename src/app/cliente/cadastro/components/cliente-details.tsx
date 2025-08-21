'use client'

import { User, Building, Phone, Mail, MapPin, CreditCard, Lock, Shield, ShieldOff, FileText, Calendar } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { Cliente, TipoCliente, StatusCliente } from '../types'

interface ClienteDetailsProps {
  cliente: Cliente | null
  open: boolean
  onClose: () => void
  onEditar: (cliente: Cliente) => void
}

export function ClienteDetails({ cliente, open, onClose, onEditar }: ClienteDetailsProps) {
  if (!cliente) return null

  const formatarNome = () => {
    if (cliente.tipoCliente === TipoCliente.PESSOA_FISICA) {
      return cliente.nome || ''
    }
    return cliente.razaoSocial || ''
  }

  const formatarDocumento = () => {
    if (cliente.tipoCliente === TipoCliente.PESSOA_FISICA) {
      return cliente.cpf || ''
    }
    return cliente.cnpj || ''
  }

  const formatarEndereco = () => {
    const { rua, numero, complemento, bairro, cidade, estado, cep } = cliente
    const enderecoCompleto = [
      `${rua}, ${numero}`,
      complemento && complemento.trim() !== '' ? complemento : null,
      bairro,
      `${cidade}/${estado}`,
      `CEP: ${cep}`
    ].filter(Boolean).join(' - ')
    
    return enderecoCompleto
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? (
              <User className="h-5 w-5 text-blue-600" />
            ) : (
              <Building className="h-5 w-5 text-blue-600" />
            )}
            {formatarNome()}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com Status e Ações */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Badge 
                variant={cliente.status === StatusCliente.ATIVO ? "default" : "secondary"}
                className={cliente.status === StatusCliente.ATIVO ? "bg-green-100 text-green-800" : ""}
              >
                {cliente.status === StatusCliente.ATIVO ? 'Ativo' : 'Inativo'}
              </Badge>
              
              {cliente.confidencial ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Confidencial
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ShieldOff className="h-3 w-3" />
                  Não Confidencial
                </Badge>
              )}
            </div>
            
            <Button 
              onClick={() => onEditar(cliente)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Editar Cliente
            </Button>
          </div>

          {/* Dados Principais */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                {cliente.tipoCliente === TipoCliente.PESSOA_FISICA 
                  ? 'Dados Pessoais' 
                  : 'Dados Empresariais'
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? 'Nome Completo' : 'Razão Social'}
                    </label>
                    <p className="text-base font-medium">{formatarNome()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? 'CPF' : 'CNPJ'}
                    </label>
                    <p className="text-base font-mono">{formatarDocumento()}</p>
                  </div>
                  
                  {cliente.tipoCliente === TipoCliente.PESSOA_FISICA && cliente.dataNascimento && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
                      <p className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  
                  {cliente.tipoCliente === TipoCliente.PESSOA_JURIDICA && cliente.responsavel && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Responsável</label>
                      <p className="text-base">{cliente.responsavel}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Cliente</label>
                    <p className="text-base flex items-center gap-2">
                      {cliente.tipoCliente === TipoCliente.PESSOA_FISICA ? (
                        <>
                          <User className="h-4 w-4 text-blue-600" />
                          Pessoa Física
                        </>
                      ) : (
                        <>
                          <Building className="h-4 w-4 text-green-600" />
                          Pessoa Jurídica
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {cliente.telefone}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <p className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {cliente.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Endereço Completo</label>
                  <p className="text-base">{formatarEndereco()}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rua</label>
                    <p className="text-sm">{cliente.rua}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número</label>
                    <p className="text-sm">{cliente.numero}</p>
                  </div>
                  {cliente.complemento && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Complemento</label>
                      <p className="text-sm">{cliente.complemento}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bairro</label>
                    <p className="text-sm">{cliente.bairro}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                    <p className="text-sm">{cliente.cidade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <p className="text-sm">{cliente.estado}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Bancários */}
          {(cliente.banco || cliente.agencia || cliente.contaCorrente || cliente.chavePix) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Dados Bancários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {cliente.banco && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Banco</label>
                        <p className="text-base">{cliente.banco}</p>
                      </div>
                    )}
                    {cliente.agencia && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Agência</label>
                        <p className="text-base">{cliente.agencia}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {cliente.contaCorrente && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Conta Corrente</label>
                        <p className="text-base">{cliente.contaCorrente}</p>
                      </div>
                    )}
                    {cliente.chavePix && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Chave Pix</label>
                        <p className="text-base font-mono">{cliente.chavePix}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acesso do Cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Acesso do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Login</label>
                  <p className="text-base font-mono">{cliente.login}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Senha</label>
                  <p className="text-base">••••••••</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          {cliente.anexos && cliente.anexos.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos Anexados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cliente.anexos.map((anexo) => (
                    <div key={anexo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{anexo.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            Anexado em {new Date(anexo.dataUpload).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(anexo.url, '_blank')}
                      >
                        Visualizar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configurações */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-base">
                    <Badge 
                      variant={cliente.status === StatusCliente.ATIVO ? "default" : "secondary"}
                      className={cliente.status === StatusCliente.ATIVO ? "bg-green-100 text-green-800" : ""}
                    >
                      {cliente.status === StatusCliente.ATIVO ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidencialidade</label>
                  <p className="text-base">
                    {cliente.confidencial ? (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <Shield className="h-3 w-3" />
                        Confidencial
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <ShieldOff className="h-3 w-3" />
                        Não Confidencial
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              
              {cliente.confidencial && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Este cliente possui informações confidenciais. Qualquer alteração nesta configuração 
                    gerará um alerta automático para os administradores.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}