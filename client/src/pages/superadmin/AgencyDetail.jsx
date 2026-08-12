import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSuperAdmin, saError } from '../../context/SuperAdminContext'

const tone = (s) => {
  if (s === 'active') return 'text-emerald-400'
  if (s === 'pending' || s === 'trialing' || s === 'past_due') return 'text-amber-400'
  if (s === 'suspended' || s === 'disabled' || s === 'expired' || s === 'canceled') return 'text-rose-400'
  return 'text-slate-400'
}

const AgencyBillingPanel = ({ agencyId, axios, busy, run }) => {
  const [billing, setBilling] = useState(null)
  const [events, setEvents] = useState([])
  const [plans, setPlans] = useState([])
  const [planCode, setPlanCode] = useState('basic')
  const [extendDays, setExtendDays] = useState(7)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [billRes, plansRes] = await Promise.all([
        axios.get(`/api/super-admin/agencies/${agencyId}/billing`),
        axios.get('/api/super-admin/billing/plans'),
      ])
      if (billRes.data?.success) {
        setBilling(billRes.data.billing)
        setEvents(billRes.data.events || [])
        if (billRes.data.billing?.subscription?.planCode) {
          setPlanCode(billRes.data.billing.subscription.planCode)
        }
      }
      if (plansRes.data?.success) setPlans(plansRes.data.plans || [])
    } catch (error) {
      toast.error(saError(error))
    } finally {
      setLoading(false)
    }
  }, [axios, agencyId])

  useEffect(() => {
    load()
  }, [load])

  if (loading && !billing) {
    return <p className="text-sm text-slate-500">Loading billing…</p>
  }

  const sub = billing?.subscription
  const usage = billing?.usage || {}
  const limits = billing?.limits || {}

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-white text-sm">
            Plan:{' '}
            <span className="font-mono text-cyan-400">{sub?.planCode || '—'}</span>
            {' · '}
            Status:{' '}
            <span className={`capitalize ${tone(sub?.status)}`}>{sub?.status || '—'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Trial ends:{' '}
            {sub?.trialEndsAt ? new Date(sub.trialEndsAt).toLocaleString() : '—'}
            {' · '}Vehicles: {usage.vehicles ?? 0}
            {limits.maxVehicles != null ? ` / ${limits.maxVehicles}` : ' / ∞'}
            {' · '}Custom domain: {limits.customDomain ? 'yes' : 'no'}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="text-xs text-slate-400 hover:text-cyan-400"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
            Assign plan
          </label>
          <select
            value={planCode}
            onChange={(e) => setPlanCode(e.target.value)}
            className="bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm text-white outline-none"
          >
            {(plans.length
              ? plans
              : [
                  { code: 'free_trial', name: 'Free Trial' },
                  { code: 'basic', name: 'Basic' },
                  { code: 'pro', name: 'Pro' },
                  { code: 'enterprise', name: 'Enterprise' },
                  { code: 'legacy_grandfathered', name: 'Legacy' },
                ]
            ).map((p) => (
              <option key={p.code} value={p.code}>
                {p.name || p.code}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={busy === 'bill-assign'}
          onClick={() =>
            run('bill-assign', async () => {
              const { data } = await axios.post(
                `/api/super-admin/agencies/${agencyId}/billing/assign-plan`,
                { planCode },
              )
              if (!data.success) throw new Error(data.message || 'Assign failed')
              toast.success(`Assigned ${planCode}`)
              await load()
            })
          }
          className="bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 text-white text-xs px-4 py-2"
        >
          Assign
        </button>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
            Extend trial (days)
          </label>
          <input
            type="number"
            min={1}
            value={extendDays}
            onChange={(e) => setExtendDays(Number(e.target.value) || 7)}
            className="w-24 bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm text-white outline-none"
          />
        </div>
        <button
          type="button"
          disabled={busy === 'bill-extend'}
          onClick={() =>
            run('bill-extend', async () => {
              const { data } = await axios.post(
                `/api/super-admin/agencies/${agencyId}/billing/extend-trial`,
                { days: extendDays },
              )
              if (!data.success) throw new Error(data.message || 'Extend failed')
              toast.success('Trial extended')
              await load()
            })
          }
          className="border border-white/15 text-slate-200 text-xs px-4 py-2 hover:border-cyan-600/50"
        >
          Extend trial
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['bill-reactivate', 'Reactivate', 'reactivate', {}],
          ['bill-suspend', 'Suspend billing', 'suspend', {}],
          ['bill-expire', 'Expire', 'expire', {}],
          ['bill-cancel', 'Cancel now', 'cancel', { atPeriodEnd: false }],
        ].map(([key, label, action, body]) => (
          <button
            key={key}
            type="button"
            disabled={busy === key}
            onClick={() =>
              run(key, async () => {
                const { data } = await axios.post(
                  `/api/super-admin/agencies/${agencyId}/billing/${action}`,
                  body,
                )
                if (!data.success) throw new Error(data.message || `${action} failed`)
                toast.success(label)
                await load()
              })
            }
            className="border border-white/10 text-xs px-3 py-2 text-slate-300 hover:border-white/25 disabled:opacity-40"
          >
            {label}
          </button>
        ))}
      </div>

      {events.length > 0 ? (
        <div className="pt-2 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Recent events</p>
          <ul className="space-y-1 max-h-40 overflow-y-auto text-xs text-slate-400">
            {events.slice(0, 12).map((ev) => (
              <li key={ev._id}>
                <span className="text-slate-300">{ev.type}</span>
                {' · '}
                {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : ''}
                {ev.to?.status ? ` → ${ev.to.status}` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const AgencyStaffPanel = ({ agencyId, axios, busy, run }) => {
  const [members, setMembers] = useState([])
  const [usage, setUsage] = useState({ seats: 1, maxStaff: null })
  const [form, setForm] = useState({ name: '', email: '', staffRole: 'agent' })
  const [inviteUrl, setInviteUrl] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/super-admin/agencies/${agencyId}/staff`)
      if (data.success) {
        setMembers(data.members || [])
        setUsage(data.usage || { seats: 1, maxStaff: null })
      }
    } catch (error) {
      toast.error(saError(error))
    } finally {
      setLoading(false)
    }
  }, [axios, agencyId])

  useEffect(() => {
    load()
  }, [load])

  if (loading && !members.length) {
    return <p className="text-sm text-slate-500">Loading staff…</p>
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Seats: {usage.seats}
        {usage.maxStaff == null ? ' / ∞' : ` / ${usage.maxStaff}`}
      </p>
      <ul className="space-y-2 text-sm">
        {members.map((m) => (
          <li key={m._id} className="flex flex-wrap items-center justify-between gap-2 border border-white/5 px-3 py-2">
            <div>
              <p className="text-white">{m.name}</p>
              <p className="text-xs text-slate-500">
                {m.email} · {m.staffRole} · {m.accountStatus}
              </p>
            </div>
            <button
              type="button"
              disabled={busy === `staff-rm-${m._id}`}
              onClick={() =>
                run(`staff-rm-${m._id}`, async () => {
                  const { data } = await axios.delete(
                    `/api/super-admin/agencies/${agencyId}/staff/${m._id}`,
                  )
                  if (!data.success) throw new Error(data.message || 'Remove failed')
                  toast.success('Staff removed')
                  await load()
                })
              }
              className="text-xs text-rose-400 border border-rose-900/50 px-2 py-1"
            >
              Remove
            </button>
          </li>
        ))}
        {members.length === 0 ? <p className="text-xs text-slate-500">No staff yet.</p> : null}
      </ul>
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm text-white outline-none"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm text-white outline-none"
        />
        <select
          value={form.staffRole}
          onChange={(e) => setForm((f) => ({ ...f, staffRole: e.target.value }))}
          className="bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="manager">Manager</option>
          <option value="agent">Agent</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <button
        type="button"
        disabled={busy === 'staff-invite'}
        onClick={() =>
          run('staff-invite', async () => {
            const { data } = await axios.post(`/api/super-admin/agencies/${agencyId}/staff`, form)
            if (!data.success) throw new Error(data.message || 'Invite failed')
            setInviteUrl(data.inviteUrl || '')
            setForm({ name: '', email: '', staffRole: 'agent' })
            toast.success('Staff invited')
            await load()
          })
        }
        className="bg-cyan-700 hover:bg-cyan-600 text-white text-xs px-4 py-2"
      >
        Invite staff
      </button>
      {inviteUrl ? (
        <p className="text-xs text-cyan-400 break-all">{inviteUrl}</p>
      ) : null}
    </div>
  )
}

const SuperAdminAgencyDetail = () => {
  const { id } = useParams()
  const { axios, navigate } = useSuperAdmin()
  const [agency, setAgency] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState({
    name: '',
    slug: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    country: '',
    logoUrl: '',
    timezone: '',
    currency: '',
    locale: '',
    isPublicStorefront: false,
  })
  const [busy, setBusy] = useState('')
  const [inviteUrl, setInviteUrl] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/super-admin/agencies/${id}`)
      if (data.success) {
        setAgency(data.agency)
        setStats(data.stats)
        setEdit({
          name: data.agency.name || '',
          slug: data.agency.slug || '',
          phone: data.agency.phone || '',
          whatsapp: data.agency.whatsapp || '',
          address: data.agency.address || '',
          city: data.agency.city || '',
          country: data.agency.country || '',
          logoUrl: data.agency.logoUrl || '',
          timezone: data.agency.timezone || '',
          currency: data.agency.currency || '',
          locale: data.agency.locale || '',
          isPublicStorefront: Boolean(data.agency.isPublicStorefront),
        })
      }
    } catch (error) {
      toast.error(saError(error))
      navigate('/superadmin/agencies')
    } finally {
      setLoading(false)
    }
  }, [axios, id, navigate])

  useEffect(() => {
    load()
  }, [load])

  const run = async (key, fn) => {
    setBusy(key)
    try {
      await fn()
      await load()
    } catch (error) {
      toast.error(saError(error))
    } finally {
      setBusy('')
    }
  }

  if (loading || !agency) {
    return <p className="text-slate-500 text-sm">Loading agency…</p>
  }

  const owner = agency.primaryOwner
  const needsInvite =
    agency.status === 'pending' ||
    owner?.accountStatus === 'pending' ||
    Boolean(agency.invitePending)

  return (
    <div className="space-y-8">
      <div>
        <Link to="/superadmin/agencies" className="text-xs text-slate-500 hover:text-cyan-400">
          ← All agencies
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl text-white mt-2">{agency.name}</h1>
        <p className="text-sm text-slate-500 mt-1 font-mono">{agency.slug}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="border border-white/10 p-4">
          <p className="text-[11px] uppercase text-slate-500">Status</p>
          <p className={`mt-1 capitalize text-lg ${tone(agency.status)}`}>{agency.status}</p>
        </div>
        <div className="border border-white/10 p-4">
          <p className="text-[11px] uppercase text-slate-500">Public storefront</p>
          <p className="mt-1 text-lg text-white">{agency.isPublicStorefront ? 'Yes' : 'No'}</p>
        </div>
        <div className="border border-white/10 p-4">
          <p className="text-[11px] uppercase text-slate-500">Usage</p>
          <p className="mt-1 text-sm text-slate-300">
            {stats?.cars ?? 0} cars · {stats?.bookings ?? 0} bookings · {stats?.customers ?? 0} customers
          </p>
        </div>
      </div>

      {needsInvite && (
        <section className="border border-amber-700/40 bg-amber-950/20 p-4 sm:p-6 space-y-3">
          <h2 className="text-sm uppercase tracking-wider text-amber-400/90">Owner onboarding</h2>
          <p className="text-xs text-slate-400">
            Agency and owner are pending until the owner activates via the invitation link and completes setup.
            {agency.inviteExpiresAt
              ? ` Current invite expires ${new Date(agency.inviteExpiresAt).toLocaleString()}.`
              : ''}
          </p>
          {inviteUrl && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                readOnly
                value={inviteUrl}
                className="flex-1 bg-[#0a0f14] border border-white/10 px-3 py-2 text-xs font-mono text-slate-200"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteUrl)
                    toast.success('Link copied')
                  } catch {
                    toast.error('Copy failed')
                  }
                }}
                className="bg-cyan-700 hover:bg-cyan-600 text-white text-sm px-4 py-2"
              >
                Copy
              </button>
            </div>
          )}
          <button
            type="button"
            disabled={busy === 'invite' || agency.status === 'suspended' || agency.status === 'disabled'}
            onClick={() =>
              run('invite', async () => {
                const { data } = await axios.post(`/api/super-admin/agencies/${id}/resend-invite`)
                if (!data.success) throw new Error(data.message || 'Failed')
                setInviteUrl(data.onboardingUrl || '')
                toast.success('New onboarding link generated')
              })
            }
            className="bg-amber-700/80 hover:bg-amber-600 disabled:opacity-40 text-white text-sm px-4 py-2"
          >
            {busy === 'invite' ? 'Generating…' : inviteUrl ? 'Regenerate invite link' : 'Generate invite link'}
          </button>
        </section>
      )}

      <section className="border border-white/10 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400">Edit agency</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Agency name</label>
            <input
              value={edit.name}
              onChange={(e) => setEdit((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Slug</label>
            <input
              value={edit.slug}
              onChange={(e) => setEdit((f) => ({ ...f, slug: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Phone</label>
            <input
              value={edit.phone}
              onChange={(e) => setEdit((f) => ({ ...f, phone: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">WhatsApp</label>
            <input
              value={edit.whatsapp}
              onChange={(e) => setEdit((f) => ({ ...f, whatsapp: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Address</label>
            <input
              value={edit.address}
              onChange={(e) => setEdit((f) => ({ ...f, address: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">City</label>
            <input
              value={edit.city}
              onChange={(e) => setEdit((f) => ({ ...f, city: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Country</label>
            <input
              value={edit.country}
              onChange={(e) => setEdit((f) => ({ ...f, country: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Logo URL</label>
            <input
              value={edit.logoUrl}
              onChange={(e) => setEdit((f) => ({ ...f, logoUrl: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Timezone</label>
            <input
              value={edit.timezone}
              onChange={(e) => setEdit((f) => ({ ...f, timezone: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Currency</label>
            <input
              value={edit.currency}
              onChange={(e) => setEdit((f) => ({ ...f, currency: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Locale</label>
            <input
              value={edit.locale}
              onChange={(e) => setEdit((f) => ({ ...f, locale: e.target.value }))}
              className="w-full bg-[#0a0f14] border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-600/60"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 self-end pb-2">
            <input
              type="checkbox"
              checked={edit.isPublicStorefront}
              onChange={(e) => setEdit((f) => ({ ...f, isPublicStorefront: e.target.checked }))}
              className="accent-cyan-600"
            />
            Public storefront
          </label>
        </div>
        <button
          type="button"
          disabled={busy === 'save'}
          onClick={() =>
            run('save', async () => {
              const { data } = await axios.patch(`/api/super-admin/agencies/${id}`, edit)
              if (!data.success) throw new Error(data.message || 'Save failed')
              toast.success('Agency updated')
            })
          }
          className="bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 text-white text-sm px-5 py-2.5"
        >
          {busy === 'save' ? 'Saving…' : 'Save changes'}
        </button>
      </section>

      <section className="border border-white/10 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400">Primary owner</h2>
        {owner ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-white">{owner.name}</p>
              <p className="text-xs text-slate-500">{owner.email}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">
                Account: {owner.accountStatus || 'active'}
                {owner.licenseStatus ? ` · License: ${owner.licenseStatus}` : ''}
                {owner.passwordSetAt ? ' · Password set' : ' · Awaiting password'}
              </p>
            </div>
            {owner._id && (
              <Link
                to={`/superadmin/admins/${owner._id}`}
                className="text-cyan-500 hover:text-cyan-400 text-sm"
              >
                Open owner admin →
              </Link>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No primary owner linked.</p>
        )}
      </section>

      <section className="border border-white/10 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400">Billing</h2>
        <AgencyBillingPanel agencyId={id} axios={axios} busy={busy} run={run} />
      </section>

      <section className="border border-white/10 p-4 sm:p-6 space-y-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400">Staff</h2>
        <AgencyStaffPanel agencyId={id} axios={axios} busy={busy} run={run} />
      </section>

      <section className="border border-white/10 p-4 sm:p-6 space-y-3">
        <h2 className="text-sm uppercase tracking-wider text-slate-400">Agency status</h2>
        <div className="flex flex-wrap gap-2">
          {['active', 'suspended', 'disabled'].map((status) => (
            <button
              key={status}
              type="button"
              disabled={busy === `status-${status}` || agency.status === status}
              onClick={() =>
                run(`status-${status}`, async () => {
                  const { data } = await axios.patch(`/api/super-admin/agencies/${id}/status`, {
                    status,
                  })
                  if (!data.success) throw new Error(data.message || 'Status update failed')
                  toast.success(`Agency ${status}`)
                })
              }
              className={`px-3 py-2 text-xs capitalize border transition-colors disabled:opacity-40 ${
                agency.status === status
                  ? 'border-cyan-600/50 text-cyan-400'
                  : 'border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Suspending or disabling locks the owner login. Existing cars, bookings, and customers are never deleted.
        </p>
      </section>

      <section className="border border-white/10 p-4 sm:p-6 text-xs text-slate-500 space-y-1">
        <p>
          Agency ID: <span className="font-mono text-slate-400">{agency._id}</span>
        </p>
        <p>
          Legacy owner ID:{' '}
          <span className="font-mono text-slate-400">{agency.legacyOwnerId || '—'}</span>
        </p>
        <p>
          Onboarding completed:{' '}
          {agency.onboardingCompletedAt
            ? new Date(agency.onboardingCompletedAt).toLocaleString()
            : '—'}
        </p>
        <p>
          Created:{' '}
          {agency.createdAt ? new Date(agency.createdAt).toLocaleString() : '—'}
        </p>
      </section>
    </div>
  )
}

export default SuperAdminAgencyDetail
