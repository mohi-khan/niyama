'use client'

import { useGetGoodsReceivedDetails, useReceiveGoods } from '@/hooks/use-api'
import { useParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Printer,
  ArrowDownToLine,
  Calendar,
  Clock,
  Building2,
  Package,
  FileText,
  Warehouse,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

const GoodsReceivedDetails = () => {
  const name = useParams().name
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const { data: goodsReceived, isLoading } = useGetGoodsReceivedDetails(
    name as string
  )

  const goodData = goodsReceived?.data?.data

  // Initialize the receive mutation
  const receiveMutation = useReceiveGoods({
    onClose: () => {
      setIsAlertOpen(false)
    },
    reset: () => {},
  })

  // Print handler
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!goodData) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-center text-gray-500 font-medium">
            No goods received details found.
          </p>
        </div>
      </div>
    )
  }

  // Check if goods are already received (docstatus === 1)
  const isReceived = goodData.docstatus === 1

  const handleReceive = () => {
    if (!isReceived && goodData.name) {
      receiveMutation.mutate({ name: goodData.name })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 pb-4 border-b">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#42af4b] rounded-lg">
            <ArrowDownToLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {goodData.name}
            </h1>
            <p className="text-gray-600 mt-1">{goodData.stock_entry_type}</p>
            <div className="flex items-center gap-2 mt-2">
              {isReceived ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Received
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                  <Clock className="h-3 w-3" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          className={`${isReceived ? 'bg-gray-400' : 'bg-[#42af4b] hover:bg-[#3ba844]'} text-white`}
          onClick={() => setIsAlertOpen(true)}
          disabled={isReceived || receiveMutation.isPending}
        >
          {receiveMutation.isPending ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Receiving...
            </>
          ) : isReceived ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Received
            </>
          ) : (
            <>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </>
          )}
        </Button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-[#42af4b]" />
              Confirm Receive
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to receive these goods? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReceive}
              className="bg-[#42af4b] hover:bg-[#3ba844]"
            >
              Confirm Receive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#42af4b]" />
              Entry Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Stock Entry Type</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {goodData.stock_entry_type}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Purpose</p>
              <p className="font-semibold text-gray-900">{goodData.purpose}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Document Type</p>
              <p className="font-semibold text-gray-900">{goodData.doctype}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#42af4b]" />
              Posting Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Posting Date</p>
                <p className="font-semibold text-gray-900">
                  {goodData.posting_date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Posting Time</p>
                <p className="font-semibold text-gray-900">
                  {goodData.posting_time}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Owner</p>
              <p className="font-semibold text-gray-900">{goodData.owner}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3 bg-gray-50 border-b">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#42af4b]" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Company</p>
                <p className="font-semibold text-gray-900">
                  {goodData.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Total Items</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {goodData.items.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#42af4b]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Items ({goodData.items.length})
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePrint()}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-16 font-semibold text-gray-900">
                  SL
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Item Code
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Item Name
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Source
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Actual Target
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  Qty
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Description
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {goodData.items.length === 0 && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Package className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {goodData.items.map((item, index) => (
                <TableRow
                  key={item.name ?? index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-700">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {item.item_code}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.item_name}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.s_warehouse || 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {item.custom_actual_target_warehouse || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {item.qty}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {item.description || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Printable Goods Received Note (Hidden from view) */}
      <div className="hidden">
        <div ref={printRef} className="p-8 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 py-2">
              Goods Received Note
            </h2>
          </div>

          <div className="flex justify-between mb-6 text-sm">
            <div>
              <p className="mb-1">
                <span className="font-semibold">Entry Type:</span>{' '}
                {goodData.stock_entry_type}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Purpose:</span>{' '}
                {goodData.purpose}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Company:</span>{' '}
                {goodData.company}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1">
                <span className="font-semibold">Date:</span>{' '}
                {goodData.posting_date}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Time:</span>{' '}
                {goodData.posting_time}
              </p>
              <p>
                <span className="font-semibold">Entry No:</span> {goodData.name}
              </p>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  SL
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  Item - Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Source Warehouse
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Target Warehouse
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {goodData.items.map((item, index) => (
                <tr key={item.name ?? index}>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    <span className="font-semibold">{item.item_code}</span> -{' '}
                    {item.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.s_warehouse || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.custom_actual_target_warehouse ||
                      item.t_warehouse ||
                      'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.qty}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-right font-semibold">
                  Total Items
                </td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                  {goodData.items.reduce((sum, item) => sum + item.qty, 0)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between pt-12">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 w-40">
                <p className="text-sm font-semibold">Prepared By</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 w-40">
                <p className="text-sm font-semibold">Checked By</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 w-40">
                <p className="text-sm font-semibold">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoodsReceivedDetails
