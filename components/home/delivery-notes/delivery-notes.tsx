'use client'

import { useGetDeliveryNote } from '@/hooks/use-api'
import {
  useInitializeUserPermission,
  warehousePermissionAtom,
} from '@/utils/user-permission'
import { useAtom } from 'jotai'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

const DeliveryNotes = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: deliveryNotes } = useGetDeliveryNote(warehouse)
  console.log('🚀 ~ DeliveryNotes ~ deliveryNotes:', deliveryNotes)

  const deliveryNoteList = deliveryNotes?.data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table className="shadow-md">
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="w-16">SL</TableHead>
              <TableHead>Delivery Note Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Posting Date</TableHead>
              <TableHead className="text-right">Grand Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* No data */}
            {deliveryNoteList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No delivery notes found.
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {deliveryNoteList.map((deliveryNote: any, index: number) => (
              <TableRow key={deliveryNote.name ?? index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-semibold">
                  <Link href={`/delivery-note-details/${deliveryNote.name}`}>
                    {deliveryNote.name}
                  </Link>
                </TableCell>
                <TableCell>{deliveryNote.customer}</TableCell>
                <TableCell>{deliveryNote.posting_date}</TableCell>
                <TableCell className="text-right">
                  {deliveryNote.grand_total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DeliveryNotes
