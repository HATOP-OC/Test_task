import { Link } from "react-router-dom"

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Access denied</h1>
      <p className="max-w-md text-sm text-slate-500">
        You don&apos;t have permission to view this page.
      </p>
      <Link
        to="/books"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Back to books
      </Link>
    </div>
  )
}
