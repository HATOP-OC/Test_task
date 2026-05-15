import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { booksService } from "../services/books.service"
import { useAuth } from "../context/AuthContext"
import { extractErrorMessage } from "../services/api"
import type { Book } from "../types"

export default function BooksList() {
  const { isAdmin } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      setBooks(await booksService.list())
      setError(null)
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this book?")) return
    try {
      await booksService.remove(id)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      alert(extractErrorMessage(err))
    }
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Books</h1>
        {isAdmin && (
          <Link
            to="/books/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New book
          </Link>
        )}
      </div>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}
      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && !isAdmin && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">No books yet.</p>
          ) : (
            books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group block rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 group-hover:underline">
                  {book.name}
                </h3>
                <p className="mt-1 text-sm text-slate-600">by {book.author}</p>
                <p className="mt-3 text-xs text-slate-500">{book.pageCount} pages</p>
                <span className="mt-4 inline-block text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  View details &rarr;
                </span>
              </Link>
            ))
          )}
        </div>
      )}

      {!loading && !error && isAdmin && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Pages</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No books yet.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/books/${book.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {book.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{book.author}</td>
                    <td className="px-4 py-3 text-slate-600">{book.pageCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/books/${book.id}/edit`}
                          className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(book.id)}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
