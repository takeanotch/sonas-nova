// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, ComposedChart
} from 'recharts';
import {
  FaArrowLeft, FaChartBar, FaChartPie, FaChartLine,
  FaCalendarAlt, FaSpinner, FaExclamationTriangle,
  FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle,
  FaClipboardList, FaMoneyBillWave, FaUserTie, FaUsers,
  FaBuilding, FaHandshake, FaTrophy, FaBan, FaSearch,
  FaFilter, FaDownload
} from 'react-icons/fa';

// ==================== TYPES ====================

type DashboardStats = {
  total_sinistres: number;
  en_attente: number;
  en_cours: number;
  expertise: number;
  en_indemnisation: number;
  cloture: number;
  refuse: number;
  montant_total_estime: number;
  montant_total_indemnisation: number;
  taux_cloture: number;
  temps_moyen_traitement: number;
  total_assures: number;
  total_experts: number;
  total_souscriptions_actives: number;
};

type MonthlyStats = {
  mois: string;
  declarations: number;
  clotures: number;
  refus: number;
  montant_estime: number;
  montant_indemnisation: number;
};

type TypeDistribution = {
  name: string;
  value: number;
  label: string;
};

type AgentPerformance = {
  nom: string;
  dossiers_traites: number;
  dossiers_en_cours: number;
  taux_cloture: number;
  temps_moyen: number;
};

type ExpertPerformance = {
  nom: string;
  expertises_realisees: number;
  expertises_en_cours: number;
  montant_moyen_evalue: number;
};

// ==================== CONSTANTES ====================

const COLORS = ['#3B82F6', '#F59E0B', '#8B5CF6', '#6366F1', '#10B981', '#EF4444', '#EC4899', '#F97316'];

const STATUT_COLORS: Record<string, string> = {
  en_attente: '#F59E0B',
  en_cours: '#3B82F6',
  expertise: '#8B5CF6',
  en_indemnisation: '#6366F1',
  cloture: '#10B981',
  refuse: '#EF4444',
};

const STATUT_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  expertise: 'En expertise',
  en_indemnisation: 'En indemnisation',
  cloture: 'Clôturé',
  refuse: 'Refusé',
};

const TYPES_LABELS: Record<string, string> = {
  accident_auto: 'Accident auto',
  vol: 'Vol',
  incendie: 'Incendie',
  degats_eau: 'Dégâts eau',
  catastrophe_naturelle: 'Catastrophe naturelle',
  bris_glace: 'Bris de glace',
  responsabilite_civile: 'Responsabilité civile',
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

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle, trend }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2.5 rounded-lg ${bgColor}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      {trend && (
        <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '↑' : '↓'} {trend.value}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
    {subtitle && (
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    )}
  </div>
);

const PerformanceTable = ({ agents }: { agents: AgentPerformance[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-2 font-medium text-gray-500">Agent</th>
          <th className="text-center py-3 px-2 font-medium text-gray-500">Dossiers traités</th>
          <th className="text-center py-3 px-2 font-medium text-gray-500">En cours</th>
          <th className="text-center py-3 px-2 font-medium text-gray-500">Taux clôture</th>
          <th className="text-center py-3 px-2 font-medium text-gray-500">Temps moyen</th>
        </tr>
      </thead>
      <tbody>
        {agents.map((agent, index) => (
          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 px-2 font-medium text-gray-900">{agent.nom}</td>
            <td className="py-3 px-2 text-center text-gray-700">{agent.dossiers_traites}</td>
            <td className="py-3 px-2 text-center text-gray-700">{agent.dossiers_en_cours}</td>
            <td className="py-3 px-2 text-center">
              <div className="flex items-center justify-center">
                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${agent.taux_cloture}%` }}
                  />
                </div>
                <span className="text-gray-700">{agent.taux_cloture}%</span>
              </div>
            </td>
            <td className="py-3 px-2 text-center text-gray-700">{agent.temps_moyen}j</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ==================== PAGE PRINCIPALE ====================

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'6m' | '12m'>('6m');
  
  const [stats, setStats] = useState<DashboardStats>({
    total_sinistres: 0,
    en_attente: 0,
    en_cours: 0,
    expertise: 0,
    en_indemnisation: 0,
    cloture: 0,
    refuse: 0,
    montant_total_estime: 0,
    montant_total_indemnisation: 0,
    taux_cloture: 0,
    temps_moyen_traitement: 0,
    total_assures: 0,
    total_experts: 0,
    total_souscriptions_actives: 0,
  });

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [expertPerformance, setExpertPerformance] = useState<ExpertPerformance[]>([]);
  const [recentSinistres, setRecentSinistres] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      chargerDonnees();
    }
  }, [user, period]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      await Promise.all([
        chargerStatsGlobales(),
        chargerStatsMensuelles(),
        chargerDistributionTypes(),
        chargerPerformanceAgents(),
        chargerPerformanceExperts(),
        chargerSinistresRecents(),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


// app/admin/dashboard/page.tsx

const chargerStatsGlobales = async () => {
  // 1. Récupérer les sinistres
  const { data, error } = await supabase
    .from('sinistres')
    .select('id, statut, montant_estime, montant_indemnisation, created_at, updated_at');

  if (error) throw error;

  // 2. Récupérer les indemnisations payées
  const { data: indemnisations, error: indError } = await supabase
    .from('indemnisations')
    .select('sinistre_id, statut, montant_indemnisation')
    .eq('statut', 'payee');

  if (indError) {
    console.error('Erreur chargement indemnisations:', indError);
  }

  // Créer un Set des IDs de sinistres qui ont une indemnisation payée
  const sinistresPayes = new Set(
    (indemnisations || []).map(i => i.sinistre_id)
  );

  console.log('📊 Sinistres avec indemnisation payée:', sinistresPayes.size); // Debug

  const newStats: DashboardStats = {
    total_sinistres: data.length,
    en_attente: 0,
    en_cours: 0,
    expertise: 0,
    en_indemnisation: 0,
    cloture: 0,
    refuse: 0,
    montant_total_estime: 0,
    montant_total_indemnisation: 0,
    taux_cloture: 0,
    temps_moyen_traitement: 0,
    total_assures: 0,
    total_experts: 0,
    total_souscriptions_actives: 0,
  };

  let totalTraitementJours = 0;
  let cloturesCount = 0;

  data.forEach(s => {
    const statut = (s.statut || '').toLowerCase().trim();
    
    // ✅ Si le sinistre a une indemnisation payée, on le considère comme clôturé
    const estPaye = sinistresPayes.has(s.id);
    
    if (estPaye) {
      // Considérer comme clôturé
      newStats.cloture++;
      newStats.montant_total_indemnisation += s.montant_indemnisation || 0;
      
      // Calculer le temps de traitement
      const debut = new Date(s.created_at);
      const fin = new Date(s.updated_at);
      totalTraitementJours += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
      cloturesCount++;
    } else {
      // Comportement normal selon le statut
      if (statut === 'en_attente') newStats.en_attente++;
      else if (statut === 'en_cours') newStats.en_cours++;
      else if (statut === 'expertise') newStats.expertise++;
      else if (statut === 'en_indemnisation') newStats.en_indemnisation++;
      else if (statut === 'cloture') {
        newStats.cloture++;
        const debut = new Date(s.created_at);
        const fin = new Date(s.updated_at);
        totalTraitementJours += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
        cloturesCount++;
      }
      else if (statut === 'refuse') newStats.refuse++;
    }

    newStats.montant_total_estime += s.montant_estime || 0;
    
    // Ajouter l'indemnisation si elle existe (pour les payés, déjà fait)
    if (!estPaye) {
      newStats.montant_total_indemnisation += s.montant_indemnisation || 0;
    }
  });

  console.log('📊 Stats après calcul:', {
    total: newStats.total_sinistres,
    en_attente: newStats.en_attente,
    en_cours: newStats.en_cours,
    expertise: newStats.expertise,
    en_indemnisation: newStats.en_indemnisation,
    cloture: newStats.cloture,
    refuse: newStats.refuse,
  }); // Debug

  newStats.taux_cloture = data.length > 0 ? Math.round((newStats.cloture / data.length) * 100) : 0;
  newStats.temps_moyen_traitement = cloturesCount > 0 ? Math.round(totalTraitementJours / cloturesCount) : 0;

  // Stats complémentaires
  try {
    const [souscriptionsRes, assuresRes, expertsRes] = await Promise.all([
      supabase.from('souscriptions').select('statut'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'assure'),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'expert'),
    ]);

    if (!souscriptionsRes.error && souscriptionsRes.data) {
      const statutsActifs = ['active', 'actif'];
      newStats.total_souscriptions_actives = souscriptionsRes.data.filter(
        s => statutsActifs.includes((s.statut || '').toLowerCase())
      ).length;
    }

    if (!assuresRes.error) {
      newStats.total_assures = assuresRes.count || 0;
    }

    if (!expertsRes.error) {
      newStats.total_experts = expertsRes.count || 0;
    }
  } catch (err) {
    console.error('Erreur chargement stats complémentaires:', err);
  }

  setStats(newStats);
};

  const chargerStatsMensuelles = async () => {
    const monthsAgo = period === '6m' ? 6 : 12;
    const startDate = subMonths(new Date(), monthsAgo);

    const { data, error } = await supabase
      .from('sinistres')
      .select('created_at, statut, montant_estime, montant_indemnisation')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const monthlyMap = new Map<string, MonthlyStats>();

    // Initialiser les mois
    for (let i = monthsAgo; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, 'yyyy-MM');
      monthlyMap.set(key, {
        mois: format(date, 'MMM yyyy', { locale: fr }),
        declarations: 0,
        clotures: 0,
        refus: 0,
        montant_estime: 0,
        montant_indemnisation: 0,
      });
    }

    data.forEach(s => {
      const key = format(new Date(s.created_at), 'yyyy-MM');
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.declarations++;
        existing.montant_estime += s.montant_estime || 0;
        if (s.statut === 'cloture') {
          existing.clotures++;
          existing.montant_indemnisation += s.montant_indemnisation || 0;
        }
        if (s.statut === 'refuse') {
          existing.refus++;
        }
      }
    });

    setMonthlyStats(Array.from(monthlyMap.values()));
  };

  const chargerDistributionTypes = async () => {
    const { data, error } = await supabase
      .from('sinistres')
      .select('type_sinistre');

    if (error) throw error;

    const typeMap = new Map<string, number>();
    data.forEach(s => {
      typeMap.set(s.type_sinistre, (typeMap.get(s.type_sinistre) || 0) + 1);
    });

    const distribution = Array.from(typeMap.entries()).map(([name, value]) => ({
      name,
      value,
      label: TYPES_LABELS[name] || name,
    }));

    setTypeDistribution(distribution);
  };

  const chargerPerformanceAgents = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, nom')
      .in('role', ['agent', 'admin']);

    if (error || !data) return;

    const performances: AgentPerformance[] = [];

    for (const agent of data) {
      const { data: sinistres, error: sinError } = await supabase
        .from('sinistres')
        .select('statut, created_at, updated_at')
        .eq('updated_by', agent.id);

      if (sinError || !sinistres) continue;

      const traites = sinistres.filter(s => s.statut === 'cloture' || s.statut === 'refuse');
      const enCours = sinistres.filter(s => !['cloture', 'refuse'].includes(s.statut));

      let tempsMoyen = 0;
      if (traites.length > 0) {
        const totalJours = traites.reduce((acc, s) => {
          const debut = new Date(s.created_at);
          const fin = new Date(s.updated_at);
          return acc + (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
        }, 0);
        tempsMoyen = Math.round(totalJours / traites.length);
      }

      performances.push({
        nom: agent.nom,
        dossiers_traites: traites.length,
        dossiers_en_cours: enCours.length,
        taux_cloture: sinistres.length > 0 ? Math.round((traites.length / sinistres.length) * 100) : 0,
        temps_moyen: tempsMoyen,
      });
    }

    setAgentPerformance(performances.sort((a, b) => b.dossiers_traites - a.dossiers_traites));
  };

  const chargerPerformanceExperts = async () => {
    const { data: experts, error: expError } = await supabase
      .from('users')
      .select('id, nom')
      .eq('role', 'expert');

    if (expError || !experts) return;

    const performances: ExpertPerformance[] = [];

    for (const expert of experts) {
      const { data: expertises, error: exError } = await supabase
        .from('expertises')
        .select('statut, montant_evalue')
        .eq('expert_id', expert.id);

      if (exError || !expertises) continue;

      const realisees = expertises.filter(e => e.statut === 'terminee');
      const enCours = expertises.filter(e => e.statut !== 'terminee');
      const montantMoyen = realisees.length > 0
        ? Math.round(realisees.reduce((acc, e) => acc + (e.montant_evalue || 0), 0) / realisees.length)
        : 0;

      performances.push({
        nom: expert.nom,
        expertises_realisees: realisees.length,
        expertises_en_cours: enCours.length,
        montant_moyen_evalue: montantMoyen,
      });
    }

    setExpertPerformance(performances.sort((a, b) => b.expertises_realisees - a.expertises_realisees));
  };

  const chargerSinistresRecents = async () => {
    const { data, error } = await supabase
      .from('sinistres')
      .select('id, numero_dossier, type_sinistre, statut, montant_estime, created_at, assure:users!sinistres_assure_id_fkey(nom)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setRecentSinistres(data);
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      maximumFractionDigits: 0,
    }).format(montant);
  };

  const statutPieData = Object.entries(STATUT_LABELS).map(([key, label]) => ({
    name: label,
    value: (stats as any)[key] || 0,
    color: STATUT_COLORS[key],
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link href="/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Retour aux sinistres
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de l'activité sinistres
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as '6m' | '12m')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="6m">6 derniers mois</option>
                <option value="12m">12 derniers mois</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                <FaDownload className="mr-2 h-4 w-4" />
                Exporter
              </button>
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

        {/* KPIs Principaux */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            title="Total sinistres"
            value={stats.total_sinistres}
            icon={FaFileAlt}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="En cours"
            value={stats.en_cours + stats.expertise + stats.en_indemnisation}
            icon={FaClipboardList}
            color="text-purple-600"
            bgColor="bg-purple-50"
            subtitle={`${stats.en_attente} en attente`}
          />
          <StatCard
            title="Clôturés"
            value={stats.cloture}
            icon={FaCheckCircle}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle={`${stats.taux_cloture}% de clôture`}
          />
          <StatCard
            title="Refusés"
            value={stats.refuse}
            icon={FaBan}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <StatCard
            title="Montant estimé"
            value={formatMontant(stats.montant_total_estime)}
            icon={FaMoneyBillWave}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Délai moyen"
            value={`${stats.temps_moyen_traitement}j`}
            icon={FaClock}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
            subtitle="Temps de traitement"
          />
        </div>

        {/* Stats secondaires */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            title="Assurés"
            value={stats.total_assures}
            icon={FaUsers}
            color="text-cyan-600"
            bgColor="bg-cyan-50"
          />
          <StatCard
            title="Souscriptions actives"
            value={stats.total_souscriptions_actives}
            icon={FaHandshake}
            color="text-teal-600"
            bgColor="bg-teal-50"
          />
          <StatCard
            title="Experts"
            value={stats.total_experts}
            icon={FaUserTie}
            color="text-violet-600"
            bgColor="bg-violet-50"
          />
          <StatCard
            title="Indemnisations"
            value={formatMontant(stats.montant_total_indemnisation)}
            icon={FaTrophy}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Évolution temporelle */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-blue-500" />
              Évolution mensuelle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="declarations" name="Déclarations" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="clotures" name="Clôtures" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
                <Line yAxisId="left" type="monotone" dataKey="refus" name="Refus" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                <Area yAxisId="right" type="monotone" dataKey="montant_estime" name="Montant estimé" fill="#F97316" fillOpacity={0.1} stroke="#F97316" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par statut */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartPie className="mr-2 h-5 w-5 text-purple-500" />
              Répartition par statut
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutPieData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statutPieData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Distribution par type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartBar className="mr-2 h-5 w-5 text-indigo-500" />
              Distribution par type de sinistre
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Nombre" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance des agents */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUserTie className="mr-2 h-5 w-5 text-green-500" />
              Performance des agents
            </h3>
            {agentPerformance.length > 0 ? (
              <PerformanceTable agents={agentPerformance} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Experts et Derniers sinistres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance des experts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUserTie className="mr-2 h-5 w-5 text-purple-500" />
              Performance des experts
            </h3>
            {expertPerformance.length > 0 ? (
              <div className="space-y-3">
                {expertPerformance.map((expert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{expert.nom}</p>
                      <p className="text-xs text-gray-500">
                        {expert.expertises_realisees} expertise{expert.expertises_realisees > 1 ? 's' : ''} réalisée{expert.expertises_realisees > 1 ? 's' : ''}
                        {expert.expertises_en_cours > 0 && ` • ${expert.expertises_en_cours} en cours`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-600">
                        {formatMontant(expert.montant_moyen_evalue)}
                      </p>
                      <p className="text-xs text-gray-500">montant moyen évalué</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
            )}
          </div>

          {/* Derniers sinistres */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaFileAlt className="mr-2 h-5 w-5 text-blue-500" />
              Derniers sinistres
            </h3>
            {recentSinistres.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {recentSinistres.map(sinistre => (
                  <Link
                    key={sinistre.id}
                    href={`/agent/sinistres/${sinistre.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 flex-shrink-0`}
                          style={{ backgroundColor: STATUT_COLORS[sinistre.statut] || '#9CA3AF' }}
                        />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {sinistre.numero_dossier}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {sinistre.assure?.nom || 'Assuré'} • {TYPES_LABELS[sinistre.type_sinistre] || sinistre.type_sinistre}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(sinistre.created_at), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-12">Aucun sinistre</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}