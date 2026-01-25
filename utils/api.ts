import { fetchApi } from '@/utils/http'
import {
  DeliveryNoteDetailsType,
  DeliveryNotesType,
  GetItemType,
  getStockLevelItemType,
  GoodsReceivedDetailsType,
  GoodsReceivedType,
  SignInRequest,
  SignInResponse,
  SignInResponseSchema,
  UserWarehousePermissionType,
} from '@/utils/type'
import { resolveApiKey } from './api-key'

export async function signIn(credentials: SignInRequest) {
  return fetchApi<SignInResponse>({
    url: 'api/method/login',
    method: 'POST',
    body: credentials,
    schema: SignInResponseSchema,
  })
}

export async function getUserDetAssWarehouse() {
  const apiKey = resolveApiKey()
  return fetchApi<any>({
    url: `api/method/frappe.auth.get_logged_user`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getUserPermission(username: string) {
  const apiKey = resolveApiKey()
  const filters = JSON.stringify([
    ['user', '=', username],
    ['allow', '=', 'Warehouse'],
  ])
  const fields = JSON.stringify(['for_value'])
  return fetchApi<UserWarehousePermissionType>({
    url: `api/resource/User Permission?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getDeliveryNote(warehouse: string[] | null) {
  const apiKey = resolveApiKey()
  console.log('🚀 ~ getDeliveryNote ~ warehouse:', warehouse)
  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['set_warehouse', 'in', warehouse]]
      : []),
  ])
  console.log('🚀 ~ getDeliveryNote ~ filters:', filters)
  const fields = JSON.stringify([
    'name',
    'customer',
    'posting_date',
    'grand_total',
  ])

  return fetchApi<DeliveryNotesType>({
    url: `api/resource/Delivery Note?filters=${encodeURIComponent(filters)}&fields=${encodeURIComponent(fields)}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function deliverNote(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi({
    url: `api/resource/Delivery Note/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getDeliveryNoteDetails(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi<DeliveryNoteDetailsType>({
    url: `api/resource/Delivery Note/${name}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getItems() {
  const apiKey = resolveApiKey()
  return fetchApi<GetItemType>({
    url: 'api/method/getItems',
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getStockLevelItem(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi<getStockLevelItemType>({
    url: `api/method/getStockLevelItem?item_code=${name}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getGoodsReceived(warehouse: string[] | null) {
  const apiKey = resolveApiKey()
  console.log('🚀 ~ getGoodsReceived ~ warehouse:', warehouse)

  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['Stock Entry Detail', 't_warehouse', 'in', warehouse]]
      : []),
    ['add_to_transit', '=', 0],
  ])

  console.log('🚀 ~ getGoodsReceived ~ filters:', filters)

  const fields = JSON.stringify(['name', 'stock_entry_type', 'posting_date'])

  return fetchApi<GoodsReceivedType>({
    url: `api/resource/Stock Entry?filters=${encodeURIComponent(
      filters
    )}&fields=${encodeURIComponent(fields)}&group_by=name`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getGoodsReceivedDetails(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi<GoodsReceivedDetailsType>({
    url: `api/resource/Stock Entry/${name}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getGoodsIssue(warehouse: string[] | null) {
  const apiKey = resolveApiKey()
  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['Stock Entry Detail', 's_warehouse', 'in', warehouse]]
      : []),
  ])

  console.log('🚀 ~ getGoodsIssue ~ filters:', filters)

  const fields = JSON.stringify(['name', 'stock_entry_type', 'posting_date'])

  return fetchApi<GoodsReceivedType>({
    url: `api/resource/Stock Entry?filters=${encodeURIComponent(
      filters
    )}&fields=${encodeURIComponent(fields)}&group_by=name`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function getGoodsIssueDetails(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi<GoodsReceivedDetailsType>({
    url: `api/resource/Stock Entry/${name}`,
    method: 'GET',
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function issueGoods(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi({
    url: `api/resource/Stock Entry/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
    headers: {
      Authorization: apiKey || '',
    },
  })
}

export async function receiveGoods(name: string) {
  const apiKey = resolveApiKey()
  return fetchApi({
    url: `api/resource/Stock Entry/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
    headers: {
      Authorization: apiKey || '',
    },
  })
}
