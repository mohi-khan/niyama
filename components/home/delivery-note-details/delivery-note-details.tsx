'use client'

import { useGetDeliveryNoteDetails, useDeliverNote } from '@/hooks/use-api'
import { useParams } from 'next/navigation'
import React, { useState, useRef } from 'react'
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

const DeliveryNoteDetails = () => {
  const name = useParams().name
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const { data: deliveryNoteDetails, isLoading } = useGetDeliveryNoteDetails(
    name as string
  )
  console.log(
    '🚀 ~ DeliveryNoteDetails ~ deliveryNoteDetails:',
    deliveryNoteDetails
  )

  const noteData = deliveryNoteDetails?.data?.data

  // Initialize the deliver mutation
  const deliverMutation = useDeliverNote({
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

  if (!noteData) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">
          No delivery note details found.
        </p>
      </div>
    )
  }

  // Check if delivery note is already submitted (docstatus === 1)
  const isDelivered = noteData.docstatus === 1

  const handleDeliver = () => {
    if (!isDelivered && noteData.name) {
      deliverMutation.mutate({ name: noteData.name })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{noteData.name}</h1>
          <p className="text-muted-foreground">{noteData.title}</p>
        </div>
        <Button
          variant={'outline'}
          onClick={() => setIsAlertOpen(true)}
          disabled={isDelivered || deliverMutation.isPending}
        >
          {deliverMutation.isPending
            ? 'Delivering...'
            : isDelivered
              ? 'Delivered'
              : 'Deliver'}
        </Button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deliver this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeliver}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold border-b pb-1 text-muted-foreground">
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-semibold">{noteData.customer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-semibold">{noteData.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Mobile</p>
              <p className="font-semibold">
                {noteData.contact_mobile || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold border-b pb-1 text-muted-foreground">
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Contact Person</p>
              <p className="font-semibold">
                {noteData.contact_person || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Display</p>
              <p className="font-semibold">
                {noteData.contact_display || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Email</p>
              <p className="font-semibold">{noteData.contact_email || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold border-b pb-1 text-muted-foreground">
              Posting Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Posting Date</p>
              <p className="font-semibold">{noteData.posting_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posting Time</p>
              <p className="font-semibold">{noteData.posting_time}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p className="font-semibold">{noteData.owner}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold border-b pb-1 text-muted-foreground">
              Company & Warehouse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-semibold">{noteData.company}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warehouse</p>
              <p className="font-semibold">{noteData.set_warehouse}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost Center</p>
              <p className="font-semibold">{noteData.cost_center || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold border-b pb-1 text-muted-foreground">
              Totals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="font-semibold">{noteData.total_qty}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Net Weight</p>
              <p className="font-semibold">{noteData.total_net_weight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Carton Quantity
              </p>
              <p className="font-semibold">
                {noteData.custom_total_cartoon_quantity}
              </p>
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
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SL</TableHead>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Item Group</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Carton Qty</TableHead>
                <TableHead>Stock Qty</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* No data */}
              {noteData.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {noteData.items.map((item, index) => (
                <TableRow key={item.name ?? index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.item_group}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.custom_carton_qty}</TableCell>
                  <TableCell>{item.stock_qty}</TableCell>
                  <TableCell>{item.warehouse}</TableCell>
                  <TableCell>{item.description || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Printable Delivery Note (Hidden from view) */}
      <div className="hidden">
        <div ref={printRef} className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 py-2">
              Delivery Note
            </h2>
          </div>

          {/* Customer and Date Info */}
          <div className="flex justify-between mb-6 text-sm">
            <div>
              <p className="mb-1">
                <span className="font-semibold">Customer:</span>{' '}
                {noteData.customer_name}
              </p>
              <p className="text-gray-600">
                {noteData.contact_display} {noteData.contact_mobile}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1">
                <span className="font-semibold">Date:</span>{' '}
                {noteData.posting_date}
              </p>
              <p className="mb-1">
                <span className="font-semibold">DC No:</span> {noteData.name}
              </p>
              <p>
                <span className="font-semibold">Warehouse:</span>{' '}
                {noteData.set_warehouse}
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
                  CTN
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  CTN/OUM
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {noteData.items.map((item, index) => (
                <tr key={item.name ?? index}>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    <span className="font-semibold">{item.item_code}</span> -{' '}
                    {item.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.custom_carton_qty || 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.qty / item.custom_carton_qty || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    {item.qty} pcs
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-right font-semibold">
                  Total
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                  {noteData.custom_total_cartoon_quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2"></td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                  {noteData.total_qty}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Note */}
          <p className="text-sm mb-8">
            <span className="font-semibold">Note:</span>{' '}
            {noteData.custom_special_instruction || 'N/A'}
          </p>

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

export default DeliveryNoteDetails
