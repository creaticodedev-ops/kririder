import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { SHOTS } from './productPreviews'
import { useMktI18n } from './i18n/MarketingI18n'

export const Caption = () => {
  const { t } = useMktI18n()
  return <p className="mkt-caption">{t('caption')}</p>
}

export const Frame = ({ title = 'KRIRIDER', className = '', children }) => (
  <figure className={`mkt-xp-frame ${className}`.trim()}>
    <div className="mkt-xp-bar" aria-hidden>
      <span className="mkt-xp-dots">
        <i />
        <i />
        <i />
      </span>
      <span>{title}</span>
    </div>
    <div className="mkt-xp-pane">{children}</div>
  </figure>
)

export const Crop = ({ src, pos = '50% 12%', alt = '', eager = false }) => (
  <img
    className="mkt-xp-img"
    src={src}
    alt={alt}
    style={{ objectPosition: pos }}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
  />
)

export const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export const StickyScene = ({ height = '210vh', children, className = '', id }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  return (
    <div id={id} ref={ref} className={`mkt-xp-track ${className}`.trim()} style={{ height }}>
      <div className="mkt-xp-pin">{children(scrollYProgress)}</div>
    </div>
  )
}

const useFinePointer = () => {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer:fine) and (min-width: 980px)')
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return fine
}

const Layer = ({ mx, my, depth, className, children }) => {
  const reduce = useReducedMotion()
  const x = useTransform(mx, [-0.5, 0.5], reduce ? [0, 0] : [-16 * depth, 16 * depth])
  const y = useTransform(my, [-0.5, 0.5], reduce ? [0, 0] : [-12 * depth, 12 * depth])
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  )
}

export const HeroScene = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const root = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 })
  const ease = [0.22, 1, 0.36, 1]

  const onMove = (event) => {
    if (!fine || reduce || !root.current) return
    const box = root.current.getBoundingClientRect()
    mx.set((event.clientX - box.left) / box.width - 0.5)
    my.set((event.clientY - box.top) / box.height - 0.5)
  }

  const enter = (delay, extra = {}) =>
    reduce ? false : { opacity: 0, y: 24, ...extra, transition: { duration: 0.95, delay, ease } }

  return (
    <div
      className="mkt-xp-hero-scene"
      ref={root}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <Layer mx={sx} my={sy} depth={0.55} className="mkt-xp-layer is-back-left">
        <motion.div initial={enter(0.06, { rotate: -8 })} animate={{ opacity: 1, y: 0, rotate: -7 }} className="mkt-xp-tilt">
          <Frame title={t('frames.reservations')}>
            <Crop src={SHOTS.reservations} pos="70% 30%" alt="" eager />
          </Frame>
        </motion.div>
      </Layer>
      <Layer mx={sx} my={sy} depth={0.45} className="mkt-xp-layer is-back-right">
        <motion.div initial={enter(0.14, { rotate: 8 })} animate={{ opacity: 1, y: 0, rotate: 6 }} className="mkt-xp-tilt">
          <Frame title={t('frames.fleet')}>
            <Crop src={SHOTS.fleet} pos="48% 20%" alt="" />
          </Frame>
        </motion.div>
      </Layer>
      <Layer mx={sx} my={sy} depth={1} className="mkt-xp-layer is-main">
        <motion.div initial={enter(0.2, { scale: 0.97 })} animate={{ opacity: 1, y: 0, scale: 1 }}>
          <Frame title={t('frames.workspace')} className="is-hero">
            <Crop
              src={SHOTS.dashboard}
              pos="50% 8%"
              alt={t('alts.dashboard')}
              eager
            />
          </Frame>
        </motion.div>
      </Layer>
      <Layer mx={sx} my={sy} depth={1.35} className="mkt-xp-layer is-chip-a">
        <motion.div initial={enter(0.4)} animate={{ opacity: 1, y: 0 }}>
          <Frame title={t('frames.calendar')}>
            <Crop src={SHOTS.calendar} pos="55% 35%" alt="" />
          </Frame>
          <span>{t('frames.reservations')}</span>
        </motion.div>
      </Layer>
      <Layer mx={sx} my={sy} depth={1.4} className="mkt-xp-layer is-chip-b">
        <motion.div initial={enter(0.5)} animate={{ opacity: 1, y: 0 }}>
          <Frame title={t('frames.analytics')}>
            <Crop src={SHOTS.analytics} pos="52% 18%" alt="" />
          </Frame>
          <span>{t('frames.revenue')}</span>
        </motion.div>
      </Layer>
    </div>
  )
}

export { SHOTS }
