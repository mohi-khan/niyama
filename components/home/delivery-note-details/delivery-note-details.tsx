'use client'

import { useGetDeliveryNoteDetails, useDeliverNote } from '@/hooks/use-api'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
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

const DeliveryNoteDetails = () => {
  const name = useParams().name
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const { data: deliveryNoteDetails, isLoading } = useGetDeliveryNoteDetails(
    name as string
  )
  console.log("🚀 ~ DeliveryNoteDetails ~ deliveryNoteDetails:", deliveryNoteDetails)

  const noteData = deliveryNoteDetails?.data?.data

  // Initialize the deliver mutation
  const deliverMutation = useDeliverNote({
    onClose: () => {
      setIsAlertOpen(false)
      // Optional: Add any post-delivery actions
    },
    reset: () => {
      // Optional: Add any reset logic
    },
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
    <div className="space-y-6 p-6">
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
        <AlertDialogContent className='bg-white'>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">
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
        <h2 className="text-2xl font-bold">Items</h2>
        <div className="border rounded-md">
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
    </div>
  )
}

export default DeliveryNoteDetails
