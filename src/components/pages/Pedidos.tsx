
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
  type VisibilityState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Paginacao } from "./Paginacao"
import { format, subDays, subMonths, subYears } from "date-fns"
import { PedidosFilter } from "./Pedidos/PedidosFilter"
import { usePedidosColumns, type Pedido } from "./Pedidos/PedidosColumns"

// Tipos para os filtros
type PeriodFilter = "ultimoMes" | "ultimos90Dias" | "ultimoAno" | "todos"
type SearchType =
  | "numeroPedido"
  | "statusDoPedido"
  | "notaFiscal"
  | "dataLancamentoPedido"
  | "dataParaEntrega"
  | "pedidosCompra"

const generateFictionalPedidos = (): Pedido[] => {
  const statusesPedido = ["Pendente Ativação", "Ativado", "Renovado", "Cancelado"]
  const statusesPicking = ["Configuração Pendente", "Configurado", "Pendente", "Concluído"]
  const statusesNotaFiscal = ["Autorizada", "Cancelada", "Pendente"]

  const nomes = [
    "TechNova Softwares Ltda",
    "DigitalFlow Soluções SA",
    "CodeMaster Desenvolvimento EIRELI",
    "ByteSolutions ME",
    "SoftPeak Enterprise EPP",
    "InnoTech & Cia",
    "DataWave Importadora Digital",
    "CloudForge Atacado Tech",
    "NetCore Varejo Digital",
    "AlgoRhythm Licenças Ltda",
  ]

  const parceiros = [
    "Parceiro Microsoft",
    "Revenda AWS",
    "Venda Direta",
    "Parceiro Google Cloud",
    "Revenda Oracle",
    "Parceiro Salesforce",
    "Integração Interna",
    "Revenda IBM",
    null, // Algumas vendas diretas sem parceiro
    "Parceiro SAP",
  ]

  const estados = ["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "PE", "CE"]
  const grupos = ["GRUPO_ENTERPRISE", "GRUPO_STARTUP", "GRUPO_CORPORATE"]
  const filiais = ["001-SAO", "002-RIO", "003-BH", "004-POR", "005-FLO"]

  const produtos = [
    "ERP Enterprise Pro",
    "CRM Cloud Suite",
    "Office Productivity Pack",
    "Database Manager Advanced",
    "Analytics BI Tool",
    "Security Firewall Software",
    "DevOps Pipeline Manager",
    "HR Management System",
    "E-commerce Platform",
    "Mobile App Builder",
  ]

  const pedidos: Pedido[] = []

  for (let i = 1; i <= 100; i++) {
    // Datas mais realistas para vendas de software
    const dataLancamento = new Date()
    dataLancamento.setDate(dataLancamento.getDate() - Math.floor(Math.random() * 365))

    const dataExpiracao = new Date(dataLancamento)
    dataExpiracao.setMonth(dataExpiracao.getMonth() + Math.floor(Math.random() * 12) + 6) // Licença de 6-18 meses

    const dataConfiguracao = new Date(dataLancamento)
    dataConfiguracao.setDate(dataConfiguracao.getDate() + Math.floor(Math.random() * 7) + 1) // Config em até 8 dias

    // Gerar chave NFe realista (44 dígitos) para faturamento de licenças
    const chaveNFe = `${Math.floor(Math.random() * 100000000000000000000000000000000000000000000)}`.padStart(44, "0")

    const parceiro = parceiros[Math.floor(Math.random() * parceiros.length)]
    const statusNotaFiscal = statusesNotaFiscal[Math.floor(Math.random() * statusesNotaFiscal.length)]
    const produto = produtos[Math.floor(Math.random() * produtos.length)]

    pedidos.push({
      duplicateCount: null,
      hasDuplicates: false,
      status: statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      grupo: grupos[Math.floor(Math.random() * grupos.length)],
      filial: filiais[Math.floor(Math.random() * filiais.length)],
      codigoTransportadora: parceiro ? `P${String(Math.floor(Math.random() * 999)).padStart(3, "0")}` : "",
      nomeTransportadora: parceiro,
      estado: estados[Math.floor(Math.random() * estados.length)],
      codigoDoCliente: `CLI${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      nomeCliente: nomes[Math.floor(Math.random() * nomes.length)],
      numeroPedido: `LIC${String(i).padStart(6, "0")}`, // Licença em vez de pedido físico
      dataLancamentoPedido: format(dataLancamento, "yyyy-MM-dd"),
      dataParaEntrega: format(dataExpiracao, "yyyy-MM-dd"), // Data de expiração da licença
      statusDoPedido: statusesPedido[Math.floor(Math.random() * statusesPedido.length)],
      dataPicking: format(dataConfiguracao, "yyyy-MM-dd"), // Data de configuração
      statusPicking: statusesPicking[Math.floor(Math.random() * statusesPicking.length)],
      notaFiscal: `NF${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`, // Nota fiscal para software
      chaveNFe: chaveNFe,
      statusNotaFiscal: statusNotaFiscal,
      // Campo para produto de software
      pedidosCompra: produto,
    })
  }

  return pedidos.sort((a, b) => new Date(b.dataLancamentoPedido).getTime() - new Date(a.dataLancamentoPedido).getTime())
}

export const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = React.useState<Pedido[]>([])
  const [allPedidos, _setAllPedidos] = React.useState<Pedido[]>(generateFictionalPedidos())
  const [loading, setLoading] = React.useState<boolean>(true)
  const [_error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchType, setSearchType] = React.useState<SearchType>("numeroPedido")
  const [searchValue, setSearchValue] = React.useState<string>("")
  const [currentPeriodFilter, setCurrentPeriodFilter] = React.useState<PeriodFilter>("ultimoMes")
  const [activeDateRange, setActiveDateRange] = React.useState<{
    start: Date | undefined
    end: Date | undefined
  }>({
    start: undefined,
    end: undefined,
  })

  const [pageSize, setPageSize] = React.useState<number>(7)

  const columns = usePedidosColumns()

  React.useEffect(() => {
    console.log("Dados fictícios gerados:", pedidos.slice(0, 5)) // Mostra os primeiros 5 pedidos
    console.log("Total de pedidos gerados:", pedidos.length)
  }, [pedidos])

  const table = useReactTable({
    data: pedidos,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  const fetchPedidosWithDateRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true)
      setError(null)

      setActiveDateRange({
        start: startDate,
        end: endDate,
      })

      // Simula delay de carregamento de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 7000))

      // Filter fictional data by date range
      const filteredPedidos = allPedidos.filter((pedido) => {
        const pedidoDate = new Date(pedido.dataLancamentoPedido)
        return pedidoDate >= startDate && pedidoDate <= endDate
      })

      setPedidos(filteredPedidos)
      setError(filteredPedidos.length === 0 ? "empty" : null)

      console.log("Pedidos filtrados por data:", filteredPedidos.length)
    } catch (err) {
      setError("error")
    } finally {
      setLoading(false)
    }
  }

  // Função para aplicar o filtro de período selecionado
  const applyPeriodFilter = (periodFilter: PeriodFilter) => {
    setCurrentPeriodFilter(periodFilter)

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    switch (periodFilter) {
      case "todos":
        const doisAnosAtras = subYears(hoje, 2)
        fetchPedidosWithDateRange(doisAnosAtras, hoje)
        break
      case "ultimoAno":
        const umAnoAtras = subYears(hoje, 1)
        fetchPedidosWithDateRange(umAnoAtras, hoje)
        break
      case "ultimoMes":
        const umMesAtras = subMonths(hoje, 1)
        fetchPedidosWithDateRange(umMesAtras, hoje)
        break
      case "ultimos90Dias":
        const noventaDiasAtras = subDays(hoje, 90)
        fetchPedidosWithDateRange(noventaDiasAtras, hoje)
        break
    }
  }

  // Na primeira renderização, busca os dados do último mês
  React.useEffect(() => {
    applyPeriodFilter("ultimoMes")
  }, [])

  // Efeito para aplicar filtros de texto (número de pedido, status, nota fiscal)
  React.useEffect(() => {
    if (searchType === "numeroPedido" || searchType === "notaFiscal") {
      // For numeric fields, allow partial matching without removing non-numeric characters
      table.getColumn(searchType)?.setFilterValue(searchValue)
    } else if (searchType === "statusDoPedido") {
      table.getColumn(searchType)?.setFilterValue(searchValue)
    } else if (searchType === "pedidosCompra") {
      if (searchValue.trim() === "") {
        table.getColumn("pedidosCompra")?.setFilterValue(undefined)
      } else {
        table.getColumn("pedidosCompra")?.setFilterValue(searchValue)
      }
    }
  }, [searchValue, searchType, table])



  // Componente de Skeleton para a tabela (desktop)
  const SkeletonTable = () => {
    const headerGroup = table.getHeaderGroups()[0]
    return (
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Componente de Skeleton para cards (mobile)
  const SkeletonCards = () => (
    <div className="md:hidden space-y-4">
      {[...Array(pageSize)].map((_, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-xs">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Skeleton para paginação
  const SkeletonPagination = () => (
    <div className="flex items-center justify-center md:justify-between space-x-2 py-4 px-2">
      <Skeleton className="h-8 w-64" />
    </div>
  )

  if (loading) {
    return (
      <div className="w-full p-2 md:p-4">
        <Skeleton className="h-8 w-48 mb-4" /> {/* Título */}
        <Skeleton className="h-12 w-full mb-4 rounded-md" /> {/* Filtro */}
        <SkeletonTable />
        <SkeletonCards />
        <SkeletonPagination />
      </div>
    )
  }

  

  

  return (
    <div className="w-full p-2 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Pedidos</h1>

      <PedidosFilter
        searchType={searchType}
        setSearchType={setSearchType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        currentPeriodFilter={currentPeriodFilter}
        applyPeriodFilter={applyPeriodFilter}
        activeDateRange={activeDateRange}
        setActiveDateRange={setActiveDateRange}
        fetchPedidosWithDateRange={fetchPedidosWithDateRange}
      />

      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const pedido = row.original as Pedido
            return (
              <Card key={row.id} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground">Pedido</span>
                      <span className="text-lg font-semibold">#{pedido.numeroPedido}</span>
                    </div>
                    <Badge
                      variant={
                        pedido.statusDoPedido === "Pendente Ativação"
                          ? "default"
                          : pedido.statusDoPedido === "Ativado"
                            ? "secondary"
                            : pedido.statusDoPedido === "Renovado"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {pedido.statusDoPedido}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Cliente:</span>
                      <p className="font-medium truncate">{pedido.nomeCliente}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Código:</span>
                      <p className="font-medium">{pedido.codigoDoCliente}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lançamento:</span>
                      <p className="font-medium">{format(new Date(pedido.dataLancamentoPedido), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expiração:</span>
                      <p className="font-medium">{format(new Date(pedido.dataParaEntrega), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nota Fiscal:</span>
                      <p className="font-medium">{pedido.notaFiscal}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status NF:</span>
                      <Badge
                        variant={
                          pedido.statusNotaFiscal === "Autorizada"
                            ? "default"
                            : pedido.statusNotaFiscal === "Pendente"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {pedido.statusNotaFiscal}
                      </Badge>
                    </div>
                  </div>

                  {pedido.nomeTransportadora && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground text-sm">Parceiro:</span>
                      <p className="font-medium text-sm">{pedido.nomeTransportadora}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                    <span>Filial: {pedido.filial}</span>
                    <span>Estado: {pedido.estado}</span>
                    <span>Grupo: {pedido.grupo}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-24">
              <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-center md:justify-between space-x-2 py-4 px-2">
        <Paginacao
          currentPage={table.getState().pagination.pageIndex + 1}
          pageCount={table.getPageCount()}
          pageSize={pageSize}
          totalItems={table.getFilteredRowModel().rows.length}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={setPageSize}
          showPageSizeSelector={true}
          showJumpToPage={true}
          showItemsInfo={true}
          pageSizeOptions={[5, 7, 10, 20, 50, 100]}
        />
      </div>
    </div>
  )
}