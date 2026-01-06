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

const DeliveryNotes = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: deliveryNotes } = useGetDeliveryNote(warehouse)

  const deliveryNoteList = deliveryNotes?.data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">SL</TableHead>
              <TableHead className='text-right'>Delivery Note Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* No data */}
            {deliveryNoteList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  No delivery notes found.
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {deliveryNoteList.map((item: any, index: number) => (
              <TableRow key={item.name ?? index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className='text-right'>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DeliveryNotes
