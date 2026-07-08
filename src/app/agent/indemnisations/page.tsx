// app/admin/indemnisations/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FaHandHoldingUsd, FaSearch, FaSpinner, FaCheckCircle,
  FaTimesCircle, FaExclamationTriangle, FaMoneyBillWave,
  FaCalendarAlt, FaUser, FaClipboardList, FaChevronRight,
  FaFilter, FaTimes, FaFileContract, FaCheck, FaBan,
  FaBuilding, FaIdCard, FaArrowLeft
} from 'react-icons/fa';

// ==================== TYPES ====================

type DossierIndemnisation = {
  id: string;
  numero_dossier: string;
  type_sinistre: string;
  assure_nom: string;
  assure_email: string;
  date_sinistre: string;
  lieu: string;
  montant_estime: number;
  montant_expertise: number;
  expertise_id: string;
  expert_nom: string;
  expertise_statut: string; // ✅ Ajouté
  expertise_date: string | null; // ✅ Ajouté
  statut: string;
  indemnisation: {
    id: string;
    montant: number;
    mode_paiement: string;
    statut: string;
    date_validation: string | null;
    date_paiement: string | null;
    reference: string | null;
  } | null;
};

// ==================== CONSTANTES ====================

const MODES_PAIEMENT: Record<string, string> = {
  virement: 'Virement bancaire',
  cheque: 'Chèque',
  mobile_money: 'Mobile Money',
  especes: 'Espèces',
};

const INDEMNISATION_STATUTS: Record<string, { label: string; color: string; bgColor: string }> = {
  en_attente: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  validee: { label: 'Validée', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  payee: { label: 'Payée', color: 'text-green-700', bgColor: 'bg-green-100' },
  annulee: { label: 'Annulée', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const TYPES_SINISTRE: Record<string, string> = {
  accident_auto: '🚗 Accident auto',
  vol: '🔫 Vol',
  incendie: '🔥 Incendie',
  degats_eau: '💧 Dégâts des eaux',
  catastrophe_naturelle: '🌪️ Catastrophe naturelle',
  bris_glace: '🪟 Bris de glace',
  responsabilite_civile: '⚖️ Responsabilité civile',
  autre: '📋 Autre',
};

// ==================== COMPOSANTS ====================

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
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

export default function IndemnisationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [dossiers, setDossiers] = useState<DossierIndemnisation[]>([]);
  const [filteredDossiers, setFilteredDossiers] = useState<DossierIndemnisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreIndemnisation, setFiltreIndemnisation] = useState('tous'); // tous, non_indemnise, indemnise

  // Modal indemnisation
  const [showModal, setShowModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<DossierIndemnisation | null>(null);
  const [formData, setFormData] = useState({
    montant_indemnisation: 0,
    mode_paiement: 'virement',
    commentaire: '',
  });
  const [saving, setSaving] = useState(false);

  // Modal paiement
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [referencePaiement, setReferencePaiement] = useState('');

  useEffect(() => {
    if (user && ['admin', 'agent'].includes(user.role || '')) {
      chargerDossiers();
    }
  }, [user]);

  useEffect(() => {
    filtrerDossiers();
  }, [dossiers, searchTerm, filtreIndemnisation]);

 // Remplacer la fonction chargerDossiers dans app/admin/indemnisations/page.tsx

const chargerDossiers = async () => {
  try {
    setLoading(true);

    // 1. Récupérer les sinistres SANS jointure assure
    const { data: sinistres, error: sinError } = await supabase
      .from('sinistres')
      .select(`
        id, numero_dossier, type_sinistre, date_sinistre, lieu, 
        montant_estime, statut, assure_id
      `)
      .in('statut', ['expertise', 'en_indemnisation', 'cloture', 'en_cours'])
      .order('created_at', { ascending: false });

    if (sinError) throw sinError;
    if (!sinistres || sinistres.length === 0) {
      setDossiers([]);
      setLoading(false);
      return;
    }

    // 2. Récupérer les assurés séparément
    const assureIds = [...new Set(sinistres.map(s => s.assure_id))];
    const { data: assures } = await supabase
      .from('users')
      .select('id, nom, email')
      .in('id', assureIds);

    const assureMap = new Map();
    if (assures) {
      assures.forEach(a => assureMap.set(a.id, a));
    }

    // 3. Récupérer TOUTES les expertises
    const sinistreIds = sinistres.map(s => s.id);
    const { data: expertises, error: expError } = await supabase
      .from('expertises')
      .select('id, sinistre_id, montant_evalue, statut, date_designation, date_expertise, expert_id')
      .in('sinistre_id', sinistreIds)
      .order('created_at', { ascending: false });

    if (expError) throw expError;

    // Map expertise
    const expertiseMap = new Map();
    if (expertises) {
      expertises.forEach(e => {
        if (!expertiseMap.has(e.sinistre_id)) {
          expertiseMap.set(e.sinistre_id, e);
        }
      });
    }

    // 4. Récupérer les noms des experts séparément
    const expertIds = [...new Set(expertises?.map(e => e.expert_id) || [])];
    const { data: experts } = await supabase
      .from('users')
      .select('id, nom')
      .in('id', expertIds);

    const expertMap = new Map();
    if (experts) {
      experts.forEach(e => expertMap.set(e.id, e));
    }

    // 5. Récupérer les indemnisations
    const { data: indemnisations, error: indError } = await supabase
      .from('indemnisations')
      .select('*')
      .in('sinistre_id', sinistreIds);

    if (indError) throw indError;

    const indemnisationMap = new Map();
    if (indemnisations) {
      indemnisations.forEach(i => indemnisationMap.set(i.sinistre_id, i));
    }

    // 6. Formater les dossiers
    const formatted: DossierIndemnisation[] = sinistres
      .filter(s => expertiseMap.has(s.id))
      .map(s => {
        const expertise = expertiseMap.get(s.id);
        const assure = assureMap.get(s.assure_id);
        const expert = expertMap.get(expertise?.expert_id);
        const indemnisation = indemnisationMap.get(s.id);

        return {
          id: s.id,
          numero_dossier: s.numero_dossier,
          type_sinistre: s.type_sinistre,
          assure_nom: assure?.nom || 'Inconnu',
          assure_email: assure?.email || '',
          date_sinistre: s.date_sinistre,
          lieu: s.lieu,
          montant_estime: s.montant_estime || 0,
          montant_expertise: expertise?.montant_evalue || 0,
          expertise_id: expertise?.id,
          expert_nom: expert?.nom || 'Inconnu',
          expertise_statut: expertise?.statut || 'planifiee',
          expertise_date: expertise?.date_expertise || expertise?.date_designation,
          statut: s.statut,
          indemnisation: indemnisation ? {
            id: indemnisation.id,
            montant: indemnisation.montant_indemnisation,
            mode_paiement: indemnisation.mode_paiement,
            statut: indemnisation.statut,
            date_validation: indemnisation.date_validation,
            date_paiement: indemnisation.date_paiement,
            reference: indemnisation.reference_paiement,
          } : null,
        };
      });

    setDossiers(formatted);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const filtrerDossiers = () => {
    let filtered = [...dossiers];

    // Filtre indemnisation
    if (filtreIndemnisation === 'non_indemnise') {
      filtered = filtered.filter(d => !d.indemnisation);
    } else if (filtreIndemnisation === 'indemnise') {
      filtered = filtered.filter(d => d.indemnisation);
    }

    // Recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.numero_dossier.toLowerCase().includes(term) ||
        d.assure_nom.toLowerCase().includes(term) ||
        d.assure_email.toLowerCase().includes(term) ||
        (d.indemnisation?.reference || '').toLowerCase().includes(term)
      );
    }

    setFilteredDossiers(filtered);
  };

  // ============ ACTIONS ============

  const handleInitierIndemnisation = (dossier: DossierIndemnisation) => {
    setSelectedDossier(dossier);
    setFormData({
      montant_indemnisation: dossier.indemnisation?.montant || dossier.montant_expertise || dossier.montant_estime,
      mode_paiement: dossier.indemnisation?.mode_paiement || 'virement',
      commentaire: '',
    });
    setShowModal(true);
  };


  const handleSaveIndemnisation = async () => {
  if (!selectedDossier) return;
  setSaving(true);
  try {
    if (selectedDossier.indemnisation?.id) {
      // Mise à jour
      const { error } = await supabase
        .from('indemnisations')
        .update({
          montant_indemnisation: formData.montant_indemnisation,
          mode_paiement: formData.mode_paiement,
          commentaire: formData.commentaire,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedDossier.indemnisation.id);
      if (error) throw error;
    } else {
      // Création
      const { error } = await supabase
        .from('indemnisations')
        .insert({
          sinistre_id: selectedDossier.id,
          montant_indemnisation: formData.montant_indemnisation,
          mode_paiement: formData.mode_paiement,
          statut: 'en_attente',
          commentaire: formData.commentaire,
          created_by: user?.id,
        });
      if (error) throw error;

      // ✅ Changer statut en "en_indemnisation" (pas encore clôturé)
      await supabase.from('sinistres')
        .update({ statut: 'en_indemnisation', updated_by: user?.id })
        .eq('id', selectedDossier.id);

      await supabase.from('sinistre_communications').insert({
        sinistre_id: selectedDossier.id,
        type: 'notification',
        contenu: `Indemnisation initiée : ${formatMontant(formData.montant_indemnisation)}`,
        expediteur_id: user?.id,
      });
    }

    setSuccess(selectedDossier.indemnisation ? 'Indemnisation mise à jour' : 'Indemnisation initiée');
    setShowModal(false);
    await chargerDossiers();
    setTimeout(() => setSuccess(null), 2000);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};


//   const handleSaveIndemnisation = async () => {
//     if (!selectedDossier) return;
//     setSaving(true);
//     try {
//       if (selectedDossier.indemnisation?.id) {
//         // Mise à jour
//         const { error } = await supabase
//           .from('indemnisations')
//           .update({
//             montant_indemnisation: formData.montant_indemnisation,
//             mode_paiement: formData.mode_paiement,
//             commentaire: formData.commentaire,
//             updated_at: new Date().toISOString(),
//           })
//           .eq('id', selectedDossier.indemnisation.id);
//         if (error) throw error;
//       } else {
//         // Création
//         const { error } = await supabase
//           .from('indemnisations')
//           .insert({
//             sinistre_id: selectedDossier.id,
//             montant_indemnisation: formData.montant_indemnisation,
//             mode_paiement: formData.mode_paiement,
//             statut: 'en_attente',
//             commentaire: formData.commentaire,
//             created_by: user?.id,
//           });
//         if (error) throw error;

//         // Changer statut sinistre si nécessaire
//         if (selectedDossier.statut === 'expertise') {
//           await supabase.from('sinistres')
//             .update({ statut: 'en_indemnisation', updated_by: user?.id })
//             .eq('id', selectedDossier.id);
//         }

//         // Ajouter notification
//         await supabase.from('sinistre_communications').insert({
//           sinistre_id: selectedDossier.id,
//           type: 'notification',
//           contenu: `Indemnisation initiée : ${formatMontant(formData.montant_indemnisation)}`,
//           expediteur_id: user?.id,
//         });
//       }

//       setSuccess(selectedDossier.indemnisation ? 'Indemnisation mise à jour' : 'Indemnisation initiée');
//       setShowModal(false);
//       await chargerDossiers();
//       setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

  const handleValidate = async (dossier: DossierIndemnisation) => {
    if (!dossier.indemnisation) return;
    try {
      await supabase
        .from('indemnisations')
        .update({ statut: 'validee', date_validation: new Date().toISOString() })
        .eq('id', dossier.indemnisation.id);

      await supabase.from('sinistre_communications').insert({
        sinistre_id: dossier.id,
        type: 'notification',
        contenu: `Indemnisation validée : ${formatMontant(dossier.indemnisation.montant)}`,
        expediteur_id: user?.id,
      });

      setSuccess('Indemnisation validée');
      await chargerDossiers();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

 // Dans app/admin/indemnisations/page.tsx - fonction handlePayer

const handlePayer = async () => {
  if (!selectedDossier?.indemnisation) return;
  try {
    console.log('💰 Début paiement pour dossier:', selectedDossier.id); // Debug
    console.log('💰 Statut actuel sinistre:', selectedDossier.statut); // Debug

    // 1. Mettre à jour l'indemnisation
    const { error: indError } = await supabase
      .from('indemnisations')
      .update({
        statut: 'payee',
        date_paiement: new Date().toISOString(),
        reference_paiement: referencePaiement || null,
      })
      .eq('id', selectedDossier.indemnisation.id);

    if (indError) {
      console.error('❌ Erreur update indemnisation:', indError);
      throw indError;
    }
    console.log('✅ Indemnisation mise à jour: payee');

    // 2. Mettre à jour le sinistre : montant + clôture automatique
    const { error: sinError } = await supabase.from('sinistres')
      .update({
        montant_indemnisation: selectedDossier.indemnisation.montant,
        statut: 'cloture', // ✅ Clôture automatique
        date_cloture: new Date().toISOString(),
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedDossier.id);

    if (sinError) {
      console.error('❌ Erreur update sinistre:', sinError);
      throw sinError;
    }
    console.log('✅ Sinistre mis à jour: cloture');

    // 3. Notification
    const { error: commError } = await supabase.from('sinistre_communications').insert({
      sinistre_id: selectedDossier.id,
      type: 'notification',
      contenu: `Paiement effectué : ${formatMontant(selectedDossier.indemnisation.montant)}${referencePaiement ? ` (Réf: ${referencePaiement})` : ''}. Dossier clôturé automatiquement.`,
      expediteur_id: user?.id,
    });

    if (commError) {
      console.error('❌ Erreur communication:', commError);
    }

    setSuccess('Paiement enregistré - Dossier clôturé');
    setShowPaiementModal(false);
    setReferencePaiement('');
    await chargerDossiers();
    setTimeout(() => setSuccess(null), 2000);
  } catch (err: any) {
    console.error('❌ Erreur handlePayer:', err);
    setError(err.message);
  }
};

  const handleAnnuler = async (dossier: DossierIndemnisation) => {
    if (!dossier.indemnisation || !confirm('Annuler cette indemnisation ?')) return;
    try {
      await supabase
        .from('indemnisations')
        .update({ statut: 'annulee' })
        .eq('id', dossier.indemnisation.id);

      setSuccess('Indemnisation annulée');
      await chargerDossiers();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ============ HELPERS ============

  const formatMontant = (m: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
  };

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); }
    catch { return d; }
  };

  if (!['admin', 'agent'].includes(user?.role || '')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
        <h3 className="mt-2 text-lg font-medium">Accès non autorisé</h3>
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
              <Link href="/agent/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <FaArrowLeft className="mr-2 h-4 w-4" /> Retour aux sinistres
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <FaHandHoldingUsd className="mr-3 h-6 w-6 text-green-600" />
                Gestion des indemnisations
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Dossiers avec expertise terminée prêts pour l'indemnisation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-sm text-red-700"><FaExclamationTriangle className="mr-2" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4" /></button></div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-2" />{success}</div>}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Rechercher..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
            </div>
            <select value={filtreIndemnisation} onChange={(e) => setFiltreIndemnisation(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="tous">Tous les dossiers</option>
              <option value="non_indemnise">Non indemnisés</option>
              <option value="indemnise">Indemnisés</option>
            </select>
            <div className="flex items-center text-sm text-gray-500">
              <FaClipboardList className="mr-2" /> {filteredDossiers.length} dossier(s)
            </div>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="mx-auto h-12 w-12 text-green-500 animate-spin" />
            <p className="mt-4 text-gray-600">Chargement des dossiers...</p>
          </div>
        ) : filteredDossiers.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <FaHandHoldingUsd className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">Aucun dossier trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDossiers.map(dossier => {
              const isIndemnise = !!dossier.indemnisation;
              const statutIndemnisation = dossier.indemnisation?.statut;
              const statutInfo = statutIndemnisation ? INDEMNISATION_STATUTS[statutIndemnisation] : null;

              return (
                <div key={dossier.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link href={`/sinistres/${dossier.id}`}
                            className="font-mono font-semibold text-blue-600 hover:text-blue-800">
                            {dossier.numero_dossier}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {TYPES_SINISTRE[dossier.type_sinistre] || dossier.type_sinistre}
                          </span>
                          {isIndemnise && statutInfo && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutInfo.bgColor} ${statutInfo.color}`}>
                              {statutInfo.label}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Assuré</p>
                            <p className="font-medium">{dossier.assure_nom}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Date sinistre</p>
                            <p>{formatDate(dossier.date_sinistre)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Montant estimé</p>
                            <p className="font-medium">{formatMontant(dossier.montant_estime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Montant expertise</p>
                            <p className="font-medium text-purple-600">{formatMontant(dossier.montant_expertise)}</p>
                          </div>
                        </div>

                        {dossier.expert_nom && (
                          <p className="text-xs text-gray-500 mt-2">
                            Expert : {dossier.expert_nom}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Section indemnisation */}
                    {isIndemnise ? (
                      <div className="bg-gray-50 rounded-lg p-4 mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Indemnisation</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutInfo?.bgColor} ${statutInfo?.color}`}>
                            {statutInfo?.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Montant</p>
                            <p className="font-bold text-green-600">{formatMontant(dossier.indemnisation!.montant)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Mode</p>
                            <p>{MODES_PAIEMENT[dossier.indemnisation!.mode_paiement]}</p>
                          </div>
                          {dossier.indemnisation!.reference && (
                            <div>
                              <p className="text-gray-500 text-xs">Référence</p>
                              <p className="font-mono text-xs">{dossier.indemnisation!.reference}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                          <button onClick={() => handleInitierIndemnisation(dossier)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                            Modifier
                          </button>
                          {statutIndemnisation === 'en_attente' && (
                            <button onClick={() => handleValidate(dossier)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">
                              Valider
                            </button>
                          )}
                          {statutIndemnisation === 'validee' && (
                            <button onClick={() => { setSelectedDossier(dossier); setReferencePaiement(''); setShowPaiementModal(true); }}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                              Payer
                            </button>
                          )}
                          {(statutIndemnisation === 'en_attente' || statutIndemnisation === 'validee') && (
                            <button onClick={() => handleAnnuler(dossier)}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t">
                        <button onClick={() => handleInitierIndemnisation(dossier)}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                          <FaHandHoldingUsd className="mr-2" /> Initier l'indemnisation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Initier/Modifier Indemnisation */}
      {showModal && selectedDossier && (
        <Modal onClose={() => setShowModal(false)} title={selectedDossier.indemnisation ? 'Modifier l\'indemnisation' : 'Initier l\'indemnisation'}>
          <div className="space-y-4">
            {/* Info dossier */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium">{selectedDossier.numero_dossier}</p>
              <p className="text-xs text-gray-500">{selectedDossier.assure_nom} • {TYPES_SINISTRE[selectedDossier.type_sinistre]}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div><span className="text-gray-500">Montant estimé :</span> {formatMontant(selectedDossier.montant_estime)}</div>
                <div><span className="text-gray-500">Montant expertise :</span> <span className="text-purple-600 font-medium">{formatMontant(selectedDossier.montant_expertise)}</span></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Montant indemnisation (CDF) *</label>
              <input type="number" value={formData.montant_indemnisation}
                onChange={(e) => setFormData({...formData, montant_indemnisation: Number(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2.5 text-lg font-semibold" min="0" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mode de paiement</label>
              <select value={formData.mode_paiement}
                onChange={(e) => setFormData({...formData, mode_paiement: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {Object.entries(MODES_PAIEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea value={formData.commentaire}
                onChange={(e) => setFormData({...formData, commentaire: e.target.value})}
                rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={handleSaveIndemnisation} disabled={saving || !formData.montant_indemnisation}
                className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}
                {selectedDossier.indemnisation ? 'Mettre à jour' : 'Initier l\'indemnisation'}
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Paiement */}
      {showPaiementModal && selectedDossier?.indemnisation && (
        <Modal onClose={() => setShowPaiementModal(false)} title="Enregistrer le paiement">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm">Montant à payer : <span className="font-bold text-green-700">{formatMontant(selectedDossier.indemnisation.montant)}</span></p>
              <p className="text-xs text-gray-500 mt-1">Mode : {MODES_PAIEMENT[selectedDossier.indemnisation.mode_paiement]}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Référence de paiement (optionnel)</label>
              <input type="text" value={referencePaiement}
                onChange={(e) => setReferencePaiement(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="N° chèque, transaction..." />
            </div>

            <div className="flex space-x-3 pt-2">
              <button onClick={handlePayer}
                className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700">
                <FaMoneyBillWave className="inline mr-1" /> Confirmer le paiement
              </button>
              <button onClick={() => setShowPaiementModal(false)}
                className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}