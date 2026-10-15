'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, Zap, BarChart2, ArrowLeftRight, ListOrdered, Trophy, Activity, Crown } from 'lucide-react'
import { clsx } from 'clsx'
import { Logo } from '@/components/ui/Logo'

const NAV_ITEMS = [
  { href: '/', label: 'Matchs', icon: TrendingUp },
  { href: '/top-bets', label: 'Top Paris', icon: Crown },
  { href: '/tournaments', label: 'Tournois', icon: Trophy },
  { href: '/value-bets', label: 'Value Bets', icon: Zap },
  { href: '/streaks', label: 'Séries', icon: BarChart2 },
  { href: '/atp-rankings', label: 'Classement ATP', icon: ListOrdered },
  { href: '/elo-rankings', label: 'Classement Elo', icon: Activity },
  { href: '/compare', label: 'Comparaison', icon: ArrowLeftRight },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5 font-bold text-slate-100">
          <Logo size={34} animate className="text-slate-300 group-hover:text-slate-100 transition-colors" />
          <span className="hidden sm:block tracking-tight">
            Tennis<span className="text-ball-300"> Analytics</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === href
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:block">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
