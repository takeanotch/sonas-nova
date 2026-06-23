// app/assure/reclamations/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaExclamationCircle, FaPlus, FaSearch,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaFilter, FaChevronDown, FaChevronUp, FaEye,
  FaComments, FaPaperPlane, FaFileContract, FaTimes,
  FaEnvelope, FaCalendarAlt, FaUser, FaExclamationTriangle,
  FaTrash, FaEdit, FaInfoCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==================== TYPES ====================

type Reclamation = {
  id: string;
  sinistre_id: string;
  sinistre_numero?: string;
  sinistre_type?: string;
  sinistre_statut?: string;
  sujet: string;
  contenu: string;
  priorite: 'normal' | 'urgent' | 'critique';
  statut: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
  reponse?: string;
  date_reponse?: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
};

type Sinistre = {
  id: string;
  numero_dossier: string;
  type_sinistre: string;
  statut: string;
};

type FilterState = {
  statut: string;
  priorite: string;
  search: string;
};

type ModalType = 'create' | 'detail' | null;

// ==================== CONSTANTES ====================

const STATUTS_RECLAMATION: Record<string, { 
  label: string; 
  icon: React.ComponentType<any>; 
  color: string;
  bgColor: string;
}> = {
  ouverte: { 
    label: 'Ouverte', 
    icon: FaExclamationCircle, 
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100'
  },
  en_cours: { 
    label: 'En cours', 
    icon: FaSpinner, 
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  resolue: { 
    label: 'Résolue', 
    icon: FaCheckCircle, 
    color: 'text-green-700',
    bgColor: 'bg-green-100'
  },
  fermee: { 
    label: 'Fermée', 
    icon: FaTimesCircle, 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100'
  },
};

const PRIORITES: Record<string, { 
  label: string; 
  color: string;
  bgColor: string;
  icon: string;
}> = {
  normal: { 
    label: 'Normale', 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: '📋'
  },
  urgent: { 
    label: 'Urgente', 
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: '⚠️'
  },
  critique: { 
    label: 'Critique', 
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: '🚨'
  },
};

// ==================== COMPOSANTS ====================

function StatutBadge({ statut }: { statut: string }) {
  const info = STATUTS_RECLAMATION[statut] || STATUTS_RECLAMATION.ouverte;
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${info.bgColor} ${info.color}`}>
      <Icon className="mr-1.5 h-4 w-4" />
      {info.label}
    </span>
  );
}

function PrioriteBadge({ priorite }: { priorite: string }) {
  const info = PRIORITES[priorite] || PRIORITES.normal;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${info.bgColor} ${info.color}`}>
      {info.icon} {info.label}
    </span>
  );
}

function Modal({ children, onClose, title, size = 'md' }: { 
  children: React.ReactNode; 
  onClose: () => void; 
  title: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// ==================== PAGE PRINCIPALE ====================

export default function AssureReclamationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // États
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // États des filtres
  const [filters, setFilters] = useState<FilterState>({
    statut: 'all',
    priorite: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // États des modals
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);
  
  // États du formulaire de création
  const [createForm, setCreateForm] = useState({
    sinistre_id: '',
    sujet: '',
    contenu: '',
    priorite: 'normal' as 'normal' | 'urgent' | 'critique',
  });
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (user) {
      chargerDonnees();
    }
  }, [user, page, filters]);

  // ==================== CHARGEMENT DONNÉES ====================

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      await Promise.all([
        chargerReclamations(),
        chargerSinistres(),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chargerReclamations = async () => {
    if (!user) return;

    // Récupérer d'abord les IDs des sinistres de l'assuré
    const { data: userSinistres } = await supabase
      .from('sinistres')
      .select('id')
      .eq('assure_id', user.id);

    if (!userSinistres || userSinistres.length === 0) {
      setReclamations([]);
      setTotalPages(0);
      return;
    }

    const sinistreIds = userSinistres.map(s => s.id);

    // Compter le total pour la pagination
    let countQuery = supabase
      .from('sinistre_communications')
      .select('*', { count: 'exact', head: true })
      .in('sinistre_id', sinistreIds)
      .eq('type', 'reclamation');

    if (filters.statut !== 'all') {
      countQuery = countQuery.eq('statut_reclamation', filters.statut);
    }
    if (filters.priorite !== 'all') {
      countQuery = countQuery.eq('priorite', filters.priorite);
    }
    if (filters.search) {
      countQuery = countQuery.or(`sujet.ilike.%${filters.search}%,contenu.ilike.%${filters.search}%`);
    }

    const { count } = await countQuery;
    setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

    // Récupérer les réclamations
    let query = supabase
      .from('sinistre_communications')
      .select(`
        *,
        sinistre:sinistres!inner(
          id,
          numero_dossier,
          type_sinistre,
          statut
        )
      `)
      .in('sinistre_id', sinistreIds)
      .eq('type', 'reclamation')
      .order('created_at', { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (filters.statut !== 'all') {
      query = query.eq('statut_reclamation', filters.statut);
    }
    if (filters.priorite !== 'all') {
      query = query.eq('priorite', filters.priorite);
    }
    if (filters.search) {
      query = query.or(`contenu.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Formater les données
    const formatted = (data || []).map(item => ({
      id: item.id,
      sinistre_id: item.sinistre_id,
      sinistre_numero: item.sinistre?.numero_dossier,
      sinistre_type: item.sinistre?.type_sinistre,
      sinistre_statut: item.sinistre?.statut,
      sujet: extractSujet(item.contenu),
      contenu: extractContenu(item.contenu),
      priorite: item.priorite || 'normal',
      statut: item.statut_reclamation || 'ouverte',
      reponse: item.reponse,
      date_reponse: item.date_reponse,
      created_at: item.created_at,
      updated_at: item.updated_at,
      messages_count: 1,
    }));

    setReclamations(formatted);
  };

  const chargerSinistres = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('sinistres')
      .select('id, numero_dossier, type_sinistre, statut')
      .eq('assure_id', user.id)
      .order('created_at', { ascending: false });

    setSinistres(data || []);
  };

  // ==================== HELPERS ====================

  const extractSujet = (contenu: string): string => {
    const match = contenu.match(/\*\*Sujet:\*\*\s*(.+)/);
    return match ? match[1] : 'Sans sujet';
  };

  const extractContenu = (contenu: string): string => {
    return contenu.replace(/\*\*Sujet:\*\*\s*.+\n\n/, '');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  // ==================== ACTIONS ====================

  const handleCreateReclamation = async () => {
    if (!createForm.sinistre_id || !createForm.sujet || !createForm.contenu) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const contenuFormate = `**Sujet:** ${createForm.sujet}\n\n${createForm.contenu}`;

      const { error } = await supabase.from('sinistre_communications').insert({
        sinistre_id: createForm.sinistre_id,
        type: 'reclamation',
        contenu: contenuFormate,
        expediteur_id: user?.id,
        priorite: createForm.priorite,
        statut_reclamation: 'ouverte',
      });

      if (error) throw error;

      setSuccess('Votre réclamation a été créée avec succès');
      setActiveModal(null);
      resetCreateForm();
      await chargerReclamations();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteReclamation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) return;

    try {
      const { error } = await supabase
        .from('sinistre_communications')
        .delete()
        .eq('id', id)
        .eq('expediteur_id', user?.id);

      if (error) throw error;

      setSuccess('Réclamation supprimée');
      setActiveModal(null);
      await chargerReclamations();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      sinistre_id: '',
      sujet: '',
      contenu: '',
      priorite: 'normal',
    });
  };

  const resetFilters = () => {
    setFilters({ statut: 'all', priorite: 'all', search: '' });
    setPage(1);
  };

  const viewReclamationDetail = (reclamation: Reclamation) => {
    setSelectedReclamation(reclamation);
    setActiveModal('detail');
  };

  // ==================== STATISTIQUES ====================

  const stats = {
    total: reclamations.length,
    ouvertes: reclamations.filter(r => r.statut === 'ouverte').length,
    en_cours: reclamations.filter(r => r.statut === 'en_cours').length,
    resolues: reclamations.filter(r => r.statut === 'resolue').length,
  };

  // ==================== RENDU ====================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/assure" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <FaExclamationCircle className="mr-3 h-6 w-6 text-orange-600" />
                Mes réclamations
              </h1>
            </div>
            <button
              onClick={() => {
                resetCreateForm();
                setActiveModal('create');
              }}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Nouvelle réclamation
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <FaTimesCircle className="text-red-400 mr-3 h-5 w-5" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <FaTimes className="h-4 w-4 text-red-400" />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <FaCheckCircle className="text-green-400 mr-3 h-5 w-5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.total}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-yellow-700">Ouvertes</p>
              <FaExclamationCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-semibold text-yellow-900 mt-2">{stats.ouvertes}</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-700">En cours</p>
              <FaSpinner className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-blue-900 mt-2">{stats.en_cours}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-700">Résolues</p>
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-green-900 mt-2">{stats.resolues}</p>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher une réclamation..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FaFilter className="mr-2 h-4 w-4" />
              Filtres
              {showFilters ? <FaChevronUp className="ml-2 h-3 w-3" /> : <FaChevronDown className="ml-2 h-3 w-3" />}
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.statut}
                  onChange={(e) => {
                    setFilters({ ...filters, statut: e.target.value });
                    setPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="ouverte">Ouverte</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolue">Résolue</option>
                  <option value="fermee">Fermée</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={filters.priorite}
                  onChange={(e) => {
                    setFilters({ ...filters, priorite: e.target.value });
                    setPage(1);
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="normal">Normale</option>
                  <option value="urgent">Urgente</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des réclamations */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Chargement...</span>
          </div>
        ) : reclamations.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FaEnvelope className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune réclamation</h3>
            <p className="mt-2 text-sm text-gray-500">
              Vous n'avez pas encore fait de réclamation. Utilisez le bouton "Nouvelle réclamation" pour commencer.
            </p>
            <button
              onClick={() => {
                resetCreateForm();
                setActiveModal('create');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Créer ma première réclamation
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dossier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sujet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priorité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reclamations.map((reclamation) => (
                      <tr key={reclamation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link 
                            href={`/assure/sinistres/${reclamation.sinistre_id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaFileContract className="inline mr-1 h-3 w-3" />
                            {reclamation.sinistre_numero}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {reclamation.sujet}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PrioriteBadge priorite={reclamation.priorite} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatutBadge statut={reclamation.statut} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <FaCalendarAlt className="inline mr-1 h-3 w-3" />
                          {formatDateShort(reclamation.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => viewReclamationDetail(reclamation)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Voir les détails"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/assure/sinistres/${reclamation.sinistre_id}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="Voir le dossier"
                            >
                              <FaFileContract className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Page {page} sur {totalPages}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Création de réclamation */}
      {activeModal === 'create' && (
        <Modal 
          onClose={() => setActiveModal(null)} 
          title="Nouvelle réclamation"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dossier concerné *
              </label>
              <select
                value={createForm.sinistre_id}
                onChange={(e) => setCreateForm({...createForm, sinistre_id: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Sélectionnez un dossier</option>
                {sinistres.map(sinistre => (
                  <option key={sinistre.id} value={sinistre.id}>
                    {sinistre.numero_dossier} - {sinistre.type_sinistre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité
              </label>
              <select
                value={createForm.priorite}
                onChange={(e) => setCreateForm({...createForm, priorite: e.target.value as any})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="normal">📋 Normale</option>
                <option value="urgent">⚠️ Urgente</option>
                <option value="critique">🚨 Critique</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sujet *
              </label>
              <input
                type="text"
                value={createForm.sujet}
                onChange={(e) => setCreateForm({...createForm, sujet: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Objet de votre réclamation"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{createForm.sujet.length}/200 caractères</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description détaillée *
              </label>
              <textarea
                value={createForm.contenu}
                onChange={(e) => setCreateForm({...createForm, contenu: e.target.value})}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Décrivez votre problème en détail. Incluez toutes les informations pertinentes..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 h-4 w-4" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Conseils pour une réclamation efficace :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Soyez précis dans la description du problème</li>
                    <li>Mentionnez les dates et événements importants</li>
                    <li>Joignez des documents si nécessaire via le dossier</li>
                    <li>Choisissez la bonne priorité selon l'urgence</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleCreateReclamation}
                disabled={!createForm.sinistre_id || !createForm.sujet || !createForm.contenu}
                className="flex-1 bg-orange-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane className="inline mr-2 h-4 w-4" />
                Envoyer la réclamation
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Détail réclamation */}
      {activeModal === 'detail' && selectedReclamation && (
        <Modal 
          onClose={() => setActiveModal(null)} 
          title={`Réclamation - ${selectedReclamation.sujet}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* En-tête */}
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-3">
                <StatutBadge statut={selectedReclamation.statut} />
                <PrioriteBadge priorite={selectedReclamation.priorite} />
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(selectedReclamation.created_at)}
              </span>
            </div>

            {/* Dossier lié */}
            <div className="flex items-center text-sm">
              <span className="text-gray-500 mr-2">Dossier :</span>
              <Link 
                href={`/assure/sinistres/${selectedReclamation.sinistre_id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaFileContract className="inline mr-1 h-3 w-3" />
                {selectedReclamation.sinistre_numero}
              </Link>
            </div>

            {/* Contenu */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedReclamation.contenu}
                </p>
              </div>
            </div>

            {/* Réponse */}
            {selectedReclamation.reponse && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Réponse de l'agent
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaUser className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-700">Agent ARCA</span>
                    {selectedReclamation.date_reponse && (
                      <span className="ml-auto text-xs text-blue-500">
                        {formatDateShort(selectedReclamation.date_reponse)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedReclamation.reponse}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-3 border-t">
              <button
                onClick={() => handleDeleteReclamation(selectedReclamation.id)}
                className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                disabled={selectedReclamation.statut !== 'ouverte'}
                title={selectedReclamation.statut !== 'ouverte' ? 'Impossible de supprimer une réclamation déjà traitée' : ''}
              >
                <FaTrash className="mr-2 h-3 w-3" />
                {selectedReclamation.statut === 'ouverte' ? 'Supprimer' : 'Suppression impossible'}
              </button>
              <div className="flex space-x-2">
                <Link
                  href={`/assure/sinistres/${selectedReclamation.sinistre_id}`}
                  className="inline-flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                >
                  <FaFileContract className="mr-2 h-3 w-3" />
                  Voir le dossier
                </Link>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}