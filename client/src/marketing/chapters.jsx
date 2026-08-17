import { useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react'
import { Caption, Crop, Frame, Reveal, SHOTS, StickyScene } from './experience'

const StepLabel = ({ progress, steps }) => {
  const [index, setIndex] = useState(0)
  useMotionValueEvent(progress, 'change', (value) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length)))
    setIndex((prev) => (prev === next ? prev : next))
  })
  return <em className="mkt-xp-live">{steps[index]}</em>
}

const OrbitNode = ({ progress, src, label, from, to }) => {
  const reduce = useReducedMotion()
  const x = useTransform(progress, [0, 1], reduce ? [to.x, to.x] : [from.x, to.x])
  const y = useTransform(progress, [0, 1], reduce ? [to.y, to.y] : [from.y, to.y])
  return (
    <motion.div className="mkt-xp-orbit-node" style={{ x, y }}>
      <Frame title={label}>
        <Crop src={src} pos="50% 22%" alt="" />
      </Frame>
      <p>{label}</p>
    </motion.div>
  )
}

const ConnectPin = ({ progress }) => {
  const reduce = useReducedMotion()
  const line = useTransform(progress, [0.12, 0.72], [0, 1])
  return (
    <div className="mkt-xp-connect">
      <div className="mkt-xp-connect-copy">
        <p className="mkt-kicker">03 — One workspace</p>
        <h2 className="mkt-h2">Modules stay attached to the same rental.</h2>
        <p className="mkt-lead">
          Reservations, fleet, customers, contracts, finance and analytics are screens in one product — not five tools
          stitched together.
        </p>
      </div>
      <div className="mkt-xp-orbit">
        <div className="mkt-xp-orbit-core" aria-hidden>
          KR
        </div>
        <svg className="mkt-xp-orbit-lines" viewBox="0 0 400 400" fill="none" aria-hidden>
          {[
            [80, 78],
            [320, 78],
            [70, 210],
            [330, 210],
            [110, 330],
            [290, 330],
          ].map(([x, y]) => (
            <motion.line
              key={`${x}-${y}`}
              x1="200"
              y1="200"
              x2={x}
              y2={y}
              stroke="#8F1F1F"
              strokeWidth="1.15"
              style={{ pathLength: reduce ? 1 : line, opacity: reduce ? 0.45 : line }}
            />
          ))}
        </svg>
        <OrbitNode progress={progress} src={SHOTS.reservations} label="Reservations" from={{ x: -210, y: -150 }} to={{ x: -132, y: -108 }} />
        <OrbitNode progress={progress} src={SHOTS.fleet} label="Fleet" from={{ x: 210, y: -148 }} to={{ x: 132, y: -108 }} />
        <OrbitNode progress={progress} src={SHOTS.customers} label="Customers" from={{ x: -230, y: 8 }} to={{ x: -150, y: 18 }} />
        <OrbitNode progress={progress} src={SHOTS.contracts} label="Contracts" from={{ x: 230, y: 10 }} to={{ x: 150, y: 18 }} />
        <OrbitNode progress={progress} src={SHOTS.revenues} label="Finance" from={{ x: -160, y: 148 }} to={{ x: -92, y: 118 }} />
        <OrbitNode progress={progress} src={SHOTS.analytics} label="Analytics" from={{ x: 160, y: 148 }} to={{ x: 92, y: 118 }} />
      </div>
    </div>
  )
}

export const ConnectScene = () => {
  const reduce = useReducedMotion()
  return (
    <StickyScene id="connected" className="is-connect" height={reduce ? '100vh' : '220vh'}>
      {(progress) => <ConnectPin progress={progress} />}
    </StickyScene>
  )
}

const ReservationPin = ({ progress }) => {
  const reduce = useReducedMotion()
  const calX = useTransform(progress, [0, 0.35], reduce ? [0, 0] : [48, 0])
  const calClip = useTransform(
    progress,
    [0, 0.38],
    reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(10% 14% 10% 14%)', 'inset(0% 0% 0% 0%)'],
  )
  const listO = useTransform(progress, [0.22, 0.5], [reduce ? 1 : 0, 1])
  const listY = useTransform(progress, [0.22, 0.5], [reduce ? 0 : 28, 0])
  const detailO = useTransform(progress, [0.48, 0.78], [reduce ? 1 : 0, 1])
  const detailS = useTransform(progress, [0.48, 0.78], [reduce ? 1 : 0.94, 1])
  return (
    <div className="mkt-xp-chapter">
      <div className="mkt-xp-copy">
        <p className="mkt-kicker">04 — Reservations</p>
        <h2 className="mkt-h2">The desk runs on one booking workspace.</h2>
        <p className="mkt-lead">
          Online, walk-in and WhatsApp channels share the same statuses. The calendar, the list and the file are the same
          rental.
        </p>
        <StepLabel progress={progress} steps={['Calendar occupancy', 'Reservation list', 'Booking file', 'Status in the product']} />
      </div>
      <div className="mkt-xp-compose">
        <motion.div className="mkt-xp-mainshot" style={{ x: calX, clipPath: calClip }}>
          <Frame title="Calendar">
            <Crop src={SHOTS.calendar} pos="50% 28%" alt="KRIRIDER reservation calendar" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-float is-list" style={{ opacity: listO, y: listY }}>
          <Frame title="Reservations">
            <Crop src={SHOTS.reservations} pos="74% 32%" alt="KRIRIDER reservation list" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-float is-detail" style={{ opacity: detailO, scale: detailS }}>
          <Frame title="Reservation">
            <Crop src={SHOTS.booking} pos="50% 18%" alt="KRIRIDER reservation detail" />
          </Frame>
        </motion.div>
      </div>
    </div>
  )
}

export const ReservationChapter = () => {
  const reduce = useReducedMotion()
  return (
    <StickyScene id="features" height={reduce ? 'auto' : '230vh'} className="is-chapter">
      {(progress) => <ReservationPin progress={progress} />}
    </StickyScene>
  )
}

const FleetPin = ({ progress }) => {
  const reduce = useReducedMotion()
  const reveal = useTransform(
    progress,
    [0, 0.4],
    reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(0% 28% 0% 28%)', 'inset(0% 0% 0% 0%)'],
  )
  const overlay = useTransform(progress, [0.32, 0.62], [reduce ? 1 : 0, 1])
  const maint = useTransform(progress, [0.55, 0.88], [reduce ? 1 : 0, 1])
  const shift = useTransform(progress, [0.55, 0.88], [reduce ? 0 : 20, 0])
  return (
    <div className="mkt-xp-chapter">
      <div className="mkt-xp-copy">
        <p className="mkt-kicker">05 — Fleet</p>
        <h2 className="mkt-h2">The car that gets assigned is a physical asset.</h2>
        <p className="mkt-lead">
          Fleet ID, VIN, plate, mileage, branch and availability sit next to the booking. Maintenance is tracked on that
          exact vehicle.
        </p>
        <StepLabel progress={progress} steps={['Vehicle inventory', 'Availability', 'Maintenance per car']} />
      </div>
      <div className="mkt-xp-compose">
        <motion.div className="mkt-xp-mainshot" style={{ clipPath: reveal }}>
          <Frame title="Manage cars">
            <Crop src={SHOTS.fleet} pos="48% 16%" alt="KRIRIDER fleet table" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-float is-avail" style={{ opacity: overlay }}>
          <Frame title="Locations">
            <Crop src={SHOTS.locations} pos="50% 30%" alt="KRIRIDER pickup locations" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-float is-maint" style={{ opacity: maint, y: shift }}>
          <Frame title="Maintenance">
            <Crop src={SHOTS.maintenance} pos="55% 22%" alt="KRIRIDER fleet maintenance" />
          </Frame>
        </motion.div>
      </div>
    </div>
  )
}

export const FleetChapter = () => {
  const reduce = useReducedMotion()
  return (
    <StickyScene id="fleet" height={reduce ? 'auto' : '210vh'} className="is-chapter is-invert">
      {(progress) => <FleetPin progress={progress} />}
    </StickyScene>
  )
}

const ContractPin = ({ progress }) => {
  const reduce = useReducedMotion()
  const fromX = useTransform(progress, [0, 0.45], reduce ? [0, 0] : [0, -18])
  const fromO = useTransform(progress, [0.2, 0.55], [1, reduce ? 1 : 0.28])
  const toX = useTransform(progress, [0.18, 0.58], reduce ? [0, 0] : [36, 0])
  const toO = useTransform(progress, [0.18, 0.5], [reduce ? 1 : 0, 1])
  const sign = useTransform(progress, [0.52, 0.82], [reduce ? 1 : 0, 1])
  return (
    <div className="mkt-xp-chapter">
      <div className="mkt-xp-copy">
        <p className="mkt-kicker">06 — Contracts</p>
        <h2 className="mkt-h2">The rental becomes the document.</h2>
        <p className="mkt-lead">
          Contracts and invoices are generated from the booking. Customers complete files through a dedicated completion
          link — the stay is not retyped.
        </p>
        <StepLabel progress={progress} steps={['Booking data', 'Generated contract', 'Signature request']} />
      </div>
      <div className="mkt-xp-compose is-flow">
        <motion.div className="mkt-xp-mainshot is-ghost" style={{ x: fromX, opacity: fromO }}>
          <Frame title="Reservation">
            <Crop src={SHOTS.booking} pos="48% 20%" alt="" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-mainshot is-over" style={{ x: toX, opacity: toO }}>
          <Frame title="Contracts">
            <Crop src={SHOTS.contracts} pos="52% 14%" alt="KRIRIDER contract workspace" />
          </Frame>
        </motion.div>
        <motion.div className="mkt-xp-float is-sign" style={{ opacity: sign }}>
          <Frame title="Signatures">
            <Crop src={SHOTS.signatures} pos="68% 38%" alt="KRIRIDER signature requests" />
          </Frame>
        </motion.div>
      </div>
    </div>
  )
}

export const ContractChapter = () => {
  const reduce = useReducedMotion()
  return (
    <StickyScene id="contracts" height={reduce ? 'auto' : '210vh'} className="is-chapter">
      {(progress) => <ContractPin progress={progress} />}
    </StickyScene>
  )
}

const FinancePin = ({ progress }) => {
  const reduce = useReducedMotion()
  const x = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-75%'])
  const slides = [
    { src: SHOTS.revenues, title: 'Revenues', alt: 'KRIRIDER revenues with paid and unpaid totals' },
    { src: SHOTS.invoices, title: 'Invoices', alt: 'KRIRIDER invoices' },
    { src: SHOTS.analytics, title: 'Analytics', alt: 'KRIRIDER analytics' },
    { src: SHOTS.reports, title: 'Reports', alt: 'KRIRIDER reports and exports' },
  ]
  return (
    <div className="mkt-xp-chapter">
      <div className="mkt-xp-copy">
        <p className="mkt-kicker">Finance & analytics</p>
        <h2 className="mkt-h2">Know exactly how your business is performing.</h2>
        <p className="mkt-lead">
          Booking-derived income, invoices and CSV/PDF reports sit next to the work that produced them.
        </p>
        <StepLabel progress={progress} steps={['Revenues', 'Invoices', 'Analytics', 'Reports']} />
      </div>
      <div className="mkt-xp-film">
        <motion.div className="mkt-xp-film-track" style={{ x }}>
          {slides.map((slide) => (
            <Frame key={slide.title} title={slide.title} className="mkt-xp-film-cell">
              <Crop src={slide.src} pos="50% 16%" alt={slide.alt} />
            </Frame>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export const FinanceChapter = () => {
  const reduce = useReducedMotion()
  return (
    <StickyScene id="finance" height={reduce ? 'auto' : '240vh'} className="is-chapter is-dark">
      {(progress) => <FinancePin progress={progress} />}
    </StickyScene>
  )
}

export const Ecosystem = () => (
  <section className="mkt-xp-eco" id="workspace">
    <div className="mkt-wrap">
      <Reveal className="mkt-intro">
        <p className="mkt-kicker">The platform</p>
        <h2 className="mkt-h2">The whole operation, in one KRIRIDER workspace.</h2>
        <p className="mkt-lead">
          Dashboard, desk, documents, money and the public storefront share the same agency account.
        </p>
      </Reveal>
      <div className="mkt-xp-eco-stage">
        <Reveal className="mkt-xp-eco-core" delay={0.05}>
          <Frame title="Dashboard" className="is-hero">
            <Crop src={SHOTS.dashboard} pos="50% 10%" alt="KRIRIDER dashboard" />
          </Frame>
        </Reveal>
        <Reveal className="mkt-xp-eco-s is-a" delay={0.12}>
          <Frame title="Walk-in">
            <Crop src={SHOTS.walkin} pos="50% 20%" alt="KRIRIDER walk-in reservation" />
          </Frame>
        </Reveal>
        <Reveal className="mkt-xp-eco-s is-b" delay={0.18}>
          <Frame title="Customers">
            <Crop src={SHOTS.customers} pos="50% 22%" alt="KRIRIDER customers" />
          </Frame>
        </Reveal>
        <Reveal className="mkt-xp-eco-s is-c" delay={0.24}>
          <Frame title="Storefront">
            <Crop src={SHOTS.storefront} pos="50% 18%" alt="Agency storefront on KRIRIDER" />
          </Frame>
        </Reveal>
        <Reveal className="mkt-xp-eco-s is-d" delay={0.3}>
          <Frame title="Templates">
            <Crop src={SHOTS.templates} pos="50% 20%" alt="KRIRIDER document templates" />
          </Frame>
        </Reveal>
        <Reveal className="mkt-xp-eco-s is-e" delay={0.36}>
          <Frame title="Accounting">
            <Crop src={SHOTS.accounting} pos="50% 20%" alt="KRIRIDER accounting" />
          </Frame>
        </Reveal>
      </div>
      <Caption />
    </div>
  </section>
)
