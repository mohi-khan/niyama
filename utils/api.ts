import { fetchApi } from '@/utils/http'
import {
  GetItemType,
  getStockLevelItemType,
  SignInRequest,
  SignInResponse,
  SignInResponseSchema,
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

export async function getItems() {
  return fetchApi<GetItemType>({
    url: 'api/method/getItems',
    method: 'GET',
    headers: {
        'Authorization': API_KEY_AND_SECRET || '',
    },
  })
}

export async function getStockLevelItem(name: string) {
  return fetchApi<getStockLevelItemType>({
    url: `api/method/getStockLevelItem?item_code=${name}`,
    method: 'GET',
    headers: {
        'Authorization': API_KEY_AND_SECRET || '',
    },
  })
}

