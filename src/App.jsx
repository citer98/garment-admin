import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import CreateOrder from './pages/CreateOrder'
import ViewOrder from './pages/ViewOrder'
import EditOrder from './pages/EditOrder'
import Tracking from './pages/Tracking'
import Finance from './pages/Finance'
import UserManagement from './pages/UserManagement'
import JobList from './pages/JobList'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import EditUser from './pages/EditUser'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders/:id" element={<ViewOrder />} />
            <Route path="/orders/edit/:id" element={<EditOrder />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/joblist" element={<JobList />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}