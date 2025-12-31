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
import React, { useState } from 'react'

const ItemView = () => {
  const { data: items } = useGetItems()
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

  return (
    <div className="space-y-4">
      {/* Combobox */}
      <div className="space-y-2">
        <Label htmlFor="name">Item*</Label>

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
          placeholder="Select item"
        />
      </div>

      {/* Stock Level Table (Always Visible) */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">SL</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Actual Quantity</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* No item selected */}
            {!selectedName && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Please select an item to show stock level item.
                </TableCell>
              </TableRow>
            )}

            {/* Item selected but no stock */}
            {selectedName && stockLevelItem?.data?.message?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No stock available for this item.
                </TableCell>
              </TableRow>
            )}

            {/* Stock data */}
            {selectedName &&
              stockLevelItem?.data?.message &&
              stockLevelItem.data.message.length > 0 &&
              stockLevelItem.data.message.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.warehouse}</TableCell>
                  <TableCell className="text-right">
                    {item.actual_qty}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ItemView
