import { createFileRoute, redirect } from "@tanstack/react-router"

import { authClient } from "#/lib/auth-client"
import { getSession } from "#/lib/auth-functions"

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

  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext()

  const handleLogout = async () => {
    await authClient.signOut()

    window.location.href = "/login"
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-8 text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome {user.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {user.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </main>
  )
}