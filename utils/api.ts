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
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function deliverNote(name: string) {
  return fetchApi({
    url: `api/resource/Delivery Note/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
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

export async function getGoodsReceived(warehouse: string[] | null) {
  console.log('🚀 ~ getGoodsReceived ~ warehouse:', warehouse)

  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['Stock Entry Detail', 't_warehouse', 'in', warehouse]]
      : []),
      ['add_to_transit' ,'=',0]
  ])

  console.log('🚀 ~ getGoodsReceived ~ filters:', filters)

  const fields = JSON.stringify(['name', 'stock_entry_type', 'posting_date'])

  return fetchApi<GoodsReceivedType>({
    url: `api/resource/Stock Entry?filters=${encodeURIComponent(
      filters
    )}&fields=${encodeURIComponent(fields)}&group_by=name`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getGoodsReceivedDetails(name: string) {
  return fetchApi<GoodsReceivedDetailsType>({
    url: `api/resource/Stock Entry/${name}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getGoodsIssue(warehouse: string[] | null) {
  const filters = JSON.stringify([
    ['docstatus', '=', 0],
    ...(warehouse && warehouse.length > 0
      ? [['Stock Entry Detail', 's_warehouse', 'in', warehouse]]
      : [])
  ])

  console.log('🚀 ~ getGoodsIssue ~ filters:', filters)

  const fields = JSON.stringify(['name', 'stock_entry_type', 'posting_date'])

  return fetchApi<GoodsReceivedType>({
    url: `api/resource/Stock Entry?filters=${encodeURIComponent(
      filters
    )}&fields=${encodeURIComponent(fields)}&group_by=name`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function getGoodsIssueDetails(name: string) {
  return fetchApi<GoodsReceivedDetailsType>({
    url: `api/resource/Stock Entry/${name}`,
    method: 'GET',
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function issueGoods(name: string) {
  return fetchApi({
    url: `api/resource/Stock Entry/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}

export async function receiveGoods(name: string) {
  return fetchApi({
    url: `api/resource/Stock Entry/${name}`,
    method: 'PUT',
    body: {
      docstatus: 1,
    },
    headers: {
      Authorization: API_KEY_AND_SECRET || '',
    },
  })
}