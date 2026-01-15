'use client'

import { useGetGoodsIssue } from '@/hooks/use-api'
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
import { ArrowUpFromLine, Calendar, FileText, Package } from 'lucide-react'

const GoodsIssue = () => {
  useInitializeUserPermission()

  const [warehousePermission] = useAtom(warehousePermissionAtom)

  const warehouse =
    (warehousePermission as any)?.map((w: any) => w.for_value) ?? null

  const { data: goodsIssue } = useGetGoodsIssue(warehouse)
  console.log('🚀 ~ GoodsIssue ~ goodsIssue:', goodsIssue?.data?.data)

  const goodsIssueList = goodsIssue?.data?.data ?? []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-3 bg-[#42af4b] rounded-lg">
          <ArrowUpFromLine className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goods Issue</h1>
          <p className="text-sm text-gray-600">
            Track outbound stock entries ({goodsIssueList.length} total)
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
              {goodsIssueList.length === 0 && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ArrowUpFromLine className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No Goods Issue Found</p>
                      <p className="text-sm">There are no goods issue entries to display</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Data rows */}
              {goodsIssueList.map((goodsIssue, index) => (
                <TableRow key={goodsIssue.name ?? index} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/goods-issue-details/${goodsIssue.name}`}
                      className="font-semibold text-[#42af4b] hover:text-[#3ba844] hover:underline transition-colors"
                    >
                      {goodsIssue.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-700">{goodsIssue.posting_date}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                      {goodsIssue.stock_entry_type}
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

export default GoodsIssue