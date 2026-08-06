import { useAuth } from '../../../../Context/AuthProvider'
import useDashboardData from './useDashboardData'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Flame, CalendarDays, Zap, RefreshCw, AlertCircle,
  HelpCircle, TrendingUp, BookOpen, Search, Map, Briefcase
} from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, CartesianGrid, XAxis, YAxis
} from 'recharts'

const TEAL = '#14b8a6'
const PIE_COLORS = [TEAL, '#6366f1', '#f59e0b', '#ec4899']

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

const containerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0, 1] } },
}

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-base-content/10 rounded-2xl ${className || ''}`} />
)

const SectionHeader = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-base-content/5">
      <Icon className="w-3.5 h-3.5 text-base-content/40" size={14} />
    </span>
    <span className="text-[11px] font-semibold tracking-[0.12em] text-base-content/40 uppercase">
      {children}
    </span>
    <span className="h-px flex-1 bg-base-content/5" />
  </div>
)

const ScoreRing = ({ score, size = 132 }) => {
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(Math.max(score, 0), 100) / 100) * circ
  const label = score >= 80 ? 'Ready' : score >= 60 ? 'Getting there' : 'Needs work'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-base-content/8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={TEAL} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-bold tracking-tight text-base-content">{score}</span>
        <span className="text-[10px] font-medium tracking-wider text-base-content/30 mt-0.5">{label}</span>
      </div>
    </div>
  )
}

const ContentDoughnutChart = ({ content }) => {
  const data = [
    { name: 'CVs', value: content.totalCvs || 0 },
    { name: 'Analyses', value: content.totalAnalyses || 0 },
    { name: 'Roadmaps', value: content.totalRoadmaps || 0 },
    { name: 'Quiz', value: content.totalQuizAttempts || 0 },
  ].filter(d => d.value > 0)

  if (data.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 text-base-content/30"><span className="text-sm">No content yet</span></div>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={96} paddingAngle={3} dataKey="value" stroke="none">
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 12, fontSize: 13 }} />
        <Legend verticalAlign="bottom" height={32}
          formatter={v => <span className="text-xs text-base-content/60">{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}

const StreakGauge = ({ current, longest }) => {
  const pct = longest > 0 ? Math.round((current / longest) * 100) : 0
  const r = 64
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-base-content/8" />
          <circle cx="70" cy="70" r={r} fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className="w-5 h-5 text-amber-500 mb-0.5" />
          <span className="font-mono text-2xl font-bold text-base-content">{current}</span>
          <span className="text-[10px] text-base-content/30 tracking-wider font-medium">of {longest} days</span>
        </div>
      </div>
    </div>
  )
}

const MonthlyUsageBar = ({ usage }) => {
  if (!usage) return null

  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()

  const used = usage.analysesUsedThisMonth || 0
  const limit = usage.analysesLimit || 0
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const remaining = Math.max(limit - used, 0)
  const dailyAvg = dayOfMonth > 0 ? (used / dayOfMonth) : 0
  const projected = Math.round(dailyAvg * daysInMonth)
  const daysLeft = daysInMonth - dayOfMonth
  const pctThroughMonth = Math.round((dayOfMonth / daysInMonth) * 100)

  const urgency = pct >= 90 ? 'rose' : pct >= 70 ? 'amber' : 'teal'
  const colors = { teal: { text: 'text-teal-400', bar: TEAL, ring: TEAL }, amber: { text: 'text-amber-400', bar: '#fbbf24', ring: '#fbbf24' }, rose: { text: 'text-rose-400', bar: '#fb7185', ring: '#fb7185' } }
  const c = colors[urgency]

  const ringR = 38
  const ringCirc = 2 * Math.PI * ringR
  const ringOffset = ringCirc - (pct / 100) * ringCirc

  const barSegments = [
    { label: 'Used', value: used, color: c.bar },
    { label: 'Remaining', value: remaining, color: 'rgba(148,163,184,0.12)' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
          <svg width="88" height="88" className="-rotate-90">
            <circle cx="44" cy="44" r={ringR} fill="none" stroke="currentColor" strokeWidth="6" className="text-base-content/8" />
            <circle cx="44" cy="44" r={ringR} fill="none" stroke={c.ring} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={ringCirc} strokeDashoffset={ringOffset} className="transition-all duration-700 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-mono text-lg font-bold ${c.text}`}>{pct}%</span>
            <span className="text-[9px] tracking-wider text-base-content/25 uppercase">used</span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-base-content">{used}</span>
            <span className="font-mono text-sm text-base-content/25">/ {limit}</span>
          </div>

          <div className="mt-3 flex gap-0.5 h-2.5 rounded-full overflow-hidden">
            {barSegments.filter(s => s.value > 0).map(s => (
              <div key={s.label} style={{ width: `${(s.value / limit) * 100}%`, backgroundColor: s.color }}
                className="h-full transition-all duration-700 ease-out" />
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-xs text-base-content/30">{remaining} left</span>
            <span className="font-mono text-[10px] text-base-content/20">{dailyAvg.toFixed(1)}/day avg</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between text-[10px] text-base-content/25 mb-2">
          <span>{pct}% of credits</span>
          <span>{pctThroughMonth}% of month</span>
        </div>
        <div className="relative h-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-0.5 bg-base-content/8 rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="h-0.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pctThroughMonth}%`, backgroundColor: 'rgba(148,163,184,0.15)' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-0.5">
            <div className="w-2 h-2 rounded-full bg-base-content/15" />
            <div className="w-2 h-2 rounded-full bg-base-content/15" />
          </div>
          <div className="absolute inset-0 flex items-center"
            style={{ left: `${Math.min(pctThroughMonth, 100)}%` }}>
            <div className={`w-2.5 h-2.5 rounded-full ${c.text} ring-2 ring-base-300`} style={{ backgroundColor: c.bar }} />
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1">
          <span className="text-base-content/20">Start</span>
          <div className="text-center">
            <span className={`font-mono text-xs font-medium ${c.text}`}>{projected}</span>
            <span className="text-base-content/20 ml-1">projected</span>
          </div>
          <span className="text-base-content/20">{daysLeft}d left</span>
        </div>
      </div>

      {usage.resetDate && (
        <div className="flex items-center gap-1.5 text-[10px] text-base-content/20 pt-1 border-t border-base-content/5">
          <CalendarDays className="w-3 h-3" />
          Resets {formatDate(usage.resetDate)}
        </div>
      )}
    </div>
  )
}

const PerformanceRadar = ({ analytics, quizStats }) => {
  const readiness = analytics?.readinessScore ?? 0
  const quizAccuracy = analytics?.content?.quizAccuracy ?? quizStats?.accuracy_percent ?? 0
  const behavioral = analytics?.content?.totalBehavioralAnswers ?? 0
  const behavioralScore = Math.min(Math.round((behavioral / 50) * 100), 100)
  const data = [
    { metric: 'Readiness', value: readiness, label: `${readiness}%` },
    { metric: 'Quiz Accuracy', value: quizAccuracy, label: `${quizAccuracy}%` },
    { metric: 'Behavioral', value: behavioralScore, label: `${behavioralScore}%` },
  ]

  if (!data.some(d => d.value > 0)) {
    return <div className="flex flex-col items-center justify-center h-64 text-base-content/30"><span className="text-sm">No data yet</span></div>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="78%">
        <PolarGrid stroke="rgba(148,163,184,0.08)" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.5)', fontWeight: 500 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Performance" dataKey="value" stroke={TEAL} fill={TEAL} fillOpacity={0.12} strokeWidth={2.5} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

const ReadinessTrendLine = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className="flex flex-col items-center justify-center h-64 text-base-content/30"><TrendingUp className="w-6 h-6 mb-2 opacity-50" /><span className="text-sm">No history yet</span></div>
  }

  const sorted = [...history].sort((a, b) => new Date(a.calculated_at) - new Date(b.calculated_at))
  const data = sorted.map(e => ({ date: formatDate(e.calculated_at), score: e.composite_score ?? 0 }))
  const latest = data[data.length - 1]?.score ?? 0
  const first = data[0]?.score ?? 0
  const trend = latest - first
  const TrendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→'
  const trendColor = trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-rose-400' : 'text-base-content/30'

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-base-content">{latest}</span>
          <span className="font-mono text-sm text-base-content/25">/ 100</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${trendColor}`}>
          <span>{TrendIcon}</span>
          <span>{Math.abs(trend)} pts</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TEAL} stopOpacity={0.2} />
              <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.05)" strokeDasharray="2 2" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.3)' }} axisLine={false} tickLine={false} dy={6} />
          <YAxis domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
          <Area type="monotone" dataKey="score" stroke={TEAL} strokeWidth={2} fill="url(#gl)"
            dot={{ r: 3, fill: TEAL, stroke: 'none' }}
            activeDot={{ r: 5, fill: TEAL, stroke: '#0f172a', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
    <div className="flex gap-6">
      <Skeleton className="w-32 h-32 rounded-full" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
    <Skeleton className="h-72" />
  </div>
)

const DashboardError = ({ error, onRetry }) => (
  <div className="max-w-6xl mx-auto py-20 px-4 flex flex-col items-center text-center">
    <AlertCircle className="w-10 h-10 text-rose-400 mb-4" />
    <h2 className="text-lg font-semibold text-base-content mb-1">Could not load your dashboard</h2>
    <p className="text-sm text-base-content/40 mb-6 max-w-sm">{error?.response?.data?.message || error?.message || 'Something went wrong.'}</p>
    <button onClick={onRetry} className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-base-content transition px-4 py-2 rounded-xl border border-base-content/10 hover:bg-base-content/5">
      <RefreshCw className="w-3.5 h-3.5" />
      Try again
    </button>
  </div>
)

const EmptyDashboard = ({ user }) => (
  <div className="max-w-6xl mx-auto py-10 px-4">
    <motion.div initial="hidden" animate="visible" variants={containerVariant} className="space-y-8">
      <motion.div variants={itemVariant}>
        <h1 className="text-2xl font-semibold text-base-content">Welcome, {user?.displayName || 'there'}</h1>
        <p className="text-sm text-base-content/40 mt-1">Start using CareerForge to see your readiness data here</p>
      </motion.div>
      <motion.div variants={itemVariant} className="rounded-2xl border border-base-content/8 bg-base-300/50 p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-base-content/5 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-5 h-5 text-base-content/30" />
        </div>
        <h2 className="text-base font-semibold text-base-content mb-2">Your dashboard is empty</h2>
        <p className="text-sm text-base-content/40 mb-6 max-w-xs mx-auto">Analyze a CV, build a roadmap, or take a quiz. Your metrics will appear here.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/dashboard/analyses', icon: Search, label: 'Analyze your CV' },
            { href: '/dashboard/roadmaps', icon: Map, label: 'Start a roadmap' },
            { href: '/dashboard/interview', icon: BookOpen, label: 'Practice interviews' },
          ].map(({ href, icon: Icon, label }) => (
            <button key={href} onClick={() => window.location.href = href}
              className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-base-content px-4 py-2 rounded-xl border border-base-content/10 hover:bg-base-content/5 transition">
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  </div>
)

const UserDashboardHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { analytics, history, quizStats, isLoading, isError, error } = useDashboardData()

  if (isLoading) return <DashboardSkeleton />
  if (isError) return <DashboardError error={error} onRetry={() => window.location.reload()} />

  const { content, streak, usage, subscription } = analytics || {}
  const totalContent = (content?.totalCvs || 0) + (content?.totalAnalyses || 0) + (content?.totalRoadmaps || 0) + (content?.totalQuizAttempts || 0)

  if (totalContent === 0) return <EmptyDashboard user={user} />

  const isPremium = subscription?.plan === 'premium'

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <motion.div initial="hidden" animate="visible" variants={containerVariant} className="space-y-10">

        <motion.div variants={itemVariant} className="flex items-start gap-6 flex-wrap">
          <ScoreRing score={analytics?.readinessScore ?? 0} />

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-lg font-semibold text-base-content tracking-tight">
                  Welcome back{user?.displayName ? `, ${user.displayName}` : ''}
                </h1>
                <p className="text-sm text-base-content/35 mt-0.5">Your readiness at a glance</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${isPremium ? 'bg-amber-500/10 text-amber-400' : 'bg-base-content/5 text-base-content/35'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPremium ? 'bg-amber-400' : 'bg-base-content/20'}`} />
                {subscription?.plan || 'free'}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 mt-5">
              {[
                { label: 'CVs', value: content?.totalCvs ?? 0 },
                { label: 'Analyses', value: content?.totalAnalyses ?? 0 },
                { label: 'Roadmaps', value: content?.totalRoadmaps ?? 0 },
                { label: 'Quiz Acc.', value: content?.quizAccuracy != null ? `${content.quizAccuracy}%` : '-' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="font-mono text-sm font-semibold text-base-content">{value}</span>
                  <span className="text-[10px] text-base-content/30 tracking-wider uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariant} className="rounded-2xl border border-base-content/8 bg-base-300/50 p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Briefcase className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-base-content">Explore remote roles</p>
              <p className="text-xs text-base-content/40">Search live software jobs for your target role</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/jobs')}
            className="flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-base-content px-4 py-2 rounded-xl border border-base-content/10 hover:bg-base-content/5 transition"
          >
            Find jobs for my role
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div variants={itemVariant} className="lg:col-span-3 rounded-2xl border border-base-content/8 bg-base-300/50 p-6">
            <SectionHeader icon={({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>}>Content distribution</SectionHeader>
            <ContentDoughnutChart content={content} />
          </motion.div>

          <motion.div variants={itemVariant} className="lg:col-span-2 rounded-2xl border border-base-content/8 bg-base-300/50 p-6 flex flex-col justify-center">
            <SectionHeader icon={Flame}>Streak</SectionHeader>
            <StreakGauge current={streak?.current || 0} longest={streak?.longest || 0} />
            <p className="text-[11px] text-center text-base-content/25 mt-3">
              {streak?.lastActive ? `Last active ${formatDate(streak.lastActive)}` : 'Start your streak'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariant} className="rounded-2xl border border-base-content/8 bg-base-300/50 p-6">
            <SectionHeader icon={({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M18 9v6"/><path d="M12 6v9"/><path d="M6 12v3"/></svg>}>Monthly credits</SectionHeader>
            <MonthlyUsageBar usage={usage} />
          </motion.div>

          <motion.div variants={itemVariant} className="rounded-2xl border border-base-content/8 bg-base-300/50 p-6">
            <SectionHeader icon={({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}>Performance</SectionHeader>
            <PerformanceRadar analytics={analytics} quizStats={quizStats} />
          </motion.div>
        </div>

        <motion.div variants={itemVariant} className="rounded-2xl border border-base-content/8 bg-base-300/50 p-6">
          <SectionHeader icon={TrendingUp}>Readiness trend</SectionHeader>
          <ReadinessTrendLine history={history} />
        </motion.div>

      </motion.div>
    </div>
  )
}

export default UserDashboardHome
