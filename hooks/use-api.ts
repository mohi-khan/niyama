import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deliverNote,
  getDeliveryNote,
  getDeliveryNoteDetails,
  getItems,
  getStockLevelItem,
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
      return response
    },
    onSuccess: () => {
      console.log('hit');
      toast({
        title: 'Success!',
        description: 'Note delivered successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['deliveryNoteDetails'] })

      reset()
      onClose()
    },
    onError: (error: any) => {
      console.error('Error delivering note:', error)

      let errorMessage = 'Failed to deliver note.'

      // Handle Frappe-specific error format
      console.log('hit2');
      if (error.response) {
        const status = error.response.status
        const errorData = error.response.data

        // Handle 417 validation errors from Frappe
        if (status === 417 && errorData._server_messages) {
          try {
            const messages = JSON.parse(errorData._server_messages || '[]')
            const cleanMessages = messages.map((msg: string) => {
              const parsedMsg = JSON.parse(msg)
              // Remove HTML tags from Frappe messages
              return parsedMsg.message.replace(/<[^>]*>/g, '')
            })
            errorMessage =
              cleanMessages.join('\n') || 'Validation error occurred.'
          } catch (parseError) {
            console.error('Error parsing server messages:', parseError)
            errorMessage = 'Validation error occurred.'
          }
        }
        // Handle other Frappe errors
        else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.exception) {
          errorMessage = errorData.exception
        }
        // Handle network errors
        else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (status === 403) {
          errorMessage =
            'You do not have permission to submit this delivery note.'
        } else if (status === 404) {
          errorMessage = 'Delivery note not found.'
        }
      }
      // Handle network or unknown errors
      else if (error.message) {
        errorMessage = error.message
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
