import { db } from "#/db"
import { products } from "#/db/schema"
import { createServerFn } from "@tanstack/react-start"
import { desc } from "drizzle-orm"


export const getProducts = createServerFn({
  method: "GET",
}).handler(async () => {

  return await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))

})


export const createProduct = createServerFn({
  method: "POST",
})
.inputValidator(
  (data: {
    name: string
    description?: string
    price: number
  }) => data
)
.handler(async ({ data }) => {

  await db.insert(products)
    .values({
      name: data.name,
      description: data.description,
      price: data.price,
    })

  return {
    success: true,
  }

})