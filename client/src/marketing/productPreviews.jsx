export const AppWindow = ({ title = 'KRIRIDER', children, className = '' }) => (
  <figure className={`mkt-app ${className}`.trim()}>
    <div className="mkt-app-top" aria-hidden>
      <span className="mkt-app-kr">KR</span>
      <span>{title}</span>
    </div>
    {children}
  </figure>
)

const Nav = ({ active }) => (
  <aside className="mkt-app-nav" aria-hidden>
    <p className="mkt-app-nav-brand">KRIRIDER</p>
    {['Dashboard', 'Reservations', 'Walk-in', 'Customers', 'Fleet', 'Contracts', 'Invoices', 'Reports'].map((item) => (
      <span key={item} className={item === active ? 'is-on' : ''}>
        {item}
      </span>
    ))}
  </aside>
)

export const DashboardPreview = () => (
  <div className="mkt-app-body">
    <Nav active="Dashboard" />
    <div className="mkt-app-main">
      <header className="mkt-app-head">
        <div>
          <p>Operations</p>
          <h3>Dashboard</h3>
        </div>
        <span className="mkt-chip">Today</span>
      </header>
      <div className="mkt-kpis">
        {[
          ['Bookings', '12', '+3 today'],
          ['On rent', '18', 'active'],
          ['Revenue', '86k', 'this month'],
          ['Occupancy', '74%', 'fleet'],
        ].map(([label, value, hint]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>{hint}</em>
          </article>
        ))}
      </div>
      <div className="mkt-dash-grid">
        <div className="mkt-pane">
          <span>Revenue overview</span>
          <svg className="mkt-line" viewBox="0 0 280 88" fill="none" aria-hidden>
            <path d="M8 70 C 40 62, 56 48, 84 52 S 132 22, 160 30 S 220 18, 272 28" stroke="#8F1F1F" strokeWidth="2.4" />
            <path d="M8 70 C 40 62, 56 48, 84 52 S 132 22, 160 30 S 220 18, 272 28 V 88 H 8 Z" fill="#8F1F1F" opacity="0.12" />
          </svg>
        </div>
        <div className="mkt-pane">
          <span>Fleet status</span>
          <div className="mkt-fleet-mix">
            <i className="is-a" />
            <div>
              <p>
                <b>9</b> available
              </p>
              <p>
                <b>18</b> on rent
              </p>
              <p>
                <b>2</b> maintenance
              </p>
            </div>
          </div>
        </div>
        <div className="mkt-pane mkt-pane-wide">
          <span>Recent reservations</span>
          <ul className="mkt-mini-table">
            {[
              ['RES-1842', 'El Amrani', 'Confirmed'],
              ['RES-1841', 'Benali', 'Ready'],
              ['RES-1838', 'Walk-in', 'Active'],
            ].map(([id, name, status]) => (
              <li key={id}>
                <span>{id}</span>
                <span>{name}</span>
                <em>{status}</em>
              </li>
            ))}
          </ul>
        </div>
        <div className="mkt-pane">
          <span>Quick actions</span>
          <ul className="mkt-quick">
            <li>New reservation</li>
            <li>Walk-in booking</li>
            <li>Generate contract</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)

export const ReservationsPreview = () => (
  <div className="mkt-app-body">
    <Nav active="Reservations" />
    <div className="mkt-app-main">
      <header className="mkt-app-head">
        <div>
          <p>Bookings</p>
          <h3>Reservation workspace</h3>
        </div>
        <span className="mkt-chip">Online · Walk-in · WhatsApp</span>
      </header>
      <div className="mkt-pane">
        <ul className="mkt-mini-table mkt-mini-table-lg">
          {[
            ['RES-1842', 'A. El Amrani', 'Duster', 'Confirmed'],
            ['RES-1841', 'S. Benali', 'Peugeot 208', 'Ready'],
            ['RES-1838', 'Walk-in', 'C220', 'Active'],
            ['RES-1833', 'M. Leroux', 'Tucson', 'Pending'],
          ].map(([id, name, car, status]) => (
            <li key={id}>
              <span>{id}</span>
              <span>{name}</span>
              <span>{car}</span>
              <em>{status}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

export const FleetPreview = () => (
  <div className="mkt-app-body">
    <Nav active="Fleet" />
    <div className="mkt-app-main">
      <header className="mkt-app-head">
        <div>
          <p>Vehicles</p>
          <h3>Fleet & availability</h3>
        </div>
      </header>
      <div className="mkt-fleet-cards">
        {[
          ['Dacia Duster', 'Available', 'Casablanca'],
          ['Peugeot 208', 'On rent', 'Marrakech'],
          ['Mercedes C220', 'Available', 'Airport'],
          ['Hyundai Tucson', 'Maintenance', 'Agadir'],
        ].map(([car, status, loc]) => (
          <article key={car}>
            <strong>{car}</strong>
            <span>{loc}</span>
            <em className={status === 'Maintenance' ? 'is-warn' : ''}>{status}</em>
          </article>
        ))}
      </div>
    </div>
  </div>
)

export const ContractsPreview = () => (
  <div className="mkt-app-body">
    <Nav active="Contracts" />
    <div className="mkt-app-main">
      <header className="mkt-app-head">
        <div>
          <p>Documents</p>
          <h3>Contract RES-1842</h3>
        </div>
        <span className="mkt-chip">PDF ready</span>
      </header>
      <div className="mkt-doc">
        <p>Rental agreement · generated from the booking</p>
        <div className="mkt-sign">
          <span>Remote signature</span>
          <em>Awaiting customer</em>
        </div>
      </div>
    </div>
  </div>
)

export const AnalyticsPreview = () => (
  <div className="mkt-app-body">
    <Nav active="Reports" />
    <div className="mkt-app-main">
      <header className="mkt-app-head">
        <div>
          <p>Performance</p>
          <h3>Analytics</h3>
        </div>
      </header>
      <div className="mkt-kpis">
        {[
          ['Week', '21k'],
          ['Month', '86k'],
          ['Online', '54k'],
          ['Walk-in', '32k'],
        ].map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>MAD</em>
          </article>
        ))}
      </div>
      <div className="mkt-pane">
        <svg className="mkt-line" viewBox="0 0 280 72" fill="none" aria-hidden>
          <path d="M6 50 C 36 46, 54 28, 86 34 S 140 14, 176 24 S 230 18, 274 22" stroke="#8F1F1F" strokeWidth="2.2" />
        </svg>
      </div>
    </div>
  </div>
)

export const HeroStage = () => (
  <div className="mkt-hero-stage">
    <AppWindow className="mkt-hero-stage-main" title="Owner workspace">
      <DashboardPreview />
    </AppWindow>
    <aside className="mkt-float mkt-float-a" aria-hidden>
      <p>Reservation</p>
      <strong>RES-1842</strong>
      <span>A. El Amrani · Duster</span>
      <em>Confirmed</em>
    </aside>
    <aside className="mkt-float mkt-float-b" aria-hidden>
      <p>Contract</p>
      <strong>PDF generated</strong>
      <span>Signature requested</span>
    </aside>
  </div>
)

export const SnippetReservations = () => (
  <div className="mkt-snip">
    <p>Today</p>
    <ul>
      <li>
        <span>RES-1842</span> Confirmed
      </li>
      <li>
        <span>RES-1841</span> Ready
      </li>
      <li>
        <span>Walk-in</span> Active
      </li>
    </ul>
  </div>
)

export const SnippetFleet = () => (
  <div className="mkt-snip">
    <p>Dacia Duster</p>
    <strong>Available</strong>
    <span>Casablanca · airport</span>
  </div>
)

export const SnippetContract = () => (
  <div className="mkt-snip mkt-snip-doc">
    <p>Contrat de location</p>
    <span>RES-1842 · PDF</span>
    <em>Signature requested</em>
  </div>
)

export const SnippetAnalytics = () => (
  <div className="mkt-snip">
    <p>This month</p>
    <strong>MAD 86k</strong>
    <span>Online 54k · Walk-in 32k</span>
  </div>
)

export const SnippetCustomers = () => (
  <div className="mkt-snip">
    <p>A. El Amrani</p>
    <span>History on agency record</span>
    <em>Last stay RES-1842</em>
  </div>
)
