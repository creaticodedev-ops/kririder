import React, { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSuperAdmin, saError } from '../../context/SuperAdminContext'

const emptyForm = {
  name: '',
  slug: '',
  ownerName: '',
  ownerEmail: '',
  ownerPassword: '',
  notes: '',
  startTrial: true,
  isPublicStorefront: false,
}

const tone = (s) => {
  if (s === 'active') return 'text-emerald-400'
  if (s === 'suspended' || s === 'disabled') return 'text-rose-400'
  return 'text-slate-400'
}

const SuperAdminAgencies = () => {
  const { axios } = useSuperAdmin()
  const [searchParams, setSearchParams] = useSearchParams()
  const [agencies, setAgencies] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(searchParams.get('create') === '1')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/super-admin/agencies', {
        params: { q: debouncedSearch, status, page, limit: 20 },
      })
      if (data.success) {
        setAgencies(data.agencies || [])
        setPagination(
          data.pagination || {
            page: data.page || 1,
            totalPages: data.pages || 1,
            total: data.total || 0,
          },
        )
      }
    } catch (error) {
      toast.error(saError(error))
    } finally {
      setLoading(false)
    }
  }, [axios, debouncedSearch, status])

  useEffect(() => {
    load(1)
  }, [load])

  useEffect(() => {
    if (searchParams.get('create') === '1') setShowCreate(true)
  }, [searchParams])

  const createAgency = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.post('/api/super-admin/agencies', form)
      if (data.success) {
        toast.success('Agency created')
        setForm(emptyForm)
        setShowCreate(false)
        setSearchParams({})
        load(1)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(saError(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-white">Agencies</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tenant roots for every rental agency — isolation, storefront, and owner account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm px-4 py-2.5 transition-colors"
        >
          {showCreate ? 'Close form' : 'Create agency'}
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={createAgency}
          className="border border-white/10 bg-white/[0.03] p-4 sm:p-6 grid sm:grid-cols-2 gap-4"
        >
          <h2 className="sm:col-span-2 text-sm uppercase tracking-wider text-slate-400">New agency</h2>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Agency name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Slug (optional)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="auto-from-name"
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Owner full name</label>
            <input
              required
              value={form.ownerName}
              onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Owner email</label>
            <input
              required
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm((f) => ({ ...f, ownerEmail: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1.5">Temporary owner password</label>
            <input
              required
              type="password"
              minLength={8}
              value={form.ownerPassword}
              onChange={(e) => setForm((f) => ({ ...f, ownerPassword: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1.5">Internal notes</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.startTrial}
              onChange={(e) => setForm((f) => ({ ...f, startTrial: e.target.checked }))}
              className="accent-cyan-600"
            />
            Start 7-day trial for owner
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.isPublicStorefront}
              onChange={(e) => setForm((f) => ({ ...f, isPublicStorefront: e.target.checked }))}
              className="accent-cyan-600"
            />
            Public storefront agency
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm px-5 py-2.5"
            >
              {saving ? 'Creating…' : 'Create agency'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or slug…"
          className="flex-1 min-w-[12rem] bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div className="border border-white/10 overflow-x-auto table-scroll">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading…</p>
        ) : (
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 font-medium">Agency name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Public storefront</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{agency.name}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{agency.slug}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-200">{agency.primaryOwner?.name || '—'}</p>
                    <p className="text-xs text-slate-500">{agency.primaryOwner?.email || ''}</p>
                  </td>
                  <td className={`px-4 py-3 capitalize ${tone(agency.status)}`}>
                    {agency.status || 'active'}
                  </td>
                  <td className="px-4 py-3">
                    {agency.isPublicStorefront ? (
                      <span className="text-cyan-400 text-xs">Yes</span>
                    ) : (
                      <span className="text-slate-600 text-xs">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/superadmin/agencies/${agency._id}`}
                      className="text-cyan-500 hover:text-cyan-400 text-xs"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {!agencies.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No agencies match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => load(pagination.page - 1)}
            className="disabled:opacity-40 hover:text-white"
          >
            Previous
          </button>
          <span>
            Page {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => load(pagination.page + 1)}
            className="disabled:opacity-40 hover:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default SuperAdminAgencies
