import { z } from 'zod'

export const SignInRequestSchema = z.object({
  usr: z.string().min(1),
  pwd: z.string().min(1),
})

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const RolePermissionSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  permission: PermissionSchema,
})

export const RoleSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  rolePermissions: z.array(RolePermissionSchema),
})

export const UserSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  active: z.boolean(),
  roleId: z.number(),
  isPasswordResetRequired: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  role: RoleSchema,
})

export const SignInResponseSchema = z.object({
  message: z.string(),
  home_page: z.string(),
  full_name: z.string(),
})
export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>

export const ItemSchema = z.object({
  message: z.array(
    z.object({
      name: z.string(),
      item_name: z.string(),
      description: z.string(),
    })
  ),
})
export type GetItemType = z.infer<typeof ItemSchema>

export const StockLevelItemSchema = z.object({
  message: z.array(
    z.object({
      item_code: z.string(),
      warehouse: z.string(),
      actual_qty: z.string(),
    })
  ),
})
export type getStockLevelItemType = z.infer<typeof StockLevelItemSchema>