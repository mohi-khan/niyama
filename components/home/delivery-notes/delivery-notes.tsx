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
import { Truck, Calendar, User, DollarSign, FileText } from 'lucide-react'

const DeliveryNotes = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: deliveryNotes } = useGetDeliveryNote(warehouse)
  console.log('🚀 ~ DeliveryNotes ~ deliveryNotes:', deliveryNotes)

  const deliveryNoteList = deliveryNotes?.data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-3 bg-[#42af4b] rounded-lg">
          <Truck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Notes</h1>
          <p className="text-sm text-gray-600">
            Manage and track delivery notes ({deliveryNoteList.length} total)
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-20 font-semibold text-gray-900">SL</TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Delivery Note
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Customer
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Posting Date
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  <div className="flex items-center justify-end gap-2">
                    Grand Total
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* No data */}
              {deliveryNoteList.length === 0 && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Truck className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No Delivery Notes Found</p>
                      <p className="text-sm">There are no delivery notes to display</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {deliveryNoteList.map((deliveryNote: any, index: number) => (
                <TableRow key={deliveryNote.name ?? index} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/delivery-note-details/${deliveryNote.name}`}
                      className="font-semibold text-[#42af4b] hover:text-[#3ba844] hover:underline transition-colors"
                    >
                      {deliveryNote.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-900">{deliveryNote.customer}</TableCell>
                  <TableCell className="text-gray-700">{deliveryNote.posting_date}</TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    ${deliveryNote.grand_total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default DeliveryNotes