import { useQuery } from '@tanstack/react-query'
import { getDeliveryNote, getItems, getStockLevelItem } from '@/utils/api'

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

export const useGetDeliveryNote = (warehouse: string[] | null) => {
  console.log("🚀 ~ useGetDeliveryNote ~ warehouse:", warehouse)
  return useQuery({
    queryKey: ['deliveryNotes', warehouse],
    queryFn: () => {
      return getDeliveryNote(warehouse)
    },
    select: (data) => data,
  })
}

// export const  useGetDeliveryNote = async (warehouse: string[] | null) => {
//   console.log("🚀 ~ useGetDeliveryNote ~ warehouse:", warehouse)
//   const API_KEY_AND_SECRET = process.env.NEXT_PUBLIC_API_KEY_AND_SECRET
//   const filters = JSON.stringify([
//     ['docstatus', '=', 0],
//     ...(warehouse && warehouse.length > 0
//       ? [['set_warehouse', 'in', warehouse]]
//       : []),
//   ])
//   console.log("🚀 ~ getDeliveryNote ~ filters:", filters)
//   const fields = JSON.stringify([["name", "customer", "posting_date", "grand_total", "shipping_address"]])
//     return await fetchApi<DeliveryNotesType>({
//       url: `api/resource/Delivery Note?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`,
//       method: 'GET',
//       headers: {
//         Authorization: API_KEY_AND_SECRET || '',
//       },
//     })
  
// }