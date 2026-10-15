import { ExternalLink, Database, Github, Globe } from 'lucide-react'

interface Source {
  name: string
  url: string
  license: string
  used_for: string[]
  description: string
  icon: 'db' | 'github' | 'web'
}

const SOURCES: Source[] = [
  {
    name: 'Tennis Abstract',
    url: 'https://tennisabstract.com/',
    license: 'CC BY-NC-SA 4.0',
    icon: 'web',
    description:
      'Site de référence pour l\'analyse statistique du tennis, créé par Jeff Sackmann. Publie quotidiennement les classements Elo (global et par surface), les prédictions de tournois et de nombreux rapports analytiques.',
    used_for: [
      'Page « Tournois en cours » — calendrier ATP/WTA/Challenger avec favoris',
      'Page « Classement Elo » — Elo global + par surface (hard/clay/grass) pour 500+ joueurs et 540+ joueuses',
      'Peak Elo, dates de pic, classement officiel',
    ],
  },
  {
    name: 'JeffSackmann/tennis_atp & tennis_wta (GitHub)',
    url: 'https://github.com/JeffSackmann',
    license: 'MIT License',
    icon: 'github',
    description:
      'Datasets open source maintenus par Jeff Sackmann depuis 1968. Source de référence utilisée par la communauté tennis pour les recherches statistiques. Mis à jour régulièrement.',
    used_for: [
      'Historique complet des matchs ATP/WTA depuis 2020 (~207 000 matchs)',
      '49 colonnes de stats par match : aces, breaks, % de service, durée, etc.',
      '~3 millions de snapshots de classement hebdomadaires',
      'Bios joueurs : DOB, taille, main dominante, pays, lien Wikidata',
    ],
  },
  {
    name: 'ATP Tour officiel',
    url: 'https://www.atptour.com/',
    license: 'Données publiques (atptour.com)',
    icon: 'web',
    description:
      'Site officiel du circuit ATP. Source utilisée pour le classement officiel actuel du Top 100 masculin (mise à jour hebdomadaire le lundi).',
    used_for: [
      'Page « Classement ATP » — Top 100 actuel avec points et profils officiels',
    ],
  },
]

const ICON_MAP = {
  db: Database,
  github: Github,
  web: Globe,
}

export default function SourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Sources de données</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Toutes les analyses présentées sur ce site reposent sur des sources publiques, gratuites et licites.
          Chaque source est créditée selon les termes de sa licence. Aucune donnée n'est obtenue par des moyens
          contraires aux conditions d'utilisation des sites concernés.
        </p>
      </div>

      {/* Sources list */}
      <div className="space-y-4 mb-10">
        {SOURCES.map(src => {
          const Icon = ICON_MAP[src.icon]
          return (
            <div key={src.name} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <h2 className="font-semibold text-slate-100">{src.name}</h2>
                    <span className="badge text-slate-400 bg-slate-800 border-slate-700 font-mono text-[10px]">
                      {src.license}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-3"
                  >
                    {src.url} <ExternalLink size={11} />
                  </a>
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed">{src.description}</p>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Utilisé pour</p>
                    <ul className="space-y-1">
                      {src.used_for.map((u, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-slate-600 mt-0.5">•</span>
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* License notice */}
      <div className="card p-5 bg-amber-950/30 border-amber-900/40">
        <h3 className="font-semibold text-amber-300 mb-2 text-sm">À propos de la licence CC BY-NC-SA 4.0</h3>
        <p className="text-xs text-amber-200/80 leading-relaxed">
          Les données issues de Tennis Abstract sont distribuées sous{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-100"
          >
            licence Creative Commons Attribution - Pas d'utilisation commerciale - Partage dans les mêmes conditions 4.0
          </a>
          . Cela implique que toute redistribution doit créditer la source, ne peut servir à des fins commerciales,
          et doit être partagée sous la même licence. Cette application respecte ces termes : crédit visible sur
          chaque page utilisant ces données, usage strictement personnel et analytique.
        </p>
      </div>

      {/* Responsible gambling reminder */}
      <div className="mt-6 text-xs text-slate-500 text-center">
        Les analyses produites à partir de ces données sont fournies à titre statistique uniquement.
        Elles ne garantissent aucun résultat. Les paris sportifs comportent un risque de perte financière.
      </div>
    </div>
  )
}
