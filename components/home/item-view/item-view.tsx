'use client'

import { Label } from '@/components/ui/label'
import { useGetItems, useGetTransactionReport } from '@/hooks/use-api'
import { CustomCombobox } from '@/utils/custom-combobox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Package, Warehouse, TrendingUp } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import {
  apiKeyAtom,
  useInitializeUserPermission,
} from '@/utils/user-permission'
import { useAtom } from 'jotai'

const ItemView = () => {
  useInitializeUserPermission()
  const [arrivalTime, setArrivalTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number>(performance.now())
  const { data: items, isLoading } = useGetItems()

  const [selectedName, setSelectedName] = useState<string>('')

  const formatLabel = (item: {
    name?: string
    item_name?: string
    description?: string
  }) =>
    [item.name, item.item_name, item.description].filter(Boolean).join(' - ')

  const handleSelectChange = (value: { id: string; name: string } | null) => {
    setSelectedName(value?.id || '')
  }

  const { data: stockLevelItem } = useGetTransactionReport(selectedName)

  // Measure data arrival time
  useEffect(() => {
    if (items) {
      const endTime = performance.now()
      setArrivalTime(endTime - startTime)
    }
  }, [items, startTime])

  // Reset timer on new fetch
  useEffect(() => {
    setStartTime(performance.now())
    setArrivalTime(null)
  }, [isLoading])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="p-3 bg-[#42af4b] rounded-lg">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Item Stock View</h1>
          <p className="text-sm text-gray-600">
            Search and view item stock levels across warehouses
          </p>
        </div>
      </div>

      {/* Combobox Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-3">
          <Label
            htmlFor="name"
            className="text-base font-semibold text-gray-900 flex items-center gap-2"
          >
            <Package className="h-4 w-4 text-[#42af4b]" />
            Select Item
          </Label>
          <CustomCombobox
            items={
              items?.data?.message.map((item) => ({
                id: String(item.name),
                name: formatLabel(item),
              })) || []
            }
            value={
              selectedName
                ? {
                    id: selectedName,
                    name: formatLabel(
                      items?.data?.message.find(
                        (i) => String(i.name) === selectedName
                      ) || {}
                    ),
                  }
                : null
            }
            onChange={handleSelectChange}
            placeholder="Search for an item..."
          />
        </div>
      </div>

      {/* Stock Level Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#42af4b]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Levels by Warehouse
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-20 font-semibold text-gray-900">
                  SL
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    Warehouse
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  <div className="flex items-center justify-end gap-2">
                    Actual Quantity
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* No item selected */}
              {!selectedName && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Package className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No Item Selected</p>
                      <p className="text-sm">
                        Please select an item to view stock levels
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Item selected but no stock */}
              {selectedName && stockLevelItem?.data?.message?.length === 0 && (
                <TableRow className="hover:bg-gray-50">
                  <TableCell colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Warehouse className="h-12 w-12 text-gray-300" />
                      <p className="font-medium">No Stock Available</p>
                      <p className="text-sm">
                        This item has no stock in any warehouse
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Stock data */}
              {selectedName &&
                stockLevelItem?.data?.message &&
                stockLevelItem.data.message.length > 0 &&
                stockLevelItem.data.message.map((item, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-700">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {item.warehouse}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold`}
                      >
                        {item.actual_qty}
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

export default ItemView
