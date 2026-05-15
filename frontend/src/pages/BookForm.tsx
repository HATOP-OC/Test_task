import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { booksService } from "../services/books.service"
import { extractErrorMessage } from "../services/api"

export default function BookForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [author, setAuthor] = useState("")
  const [pageCount, setPageCount] = useState("")
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    booksService
      .get(id)
      .then((book) => {
        setName(book.name)
        setAuthor(book.author)
        setPageCount(String(book.pageCount))
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !author.trim() || !pageCount) {
      setError("All fields are required.")
      return
    }
    const pages = Number(pageCount)
    if (!Number.isInteger(pages) || pages <= 0) {
      setError("Page count must be a positive integer.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const payload = { name: name.trim(), author: author.trim(), pageCount: pages }
      if (isEdit && id) {
        await booksService.update(id, payload)
      } else {
        await booksService.create(payload)
      }
      navigate("/books", { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>

  return (
    <section>
      <Link
        to="/books"
        className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to books
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          {isEdit ? "Edit book" : "New book"}
        </h1>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium uppercase text-slate-600">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="author" className="text-xs font-medium uppercase text-slate-600">
              Author
            </label>
            <input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pageCount" className="text-xs font-medium uppercase text-slate-600">
              Page count
            </label>
            <input
              id="pageCount"
              type="number"
              min={1}
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
