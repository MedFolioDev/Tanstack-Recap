import {
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router"

import { useState } from "react"

import { authClient } from "#/lib/auth-client"
import { getSession } from "#/lib/auth-functions"

import {
  createProduct,
  getProducts,
} from "#/lib/products"

export const Route = createFileRoute("/dashboard")({

  beforeLoad: async () => {

    const session = await getSession()

    if (!session) {
      throw redirect({
        to: "/login",
      })
    }

    return {
      user: session.user,
    }
  },


  loader: async () => {

    return await getProducts()

  },


  component: Dashboard,

})

function Dashboard() {

  const { user } = Route.useRouteContext()
  const products = Route.useLoaderData()
  const router = useRouter()
  const [name,setName] = useState("")
  const [price,setPrice] = useState("")


  async function handleCreate(){
    await createProduct({
      data:{
        name,
        price:Number(price),
      }
    })

    setName("")
    setPrice("")

    router.invalidate()
  }



  async function logout(){
    await authClient.signOut()
    window.location.href="/login"
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold">
            Welcome {user.name}
          </h1>
          <p>
            {user.email}
          </p>

          <button
            onClick={logout}
            className="mt-4 border px-4 py-2 rounded"
          >
            Logout
          </button>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Products
          </h2>
          <div className="space-y-3">
          {
            products.map(product => (

              <div
                key={product.id}
                className="border p-4 rounded"
              >

                <h3 className="font-bold">
                  {product.name}
                </h3>


                <p>
                  ${product.price}
                </p>

              </div>

            ))
          }


          {
            products.length === 0 &&
            <p>
              No products
            </p>
          }


          </div>


        </section>



        <section className="border p-4 rounded space-y-3">


          <h2 className="font-bold">
            Add Product
          </h2>


          <input
            className="border p-2 w-full"
            placeholder="Product name"
            value={name}
            onChange={
              e=>setName(e.target.value)
            }
          />


          <input
            className="border p-2 w-full"
            placeholder="Price"
            type="number"
            value={price}
            onChange={
              e=>setPrice(e.target.value)
            }
          />


          <button
            onClick={handleCreate}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add
          </button>


        </section>


      </div>

    </main>

  )

}