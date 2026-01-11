'use client'

import {
  useGetGoodsIssueDetails,
  useGetGoodsReceivedDetails,
  useIssueGoods,
} from '@/hooks/use-api'
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
import { Printer } from 'lucide-react'

const GoodsIssueDetails = () => {
  const name = useParams().name
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const { data: goodsIssue, isLoading } = useGetGoodsIssueDetails(
    name as string
  )

  const goodData = goodsIssue?.data?.data

  // Initialize the issue mutation
  const issueMutation = useIssueGoods({
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
        <p className="text-center text-muted-foreground">
          No goods received details found.
        </p>
      </div>
    )
  }

  // Check if goods are already issued (docstatus === 1)
  const isIssued = goodData.docstatus === 1

  const handleIssue = () => {
    if (!isIssued && goodData.name) {
      issueMutation.mutate({ name: goodData.name })
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{goodData.name}</h1>
          <p className="text-muted-foreground">{goodData.stock_entry_type}</p>
        </div>
        <Button
          variant={'outline'}
          onClick={() => setIsAlertOpen(true)}
          disabled={isIssued || issueMutation.isPending}
        >
          {issueMutation.isPending
            ? 'Issuing...'
            : isIssued
              ? 'Issued'
              : 'Issue'}
        </Button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to issue these goods? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleIssue}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entry Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Stock Entry Type</p>
              <p className="font-semibold">{goodData.stock_entry_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Purpose</p>
              <p className="font-semibold">{goodData.purpose}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document Type</p>
              <p className="font-semibold">{goodData.doctype}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posting Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Posting Date</p>
              <p className="font-semibold">{goodData.posting_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posting Time</p>
              <p className="font-semibold">{goodData.posting_time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-semibold">{goodData.owner}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-semibold">{goodData.company}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="font-semibold">{goodData.items.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Items</h2>
          <div>
            <Printer
              className="border p-2 w-10 h-10 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handlePrint()}
            />
          </div>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SL</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Source Warehouse</TableHead>
                <TableHead>Target Warehouse</TableHead>
                <TableHead>Actual Target Warehouse</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* No data */}
              {goodData.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {goodData.items.map((item, index) => (
                <TableRow key={item.name ?? index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.s_warehouse || 'N/A'}</TableCell>
                  <TableCell>{item.t_warehouse || 'N/A'}</TableCell>
                  <TableCell>
                    {item.custom_actual_target_warehouse || 'N/A'}
                  </TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Printable Goods Received Note (Hidden from view) */}
      <div className="hidden">
        <div ref={printRef} className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 py-2">
              Goods Issue Note
            </h2>
          </div>

          {/* Entry and Date Info */}
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

          {/* Table */}
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

          {/* Signature Section */}
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

export default GoodsIssueDetails
