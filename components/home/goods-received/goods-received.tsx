'use client'

import { useGetGoodsReceived } from '@/hooks/use-api'
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
import { ArrowDownToLine, Calendar, FileText, Package } from 'lucide-react'

const GoodsReceived = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: goodsReceived } = useGetGoodsReceived(warehouse)
  console.log('🚀 ~ GoodsReceived ~ goodsReceived:', goodsReceived?.data?.data)

  const materialReceivedData =
    goodsReceived?.data?.data?.filter(
      (item) => item.stock_entry_type === 'Material Transfer'
    )

  const goodsReceivedList = materialReceivedData ?? []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-3 bg-[#42af4b] rounded-lg">
          <ArrowDownToLine className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goods Received</h1>
          <p className="text-sm text-gray-600">
            Track inbound stock entries ({goodsReceivedList.length} total)
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
                    Entry Name
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Posting Date
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  <div className="flex items-center justify-end gap-2">
                    Entry Type
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* No data */}
              {goodsReceivedList.length === 0 && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ArrowDownToLine className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No Goods Received Found</p>
                      <p className="text-sm">There are no goods received entries to display</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {goodsReceivedList.map((goodsReceived, index) => (
                <TableRow key={goodsReceived.name ?? index} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/goods-received-details/${goodsReceived.name}`}
                      className="font-semibold text-[#42af4b] hover:text-[#3ba844] hover:underline transition-colors"
                    >
                      {goodsReceived.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-700">{goodsReceived.posting_date}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {goodsReceived.stock_entry_type}
                    </span>
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

export default GoodsReceived