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

const GoodsReceived = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: goodsReceived } = useGetGoodsReceived(warehouse)
  console.log('🚀 ~ GoodsReceived ~ goodsReceived:', goodsReceived?.data?.data)

  const goodsReceivedList = goodsReceived?.data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table className="shadow-md">
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="w-16">SL</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Posting Date</TableHead>
              <TableHead className="text-right">Stock Entry Type</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* No data */}
            {goodsReceivedList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No goods received found.
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {goodsReceivedList.map((goodsReceived, index) => (
              <TableRow key={goodsReceived.name ?? index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-semibold">
                  <Link href={`/goods-received-details/${goodsReceived.name}`}>
                    {goodsReceived.name}
                  </Link>
                </TableCell>
                <TableCell>{goodsReceived.posting_date}</TableCell>
                <TableCell className="text-right">
                  {goodsReceived.stock_entry_type}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default GoodsReceived
