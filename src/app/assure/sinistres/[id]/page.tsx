

// app/assure/sinistres/[id]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaUpload, FaDownload, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
  FaHistory, FaTimes, FaExclamationTriangle, FaClipboardList,
  FaUserCheck, FaPaperPlane, FaComments, FaPhone, 
  FaFileContract, FaExclamationCircle, FaBell, FaEnvelope,
  FaCommentMedical, FaHeadset, FaInfo, FaHandHoldingUsd,
  FaCar, FaIdCard, FaTools, FaUserInjured, FaImage,
  FaChevronDown, FaChevronUp, FaPlus, FaMinus, FaPen
} from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==================== TYPES ====================

type Sinistre = {
  id: string;
  numero_dossier: string;
  type_sinistre: string;
  description: string;
  date_sinistre: string;
  lieu: string;
  statut: string;
  montant_estime: number;
  montant_indemnisation: number;
  created_at: string;
  updated_at: string;
  assure: {
    nom: string;
    email: string;
    telephone?: string;
    photo_profil?: string;
  };
  agent?: {
    nom: string;
    email: string;
    telephone?: string;
    photo_profil?: string;
  } | null;
  souscription?: {
    police_numero?: string;
    produit?: { nom: string; };
  };
  indemnisation_payee: boolean;
  indemnisation_montant: number;
  indemnisation_mode: string;
};

type Document = {
  id: string;
  nom_fichier: string;
  url_fichier: string;
  type_document: string;
  taille_fichier?: number;
  created_at: string;
};

type Communication = {
  id: string;
  type: 'message' | 'notification' | 'reclamation';
  contenu: string;
  expediteur_nom: string;
  expediteur_role: string;
  priorite?: 'normal' | 'urgent' | 'critique';
  statut_reclamation?: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
  created_at: string;
};

type Expertise = {
  id: string;
  expert_nom: string;
  expert_email: string;
  expert_photo?: string;
  date_designation: string;
  date_expertise: string | null;
  rapport: string | null;
  conclusion: string | null;
  montant_evalue: number | null;
  statut: string;
  documents: ExpertiseDocument[];
};

type ExpertiseDocument = {
  id: string;
  nom_fichier: string;
  url_fichier: string;
  created_at: string;
};

type Notification = {
  id: string;
  type: string;
  titre: string;
  message: string;
  lu: boolean;
  created_at: string;
};

type SonasDeclaration = {
  id: number;
  sinistre_id: string;
  agence: string;
  police: string;
  valable_du: string;
  valable_au: string;
  claim_no: string;
  garantie: string;
  telephone: string;
  date_heure_accident: string;
  lieu_accident: string;
  preneur_nom: string;
  preneur_prenoms: string;
  preneur_adresse: string;
  conducteur_nom_prenom: string;
  conducteur_age: number;
  conducteur_a_service: boolean;
  conducteur_titre_conduite: string;
  permis_no: string;
  permis_delivre_a: string;
  permis_date: string;
  vehicule_marque_type: string;
  vehicule_plaque: string;
  vehicule_chassis: string;
  vehicule_moteur: string;
  vehicule_puissance: string;
  vehicule_annee: number;
  vehicule_kilometrage: number;
  vehicule_valeur: number;
  garantie_rc: boolean;
  garantie_dm: boolean;
  garantie_inc: boolean;
  garantie_vol: boolean;
  description_accident: string;
  plan_lieux_url: string | null;
  degats_description: string;
  degats_montant_evalue: number;
  vehicule_immobilise: boolean;
  lieu_garde_expertise: string;
  adversaire_nom: string;
  adversaire_post_nom: string;
  adversaire_prenom: string;
  adversaire_adresse: string;
  adversaire_vehicule: string;
  adversaire_plaque: string;
  adversaire_assurance: string;
  adversaire_telephone: string;
  degats_materiels_description: string;
  degats_materiels_evalues: number;
  blesses_ou_morts: boolean;
  victimes_infos: string;
  victimes_soins_lieu: string;
  hopital_nom_adresse: string;
  medecin_nom: string;
  medecin_telephone: string;
  tiers_transportes: string;
  temoins: string;
  pv_par: string;
  localite: string;
  gendarmerie: string;
  officier_gendarme: string;
  prime_payee: boolean;
  prime_date: string;
  fait_a: string;
  date_signature: string;
  signature_assure_url: string | null;
};

// ==================== CONSTANTES ====================

const STATUTS: Record<string, { 
  label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number; description: string;
}> = {
  en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-700', bgColor: 'bg-yellow-100', progress: 10, description: 'Votre dossier a été reçu et est en attente de traitement' },
  en_cours: { label: 'En cours de traitement', icon: FaSpinner, color: 'text-blue-700', bgColor: 'bg-blue-100', progress: 30, description: 'Votre dossier est en cours de traitement par nos équipes' },
  expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-700', bgColor: 'bg-purple-100', progress: 50, description: 'Un expert évalue actuellement votre sinistre' },
  en_indemnisation: { label: 'En indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-700', bgColor: 'bg-indigo-100', progress: 75, description: 'Votre indemnisation est en cours de traitement' },
  cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-700', bgColor: 'bg-green-100', progress: 100, description: 'Votre dossier est clôturé' },
  refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-700', bgColor: 'bg-red-100', progress: 0, description: 'Votre dossier a été refusé' },
};

const TYPES_SINISTRE: Record<string, { label: string; icon: string }> = {
  accident_auto: { label: 'Accident auto', icon: '🚗' },
  vol: { label: 'Vol', icon: '🔫' },
  incendie: { label: 'Incendie', icon: '🔥' },
  degats_eau: { label: 'Dégâts des eaux', icon: '💧' },
  catastrophe_naturelle: { label: 'Catastrophe naturelle', icon: '🌪️' },
  bris_glace: { label: 'Bris de glace', icon: '🪟' },
  responsabilite_civile: { label: 'Responsabilité civile', icon: '⚖️' },
  autre: { label: 'Autre', icon: '📋' },
};

// ==================== COMPOSANTS ====================

function UserAvatar({ user, size = 'md' }: { user: { nom?: string; email?: string; photo_profil?: string; role?: string }; size?: 'sm' | 'md' | 'lg'; }) {
  const sizeClasses = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  const getInitials = (nom?: string) => { if (!nom) return '?'; return nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2); };
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
      {user.photo_profil ? <img src={user.photo_profil} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-500 flex items-center justify-center"><span className="text-white font-medium">{getInitials(user.nom)}</span></div>}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string; }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">{title}</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button></div>
          {children}
        </div>
      </div>
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const info = STATUTS[statut] || STATUTS.en_attente;
  const Icon = info.icon;
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${info.bgColor} ${info.color}`}><Icon className="mr-1.5 h-4 w-4" />{info.label}</span>;
}

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(progress, 100)}%` }} /></div>;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        </div>
        {isOpen ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

// ==================== PAGE PRINCIPALE ====================

type Props = { params: Promise<{ id: string }> };

export default function AssureSinistreDetailPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);
  
  const [sinistre, setSinistre] = useState<Sinistre | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [historique, setHistorique] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sonasDeclaration, setSonasDeclaration] = useState<SonasDeclaration | null>(null);
  
  // État pour afficher/masquer les détails SONAS
  const [showAllSonasDetails, setShowAllSonasDetails] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReclamationModal, setShowReclamationModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState('autre_document');
  const [reclamationForm, setReclamationForm] = useState({ sujet: '', contenu: '', priorite: 'normal' as 'normal' | 'urgent' | 'critique' });
  const [messageForm, setMessageForm] = useState({ contenu: '' });

  useEffect(() => { if (user && id) chargerTout(); }, [user, id]);

  const chargerTout = async () => {
    try { setLoading(true); await Promise.all([chargerSinistre(), chargerExpertises(), chargerCommunications(), chargerNotifications()]); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const chargerSinistre = async () => {
    const { data, error } = await supabase.from('sinistres').select('*').eq('id', id).eq('assure_id', user?.id).single();
    if (error || !data) throw new Error('Sinistre non trouvé');

    const { data: assureData } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.assure_id).single();

    let agentData = null;
    if (data.updated_by) {
      const { data: ag } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.updated_by).single();
      agentData = ag;
    }

    let souscription = null;
    if (data.souscription_id) {
      const { data: sub } = await supabase.from('souscriptions').select('police_numero').eq('id', data.souscription_id).single();
      souscription = sub;
      
      const { data: souscriptionData } = await supabase
        .from('souscriptions')
        .select('type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(code)')
        .eq('id', data.souscription_id)
        .single();
      
      const typeAssuranceCode = (souscriptionData?.type_assurance as any)?.code;
      
      if (typeAssuranceCode === 'automobile') {
        const { data: sonasData } = await supabase
          .from('sonas_declarations_accident')
          .select('*')
          .eq('sinistre_id', id)
          .single();
        
        if (sonasData) {
          setSonasDeclaration(sonasData as SonasDeclaration);
        }
      }
    }

    const { data: indemnisation } = await supabase.from('indemnisations').select('*').eq('sinistre_id', id).single();

    setSinistre({
      ...data,
      assure: assureData || { nom: 'Inconnu', email: '' },
      agent: agentData || null,
      souscription,
      indemnisation_payee: indemnisation?.statut === 'payee',
      indemnisation_montant: indemnisation?.montant_indemnisation || 0,
      indemnisation_mode: indemnisation?.mode_paiement || '',
    });

    const { data: docs } = await supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    setDocuments(docs || []);

    const { data: hist } = await supabase.from('sinistre_historique').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    setHistorique(hist || []);
  };

  const chargerExpertises = async () => {
    const { data } = await supabase.from('expertises').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    if (data && data.length > 0) {
      const expertIds = [...new Set(data.map((e: any) => e.expert_id))];
      const { data: experts } = await supabase.from('users').select('id, nom, email, photo_profil').in('id', expertIds);
      const expertMap = new Map();
      if (experts) experts.forEach((e: any) => expertMap.set(e.id, e));
      setExpertises(data.map((e: any) => ({ ...e, expert_nom: expertMap.get(e.expert_id)?.nom || 'Inconnu', expert_email: expertMap.get(e.expert_id)?.email || '', expert_photo: expertMap.get(e.expert_id)?.photo_profil || '', documents: [] })));
    }
  };

  const chargerCommunications = async () => {
    const { data } = await supabase.from('sinistre_communications').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(100);
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((c: any) => c.expediteur_id))];
      const { data: users } = await supabase.from('users').select('id, nom, role').in('id', userIds);
      const userMap = new Map();
      if (users) users.forEach((u: any) => userMap.set(u.id, u));
      setCommunications(data.map((c: any) => ({ ...c, expediteur_nom: userMap.get(c.expediteur_id)?.nom || 'Système', expediteur_role: userMap.get(c.expediteur_id)?.role || 'system' })));
    } else setCommunications([]);
  };

  const chargerNotifications = async () => {
    if (!user) return;
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).eq('sinistre_id', id).order('created_at', { ascending: false }).limit(20);
    setNotifications(data || []);
  };

  const handleUploadDocuments = async () => {
    if (selectedFiles.length === 0) { setError('Veuillez sélectionner au moins un fichier'); return; }
    try {
      for (const file of selectedFiles) {
        const fileName = `${id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('sinistres').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('sinistres').getPublicUrl(fileName);
        await supabase.from('sinistre_documents').insert({ sinistre_id: id, nom_fichier: file.name, url_fichier: data.publicUrl, type_document: documentType, taille_fichier: file.size, type_mime: file.type, uploaded_by: user?.id });
      }
      setSuccess('Documents téléchargés'); setShowUploadModal(false); setSelectedFiles([]);
      await chargerSinistre(); setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleSendReclamation = async () => {
    if (!reclamationForm.sujet || !reclamationForm.contenu) { setError('Veuillez remplir tous les champs'); return; }
    try {
      await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'reclamation', contenu: `Sujet: ${reclamationForm.sujet}\n\n${reclamationForm.contenu}`, expediteur_id: user?.id, priorite: reclamationForm.priorite, statut_reclamation: 'ouverte' });
      setSuccess('Réclamation envoyée'); setShowReclamationModal(false); setReclamationForm({ sujet: '', contenu: '', priorite: 'normal' });
      await chargerCommunications(); setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleSendMessage = async () => {
    if (!messageForm.contenu.trim()) return;
    try {
      await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'message', contenu: messageForm.contenu, expediteur_id: user?.id });
      setMessageForm({ contenu: '' }); setShowMessageModal(false);
      await chargerCommunications();
    } catch (err: any) { setError(err.message); }
  };

  const handleMarkNotificationAsRead = async (nid: string) => {
    await supabase.from('notifications').update({ lu: true }).eq('id', nid);
    await chargerNotifications();
  };

  const formatDate = (d: string) => { try { return format(new Date(d), 'dd MMMM yyyy à HH:mm', { locale: fr }); } catch { return d; } };
  const formatDateShort = (d: string) => { try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); } catch { return d; } };
  const formatMontant = (m: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF' }).format(m);
  const getProgressColor = (p: number) => { if (p >= 100) return 'bg-green-500'; if (p >= 75) return 'bg-indigo-500'; if (p >= 50) return 'bg-purple-500'; if (p >= 30) return 'bg-blue-500'; return 'bg-yellow-500'; };
  const getPriorityColor = (p?: string) => { switch (p) { case 'urgent': return 'bg-orange-100 text-orange-700'; case 'critique': return 'bg-red-100 text-red-700'; default: return 'bg-gray-100 text-gray-700'; } };
  const getReclamationStatusColor = (s?: string) => { switch (s) { case 'ouverte': return 'bg-yellow-100 text-yellow-700'; case 'en_cours': return 'bg-blue-100 text-blue-700'; case 'resolue': return 'bg-green-100 text-green-700'; default: return 'bg-gray-100 text-gray-700'; } };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><FaSpinner className="h-12 w-12 text-blue-500 animate-spin" /></div>;
  if (!sinistre) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" /><p className="mt-4">Dossier non trouvé</p><Link href="/assure/sinistres" className="mt-4 inline-block text-blue-600">Retour à mes sinistres</Link></div></div>;

  const statutEffectif = sinistre.indemnisation_payee ? 'cloture' : sinistre.statut;
  const statutInfo = STATUTS[statutEffectif] || STATUTS.en_attente;
  const notificationsNonLues = notifications.filter(n => !n.lu);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"><FaArrowLeft className="mr-2 h-4 w-4" />Retour à mes sinistres</Link>
              <h1 className="text-2xl font-semibold">Dossier {sinistre.numero_dossier}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"><FaUpload className="mr-2 h-4 w-4" />Ajouter documents</button>
              <button onClick={() => setShowReclamationModal(true)} className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"><FaExclamationCircle className="mr-2 h-4 w-4" />Réclamation</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-3 h-5 w-5" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4" /></button></div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-3 h-5 w-5" />{success}</div>}

        {notificationsNonLues.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3"><FaBell className="inline mr-2 h-5 w-5 text-yellow-500" />Notifications <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{notificationsNonLues.length}</span></h3>
            <div className="space-y-2">
              {notificationsNonLues.map(notif => (
                <div key={notif.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start cursor-pointer hover:bg-yellow-100" onClick={() => handleMarkNotificationAsRead(notif.id)}>
                  <FaBell className="text-yellow-500 mr-3 h-5 w-5 mt-0.5" />
                  <div className="flex-1"><p className="font-medium text-yellow-900">{notif.titre}</p><p className="text-sm text-yellow-700 mt-1">{notif.message}</p><p className="text-xs text-yellow-600 mt-2">{formatDate(notif.created_at)}</p></div>
                  <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-1 rounded">Nouveau</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">État de votre dossier</h2>
                <div className="flex items-center gap-2">
                  <StatutBadge statut={statutEffectif} />
                  {sinistre.indemnisation_payee && <span className="text-xs text-green-600 font-medium">💰 Indemnisé</span>}
                </div>
              </div>
              <ProgressBar progress={statutInfo.progress} color={getProgressColor(statutInfo.progress)} />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
                  <span key={key} className={statutEffectif === key ? 'font-semibold text-gray-900' : ''}>{val.label}</span>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg"><p className="text-sm text-blue-800"><FaInfo className="inline mr-1" />{statutInfo.description}</p></div>
            </div>

            {/* ========== DÉTAILS SINISTRE (SONAS OU NORMAL) ========== */}
            {sonasDeclaration ? (
              <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCar className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Déclaration d'Accident Automobile - SONAS</h2>
                  </div>
                  <button
                    onClick={() => setShowAllSonasDetails(!showAllSonasDetails)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                  >
                    {showAllSonasDetails ? (
                      <><FaMinus className="h-3 w-3" /> Moins de détails</>
                    ) : (
                      <><FaPlus className="h-3 w-3" /> Plus de détails</>
                    )}
                  </button>
                </div>
                
                {/* Résumé toujours visible */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-4 rounded-lg">
                    <div><p className="text-gray-500">N° Dossier</p><p className="font-semibold text-blue-700">{sonasDeclaration.claim_no}</p></div>
                    <div><p className="text-gray-500">Date accident</p><p className="font-medium">{formatDate(sonasDeclaration.date_heure_accident)}</p></div>
                    <div><p className="text-gray-500">Lieu</p><p className="font-medium truncate">{sonasDeclaration.lieu_accident}</p></div>
                    <div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'} - {sonasDeclaration.vehicule_plaque || '-'}</p></div>
                  </div>

             

               
                  {/* Détails supplémentaires (affichés/masqués) */}
                  {showAllSonasDetails && (
                    <div className="space-y-4 pt-4 border-t">
                      {/* Infos générales */}
                      <CollapsibleSection title="Informations générales" icon={<FaFileAlt className="h-4 w-4" />} defaultOpen={true}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-gray-500">Agence</p><p className="font-medium">{sonasDeclaration.agence}</p></div>
                          <div><p className="text-gray-500">Police</p><p className="font-medium">{sonasDeclaration.police || '-'}</p></div>
                          <div><p className="text-gray-500">Garantie</p><p className="font-medium">{sonasDeclaration.garantie || '-'}</p></div>
                          <div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.telephone || '-'}</p></div>
                          {sonasDeclaration.valable_du && <div><p className="text-gray-500">Valable du</p><p className="font-medium">{formatDateShort(sonasDeclaration.valable_du)}</p></div>}
                          {sonasDeclaration.valable_au && <div><p className="text-gray-500">Au</p><p className="font-medium">{formatDateShort(sonasDeclaration.valable_au)}</p></div>}
                        </div>
                      </CollapsibleSection>

                      {/* Preneur d'assurance */}
                      <CollapsibleSection title="2. Preneur d'assurance" icon={<FaUser className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.preneur_nom || '-'}</p></div>
                          <div><p className="text-gray-500">Prénoms</p><p className="font-medium">{sonasDeclaration.preneur_prenoms || '-'}</p></div>
                          <div className="col-span-2"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.preneur_adresse || '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                    

                      {/* Véhicule */}
                      <CollapsibleSection title="4. Véhicule" icon={<FaCar className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-gray-500">Marque et type</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'}</p></div>
                          <div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.vehicule_plaque || '-'}</p></div>
                          <div><p className="text-gray-500">Châssis</p><p className="font-medium">{sonasDeclaration.vehicule_chassis || '-'}</p></div>
                          <div><p className="text-gray-500">Moteur</p><p className="font-medium">{sonasDeclaration.vehicule_moteur || '-'}</p></div>
                          <div><p className="text-gray-500">Puissance</p><p className="font-medium">{sonasDeclaration.vehicule_puissance || '-'}</p></div>
                          <div><p className="text-gray-500">Année</p><p className="font-medium">{sonasDeclaration.vehicule_annee || '-'}</p></div>
                          <div><p className="text-gray-500">Kilométrage</p><p className="font-medium">{sonasDeclaration.vehicule_kilometrage ? `${sonasDeclaration.vehicule_kilometrage} km` : '-'}</p></div>
                          <div><p className="text-gray-500">Valeur</p><p className="font-medium">{sonasDeclaration.vehicule_valeur ? formatMontant(sonasDeclaration.vehicule_valeur) : '-'}</p></div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-gray-500 mb-2">Garanties :</p>
                          <div className="flex gap-4">
                            <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_rc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>R.C.</span>
                            <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_dm ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>D.M.</span>
                            <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_inc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Inc.</span>
                            <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_vol ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Vol</span>
                          </div>
                        </div>
                      </CollapsibleSection>

                      {/* Description */}
                      <CollapsibleSection title="5. Description de l'accident" icon={<FaClipboardList className="h-4 w-4" />}>
                        <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.description_accident || 'Aucune description'}</p>
                      </CollapsibleSection>

                      {/* Dégâts */}
                      <CollapsibleSection title="6. Dégâts de votre véhicule" icon={<FaTools className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_description || '-'}</p></div>
                          <div><p className="text-gray-500">Montant évalué</p><p className="font-medium">{sonasDeclaration.degats_montant_evalue ? formatMontant(sonasDeclaration.degats_montant_evalue) : '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                      {/* Garage */}
                      <CollapsibleSection title="7. Garage">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">Véhicule immobilisé ?</p><p className="font-medium">{sonasDeclaration.vehicule_immobilise === true ? 'Oui' : sonasDeclaration.vehicule_immobilise === false ? 'Non' : '-'}</p></div>
                          <div><p className="text-gray-500">Lieu de garde</p><p className="font-medium">{sonasDeclaration.lieu_garde_expertise || '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                      {/* Adversaire */}
                      <CollapsibleSection title="8. Adversaire">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.adversaire_nom || '-'}</p></div>
                          <div><p className="text-gray-500">Post-nom</p><p className="font-medium">{sonasDeclaration.adversaire_post_nom || '-'}</p></div>
                          <div><p className="text-gray-500">Prénom</p><p className="font-medium">{sonasDeclaration.adversaire_prenom || '-'}</p></div>
                          <div className="col-span-4"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.adversaire_adresse || '-'}</p></div>
                          <div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.adversaire_vehicule || '-'}</p></div>
                          <div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.adversaire_plaque || '-'}</p></div>
                          <div><p className="text-gray-500">Assurance</p><p className="font-medium">{sonasDeclaration.adversaire_assurance || '-'}</p></div>
                          <div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.adversaire_telephone || '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                      {/* Dégâts matériels tiers */}
                      <CollapsibleSection title="9. Dégâts matériels (tiers)">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_materiels_description || '-'}</p></div>
                          <div><p className="text-gray-500">Dégâts évalués à</p><p className="font-medium">{sonasDeclaration.degats_materiels_evalues ? formatMontant(sonasDeclaration.degats_materiels_evalues) : '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                      {/* Blessés ou morts */}
                      <CollapsibleSection title="10. Blessés ou morts" icon={<FaUserInjured className="h-4 w-4" />}>
                        <div className="space-y-3 text-sm">
                          <div><p className="text-gray-500">Blessés ou morts ?</p><p className="font-medium">{sonasDeclaration.blesses_ou_morts ? 'Oui' : 'Non'}</p></div>
                          {sonasDeclaration.victimes_infos && <div><p className="text-gray-500">Victimes</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.victimes_infos}</p></div>}
                          {sonasDeclaration.victimes_soins_lieu && <div><p className="text-gray-500">Lieu des soins</p><p className="font-medium">{sonasDeclaration.victimes_soins_lieu}</p></div>}
                          <div className="grid grid-cols-2 gap-4">
                            {sonasDeclaration.hopital_nom_adresse && <div><p className="text-gray-500">Hôpital</p><p className="font-medium">{sonasDeclaration.hopital_nom_adresse}</p></div>}
                            {sonasDeclaration.medecin_nom && <div><p className="text-gray-500">Médecin</p><p className="font-medium">{sonasDeclaration.medecin_nom}</p></div>}
                          </div>
                          {sonasDeclaration.medecin_telephone && <div><p className="text-gray-500">Tél médecin</p><p className="font-medium">{sonasDeclaration.medecin_telephone}</p></div>}
                        </div>
                      </CollapsibleSection>

                      {/* Tiers transportés */}
                      {sonasDeclaration.tiers_transportes && (
                        <CollapsibleSection title="11. Tiers transportés">
                          <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.tiers_transportes}</p>
                        </CollapsibleSection>
                      )}

                      {/* Témoins */}
                      {sonasDeclaration.temoins && (
                        <CollapsibleSection title="12. Témoins">
                          <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.temoins}</p>
                        </CollapsibleSection>
                      )}

                      {/* Autorités */}
                      <CollapsibleSection title="13. Autorités">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">PV par</p><p className="font-medium">{sonasDeclaration.pv_par || '-'}</p></div>
                          <div><p className="text-gray-500">Localité</p><p className="font-medium">{sonasDeclaration.localite || '-'}</p></div>
                          <div><p className="text-gray-500">Gendarmerie</p><p className="font-medium">{sonasDeclaration.gendarmerie || '-'}</p></div>
                          <div><p className="text-gray-500">Officier</p><p className="font-medium">{sonasDeclaration.officier_gendarme || '-'}</p></div>
                        </div>
                      </CollapsibleSection>

                      {/* Prime */}
                      <CollapsibleSection title="14. Prime d'assurance">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><p className="text-gray-500">Dernière prime payée ?</p><p className="font-medium">{sonasDeclaration.prime_payee === true ? 'Oui' : sonasDeclaration.prime_payee === false ? 'Non' : '-'}</p></div>
                          {sonasDeclaration.prime_date && <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDateShort(sonasDeclaration.prime_date)}</p></div>}
                        </div>
                      </CollapsibleSection>

                     
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Détails du sinistre</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Type</p><p>{TYPES_SINISTRE[sinistre.type_sinistre]?.icon} {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}</p></div>
                  <div><p className="text-gray-500">Date</p><p><FaCalendarAlt className="inline mr-1 text-gray-400" />{formatDate(sinistre.date_sinistre)}</p></div>
                  <div><p className="text-gray-500">Lieu</p><p><FaMapMarkerAlt className="inline mr-1 text-gray-400" />{sinistre.lieu}</p></div>
                  <div><p className="text-gray-500">Montant estimé</p><p className="font-semibold">{sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : 'Non spécifié'}</p></div>
                  {sinistre.montant_indemnisation > 0 && <div><p className="text-gray-500">Indemnisation</p><p className="text-green-600 font-semibold">{formatMontant(sinistre.montant_indemnisation)}</p></div>}
                  {sinistre.souscription && <div><p className="text-gray-500">Police</p><p>{sinistre.souscription.police_numero || 'N/A'}</p></div>}
                </div>
                <div className="mt-4 pt-4 border-t"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-sm whitespace-pre-wrap">{sinistre.description}</p></div>
              </div>
            )}

            {/* Section indemnisation */}
            {sinistre.indemnisation_payee && (
              <div className="bg-white rounded-lg border border-green-200 p-6">
                <h2 className="text-lg font-semibold mb-4"><FaHandHoldingUsd className="inline mr-2 text-green-600" />Votre indemnisation</h2>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">Montant payé</p><p className="text-xl font-bold text-green-600">{formatMontant(sinistre.indemnisation_montant)}</p></div>
                    <div><p className="text-gray-500">Mode de paiement</p><p className="font-medium">{sinistre.indemnisation_mode === 'virement' ? 'Virement bancaire' : sinistre.indemnisation_mode === 'cheque' ? 'Chèque' : sinistre.indemnisation_mode === 'mobile_money' ? 'Mobile Money' : sinistre.indemnisation_mode}</p></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200"><p className="text-sm text-green-700"><FaCheckCircle className="inline mr-1" />Votre indemnisation a été payée avec succès.</p></div>
                </div>
              </div>
            )}

            {/* Expertises */}
            {expertises.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4"><FaUserCheck className="inline mr-2 text-purple-600" />Expertise</h2>
                {expertises.map(expertise => (
                  <div key={expertise.id} className="border border-purple-200 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={{ nom: expertise.expert_nom, email: expertise.expert_email, photo_profil: expertise.expert_photo }} size="md" />
                        <div><p className="font-medium text-purple-900">{expertise.expert_nom}</p><p className="text-sm text-purple-600">{expertise.expert_email}</p></div>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' : expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {expertise.statut === 'terminee' ? 'Terminée' : expertise.statut === 'en_cours' ? 'En cours' : 'Planifiée'}
                      </span>
                    </div>
                    {expertise.date_expertise && <p className="text-sm text-gray-600 mb-2"><FaCalendarAlt className="inline mr-1" />Expertise {expertise.statut === 'terminee' ? 'réalisée' : 'prévue'} le {formatDateShort(expertise.date_expertise)}</p>}
                    {expertise.rapport && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-medium text-gray-700 mb-2">Rapport</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>
                        {expertise.montant_evalue != null && expertise.montant_evalue > 0 && <p className="text-lg font-semibold text-purple-600 mt-2">Montant évalué : {formatMontant(expertise.montant_evalue)}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Documents</h2><button onClick={() => setShowUploadModal(true)} className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"><FaUpload className="mr-2 h-3 w-3" />Ajouter</button></div>
              {documents.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">Aucun document</p> : (
                <div className="space-y-2">{documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center min-w-0"><FaFileAlt className="h-5 w-5 text-blue-500 mr-3" /><div><p className="text-sm font-medium truncate">{doc.nom_fichier}</p><p className="text-xs text-gray-500">{doc.created_at ? formatDateShort(doc.created_at) : ''}</p></div></div>
                    <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-600"><FaDownload className="h-5 w-5" /></a>
                  </div>
                ))}</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4"><FaHeadset className="inline mr-2" />Besoin d'aide ?</h3>
              <div className="space-y-3">
                <button onClick={() => setShowReclamationModal(true)} className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left text-sm"><FaExclamationCircle className="inline mr-2" />Faire une réclamation</button>
                <button onClick={() => setShowMessageModal(true)} className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left text-sm"><FaCommentMedical className="inline mr-2" />Envoyer un message</button>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4"><FaUserCheck className="inline mr-2 text-green-600" />Agent en charge</h3>
              {sinistre.agent ? (
                <>
                  <div className="flex items-center mb-3">
                    <UserAvatar user={{ nom: sinistre.agent.nom, email: sinistre.agent.email, photo_profil: sinistre.agent.photo_profil }} size="lg" />
                    <div className="ml-3"><p className="font-medium">{sinistre.agent.nom}</p><p className="text-sm text-green-600">Agent ARCA</p><p className="text-xs text-gray-500">{sinistre.agent.email}</p></div>
                  </div>
                  {sinistre.agent.telephone && <div className="flex items-center text-sm text-gray-600 border-t pt-3"><FaPhone className="mr-2 h-3 w-3 text-gray-400" />{sinistre.agent.telephone}</div>}
                  <div className="mt-3 pt-3 border-t"><div className="flex items-center text-xs text-green-700 bg-green-50 rounded-lg p-2"><FaCheckCircle className="mr-1.5 h-3 w-3" />En charge de votre dossier</div></div>
                </>
              ) : sinistre.statut === 'en_attente' ? (
                <div className="text-center py-3"><div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaClock className="h-6 w-6 text-yellow-600" /></div><p className="text-sm font-medium text-yellow-800">En attente d'affectation</p></div>
              ) : (
                <div className="text-center py-3"><div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><FaUser className="h-6 w-6 text-blue-600" /></div><p className="text-sm font-medium text-blue-800">Agent ARCA</p><p className="text-xs text-gray-500">Votre dossier est en cours de traitement</p></div>
              )}
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4"><FaHistory className="inline mr-2 text-gray-400" />Activité récente</h3>
              {historique.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Aucune activité</p> : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {historique.slice(0, 10).map((entry: any) => (
                    <div key={entry.id} className="border-l-2 border-blue-200 pl-3">
                      <p className="text-xs text-gray-400">{formatDateShort(entry.created_at)}</p>
                      <p className="text-sm"><span className="font-medium">{entry.commentaire || `${entry.ancien_statut} → ${entry.nouveau_statut}`}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Communications */}
        <div className="mt-6 bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4"><FaComments className="inline mr-2 text-blue-500" />Communications</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {communications.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">Aucune communication</p> : communications.map(comm => (
              <div key={comm.id} className={`p-4 rounded-lg ${comm.type === 'reclamation' ? 'bg-orange-50 border border-orange-200' : comm.type === 'notification' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center"><UserAvatar user={{ nom: comm.expediteur_nom }} size="sm" /><div className="ml-2"><p className="text-sm font-medium">{comm.expediteur_nom}<span className="ml-2 text-xs text-gray-500">{comm.expediteur_role === 'assure' ? 'Vous' : comm.expediteur_role === 'agent' ? 'Agent' : 'Expert'}</span></p><p className="text-xs text-gray-400">{formatDate(comm.created_at)}</p></div></div>
                  {comm.type === 'reclamation' && <div className="flex space-x-2">{comm.priorite && <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(comm.priorite)}`}>{comm.priorite}</span>}{comm.statut_reclamation && <span className={`px-2 py-0.5 rounded-full text-xs ${getReclamationStatusColor(comm.statut_reclamation)}`}>{comm.statut_reclamation}</span>}</div>}
                </div>
                <p className="text-sm whitespace-pre-wrap">{comm.contenu}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowMessageModal(true)} className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaPaperPlane className="mr-2 h-4 w-4" />Envoyer un message</button>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)} title="Ajouter des documents">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-2">Type</label><select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm"><option value="photo_dommage">Photo des dommages</option><option value="constat_amiable">Constat amiable</option><option value="rapport_police">Rapport de police</option><option value="facture">Facture</option><option value="devis">Devis</option><option value="autre_document">Autre</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Fichiers</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"><input type="file" multiple onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" id="file-upload" /><label htmlFor="file-upload" className="cursor-pointer"><FaUpload className="mx-auto h-8 w-8 text-gray-400" /><p className="mt-2 text-sm">Cliquez pour sélectionner</p></label></div></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleUploadDocuments} disabled={selectedFiles.length === 0} className="flex-1 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Télécharger</button><button onClick={() => setShowUploadModal(false)} className="flex-1 border rounded-md py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}
      {showReclamationModal && (
        <Modal onClose={() => setShowReclamationModal(false)} title="Faire une réclamation">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Sujet </label><input type="text" value={reclamationForm.sujet} onChange={(e) => setReclamationForm({...reclamationForm, sujet: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Priorité</label><select value={reclamationForm.priorite} onChange={(e) => setReclamationForm({...reclamationForm, priorite: e.target.value as any})} className="w-full border rounded-md px-3 py-2 text-sm"><option value="normal">Normale</option><option value="urgent">Urgente</option><option value="critique">Critique</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Description </label><textarea value={reclamationForm.contenu} onChange={(e) => setReclamationForm({...reclamationForm, contenu: e.target.value})} rows={5} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleSendReclamation} disabled={!reclamationForm.sujet || !reclamationForm.contenu} className="flex-1 bg-orange-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-orange-700 disabled:opacity-50">Envoyer</button><button onClick={() => setShowReclamationModal(false)} className="flex-1 border rounded-md py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}
      {showMessageModal && (
        <Modal onClose={() => setShowMessageModal(false)} title="Envoyer un message">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Votre message</label><textarea value={messageForm.contenu} onChange={(e) => setMessageForm({contenu: e.target.value})} rows={4} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleSendMessage} disabled={!messageForm.contenu.trim()} className="flex-1 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Envoyer</button><button onClick={() => setShowMessageModal(false)} className="flex-1 border rounded-md py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}