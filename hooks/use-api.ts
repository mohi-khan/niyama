import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deliverNote,
  getDeliveryNote,
  getDeliveryNoteDetails,
  getGoodsIssue,
  getGoodsIssueDetails,
  getGoodsReceived,
  getGoodsReceivedDetails,
  getItems,
  getStockLevelItem,
  issueGoods,
} from '@/utils/api'
import { toast } from './use-toast'

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

export const useGetDeliveryNoteDetails = (name: string) => {
  return useQuery({
    queryKey: ['deliveryNoteDetails', name],
    queryFn: () => {
      return getDeliveryNoteDetails(name)
    },
    select: (data) => data,
  })
}

export const useDeliverNote = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await deliverNote(name)

      console.log('🚀 ~ useDeliverNote ~ response:', response)

      /**
       * 🔴 API-level error
       */
      if (response?.error) {
        throw {
          response: {
            status: response.error.status,
            data: response.error.details,
            message: response.error.message,
          },
        }
      }

      /**
       * ✅ Extract actual Delivery Note document
       */
      const doc = (response?.data as any)?.data

      const docstatus = doc?.docstatus

      console.log('✅ docstatus:', docstatus)

      /**
       * 🔴 Logical failure (not actually submitted)
       */
      if (docstatus !== 1) {
        throw {
          response: {
            status: 417,
            data: {
              message: 'Delivery note was not submitted.',
            },
          },
        }
      }

      return doc
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Note delivered successfully.',
      })

      queryClient.invalidateQueries({
        queryKey: ['deliveryNoteDetails'],
      })

      reset()
      onClose()
    },

    onError: (error: any) => {
      let errorMessage = 'Failed to deliver note.'

      const errorData = error?.response?.data
      const status = error?.response?.status

      // ✅ Frappe validation messages
      if (status === 417 && errorData?._server_messages) {
        try {
          const messages = JSON.parse(errorData._server_messages)

          errorMessage = messages
            .map((msg: string) => {
              const parsed = JSON.parse(msg)
              return parsed.message.replace(/<[^>]*>/g, '')
            })
            .join('\n')
        } catch {
          errorMessage = 'Validation error occurred.'
        }
      }
      // ✅ Frappe exception
      else if (errorData?.exception) {
        errorMessage = errorData.exception.replace(/<[^>]*>/g, '')
      }
      // ✅ Custom message
      else if (error?.response?.message) {
        errorMessage = error.response.message
      }
      // ✅ Permission
      else if (status === 403) {
        errorMessage =
          'You do not have permission to submit this delivery note.'
      }
      // ✅ Server error
      else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })

  return mutation
}

export const useGetDeliveryNote = (warehouse: string[] | null) => {
  console.log('🚀 ~ useGetDeliveryNote ~ warehouse:', warehouse)
  return useQuery({
    queryKey: ['deliveryNotes', warehouse],
    queryFn: () => {
      return getDeliveryNote(warehouse)
    },
    select: (data) => data,
  })
}

export const useGetGoodsIssue = (warehouse: string[] | null) => {
  console.log('🚀 ~ useGetDeliveryNote ~ warehouse:', warehouse)
  return useQuery({
    queryKey: ['goodsIssue', warehouse],
    queryFn: () => {
      return getGoodsIssue(warehouse)
    },
    select: (data) => data,
  })
}

export const useGetGoodsIssueDetails = (name: string) => {
  return useQuery({
    queryKey: ['goodsIssue', name],
    queryFn: () => {
      return getGoodsIssueDetails(name)
    },
    select: (data) => data,
  })
}

export const useGetGoodsReceived = (warehouse: string[] | null) => {
  console.log('🚀 ~ useGetDeliveryNote ~ warehouse:', warehouse)
  return useQuery({
    queryKey: ['goodsReceived', warehouse],
    queryFn: () => {
      return getGoodsReceived(warehouse)
    },
    select: (data) => data,
  })
}

export const useGetGoodsReceivedDetails = (name: string) => {
  return useQuery({
    queryKey: ['goodsReceived', name],
    queryFn: () => {
      return getGoodsReceivedDetails(name)
    },
    select: (data) => data,
  })
}

export const useIssueGoods = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const response = await issueGoods(name)

      console.log('🚀 ~ useDeliverNote ~ response:', response)

      /**
       * 🔴 API-level error
       */
      if (response?.error) {
        throw {
          response: {
            status: response.error.status,
            data: response.error.details,
            message: response.error.message,
          },
        }
      }

      /**
       * ✅ Extract actual Delivery Note document
       */
      const doc = (response?.data as any)?.data

      const docstatus = doc?.docstatus

      console.log('✅ docstatus:', docstatus)

      /**
       * 🔴 Logical failure (not actually submitted)
       */
      if (docstatus !== 1) {
        throw {
          response: {
            status: 417,
            data: {
              message: 'Delivery note was not submitted.',
            },
          },
        }
      }

      return doc
    },

    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Note delivered successfully.',
      })

      queryClient.invalidateQueries({
        queryKey: ['goodsReceived'],
      })

      reset()
      onClose()
    },

    onError: (error: any) => {
      let errorMessage = 'Failed to deliver note.'

      const errorData = error?.response?.data
      const status = error?.response?.status

      // ✅ Frappe validation messages
      if (status === 417 && errorData?._server_messages) {
        try {
          const messages = JSON.parse(errorData._server_messages)

          errorMessage = messages
            .map((msg: string) => {
              const parsed = JSON.parse(msg)
              return parsed.message.replace(/<[^>]*>/g, '')
            })
            .join('\n')
        } catch {
          errorMessage = 'Validation error occurred.'
        }
      }
      // ✅ Frappe exception
      else if (errorData?.exception) {
        errorMessage = errorData.exception.replace(/<[^>]*>/g, '')
      }
      // ✅ Custom message
      else if (error?.response?.message) {
        errorMessage = error.response.message
      }
      // ✅ Permission
      else if (status === 403) {
        errorMessage =
          'You do not have permission to submit this delivery note.'
      }
      // ✅ Server error
      else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })

  return mutation
}