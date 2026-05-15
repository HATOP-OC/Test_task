import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { booksService } from "../services/books.service"
import { useAuth } from "../context/AuthContext"
import { extractErrorMessage } from "../services/api"
import type { Book } from "../types"

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    booksService
      .get(id)
      .then(setBook)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  const onDelete = async () => {
    if (!id || !window.confirm("Delete this book?")) return
    try {
      await booksService.remove(id)
      navigate("/books", { replace: true })
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <section>
      <Link
        to="/books"
        className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to books
      </Link>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {book && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-semibold text-slate-900">{book.name}</h1>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">Author</dt>
              <dd className="mt-1 text-slate-900">{book.author}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">Page count</dt>
              <dd className="mt-1 text-slate-900">{book.pageCount}</dd>
            </div>
          </dl>

          {isAdmin && (
            <div className="mt-6 flex gap-2">
              <Link
                to={`/books/${book.id}/edit`}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
