import { useQuery } from '@tanstack/react-query'
import { getItems, getStockLevelItem } from '@/utils/api'

//item
export const useGetItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => {
      return getItems()
    },
    select: (data) => data,
  })
}

export const useGetTransactionReport = (name: string) => {
  return useQuery({
    queryKey: ['items', name],
    queryFn: () => {
      return getStockLevelItem(name)
    },
    select: (data) => data,
  })
}
