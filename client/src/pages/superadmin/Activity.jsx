import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSuperAdmin, saError } from '../../context/SuperAdminContext'
import { SaCard, SaEmpty, SaPageHeader, SaSkeleton, sa } from './saUi'

const SuperAdminActivity = () => {
  const { axios } = useSuperAdmin()
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await axios.get('/api/super-admin/activity')
        if (!cancelled && data.success) {
          setBookings(data.recentBookings || [])
          setCars(data.recentCars || [])
        }
      } catch (error) {
        toast.error(saError(error))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [axios])

  if (loading) {
    return (
      <div className={sa.page}>
        <SaSkeleton className="h-10 w-64" />
        <SaSkeleton className="h-48 w-full mt-6" />
        <SaSkeleton className="h-48 w-full mt-4" />
      </div>
    )
  }

  return (
    <div className={sa.page}>
      <SaPageHeader
        title="System activity"
        subtitle="Recent bookings and fleet changes across all agencies."
      />

      <SaCard title="Recent bookings">
        {bookings.length === 0 ? (
          <SaEmpty title="No bookings yet" description="New reservations will appear here." />
        ) : (
          <div className="overflow-x-auto sa-scrollbar -mx-1">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr>
                  <th className={sa.th}>Reservation</th>
                  <th className={sa.th}>Customer</th>
                  <th className={sa.th}>Agency</th>
                  <th className={sa.th}>Status</th>
                  <th className={sa.th}>When</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className={sa.row}>
                    <td className={`${sa.td} font-medium text-[var(--sa-text)]`}>
                      {b.reservationId || b._id?.slice(-6)}
                    </td>
                    <td className={sa.td}>{b.customerName || '—'}</td>
                    <td className={`${sa.td} text-xs`}>{b.owner?.agencyName || b.owner?.name || '—'}</td>
                    <td className={`${sa.td} capitalize`}>{b.status}</td>
                    <td className={`${sa.td} text-xs text-[var(--sa-text-muted)]`}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SaCard>

      <SaCard title="Recent vehicles">
        {cars.length === 0 ? (
          <SaEmpty title="No vehicles yet" description="Fleet additions will appear here." />
        ) : (
          <div className="overflow-x-auto sa-scrollbar -mx-1">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr>
                  <th className={sa.th}>Vehicle</th>
                  <th className={sa.th}>Agency</th>
                  <th className={sa.th}>Available</th>
                  <th className={sa.th}>Added</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c._id} className={sa.row}>
                    <td className={`${sa.td} text-[var(--sa-text)]`}>
                      {c.brand} {c.model}
                      <span className="text-xs text-[var(--sa-text-muted)] ml-2">{c.category}</span>
                    </td>
                    <td className={`${sa.td} text-xs`}>{c.owner?.agencyName || c.owner?.name || '—'}</td>
                    <td className={sa.td}>{c.isAvaliable ? 'Yes' : 'No'}</td>
                    <td className={`${sa.td} text-xs text-[var(--sa-text-muted)]`}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SaCard>
    </div>
  )
}

export default SuperAdminActivity
