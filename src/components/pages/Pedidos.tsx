import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type ExpandedState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Paginacao } from "./Paginacao"
import { PedidosFilter } from "./Pedidos/PedidosFilter"
import { usePedidosColumns, type Pedido } from "./Pedidos/PedidosColumns"
import { format, subDays, subMonths, subYears } from "date-fns"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Package,
  FileText,
  Truck,
  Building2,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode2,
  Receipt,
  Download,
  ExternalLink,
  FileArchive,
} from "lucide-react"

type PeriodFilter = "ultimoMes" | "ultimos90Dias" | "ultimoAno" | "todos"
type SearchType =
  | "numeroPedido"
  | "statusDoPedido"
  | "notaFiscal"
  | "dataLancamentoPedido"
  | "dataParaEntrega"
  | "pedidosCompra"

const generateFictionalPedidos = (): Pedido[] => {
  const pedidos: Pedido[] = []

  for (let i = 1; i <= 120; i++) {
    const dataLancamento = new Date()
    dataLancamento.setDate(dataLancamento.getDate() - Math.floor(Math.random() * 400))

    const dataExpiracao = new Date(dataLancamento)
    dataExpiracao.setMonth(dataExpiracao.getMonth() + Math.floor(Math.random() * 18) + 6)

    const chaveNFe = `3525${String(Date.now() + i).padEnd(40, "0").slice(-40)}`

    pedidos.push({
      duplicateCount: null,
      hasDuplicates: false,
      status: ["Pendente Ativação", "Ativado", "Renovado", "Cancelado"][Math.floor(Math.random() * 4)],
      grupo: ["GRUPO_ENTERPRISE", "GRUPO_STARTUP", "GRUPO_CORPORATE"][Math.floor(Math.random() * 3)],
      filial: ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-CUR"][Math.floor(Math.random() * 5)],
      codigoTransportadora: Math.random() > 0.3 ? `P${String(Math.floor(Math.random() * 999)).padStart(3, "0")}` : "",
      nomeTransportadora: Math.random() > 0.3 ? ["Parceiro Microsoft", "Revenda AWS", "Parceiro Google Cloud", "Venda Direta"][Math.floor(Math.random() * 4)] : null,
      estado: ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO"][Math.floor(Math.random() * 8)],
      codigoDoCliente: `CLI${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      nomeCliente: ["TechNova Softwares", "DigitalFlow SA", "CodeMaster", "ByteSolutions", "InnoTech"][Math.floor(Math.random() * 5)],
      numeroPedido: `LIC${String(i).padStart(6, "0")}`,
      dataLancamentoPedido: format(dataLancamento, "yyyy-MM-dd"),
      dataParaEntrega: format(dataExpiracao, "yyyy-MM-dd"),
      statusDoPedido: ["Pendente Ativação", "Ativado", "Renovado", "Cancelado"][Math.floor(Math.random() * 4)],
      notaFiscal: `NF${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      chaveNFe,
      statusNotaFiscal: ["Autorizada", "Pendente", "Cancelada"][Math.floor(Math.random() * 3)],
      pedidosCompra: ["Office 365 E5", "Azure AD Premium", "Dynamics 365", "Power BI Pro", "Windows Server 2022"][Math.floor(Math.random() * 5)],


      dataPicking: null,
      statusPicking: "Não Iniciado",
    })
  }

  return pedidos.sort((a, b) => new Date(b.dataLancamentoPedido).getTime() - new Date(a.dataLancamentoPedido).getTime())
}

export const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = React.useState<Pedido[]>([])
  const [allPedidos] = React.useState<Pedido[]>(generateFictionalPedidos())
  const [loading, setLoading] = React.useState<boolean>(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [searchType, setSearchType] = React.useState<SearchType>("numeroPedido")
  const [searchValue, setSearchValue] = React.useState<string>("")
  const [currentPeriodFilter, setCurrentPeriodFilter] = React.useState<PeriodFilter>("ultimoMes")
  const [pageSize, setPageSize] = React.useState<number>(10)

  const [selectedPedido, setSelectedPedido] = React.useState<Pedido | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [copiedField, setCopiedField] = React.useState<"danfe" | "xml" | null>(null)

  const columns = usePedidosColumns()

  const table = useReactTable({
    data: pedidos,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, expanded },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: { pagination: { pageSize } },
  })

  React.useEffect(() => { table.setPageSize(pageSize) }, [pageSize, table])

  const fetchPedidosWithDateRange = async (start: Date, end: Date) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const filtered = allPedidos.filter(p => {
      const date = new Date(p.dataLancamentoPedido)
      return date >= start && date <= end
    })
    setPedidos(filtered)
    setLoading(false)
  }

  const applyPeriodFilter = (period: PeriodFilter) => {
    setCurrentPeriodFilter(period)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const start = period === "todos" ? subYears(hoje, 3) :
      period === "ultimoAno" ? subYears(hoje, 1) :
        period === "ultimos90Dias" ? subDays(hoje, 90) : subMonths(hoje, 1)
    fetchPedidosWithDateRange(start, hoje)
  }

  React.useEffect(() => { applyPeriodFilter("ultimoMes") }, [])

  React.useEffect(() => {
    if (!searchValue.trim()) table.resetColumnFilters()
    else table.getColumn(searchType)?.setFilterValue(searchValue)
  }, [searchValue, searchType, table])

  const formatChaveNFe = (chave: string) => {
    if (chave.length !== 44) return chave
    return chave.match(/.{1,4}/g)?.join(" ") || chave
  }

  const handleCopy = (text: string, type: "danfe" | "xml") => {
    navigator.clipboard.writeText(text)
    setCopiedField(type)

    toast(type === "danfe" ? "Chave DANFE copiada!" : "XML copiado!", {
      style: { borderRadius: "8px", background: "#008000", color: "#fff" },
    })

    setTimeout(() => setCopiedField(null), 2000)
  }


  const StatusBadge = ({ status = "Pendente" }: { status?: string }) => {
    const config: Record<string, { variant: any; icon: React.ReactNode }> = {
      "Pendente Ativação": { variant: "default", icon: <Clock className="w-3.5 h-3.5" /> },
      "Ativado": { variant: "secondary", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      "Renovado": { variant: "outline", icon: <Package className="w-3.5 h-3.5" /> },
      "Cancelado": { variant: "destructive", icon: <AlertCircle className="w-3.5 h-3.5" /> },
      "Autorizada": { variant: "secondary", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      "Pendente": { variant: "default", icon: <Clock className="w-3.5 h-3.5" /> },
      "Cancelada": { variant: "destructive", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    }
    const { variant = "default", icon } = config[status] || {}
    return <Badge variant={variant} className="text-xs font-medium">{icon && <span className="mr-1">{icon}</span>}{status}</Badge>
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie seus pedidos em tempo real.</p>
      </div>

      <PedidosFilter
        searchType={searchType}
        setSearchType={setSearchType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        currentPeriodFilter={currentPeriodFilter}
        applyPeriodFilter={applyPeriodFilter}
        activeDateRange={{ start: undefined, end: undefined }}
        setActiveDateRange={() => { }}
        fetchPedidosWithDateRange={fetchPedidosWithDateRange}
      />


      {/* Tabela Desktop */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="bg-muted/50">
                {hg.headers.map(h => (
                  <TableHead key={h.id} className="font-semibold">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => {
              const p = row.original
              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-4">
                        <div className="flex items-center gap-2">
                          {cell.column.id === "numeroPedido" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={e => { e.stopPropagation(); row.toggleExpanded() }}
                            >
                              {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          )}
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0 bg-gradient-to-b from-muted/20 to-background">
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-3 gap-8">
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-3"><Building2 className="w-4 h-4" /> Cliente</h4>
                              <p className="font-medium">{p.nomeCliente}</p>
                              <p className="text-sm text-muted-foreground">Cód: {p.codigoDoCliente} • {p.grupo}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-3"><Package className="w-4 h-4" /> Produto</h4>
                              <p className="font-medium">{p.pedidosCompra}</p>
                              <p className="text-sm text-muted-foreground">
                                Expira em: {format(new Date(p.dataParaEntrega), "dd/MM/yyyy")}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold flex items-center gap-2 mb-3"><Truck className="w-4 h-4" /> Distribuição</h4>
                              <p className="font-medium">{p.nomeTransportadora || "Venda direta"}</p>
                              <p className="text-sm text-muted-foreground">{p.filial} • {p.estado}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-6 border-t">
                            <div className="flex items-center gap-6">
                              <div>
                                <span className="text-muted-foreground">NF-e:</span>
                                <span className="font-mono font-medium ml-2">{p.notaFiscal}</span>
                              </div>
                              <StatusBadge status={p.statusNotaFiscal} />
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPedido(p)
                                setIsDrawerOpen(true)
                              }}
                            >
                              <FileArchive className="w-4 h-4 mr-2" />
                              Ver DANFE/XML
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.map(row => {
          const p = row.original
          return (
            <Card key={row.id} className={cn("transition-all", row.getIsExpanded() && "ring-2 ring-primary")}>
              <CardHeader className="pb-3 cursor-pointer" onClick={() => row.toggleExpanded()}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); row.toggleExpanded() }}>
                      {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                    <div>
                      <p className="text-xs text-muted-foreground">Licença</p>
                      <p className="text-xl font-bold">#{p.numeroPedido}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.statusDoPedido ?? "Pendente"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><span className="text-muted-foreground">Cliente:</span> <span className="font-medium">{p.nomeCliente}</span></p>
                  <p><span className="text-muted-foreground">Produto:</span> <span className="font-medium">{p.pedidosCompra}</span></p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPedido(p)
                    setIsDrawerOpen(true)
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Ver DANFE/XML
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Paginacao
        currentPage={table.getState().pagination.pageIndex + 1}
        pageCount={table.getPageCount()}
        pageSize={pageSize}
        totalItems={table.getFilteredRowModel().rows.length}
        onPageChange={p => table.setPageIndex(p - 1)}
        onPageSizeChange={setPageSize}
        showPageSizeSelector
        showJumpToPage
        showItemsInfo
        pageSizeOptions={[10, 20, 50, 100]}
      />

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto px-4">
          <SheetHeader className="space-y-3 pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                {/* Corrigido: SheetTitle não tem prop "title" */}
                <SheetTitle className="text-2xl">Nota Fiscal Eletrônica</SheetTitle>
                {selectedPedido && (
                  <SheetDescription className="text-base mt-1">
                    <span className="font-semibold text-slate-700">{selectedPedido.notaFiscal}</span>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="text-slate-600">Pedido {selectedPedido.numeroPedido}</span>
                  </SheetDescription>
                )}
              </div>
            </div>
          </SheetHeader>

          {selectedPedido && (
            <Tabs defaultValue="danfe" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 h-auto">
                <TabsTrigger value="danfe" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
                  <Receipt className="w-4 h-4 mr-2" />
                  <span className="font-medium">Chave DANFE</span>
                </TabsTrigger>
                <TabsTrigger value="xml" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
                  <FileCode2 className="w-4 h-4 mr-2" />
                  <span className="font-medium">XML Completo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="danfe" className="mt-6 space-y-6">
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg text-slate-800">Chave de Acesso</h4>
                      <p className="text-sm text-slate-500 mt-1">44 dígitos da NF-e</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(selectedPedido.chaveNFe, "danfe")}
                      variant={copiedField === "danfe" ? "default" : "outline"}
                    >
                      {copiedField === "danfe" ? (
                        <> <CheckCircle2 className="w-4 h-4 mr-2" /> Copiado! </>
                      ) : (
                        <> <Copy className="w-4 h-4 mr-2" /> Copiar </>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    value={formatChaveNFe(selectedPedido.chaveNFe)}
                    readOnly
                    className="font-mono text-base leading-relaxed h-28 resize-none bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800">
                      Use esta chave no portal da Sefaz para consultar ou imprimir o DANFE.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar DANFE
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Consultar Sefaz
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="xml" className="mt-6 space-y-6">
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg text-slate-800">XML da NF-e</h4>
                      <p className="text-sm text-slate-500 mt-1">Estrutura completa do documento fiscal</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopy(`<nfeProc>${selectedPedido.chaveNFe}</nfeProc>`, "xml")}
                      variant={copiedField === "xml" ? "default" : "outline"}
                    >
                      {copiedField === "xml" ? (
                        <> <CheckCircle2 className="w-4 h-4 mr-2" /> Copiado! </>
                      ) : (
                        <> <Copy className="w-4 h-4 mr-2" /> Copiar </>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    value={`<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${selectedPedido.chaveNFe}" versao="4.00">
      <ide>
        <nNF>${selectedPedido.notaFiscal.replace("NF", "")}</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
      </ide>
    </infNFe>
  </NFe>
</nfeProc>`}
                    readOnly
                    className="font-mono text-xs leading-relaxed h-96 resize-none bg-slate-50 border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar arquivo XML
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}


