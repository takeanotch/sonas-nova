// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
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
  FaFilter, FaDownload, FaFileContract, FaUser,
  FaUserCheck, FaUserShield, FaUserPlus, FaChevronRight,
  FaEye, FaEdit, FaTrash, FaPlus, FaStar, FaStarHalfAlt
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
  total_agents: number;
  total_admins: number;
  total_souscriptions_actives: number;
  taux_souscription: number;
};

type MonthlyStats = {
  mois: string;
  declarations: number;
  clotures: number;
  refus: number;
  montant_estime: number;
  montant_indemnisation: number;
  souscriptions: number;
};

type TypeDistribution = {
  name: string;
  value: number;
  label: string;
  color: string;
};

type AgentPerformance = {
  id: string;
  nom: string;
  dossiers_traites: number;
  dossiers_en_cours: number;
  taux_cloture: number;
  temps_moyen: number;
  satisfaction?: number;
};

type ExpertPerformance = {
  id: string;
  nom: string;
  expertises_realisees: number;
  expertises_en_cours: number;
  montant_moyen_evalue: number;
  delai_moyen: number;
};

type RecentSinistre = {
  id: string;
  numero_dossier: string;
  type_sinistre: string;
  statut: string;
  montant_estime: number;
  created_at: string;
  assure_nom: string;
};

type TopAssure = {
  id: string;
  nom: string;
  email: string;
  total_sinistres: number;
  total_montant: number;
  nombre_souscriptions: number;
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

const TYPE_COLORS: Record<string, string> = {
  accident_auto: '#3B82F6',
  vol: '#8B5CF6',
  incendie: '#EF4444',
  degats_eau: '#06B6D4',
  catastrophe_naturelle: '#F97316',
  bris_glace: '#EC4899',
  responsabilite_civile: '#10B981',
  autre: '#6B7280',
};

// ==================== COMPOSANTS ====================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 max-w-xs">
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

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle, trend, onClick }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  onClick?: () => void;
}) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}
  >
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

const PerformanceBar = ({ value, label, color, max }: { value: number; label: string; color: string; max: number }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-600 w-16 truncate">{label}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-xs font-medium text-gray-700 w-8 text-right">{value}</span>
  </div>
);

// ==================== PAGE PRINCIPALE ====================

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'6m' | '12m'>('6m');
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'experts' | 'assures'>('overview');
  
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
    total_agents: 0,
    total_admins: 0,
    total_souscriptions_actives: 0,
    taux_souscription: 0,
  });

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [expertPerformance, setExpertPerformance] = useState<ExpertPerformance[]>([]);
  const [recentSinistres, setRecentSinistres] = useState<RecentSinistre[]>([]);
  const [topAssures, setTopAssures] = useState<TopAssure[]>([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
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
        chargerTopAssures(),
      ]);
    } catch (err: any) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // ==================== CHARGEMENT DES DONNÉES ====================

  const chargerStatsGlobales = async () => {
    // 1. Récupérer les sinistres
    const { data: sinistres, error: sinError } = await supabase
      .from('sinistres')
      .select('id, statut, montant_estime, montant_indemnisation, created_at, updated_at');

    if (sinError) throw sinError;

    // 2. Récupérer les indemnisations payées
    const { data: indemnisations, error: indError } = await supabase
      .from('indemnisations')
      .select('sinistre_id, statut, montant_indemnisation')
      .eq('statut', 'payee');

    if (indError) {
      console.error('Erreur chargement indemnisations:', indError);
    }

    const sinistresPayes = new Set(
      (indemnisations || []).map(i => i.sinistre_id)
    );

    const newStats: DashboardStats = {
      total_sinistres: sinistres.length,
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
      total_agents: 0,
      total_admins: 0,
      total_souscriptions_actives: 0,
      taux_souscription: 0,
    };

    let totalTraitementJours = 0;
    let cloturesCount = 0;

    sinistres.forEach(s => {
      const statut = (s.statut || '').toLowerCase().trim();
      
      // Si le sinistre a une indemnisation payée, on le considère comme clôturé
      const estPaye = sinistresPayes.has(s.id);
      
      if (estPaye) {
        newStats.cloture++;
        newStats.montant_total_indemnisation += s.montant_indemnisation || 0;
        
        const debut = new Date(s.created_at);
        const fin = new Date(s.updated_at);
        totalTraitementJours += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
        cloturesCount++;
      } else {
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
      
      if (!estPaye) {
        newStats.montant_total_indemnisation += s.montant_indemnisation || 0;
      }
    });

    newStats.taux_cloture = sinistres.length > 0 ? Math.round((newStats.cloture / sinistres.length) * 100) : 0;
    newStats.temps_moyen_traitement = cloturesCount > 0 ? Math.round(totalTraitementJours / cloturesCount) : 0;

    // Stats des utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, role');

    if (!usersError && users) {
      newStats.total_assures = users.filter(u => u.role === 'assure').length;
      newStats.total_experts = users.filter(u => u.role === 'expert').length;
      newStats.total_agents = users.filter(u => u.role === 'agent').length;
      newStats.total_admins = users.filter(u => u.role === 'admin').length;
    }

    // Stats des souscriptions
    const { data: souscriptions, error: sousError } = await supabase
      .from('souscriptions')
      .select('statut');

    if (!sousError && souscriptions) {
      const actives = souscriptions.filter(s => s.statut === 'active').length;
      newStats.total_souscriptions_actives = actives;
      newStats.taux_souscription = newStats.total_assures > 0 
        ? Math.round((actives / newStats.total_assures) * 100) 
        : 0;
    }

    setStats(newStats);
  };

  const chargerStatsMensuelles = async () => {
    const monthsAgo = period === '6m' ? 6 : 12;
    const startDate = subMonths(new Date(), monthsAgo);

    const { data: sinistres, error: sinError } = await supabase
      .from('sinistres')
      .select('created_at, statut, montant_estime, montant_indemnisation')
      .gte('created_at', startDate.toISOString());

    if (sinError) throw sinError;

    // Récupérer les souscriptions mensuelles
    const { data: souscriptions, error: sousError } = await supabase
      .from('souscriptions')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    if (sousError) throw sousError;

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
        souscriptions: 0,
      });
    }

    sinistres.forEach(s => {
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

    souscriptions.forEach(s => {
      const key = format(new Date(s.created_at), 'yyyy-MM');
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.souscriptions++;
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
      color: TYPE_COLORS[name] || '#6B7280',
    }));

    setTypeDistribution(distribution);
  };

  const chargerPerformanceAgents = async () => {
    const { data: agents, error: agentsError } = await supabase
      .from('users')
      .select('id, nom')
      .in('role', ['agent', 'admin']);

    if (agentsError || !agents) return;

    const performances: AgentPerformance[] = [];

    for (const agent of agents) {
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

      // Satisfaction simulée (à remplacer par des données réelles)
      const satisfaction = 3 + Math.random() * 2;

      performances.push({
        id: agent.id,
        nom: agent.nom,
        dossiers_traites: traites.length,
        dossiers_en_cours: enCours.length,
        taux_cloture: sinistres.length > 0 ? Math.round((traites.length / sinistres.length) * 100) : 0,
        temps_moyen: tempsMoyen,
        satisfaction: Math.round(satisfaction * 10) / 10,
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
        .select('statut, montant_evalue, date_designation, date_expertise')
        .eq('expert_id', expert.id);

      if (exError || !expertises) continue;

      const realisees = expertises.filter(e => e.statut === 'terminee');
      const enCours = expertises.filter(e => e.statut !== 'terminee');
      const montantMoyen = realisees.length > 0
        ? Math.round(realisees.reduce((acc, e) => acc + (e.montant_evalue || 0), 0) / realisees.length)
        : 0;

      // Calcul du délai moyen
      let delaiTotal = 0;
      let delaiCount = 0;
      realisees.forEach(e => {
        if (e.date_designation && e.date_expertise) {
          const debut = new Date(e.date_designation);
          const fin = new Date(e.date_expertise);
          delaiTotal += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
          delaiCount++;
        }
      });

      performances.push({
        id: expert.id,
        nom: expert.nom,
        expertises_realisees: realisees.length,
        expertises_en_cours: enCours.length,
        montant_moyen_evalue: montantMoyen,
        delai_moyen: delaiCount > 0 ? Math.round(delaiTotal / delaiCount) : 0,
      });
    }

    setExpertPerformance(performances.sort((a, b) => b.expertises_realisees - a.expertises_realisees));
  };

// app/admin/dashboard/page.tsx - Partie chargerSinistresRecents

const chargerSinistresRecents = async () => {
  // ✅ CORRECTION : Utiliser la bonne syntaxe de jointure
  const { data, error } = await supabase
    .from('sinistres')
    .select(`
      id, 
      numero_dossier, 
      type_sinistre, 
      statut, 
      montant_estime, 
      created_at,
      assure_id,
      users!sinistres_assure_id_fkey (
        nom
      )
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Erreur chargement sinistres récents:', error);
    return;
  }

  const formatted = (data || []).map((s: any) => {
    // ✅ Correction : extraire le nom du tableau users
    const assureNom = s.users && s.users.length > 0 ? s.users[0].nom : 'Inconnu';
    
    return {
      id: s.id,
      numero_dossier: s.numero_dossier || 'N/A',
      type_sinistre: s.type_sinistre || 'autre',
      statut: s.statut || 'en_attente',
      montant_estime: s.montant_estime || 0,
      created_at: s.created_at,
      assure_nom: assureNom,
    };
  });

  setRecentSinistres(formatted);
};

  const chargerTopAssures = async () => {
    // Récupérer les assurés avec le plus de sinistres
    const { data: assures, error: assuresError } = await supabase
      .from('users')
      .select('id, nom, email')
      .eq('role', 'assure');

    if (assuresError || !assures) return;

    const topAssuresData: TopAssure[] = [];

    for (const assure of assures) {
      // Compter les sinistres
      const { data: sinistres, error: sinError } = await supabase
        .from('sinistres')
        .select('montant_estime')
        .eq('assure_id', assure.id);

      if (sinError || !sinistres) continue;

      // Compter les souscriptions
      const { count: souscriptionsCount, error: sousError } = await supabase
        .from('souscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('assure_id', assure.id)
        .neq('statut', 'resiliee');

      if (sousError) continue;

      const totalMontant = sinistres.reduce((acc, s) => acc + (s.montant_estime || 0), 0);

      topAssuresData.push({
        id: assure.id,
        nom: assure.nom,
        email: assure.email,
        total_sinistres: sinistres.length,
        total_montant: totalMontant,
        nombre_souscriptions: souscriptionsCount || 0,
      });
    }

    setTopAssures(topAssuresData.sort((a, b) => b.total_sinistres - a.total_sinistres).slice(0, 5));
  };

  // ==================== HELPERS ====================

  const formatMontant = (montant: number) => {
    if (!montant) return '0 CDF';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      maximumFractionDigits: 0,
    }).format(montant);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatDateFull = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statutPieData = Object.entries(STATUT_LABELS).map(([key, label]) => ({
    name: label,
    value: (stats as any)[key] || 0,
    color: STATUT_COLORS[key],
  }));

  // ==================== RENDU ====================

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Accès non autorisé</h3>
          <p className="text-sm text-gray-500">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <FaChartBar className="mr-3 h-6 w-6 text-blue-600" />
                Tableau de bord
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de l'activité assurance
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
              <button 
                onClick={() => chargerDonnees()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <FaSpinner className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Rafraîchir
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
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
              <FaTimesCircle className="h-5 w-5" />
            </button>
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
            onClick={() => router.push('/admin/sinistres')}
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
            title="Montant estimé"
            value={formatMontant(stats.montant_total_estime)}
            icon={FaMoneyBillWave}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <StatCard
            title="Assurés"
            value={stats.total_assures}
            icon={FaUsers}
            color="text-cyan-600"
            bgColor="bg-cyan-50"
            subtitle={`${stats.taux_souscription}% souscrits`}
          />
          <StatCard
            title="Délai moyen"
            value={`${stats.temps_moyen_traitement}j`}
            icon={FaClock}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* Stats secondaires */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
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
            icon={FaUserCheck}
            color="text-violet-600"
            bgColor="bg-violet-50"
            onClick={() => router.push('/admin/acteurs?role=expert')}
          />
          <StatCard
            title="Agents"
            value={stats.total_agents}
            icon={FaUserTie}
            color="text-green-600"
            bgColor="bg-green-50"
            onClick={() => router.push('/admin/acteurs?role=agent')}
          />
          <StatCard
            title="Indemnisations"
            value={formatMontant(stats.montant_total_indemnisation)}
            icon={FaTrophy}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
        </div>

        {/* Onglets de navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: FaChartPie },
              { id: 'agents', label: 'Agents', icon: FaUserTie },
              { id: 'experts', label: 'Experts', icon: FaUserCheck },
              { id: 'assures', label: 'Assurés', icon: FaUsers },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 text-sm font-medium flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <>
            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Évolution mensuelle */}
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
                    <Bar yAxisId="left" dataKey="souscriptions" name="Souscriptions" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="clotures" name="Clôtures" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
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
                    <Legend formatter={(value) => <span className="text-sm text-gray-700">{value}</span>} />
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
                    <YAxis dataKey="label" type="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Nombre" fill="#6366F1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                        href={`/admin/sinistres/${sinistre.id}`}
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
                            {sinistre.assure_nom} • {TYPES_LABELS[sinistre.type_sinistre] || sinistre.type_sinistre}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="text-sm font-semibold text-gray-900">
                            {sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : '-'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(sinistre.created_at)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-12">Aucun sinistre récent</p>
                )}
                <div className="mt-3 text-center">
                  <Link href="/admin/sinistres" className="text-sm text-blue-600 hover:text-blue-800">
                    Voir tous les sinistres →
                  </Link>
                </div>
              </div>
            </div>

            {/* Barre de progression globale */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Progression globale</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                {Object.entries(STATUT_COLORS).map(([key, color]) => {
                  const count = (stats as any)[key] || 0;
                  const percentage = stats.total_sinistres > 0 ? (count / stats.total_sinistres) * 100 : 0;
                  return percentage > 0 ? (
                    <div
                      key={key}
                      className="h-full float-left transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      title={`${STATUT_LABELS[key]}: ${count}`}
                    />
                  ) : null;
                })}
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                {Object.entries(STATUT_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center text-xs">
                    <div
                      className="w-3 h-3 rounded-full mr-1.5"
                      style={{ backgroundColor: STATUT_COLORS[key] }}
                    />
                    <span className="text-gray-600">{label}: {(stats as any)[key] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'agents' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaUserTie className="mr-2 h-5 w-5 text-green-500" />
                Performance des agents
              </h3>
              <Link href="/admin/acteurs?role=agent" className="text-sm text-blue-600 hover:text-blue-800">
                Gérer les agents →
              </Link>
            </div>
            {agentPerformance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-3 font-medium text-gray-500">Agent</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-500">Dossiers traités</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-500">En cours</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-500">Taux clôture</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-500">Temps moyen</th>
                      <th className="text-center py-3 px-3 font-medium text-gray-500">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformance.map((agent, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium text-gray-900">{agent.nom}</td>
                        <td className="py-3 px-3 text-center text-gray-700">{agent.dossiers_traites}</td>
                        <td className="py-3 px-3 text-center text-gray-700">{agent.dossiers_en_cours}</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(agent.taux_cloture, 100)}%` }}
                              />
                            </div>
                            <span className="text-gray-700">{agent.taux_cloture}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-700">{agent.temps_moyen}j</td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center text-yellow-500">
                            {[...Array(5)].map((_, i) => {
                              const star = agent.satisfaction || 0;
                              if (i < Math.floor(star)) return <FaStar key={i} className="h-4 w-4" />;
                              if (i < Math.ceil(star)) return <FaStarHalfAlt key={i} className="h-4 w-4" />;
                              return <FaStar key={i} className="h-4 w-4 text-gray-300" />;
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
            )}
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaUserCheck className="mr-2 h-5 w-5 text-purple-500" />
                Performance des experts
              </h3>
              <Link href="/admin/acteurs?role=expert" className="text-sm text-blue-600 hover:text-blue-800">
                Gérer les experts →
              </Link>
            </div>
            {expertPerformance.length > 0 ? (
              <div className="space-y-4">
                {expertPerformance.map((expert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{expert.nom}</p>
                      <p className="text-xs text-gray-500">
                        {expert.expertises_realisees} expertise{expert.expertises_realisees > 1 ? 's' : ''} réalisée{expert.expertises_realisees > 1 ? 's' : ''}
                        {expert.expertises_en_cours > 0 && ` • ${expert.expertises_en_cours} en cours`}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-600">
                          {formatMontant(expert.montant_moyen_evalue)}
                        </p>
                        <p className="text-xs text-gray-500">montant moyen évalué</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">
                          {expert.delai_moyen}j
                        </p>
                        <p className="text-xs text-gray-500">délai moyen</p>
                      </div>
                      <Link 
                        href={`/admin/experts/${expert.id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                      >
                        <FaEye className="mr-1 h-3 w-3" />
                        Voir
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
            )}
          </div>
        )}

        {activeTab === 'assures' && (
          <div className="space-y-6">
            {/* Top Assurés */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaUsers className="mr-2 h-5 w-5 text-cyan-500" />
                  Top assurés
                </h3>
                <Link href="/admin/acteurs?role=assure" className="text-sm text-blue-600 hover:text-blue-800">
                  Voir tous les assurés →
                </Link>
              </div>
              {topAssures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topAssures.map((assure, index) => (
                    <div key={assure.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mr-2">
                              {index + 1}
                            </span>
                            <p className="font-medium text-gray-900">{assure.nom}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{assure.email}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {assure.nombre_souscriptions} contrat{assure.nombre_souscriptions > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-gray-500">Sinistres</p>
                          <p className="font-semibold text-gray-900">{assure.total_sinistres}</p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-gray-500">Montant total</p>
                          <p className="font-semibold text-blue-600">{formatMontant(assure.total_montant)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
              )}
            </div>

            {/* Statistiques des assurés */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaUserPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Total assurés</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.total_assures}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaHandshake className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Taux de souscription</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.taux_souscription}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <FaFileContract className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Souscriptions actives</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.total_souscriptions_actives}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}