import { custom, z } from 'zod'

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

export const UserPermissionSchema = z.object({
  data: z.array(
    z.object({
      for_value: z.string(),
    })
  ),
})
export type UserWarehousePermissionType = z.infer<typeof UserPermissionSchema>

export const DeliveryNotesSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      customer: z.string(),
      posting_date: z.string(),
      grand_total: z.number(),
      shipping_address: z.string(),
    })
  ),
})
export type DeliveryNotesType = z.infer<typeof DeliveryNotesSchema>

export const DeliveryNoteDetailsSchema = z.object({
  data: z.object({
    name: z.string(),
    owner: z.string(),
    posting_date: z.string(), // yyyy-mm-dd
    posting_time: z.string(), // time with microseconds

    customer: z.string(),
    title: z.string(),
    customer_name: z.string(),

    contact_mobile: z.string(),
    company: z.string(),

    cost_center: z.string(),
    set_warehouse: z.string(),

    total_qty: z.number(),
    total_net_weight: z.number(),
    custom_total_cartoon_quantity: z.number(),

    contact_person: z.string(),
    contact_display: z.string(),
    contact_email: z.string(),
    docstatus: z.number(),
    custom_special_instruction: z.string(),

    items: z.array(
      z.object({
        name: z.string(),
        owner: z.string(),

        item_code: z.string(),
        item_name: z.string(),
        description: z.string(),
        item_group: z.string(),

        qty: z.number(),
        custom_carton_qty: z.number(),

        stock_qty: z.number(),
        returned_qty: z.number(),

        warehouse: z.string(),

        actual_qty: z.number(),
        actual_batch_qty: z.number(),
        company_total_stock: z.number(),
        installed_qty: z.number(),
        packed_qty: z.number(),
        received_qty: z.number(),

        expense_account: z.string(),
        cost_center: z.string(),
      })
    ),
  }),
})
export type DeliveryNoteDetailsType = z.infer<typeof DeliveryNoteDetailsSchema>

export const GoodsReceivedSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      posting_date: z.string(),
      stock_entry_type: z.string(),
    })
  ),
})
export type GoodsReceivedType = z.infer<typeof GoodsReceivedSchema>

export const GoodsReceivedDetailsSchema = z.object({
  data: z.object({
    name: z.string(),
    owner: z.string(),

    stock_entry_type: z.string(),
    purpose: z.string(),
    company: z.string(),

    posting_date: z.string(),
    posting_time: z.string(),

    doctype: z.string(),
    docstatus: z.number(),

    items: z.array(
      z.object({
        name: z.string(),
        owner: z.string(),
        
        s_warehouse: z.string(),
        t_warehouse: z.string(),
        custom_actual_target_warehouse: z.string(),

        item_code: z.string(),
        item_name: z.string(),

        qty: z.number(),
        description: z.string(),
      })
    ),
  }),
})
export type GoodsReceivedDetailsType = z.infer<typeof GoodsReceivedDetailsSchema>