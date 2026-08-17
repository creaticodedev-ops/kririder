import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { SHOTS } from './productPreviews'
import { useMktI18n } from './i18n/MarketingI18n'

const useFinePointer = () => {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer:fine) and (min-width: 1180px)')
    const apply = () => setFine(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return fine
}

const Layer = ({ mx, my, depth, className, children }) => {
  const reduce = useReducedMotion()
  const x = useTransform(mx, [-0.5, 0.5], reduce ? [0, 0] : [-14 * depth, 14 * depth])
  const y = useTransform(my, [-0.5, 0.5], reduce ? [0, 0] : [-10 * depth, 10 * depth])
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  )
}

const Chip = ({ src, pos, title, delay = 0 }) => {
  const reduce = useReducedMotion()
  return (
    <motion.figure
      className="onboard-chip"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="onboard-chip-view">
        <img src={src} alt="" style={{ objectPosition: pos }} loading="lazy" decoding="async" />
      </div>
      <figcaption>{title}</figcaption>
    </motion.figure>
  )
}

export const SignupStage = () => {
  const { t } = useMktI18n()
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const root = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 24, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 55, damping: 24, mass: 0.7 })

  return (
    <div
      className="onboard-stage"
      ref={root}
      onMouseMove={(event) => {
        if (!fine || reduce || !root.current) return
        const box = root.current.getBoundingClientRect()
        mx.set((event.clientX - box.left) / box.width - 0.5)
        my.set((event.clientY - box.top) / box.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <Layer mx={sx} my={sy} depth={0.35} className="onboard-stage-main">
        <motion.figure
          className="onboard-shot"
          initial={reduce ? false : { opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="onboard-shot-bar" aria-hidden>
            <span>
              <i />
              <i />
              <i />
            </span>
            {t('frames.workspace')}
          </div>
          <img
            src={SHOTS.dashboard}
            alt={t('alts.dashboard')}
            width={1600}
            height={1000}
            decoding="async"
          />
        </motion.figure>
      </Layer>
      <Layer mx={sx} my={sy} depth={1.15} className="onboard-float is-a">
        <Chip src={SHOTS.reservations} pos="72% 28%" title={t('frames.reservations')} delay={0.28} />
      </Layer>
      <Layer mx={sx} my={sy} depth={1.25} className="onboard-float is-b">
        <Chip src={SHOTS.fleet} pos="48% 18%" title={t('frames.fleet')} delay={0.38} />
      </Layer>
      <Layer mx={sx} my={sy} depth={1.35} className="onboard-float is-c">
        <Chip src={SHOTS.revenues} pos="50% 20%" title={t('frames.revenue')} delay={0.48} />
      </Layer>
      <Layer mx={sx} my={sy} depth={1.2} className="onboard-float is-d">
        <Chip src={SHOTS.calendar} pos="55% 32%" title={t('frames.calendar')} delay={0.56} />
      </Layer>
      <Layer mx={sx} my={sy} depth={1.3} className="onboard-float is-e">
        <Chip src={SHOTS.contracts} pos="50% 16%" title={t('frames.contracts')} delay={0.64} />
      </Layer>
      <p className="onboard-caption">{t('caption')}</p>
    </div>
  )
}

export default SignupStage
