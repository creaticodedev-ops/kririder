export const BrowserFrame = ({ url = 'app.kririder.com/owner', children }) => (
  <figure className="mkt-browser">
    <div className="mkt-browser-bar" aria-hidden>
      <span className="mkt-dot" />
      <span className="mkt-dot" />
      <span className="mkt-dot" />
      <span className="mkt-url">{url}</span>
    </div>
    {children}
  </figure>
)

export const PhoneFrame = ({ title, children }) => (
  <figure className="mkt-phone">
    <div className="mkt-phone-screen">
      <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8F1F1F', margin: '0 0 8px' }}>
        KRIRIDER
      </p>
      <p style={{ fontWeight: 600, margin: '0 0 10px', fontSize: 14 }}>{title}</p>
      {children}
    </div>
  </figure>
)

const Side = ({ active }) => (
  <aside className="mkt-ui-side" aria-hidden>
    <b>KRIRIDER</b>
    {['Dashboard', 'Reservations', 'Walk-in', 'Customers', 'Fleet', 'Maintenance', 'Contracts', 'Invoices', 'Reports'].map((item) => (
      <p key={item} className={item === active ? 'is-on' : ''}>
        {item}
      </p>
    ))}
  </aside>
)

export const DashboardPreview = () => (
  <div className="mkt-ui mkt-ui-app">
    <Side active="Dashboard" />
    <div className="mkt-ui-main">
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Operations overview</p>
      <div className="mkt-kpi">
        <article>
          <span>Today</span>
          <strong>12</strong>
        </article>
        <article>
          <span>On rent</span>
          <strong>18</strong>
        </article>
        <article>
          <span>Revenue</span>
          <strong>MAD 86k</strong>
        </article>
        <article>
          <span>Occupancy</span>
          <strong>74%</strong>
        </article>
      </div>
      <div className="mkt-grid2">
        <div className="mkt-panel">
          <span style={{ color: '#8a817b' }}>Revenue trend</span>
          <div className="mkt-bars" aria-hidden>
            {[40, 55, 72, 48, 63, 86, 70].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="mkt-panel">
          <span style={{ color: '#8a817b' }}>Fleet</span>
          <p style={{ margin: '8px 0 0' }}>Available 9 · On rent 18 · Offline 2</p>
        </div>
      </div>
    </div>
  </div>
)

export const ReservationsPreview = () => (
  <div className="mkt-ui mkt-ui-app">
    <Side active="Reservations" />
    <div className="mkt-ui-main">
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Reservation workspace</p>
      <div className="mkt-panel">
        {[
          ['RES-1842', 'A. El Amrani', 'Confirmed'],
          ['RES-1841', 'S. Benali', 'Ready'],
          ['RES-1838', 'Walk-in', 'Active'],
          ['RES-1833', 'M. Leroux', 'Pending'],
        ].map(([id, name, status]) => (
          <div className="mkt-row" key={id}>
            <span>
              {id} · {name}
            </span>
            <span className={`mkt-pill${status === 'Pending' ? ' warn' : ''}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const FleetPreview = () => (
  <div className="mkt-ui mkt-ui-app">
    <Side active="Fleet" />
    <div className="mkt-ui-main">
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Fleet & availability</p>
      <div className="mkt-panel">
        {[
          ['Dacia Duster', 'Available', 'Casablanca'],
          ['Peugeot 208', 'On rent', 'Marrakech'],
          ['Mercedes C220', 'Available', 'Airport'],
          ['Hyundai Tucson', 'Maintenance', 'Agadir'],
        ].map(([car, status, loc]) => (
          <div className="mkt-row" key={car}>
            <span>
              {car} · {loc}
            </span>
            <span className={`mkt-pill${status !== 'Available' && status !== 'On rent' ? ' warn' : ''}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const ContractsPreview = () => (
  <div className="mkt-ui mkt-ui-app">
    <Side active="Contracts" />
    <div className="mkt-ui-main">
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Contract & signature</p>
      <div className="mkt-grid2">
        <div className="mkt-panel">
          <span style={{ color: '#8a817b' }}>Document</span>
          <p style={{ margin: '8px 0 0', fontWeight: 600 }}>Rental contract RES-1842</p>
          <p style={{ margin: '4px 0 0', color: '#8a817b' }}>Customer documents · PDF generated</p>
        </div>
        <div className="mkt-panel">
          <span style={{ color: '#8a817b' }}>Remote signature</span>
          <p style={{ margin: '10px 0 6px' }}>Link sent</p>
          <span className="mkt-pill">Awaiting customer</span>
        </div>
      </div>
    </div>
  </div>
)

export const AnalyticsPreview = () => (
  <div className="mkt-ui mkt-ui-app">
    <Side active="Reports" />
    <div className="mkt-ui-main">
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Performance</p>
      <div className="mkt-kpi">
        <article>
          <span>Week</span>
          <strong>MAD 21k</strong>
        </article>
        <article>
          <span>Month</span>
          <strong>MAD 86k</strong>
        </article>
        <article>
          <span>Online</span>
          <strong>MAD 54k</strong>
        </article>
        <article>
          <span>Walk-in</span>
          <strong>MAD 32k</strong>
        </article>
      </div>
      <div className="mkt-panel" style={{ marginTop: 8 }}>
        <div className="mkt-bars" aria-hidden>
          {[32, 44, 38, 60, 52, 78, 70, 64, 82, 74].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
)
