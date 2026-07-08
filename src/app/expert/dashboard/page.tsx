// app/expert/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import {
  FaArrowLeft, FaChartBar, FaChartPie, FaChartLine,
  FaSpinner, FaExclamationTriangle, FaClipboardList,
  FaCheckCircle, FaCalendarAlt, FaMoneyBillWave,
  FaUser, FaClock
} from 'react-icons/fa';

// ==================== TYPES ====================

type ExpertStats = {
  total_missions: number;
  planifiees: number;
  en_cours: number;
  terminees: number;
  montant_total_evalue: number;
  montant_moyen_evalue: number;
  taux_completion: number;
  delai_moyen: number;
};

type MonthlyMission = {
  mois: string;
  missions_recues: number;
  missions_terminees: number;
  montant_evalue: number;
};

type TypeDistribution = {
  name: string;
  value: number;
  label: string;
};

type RecentMission = {
  id: string;
  sinistre_id: string;
  sinistre_numero: string;
  sinistre_type: string;
  assure_nom: string;
  date_expertise: string;
  statut: string;
  montant_evalue: number;
};

// ==================== CONSTANTES ====================

const STATUT_COLORS: Record<string, string> = {
  planifiee: '#F59E0B',
  en_cours: '#3B82F6',
  terminee: '#10B981',
};

const STATUT_LABELS: Record<string, string> = {
  planifiee: 'Planifiées',
  en_cours: 'En cours',
  terminee: 'Terminées',
};

const TYPES_LABELS: Record<string, string> = {
  accident_auto: 'Accident auto',
  vol: 'Vol',
  incendie: 'Incendie',
  degats_eau: 'Dégâts eau',
  catastrophe_naturelle: 'Catastrophe',
  bris_glace: 'Bris de glace',
  responsabilite_civile: 'Resp. civile',
  autre: 'Autre',
};

// ==================== COMPOSANTS ====================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.stroke }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  subtitle?: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2.5 rounded-lg ${bgColor}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
    {subtitle && (
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    )}
  </div>
);

// ==================== PAGE PRINCIPALE ====================

export default function ExpertDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<ExpertStats>({
    total_missions: 0,
    planifiees: 0,
    en_cours: 0,
    terminees: 0,
    montant_total_evalue: 0,
    montant_moyen_evalue: 0,
    taux_completion: 0,
    delai_moyen: 0,
  });

  const [monthlyMissions, setMonthlyMissions] = useState<MonthlyMission[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([]);
  const [recentMissions, setRecentMissions] = useState<RecentMission[]>([]);

  useEffect(() => {
    if (user && user.role === 'expert') {
      chargerDonnees();
    }
  }, [user]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      await Promise.all([
        chargerStats(),
        chargerMissionsMensuelles(),
        chargerDistributionTypes(),
        chargerMissionsRecentes(),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chargerStats = async () => {
    const { data, error } = await supabase
      .from('expertises')
      .select('statut, montant_evalue, date_designation, date_expertise, created_at')
      .eq('expert_id', user?.id);

    if (error) throw error;

    const newStats: ExpertStats = {
      total_missions: data.length,
      planifiees: 0,
      en_cours: 0,
      terminees: 0,
      montant_total_evalue: 0,
      montant_moyen_evalue: 0,
      taux_completion: 0,
      delai_moyen: 0,
    };

    let totalDelai = 0;
    let delaiCount = 0;

    data.forEach(m => {
      if (m.statut === 'planifiee') newStats.planifiees++;
      else if (m.statut === 'en_cours') newStats.en_cours++;
      else if (m.statut === 'terminee') {
        newStats.terminees++;
        newStats.montant_total_evalue += m.montant_evalue || 0;

        if (m.date_designation && m.date_expertise) {
          const debut = new Date(m.date_designation);
          const fin = new Date(m.date_expertise);
          totalDelai += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
          delaiCount++;
        }
      }
    });

    newStats.taux_completion = data.length > 0 
      ? Math.round((newStats.terminees / data.length) * 100) 
      : 0;
    
    newStats.montant_moyen_evalue = newStats.terminees > 0 
      ? Math.round(newStats.montant_total_evalue / newStats.terminees) 
      : 0;
    
    newStats.delai_moyen = delaiCount > 0 
      ? Math.round(totalDelai / delaiCount) 
      : 0;

    setStats(newStats);
  };

  const chargerMissionsMensuelles = async () => {
    const sixMonthsAgo = subMonths(new Date(), 6);

    const { data, error } = await supabase
      .from('expertises')
      .select('created_at, statut, montant_evalue')
      .eq('expert_id', user?.id)
      .gte('created_at', sixMonthsAgo.toISOString());

    if (error) throw error;

    const monthlyMap = new Map<string, MonthlyMission>();

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, 'yyyy-MM');
      monthlyMap.set(key, {
        mois: format(date, 'MMM yyyy', { locale: fr }),
        missions_recues: 0,
        missions_terminees: 0,
        montant_evalue: 0,
      });
    }

    data.forEach(m => {
      const key = format(new Date(m.created_at), 'yyyy-MM');
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.missions_recues++;
        if (m.statut === 'terminee') {
          existing.missions_terminees++;
          existing.montant_evalue += m.montant_evalue || 0;
        }
      }
    });

    setMonthlyMissions(Array.from(monthlyMap.values()));
  };

  const chargerDistributionTypes = async () => {
    // ✅ CORRECTION : Charger sans jointure, puis récupérer les types manuellement
    const { data: expertises, error } = await supabase
      .from('expertises')
      .select('sinistre_id')
      .eq('expert_id', user?.id);

    if (error || !expertises) return;

    // Récupérer tous les IDs de sinistres
    const sinistreIds = expertises.map(e => e.sinistre_id);

    if (sinistreIds.length === 0) return;

    // Charger les types de sinistres séparément
    const { data: sinistres } = await supabase
      .from('sinistres')
      .select('id, type_sinistre')
      .in('id', sinistreIds);

    if (!sinistres) return;

    // Créer un map id -> type_sinistre
    const typeMap2 = new Map<string, string>();
    sinistres.forEach(s => {
      typeMap2.set(s.id, s.type_sinistre);
    });

    // Compter par type
    const typeCount = new Map<string, number>();
    expertises.forEach(e => {
      const type = typeMap2.get(e.sinistre_id) || 'autre';
      typeCount.set(type, (typeCount.get(type) || 0) + 1);
    });

    const distribution = Array.from(typeCount.entries()).map(([name, value]) => ({
      name,
      value,
      label: TYPES_LABELS[name] || name,
    }));

    setTypeDistribution(distribution);
  };

  const chargerMissionsRecentes = async () => {
    // ✅ CORRECTION : Charger les expertises sans jointure
    const { data: expertises, error } = await supabase
      .from('expertises')
      .select('id, sinistre_id, statut, montant_evalue, date_expertise')
      .eq('expert_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !expertises || expertises.length === 0) return;

    // Récupérer les IDs de sinistres
    const sinistreIds = [...new Set(expertises.map(e => e.sinistre_id))];

    // Charger les sinistres séparément
    const { data: sinistres } = await supabase
      .from('sinistres')
      .select('id, numero_dossier, type_sinistre, assure_id')
      .in('id', sinistreIds);

    if (!sinistres) return;

    // Créer un map sinistre_id -> sinistre
    const sinistreMap = new Map();
    sinistres.forEach(s => {
      sinistreMap.set(s.id, s);
    });

    // Récupérer les IDs des assurés
    const assureIds = [...new Set(sinistres.map(s => s.assure_id))];

    // Charger les assurés séparément
    const { data: assures } = await supabase
      .from('users')
      .select('id, nom')
      .in('id', assureIds);

    // Créer un map assure_id -> assure
    const assureMap = new Map();
    if (assures) {
      assures.forEach(a => {
        assureMap.set(a.id, a);
      });
    }

    // Formater les missions
    const formatted = expertises.map(e => {
      const sinistre = sinistreMap.get(e.sinistre_id);
      const assure = sinistre ? assureMap.get(sinistre.assure_id) : null;

      return {
        id: e.id,
        sinistre_id: e.sinistre_id,
        sinistre_numero: sinistre?.numero_dossier || 'N/A',
        sinistre_type: sinistre?.type_sinistre || 'Inconnu',
        assure_nom: assure?.nom || 'Inconnu',
        date_expertise: e.date_expertise || '',
        statut: e.statut || 'planifiee',
        montant_evalue: e.montant_evalue || 0,
      };
    });

    setRecentMissions(formatted);
  };

  const formatMontant = (montant: number) => {
    if (!montant || montant === 0) return '0 CDF';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      maximumFractionDigits: 0,
    }).format(montant);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non définie';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statutPieData = Object.entries(STATUT_LABELS).map(([key, label]) => ({
    name: label,
    value: (stats as any)[key] || 0,
    color: STATUT_COLORS[key],
  }));

  if (user?.role !== 'expert') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Accès non autorisé</h3>
          <p className="text-sm text-gray-500">Cette page est réservée aux experts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="mx-auto h-12 w-12 text-purple-500 animate-spin" />
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/expert/missions" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Retour aux missions
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord Expert</h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de votre activité d'expertise
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <FaExclamationTriangle className="text-red-400 mr-3 h-5 w-5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            title="Total missions"
            value={stats.total_missions}
            icon={FaClipboardList}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Planifiées"
            value={stats.planifiees}
            icon={FaCalendarAlt}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            title="En cours"
            value={stats.en_cours}
            icon={FaSpinner}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Terminées"
            value={stats.terminees}
            icon={FaCheckCircle}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle={`${stats.taux_completion}% de complétion`}
          />
          <StatCard
            title="Montant moyen"
            value={formatMontant(stats.montant_moyen_evalue)}
            icon={FaMoneyBillWave}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Délai moyen"
            value={`${stats.delai_moyen}j`}
            icon={FaClock}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
            subtitle="Désignation → Expertise"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-purple-500" />
              Évolution mensuelle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyMissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="missions_recues" name="Missions reçues" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="missions_terminees" name="Missions terminées" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartPie className="mr-2 h-5 w-5 text-purple-500" />
              Répartition par statut
            </h3>
            {stats.total_missions > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statutPieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statutPieData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Aucune mission</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartBar className="mr-2 h-5 w-5 text-purple-500" />
              Types de sinistres expertisés
            </h3>
            {typeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Nombre" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Aucune donnée</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaClipboardList className="mr-2 h-5 w-5 text-purple-500" />
              Missions récentes
            </h3>
            {recentMissions.length > 0 ? (
              <div className="space-y-3">
                {recentMissions.map(mission => (
                  <Link
                    key={mission.id}
                    href={`/expert/sinistres/${mission.sinistre_id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                          style={{ backgroundColor: STATUT_COLORS[mission.statut] || '#9CA3AF' }}
                        />
                        <p className="text-sm font-medium text-gray-900 truncate">{mission.sinistre_numero}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {mission.assure_nom} • {TYPES_LABELS[mission.sinistre_type] || mission.sinistre_type}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {mission.montant_evalue > 0 ? formatMontant(mission.montant_evalue) : '-'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(mission.date_expertise)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Aucune mission</p>
              </div>
            )}
          </div>
        </div>

        {/* Barre de progression */}
        {stats.total_missions > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Progression globale</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              {Object.entries(STATUT_COLORS).map(([key, color]) => {
                const count = (stats as any)[key] || 0;
                const percentage = (count / stats.total_missions) * 100;
                return percentage > 0 ? (
                  <div key={key} className="h-full float-left"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    title={`${STATUT_LABELS[key]}: ${count}`}
                  />
                ) : null;
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {Object.entries(STATUT_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: STATUT_COLORS[key] }} />
                  <span className="text-gray-600">{label}: {(stats as any)[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}