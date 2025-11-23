"use client"

import { useState } from "react"
import { flexRender, type Row } from "@tanstack/react-table"
import { Eye, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Pedido } from "./PedidosColumns"
import { format } from "date-fns"

interface PedidosTableRowProps {
  row: Row<Pedido>
}

export function PedidosTableRow({ row }: PedidosTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const pedido = row.original

  return (
    <>
      <tr className="group hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-transparent transition-all duration-300 border-b border-slate-800/50">
        {/* Expand button */}
        <td className="px-6 py-5 text-sm w-10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </td>

        {/* Main visible cells */}
        {row
          .getVisibleCells()
          .filter((cell) => cell.column.id !== "expandDetails")
          .map((cell) => (
            <td key={cell.id} className="px-6 py-5 text-sm text-slate-300">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}

        {/* Action button */}
        <td className="px-6 py-5 text-sm">
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
        </td>
      </tr>

      {/* Expanded details row */}
      {isExpanded && (
        <tr className="bg-slate-900/50 border-b border-slate-800/30">
          <td colSpan={10} className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Código Cliente</p>
                <p className="text-sm text-white font-mono">{pedido.codigoDoCliente}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Grupo</p>
                <p className="text-sm text-white">{pedido.grupo}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Filial</p>
                <p className="text-sm text-white font-mono">{pedido.filial}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Data Picking</p>
                <p className="text-sm text-white">{format(new Date(pedido.dataPicking), "dd/MM/yyyy")}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Status Picking</p>
                <p className="text-sm text-white">{pedido.statusPicking}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 font-semibold mb-2">Nota Fiscal</p>
                <p className="text-sm text-white font-mono truncate">{pedido.notaFiscal}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 col-span-2 md:col-span-3 lg:col-span-4">
                <p className="text-xs text-slate-400 font-semibold mb-2">Chave NFe</p>
                <p className="text-xs text-white font-mono break-all bg-slate-900/50 p-2 rounded border border-slate-700/50">
                  {pedido.chaveNFe}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Modal with sophisticated iframe */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800/50 shadow-2xl">
          <DialogHeader className="border-b border-slate-800/50 pb-4">
            <DialogTitle className="text-xl text-white">Detalhes do Pedido {pedido.numeroPedido}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Informações completas do pedido de {pedido.nomeCliente}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Modern iframe container */}
            <div className="relative rounded-xl overflow-hidden border-2 border-gradient-to-r from-cyan-500/20 to-transparent bg-slate-900/30 shadow-lg">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-slate-900 to-transparent pointer-events-none" />

              <iframe
                srcDoc={generatePedidoHTML(pedido)}
                className="w-full h-96 border-none rounded-xl"
                title={`Pedido ${pedido.numeroPedido}`}
              />

              {/* Overlay shine effect */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-50" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function generatePedidoHTML(pedido: Pedido): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido ${pedido.numeroPedido}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          padding: 24px;
          min-height: 100vh;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(8, 145, 178, 0.05) 100%);
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #06b6d4;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }
        .header p {
          font-size: 14px;
          color: #94a3b8;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .card {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 8px;
          padding: 16px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .card:hover {
          border-color: rgba(6, 182, 212, 0.4);
          background: rgba(6, 182, 212, 0.05);
          transform: translateY(-2px);
        }
        .card-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .card-value {
          font-size: 15px;
          font-weight: 600;
          color: #f1f5f9;
          font-family: 'Monaco', 'Courier New', monospace;
          word-break: break-word;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }
        .status-pending {
          background: rgba(217, 119, 6, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(217, 119, 6, 0.4);
        }
        .status-active {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }
        .status-renewed {
          background: rgba(6, 182, 212, 0.2);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.4);
        }
        .status-cancelled {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .section {
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #06b6d4;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          border-bottom: 2px solid rgba(6, 182, 212, 0.2);
          padding-bottom: 8px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.1), transparent);
          margin: 24px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pedido #${pedido.numeroPedido}</h1>
          <p>Cliente: <strong>${pedido.nomeCliente}</strong></p>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-label">Código do Cliente</div>
            <div class="card-value">${pedido.codigoDoCliente}</div>
          </div>
          <div class="card">
            <div class="card-label">Produto</div>
            <div class="card-value">${pedido.pedidosCompra}</div>
          </div>
          <div class="card">
            <div class="card-label">Grupo</div>
            <div class="card-value">${pedido.grupo}</div>
          </div>
          <div class="card">
            <div class="card-label">Filial</div>
            <div class="card-value">${pedido.filial}</div>
          </div>
          <div class="card">
            <div class="card-label">Estado</div>
            <div class="card-value">${pedido.estado}</div>
          </div>
          <div class="card">
            <div class="card-label">Parceiro</div>
            <div class="card-value">${pedido.nomeTransportadora || "-"}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <div class="section-title">Datas e Status</div>
          <div class="grid">
            <div class="card">
              <div class="card-label">Data Lançamento</div>
              <div class="card-value">${format(new Date(pedido.dataLancamentoPedido), "dd/MM/yyyy")}</div>
            </div>
            <div class="card">
              <div class="card-label">Data Entrega</div>
              <div class="card-value">${format(new Date(pedido.dataParaEntrega), "dd/MM/yyyy")}</div>
            </div>
            <div class="card">
              <div class="card-label">Data Picking</div>
              <div class="card-value">${format(new Date(pedido.dataPicking), "dd/MM/yyyy")}</div>
            </div>
            <div class="card">
              <div class="card-label">Status Pedido</div>
              <div class="status-badge status-${pedido.statusDoPedido.toLowerCase().replace(" ", "-")}">${pedido.statusDoPedido}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Nota Fiscal</div>
          <div class="grid">
            <div class="card">
              <div class="card-label">Número NF</div>
              <div class="card-value">${pedido.notaFiscal}</div>
            </div>
            <div class="card">
              <div class="card-label">Status NF</div>
              <div class="card-value">${pedido.statusNotaFiscal || "N/A"}</div>
            </div>
          </div>
          <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 8px; padding: 12px; margin-top: 16px;">
            <div class="card-label">Chave NFe</div>
            <div class="card-value" style="font-size: 11px; word-break: break-all;">${pedido.chaveNFe}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
