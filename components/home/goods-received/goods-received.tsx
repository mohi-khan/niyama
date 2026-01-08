'use client'

import { useGetGoodsReceived } from '@/hooks/use-api'
import React from 'react'

const GoodsReceived = () => {
  const { data: goodsReceived } = useGetGoodsReceived()
  console.log('🚀 ~ GoodsReceived ~ goodsReceived:', goodsReceived)
  return <div>gr</div>
}

export default GoodsReceived
