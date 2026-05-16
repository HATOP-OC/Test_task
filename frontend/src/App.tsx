import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BooksList from "./pages/BooksList"
import BookDetail from "./pages/BookDetail"
import BookForm from "./pages/BookForm"
import UsersList from "./pages/UsersList"
import UserForm from "./pages/UserForm"
import UserDetail from "./pages/UserDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./components/AppLayout"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="books" element={<BooksList />} />
          <Route path="books/new" element={<BookForm />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="books/:id/edit" element={<BookForm />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AppLayout />}>
          <Route path="users" element={<UsersList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users/:id/edit" element={<UserForm />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/books" replace />} />
      <Route path="*" element={<Navigate to="/books" replace />} />
    </Routes>
  )
}
