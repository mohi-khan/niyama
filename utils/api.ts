import { fetchApi } from '@/utils/http'
import {
  DeliveryNoteDetailsType,
  DeliveryNotesType,
  GetItemType,
  getStockLevelItemType,
  SignInRequest,
  SignInResponse,
  SignInResponseSchema,
  UserWarehousePermissionType,
} from '@/utils/type'
const API_KEY_AND_SECRET = process.env.NEXT_PUBLIC_API_KEY_AND_SECRET

export async function signIn(credentials: SignInRequest) {
  return fetchApi<SignInResponse>({
    url: 'api/method/login',
    method: 'POST',
    body: credentials,
    schema: SignInResponseSchema,
  })
}

export async function getUserDetAssWarehouse() {
  return fetchApi<any>({
    url: `api/method/frappe.auth.get_logged_user`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getUserPermission(username: string) {
  const filters = JSON.stringify([
    ['user', '=', username],
    ['allow', '=', 'Warehouse'],
  ])
  const fields = JSON.stringify(['for_value'])
  return fetchApi<UserWarehousePermissionType>({
    url: `api/resource/User Permission?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getDeliveryNote(warehouse: string[] | null) {
  console.log("🚀 ~ getDeliveryNote ~ warehouse:", warehouse)
  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['set_warehouse', 'in', warehouse]]
      : []),
  ])
  console.log("🚀 ~ getDeliveryNote ~ filters:", filters)
  const fields = JSON.stringify(["name", "customer", "posting_date", "grand_total"])

  return fetchApi<DeliveryNotesType>({
    url: `api/resource/Delivery Note?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getDeliveryNoteDetails(name: string) {
  return fetchApi<DeliveryNoteDetailsType>({
    url: `api/resource/Delivery Note/${name}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getItems() {
  return fetchApi<GetItemType>({
    url: 'api/method/getItems',
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getStockLevelItem(name: string) {
  return fetchApi<getStockLevelItemType>({
    url: `api/method/getStockLevelItem?item_code=${name}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}
