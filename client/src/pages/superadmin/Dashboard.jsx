import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSuperAdmin, saError } from '../../context/SuperAdminContext'
import { SaBadge, SaBarChart, SaCard, SaEmpty, SaLink, SaPageHeader, SaSkeleton, SaStat, sa, statusBadgeTone } from './saUi'

const SuperAdminDashboard = () => {
  const { axios } = useSuperAdmin()
  const [data, setData] = useState(null)
  const [billing, setBilling] = useState(null)
  const [recentAgencies, setRecentAgencies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [ov, bill, agencies] = await Promise.all([
          axios.get('/api/super-admin/overview'),
          axios.get('/api/super-admin/billing/overview').catch(() => ({ data: null })),
          axios.get('/api/super-admin/agencies', { params: { limit: 6, page: 1 } }),
        ])
        if (cancelled) return
        if (ov.data?.success) setData(ov.data)
        if (bill.data?.success) setBilling(bill.data.byStatus || {})
        if (agencies.data?.success) setRecentAgencies(agencies.data.agencies || [])
      } catch (error) {
        toast.error(saError(error, 'Failed to load overview'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [axios])

  const o = data?.overview || {}
  const pendingAgencies = o.pendingAgencies ?? Math.max(0, (o.totalAgencies || 0) - (o.activeAgencies || 0))

  const agencyChart = useMemo(
    () => [
      { label: 'Active agencies', value: o.activeAgencies || 0, color: 'var(--sa-chart-1)' },
      { label: 'Other / pending', value: pendingAgencies, color: 'var(--sa-chart-4)' },
      { label: 'Trial licenses', value: o.trialAdmins || 0, color: 'var(--sa-chart-2)' },
      { label: 'Licensed owners', value: o.licensedAdmins || 0, color: 'var(--sa-chart-3)' },
    ],
    [o, pendingAgencies],
  )

  const billingChart = useMemo(() => {
    const entries = Object.entries(billing || {})
    if (!entries.length) return []
    const colors = ['var(--sa-chart-1)', 'var(--sa-chart-2)', 'var(--sa-chart-3)', 'var(--sa-chart-4)', 'var(--sa-danger)']
    return entries.map(([label, value], i) => ({
      label: String(label).replace(/_/g, ' '),
      value,
      color: colors[i % colors.length],
    }))
  }, [billing])

  if (loading) {
    return (
      <div className={sa.page}>
        <SaSkeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SaSkeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={sa.page}>
      <SaPageHeader
        title="Dashboard"
        subtitle="Platform health across agencies, subscriptions, and operators."
        action={
          <>
            <Link to="/superadmin/requests" className={sa.btnPrimary}>
              Review requests
            </Link>
            <Link to="/superadmin/agencies?create=1" className={sa.btnSecondary}>
              Create agency
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <SaStat label="Pending requests" value={o.pendingAgencies} accent="var(--sa-warn)" hint="Awaiting approval" />
        <SaStat label="Approved agencies" value={o.approvedAgencies ?? o.activeAgencies} accent="var(--sa-success)" />
        <SaStat label="Rejected requests" value={o.rejectedAgencies} accent="var(--sa-danger)" />
        <SaStat label="Total agencies" value={o.totalAgencies} />
        <SaStat label="Suspended admins" value={o.suspendedAdmins} accent="var(--sa-danger)" />
        <SaStat label="Active subscriptions*" value={billing?.active ?? o.licensedAdmins} hint="* From billing when available" />
        <SaStat label="Trialing" value={billing?.trialing ?? o.trialAdmins} />
        <SaStat label="Expired" value={billing?.expired ?? o.expiredAdmins} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SaCard title="Agency & license mix" description="Snapshot of tenant and license distribution.">
          <SaBarChart items={agencyChart} />
        </SaCard>
        <SaCard
          title="Billing by status"
          description="AgencySubscription counts (P4)."
          action={<SaLink to="/superadmin/billing">Open billing →</SaLink>}
        >
          {billingChart.length ? (
            <SaBarChart items={billingChart} />
          ) : (
            <SaEmpty title="No billing data yet" description="Subscriptions appear after P4 migration." />
          )}
        </SaCard>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <SaStat label="Fleet vehicles" value={o.totalCars} />
        <SaStat label="Bookings" value={o.totalBookings} />
        <SaStat label="Customers" value={o.totalCustomers} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SaCard
          title="Recent agencies"
          action={<SaLink to="/superadmin/requests">Approval center →</SaLink>}
        >
          <ul className="divide-y divide-[var(--sa-border)]">
            {recentAgencies.map((a) => (
              <li key={a._id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--sa-text)] truncate">{a.name}</p>
                  <p className="text-xs text-[var(--sa-text-muted)] font-mono truncate">{a.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SaBadge tone={statusBadgeTone(a.status)}>{a.status}</SaBadge>
                  <Link to={`/superadmin/agencies/${a._id}`} className={sa.btnGhost}>
                    Open
                  </Link>
                </div>
              </li>
            ))}
            {!recentAgencies.length ? (
              <SaEmpty title="No agencies yet" description="Create your first agency to get started." />
            ) : null}
          </ul>
        </SaCard>

        <SaCard
          title="Recent activity"
          action={<SaLink to="/superadmin/activity">View activity →</SaLink>}
        >
          <div className={sa.tableWrap}>
            <table className="w-full min-w-[480px]">
              <thead>
                <tr>
                  <th className={sa.th}>Owner</th>
                  <th className={sa.th}>License</th>
                  <th className={sa.th} />
                </tr>
              </thead>
              <tbody>
                {(data?.recentAdmins || []).map((admin) => (
                  <tr key={admin._id} className={sa.row}>
                    <td className={sa.td}>
                      <p className="font-medium text-[var(--sa-text)]">{admin.name}</p>
                      <p className="text-xs text-[var(--sa-text-muted)]">{admin.email}</p>
                    </td>
                    <td className={sa.td}>
                      <SaBadge tone={statusBadgeTone(admin.license?.licenseStatus || admin.licenseStatus)}>
                        {admin.license?.licenseStatus || admin.licenseStatus}
                      </SaBadge>
                    </td>
                    <td className={`${sa.td} text-right`}>
                      <Link to={`/superadmin/admins/${admin._id}`} className={sa.link}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {!data?.recentAdmins?.length ? (
                  <tr>
                    <td colSpan={3}>
                      <SaEmpty title="No recent admins" />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SaCard>
      </div>
    </div>
  )
}

export default SuperAdminDashboard
