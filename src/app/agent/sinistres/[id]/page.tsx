

// // app/agent/sinistres/[id]/page.tsx
// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { 
//   FaArrowLeft, FaEdit, FaUpload, FaDownload, FaFileAlt,
//   FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
//   FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
//   FaHistory, FaTimes, FaExclamationTriangle, FaClipboardList,
//   FaUserCheck, FaUserTie, FaInfo, FaPaperPlane,
//   FaComments, FaPhone, FaFileContract,
//   FaClipboardCheck, FaCheck, FaBan, FaPlus, FaTrash,
//   FaHandHoldingUsd, FaCar, FaIdCard, FaTools, FaUserInjured,
//   FaChevronDown, FaChevronUp, FaMinus
// } from 'react-icons/fa';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

// // ==================== TYPES ====================

// type Assure = {
//   nom: string;
//   email: string;
//   telephone?: string;
//   photo_profil?: string;
// };

// type Expert = {
//   id: string;
//   nom: string;
//   email: string;
//   telephone?: string;
// };

// type Expertise = {
//   id: string;
//   expert_id: string;
//   expert_nom: string;
//   expert_email: string;
//   date_designation: string;
//   date_expertise: string | null;
//   rapport: string | null;
//   conclusion: string | null;
//   montant_evalue: number | null;
//   statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
//   documents: ExpertiseDocument[];
//   created_at: string;
// };

// type ExpertiseDocument = {
//   id: string;
//   nom_fichier: string;
//   url_fichier: string;
//   type_document: string;
//   created_at: string;
// };

// type Communication = {
//   id: string;
//   type: 'message' | 'notification' | 'reclamation';
//   contenu: string;
//   expediteur_nom: string;
//   expediteur_role: string;
//   created_at: string;
// };

// type Sinistre = {
//   id: string;
//   numero_dossier: string;
//   type_sinistre: string;
//   description: string;
//   date_sinistre: string;
//   lieu: string;
//   statut: string;
//   montant_estime: number;
//   montant_indemnisation: number;
//   created_at: string;
//   updated_at: string;
//   assure: Assure;
//   souscription?: {
//     police_numero?: string;
//     produit?: { nom: string };
//   };
// };

// type Indemnisation = {
//   id: string;
//   montant_indemnisation: number;
//   mode_paiement: string;
//   statut: string;
//   date_validation: string | null;
//   date_paiement: string | null;
//   reference_paiement: string | null;
//   commentaire: string | null;
// };

// type SonasDeclaration = {
//   id: number;
//   agence: string;
//   police: string;
//   valable_du: string;
//   valable_au: string;
//   claim_no: string;
//   garantie: string;
//   telephone: string;
//   date_heure_accident: string;
//   lieu_accident: string;
//   preneur_nom: string;
//   preneur_prenoms: string;
//   preneur_adresse: string;
//   conducteur_nom_prenom: string;
//   conducteur_age: number;
//   conducteur_a_service: boolean;
//   conducteur_titre_conduite: string;
//   permis_no: string;
//   permis_delivre_a: string;
//   permis_date: string;
//   vehicule_marque_type: string;
//   vehicule_plaque: string;
//   vehicule_chassis: string;
//   vehicule_moteur: string;
//   vehicule_puissance: string;
//   vehicule_annee: number;
//   vehicule_kilometrage: number;
//   vehicule_valeur: number;
//   garantie_rc: boolean;
//   garantie_dm: boolean;
//   garantie_inc: boolean;
//   garantie_vol: boolean;
//   description_accident: string;
//   degats_description: string;
//   degats_montant_evalue: number;
//   vehicule_immobilise: boolean;
//   lieu_garde_expertise: string;
//   adversaire_nom: string;
//   adversaire_post_nom: string;
//   adversaire_prenom: string;
//   adversaire_adresse: string;
//   adversaire_vehicule: string;
//   adversaire_plaque: string;
//   adversaire_assurance: string;
//   adversaire_telephone: string;
//   degats_materiels_description: string;
//   degats_materiels_evalues: number;
//   blesses_ou_morts: boolean;
//   victimes_infos: string;
//   victimes_soins_lieu: string;
//   hopital_nom_adresse: string;
//   medecin_nom: string;
//   medecin_telephone: string;
//   tiers_transportes: string;
//   temoins: string;
//   pv_par: string;
//   localite: string;
//   gendarmerie: string;
//   officier_gendarme: string;
//   prime_payee: boolean;
//   prime_date: string;
//   fait_a: string;
//   date_signature: string;
// };

// // ==================== CONSTANTES ====================

// const STATUTS: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number; description: string; }> = {
//   en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 10, description: 'Dossier reçu, en attente de traitement' },
//   en_cours: { label: 'En cours', icon: FaSpinner, color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 30, description: 'Dossier pris en charge par un agent' },
//   expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-100', progress: 50, description: 'Expert désigné, évaluation en cours' },
//   en_indemnisation: { label: 'En indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-100', progress: 75, description: 'Indemnisation en cours de versement' },
//   cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', progress: 100, description: 'Dossier clôturé' },
//   refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-100', progress: 0, description: 'Dossier refusé' },
// };

// const TYPES_SINISTRE: Record<string, { label: string; icon: string }> = {
//   accident_auto: { label: 'Accident auto', icon: '🚗' },
//   vol: { label: 'Vol', icon: '🔫' },
//   incendie: { label: 'Incendie', icon: '🔥' },
//   degats_eau: { label: 'Dégâts des eaux', icon: '💧' },
//   catastrophe_naturelle: { label: 'Catastrophe naturelle', icon: '🌪️' },
//   bris_glace: { label: 'Bris de glace', icon: '🪟' },
//   responsabilite_civile: { label: 'Responsabilité civile', icon: '⚖️' },
//   autre: { label: 'Autre', icon: '📋' },
// };

// const INDEMNISATION_STATUTS: Record<string, { label: string; color: string; bgColor: string }> = {
//   en_attente: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
//   validee: { label: 'Validée', color: 'text-blue-700', bgColor: 'bg-blue-100' },
//   payee: { label: 'Payée', color: 'text-green-700', bgColor: 'bg-green-100' },
//   annulee: { label: 'Annulée', color: 'text-red-700', bgColor: 'bg-red-100' },
// };

// const MODES_PAIEMENT: Record<string, string> = {
//   virement: 'Virement bancaire',
//   cheque: 'Chèque',
//   mobile_money: 'Mobile Money',
//   especes: 'Espèces',
// };

// // ==================== COMPOSANTS ====================

// function AssureAvatar({ assure, size = 'md' }: { assure: Assure; size?: 'sm' | 'md' | 'lg' }) {
//   const sizeClasses = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
//   const getInitials = (nom: string) => nom?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || '??';
//   return (
//     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
//       {assure.photo_profil ? (
//         <img src={assure.photo_profil} alt="" className="w-full h-full object-cover" />
//       ) : (
//         <div className="w-full h-full bg-orange-600 flex items-center justify-center">
//           <span className="text-white font-medium">{getInitials(assure.nom || '')}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
//         <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">{title}</h3>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
//           </div>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatutBadge({ statut }: { statut: string }) {
//   const info = STATUTS[statut] || STATUTS.en_attente;
//   const Icon = info.icon;
//   return (
//     <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${info.bgColor} ${info.color}`}>
//       <Icon className="mr-1.5 h-4 w-4" />{info.label}
//     </span>
//   );
// }

// function ProgressBar({ progress }: { progress: number }) {
//   const getColor = () => {
//     if (progress >= 100) return 'bg-green-500';
//     if (progress >= 75) return 'bg-indigo-500';
//     if (progress >= 50) return 'bg-purple-500';
//     if (progress >= 30) return 'bg-blue-500';
//     return 'bg-yellow-500';
//   };
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-3">
//       <div className={`h-3 rounded-full transition-all duration-500 ${getColor()}`} style={{ width: `${Math.max(progress, 2)}%` }} />
//     </div>
//   );
// }

// function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="flex items-center gap-2">{icon && <span className="text-blue-600">{icon}</span>}<h3 className="font-semibold text-sm text-gray-900">{title}</h3></div>
//         {isOpen ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
//       </button>
//       {isOpen && <div className="p-4 bg-white">{children}</div>}
//     </div>
//   );
// }

// // ==================== PAGE PRINCIPALE ====================

// type Props = { params: Promise<{ id: string }> };

// export default function SinistreDetailPage({ params }: Props) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { id } = use(params);

//   const [sinistre, setSinistre] = useState<Sinistre | null>(null);
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [historique, setHistorique] = useState<any[]>([]);
//   const [expertises, setExpertises] = useState<Expertise[]>([]);
//   const [communications, setCommunications] = useState<Communication[]>([]);
//   const [indemnisation, setIndemnisation] = useState<Indemnisation | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [sonasDeclaration, setSonasDeclaration] = useState<SonasDeclaration | null>(null);
//   const [showAllSonasDetails, setShowAllSonasDetails] = useState(false);

//   const [experts, setExperts] = useState<Expert[]>([]);
//   const [showDesignateExpert, setShowDesignateExpert] = useState(false);
//   const [selectedExpert, setSelectedExpert] = useState('');
//   const [dateExpertise, setDateExpertise] = useState('');

//   const [newMessage, setNewMessage] = useState('');
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusComment, setStatusComment] = useState('');

//   const [showIndemnisationModal, setShowIndemnisationModal] = useState(false);
//   const [indemnisationForm, setIndemnisationForm] = useState({ montant_indemnisation: 0, mode_paiement: 'virement', commentaire: '' });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (user && id) {
//       chargerTout();
//       if (['admin', 'agent'].includes(user.role || '')) chargerExperts();
//     }
//   }, [user, id]);

//   const chargerTout = async () => {
//     try { setLoading(true); await Promise.all([chargerSinistre(), chargerExpertises(), chargerCommunications(), chargerIndemnisation()]); }
//     finally { setLoading(false); }
//   };

//   const chargerSinistre = async () => {
//     const { data } = await supabase.from('sinistres').select('*').eq('id', id).single();
//     if (!data) throw new Error('Sinistre non trouvé');

//     const { data: assureData } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.assure_id).single();
//     let souscription = null;
//     if (data.souscription_id) {
//       const { data: subData } = await supabase.from('souscriptions').select('police_numero').eq('id', data.souscription_id).single();
//       souscription = subData;

//       // Charger SONAS si automobile
//       const { data: souscriptionData } = await supabase
//         .from('souscriptions')
//         .select('type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(code)')
//         .eq('id', data.souscription_id)
//         .single();
      
//       const typeAssuranceCode = (souscriptionData?.type_assurance as any)?.code;
      
//       if (typeAssuranceCode === 'automobile') {
//         const { data: sonasData } = await supabase
//           .from('sonas_declarations_accident')
//           .select('*')
//           .eq('sinistre_id', id)
//           .single();
        
//         if (sonasData) setSonasDeclaration(sonasData as SonasDeclaration);
//       }
//     }

//     setSinistre({ ...data, assure: assureData || { nom: 'Inconnu', email: '' }, souscription });

//     const { data: docs } = await supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
//     setDocuments(docs || []);

//     const { data: hist } = await supabase.from('sinistre_historique').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
//     setHistorique(hist || []);
//   };

//   const chargerExpertises = async () => {
//     const { data } = await supabase.from('expertises').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
//     if (data && data.length > 0) {
//       const expertIds = [...new Set(data.map(e => e.expert_id))];
//       const { data: expertsData } = await supabase.from('users').select('id, nom, email').in('id', expertIds);
//       const expertMap = new Map();
//       if (expertsData) expertsData.forEach(e => expertMap.set(e.id, e));
//       setExpertises(data.map(e => ({ ...e, expert_nom: expertMap.get(e.expert_id)?.nom || 'Inconnu', expert_email: expertMap.get(e.expert_id)?.email || '', documents: [] })));
//     }
//   };

//   const chargerCommunications = async () => {
//     const { data } = await supabase.from('sinistre_communications').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(50);
//     if (data && data.length > 0) {
//       const userIds = [...new Set(data.map(c => c.expediteur_id))];
//       const { data: users } = await supabase.from('users').select('id, nom, role').in('id', userIds);
//       const userMap = new Map();
//       if (users) users.forEach(u => userMap.set(u.id, u));
//       setCommunications(data.map(c => ({ ...c, expediteur_nom: userMap.get(c.expediteur_id)?.nom || 'Système', expediteur_role: userMap.get(c.expediteur_id)?.role || 'system' })));
//     } else setCommunications([]);
//   };

//   const chargerExperts = async () => {
//     const { data } = await supabase.from('users').select('id, nom, email, telephone').eq('role', 'expert').order('nom');
//     setExperts(data || []);
//   };

//   const chargerIndemnisation = async () => {
//     const { data } = await supabase.from('indemnisations').select('*').eq('sinistre_id', id).single();
//     if (data) {
//       setIndemnisation(data);
//       setIndemnisationForm({ montant_indemnisation: data.montant_indemnisation, mode_paiement: data.mode_paiement, commentaire: data.commentaire || '' });
//     }
//   };

//   const isIndemnisationPayee = indemnisation?.statut === 'payee';
//   const statutEffectif = isIndemnisationPayee ? 'cloture' : (sinistre?.statut || 'en_attente');

//   // ============ ACTIONS ============

//   const handleDesignateExpert = async () => {
//     if (!selectedExpert || !dateExpertise) { setError('Veuillez sélectionner un expert et une date'); return; }
//     try {
//       await supabase.from('expertises').insert({ sinistre_id: id, expert_id: selectedExpert, date_designation: new Date().toISOString(), date_expertise: dateExpertise, statut: 'planifiee' });
//       if (sinistre?.statut === 'en_cours') await supabase.from('sinistres').update({ statut: 'expertise', updated_by: user?.id }).eq('id', id);
//       await ajouterCommunication('notification', `Expert désigné. Date prévue : ${formatDate(dateExpertise)}`);
//       setSuccess('Expert désigné'); setShowDesignateExpert(false); await chargerTout(); setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'message', contenu: newMessage, expediteur_id: user?.id });
//       setNewMessage(''); await chargerCommunications();
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleChangeStatus = async () => {
//     if (!newStatus) return;
//     try {
//       const updateData: any = { statut: newStatus, updated_by: user?.id, updated_at: new Date().toISOString() };
//       if (newStatus === 'cloture') updateData.date_cloture = new Date().toISOString();
//       await supabase.from('sinistres').update(updateData).eq('id', id);
//       await ajouterCommunication('notification', `Statut mis à jour : ${STATUTS[newStatus]?.label}`);
//       setSuccess('Statut mis à jour'); setShowStatusModal(false); await chargerSinistre(); setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleUploadDocument = async (files: FileList) => {
//     try {
//       for (const file of Array.from(files)) {
//         const fileName = `${id}/${Date.now()}-${file.name}`;
//         await supabase.storage.from('sinistres').upload(fileName, file);
//         const { data } = supabase.storage.from('sinistres').getPublicUrl(fileName);
//         await supabase.from('sinistre_documents').insert({ sinistre_id: id, nom_fichier: file.name, url_fichier: data.publicUrl, type_document: 'autre_document', taille_fichier: file.size, type_mime: file.type, uploaded_by: user?.id });
//       }
//       await chargerSinistre(); setSuccess('Documents téléchargés'); setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleInitierIndemnisation = () => {
//     const expertiseTerminee = expertises.find(e => e.statut === 'terminee');
//     const montantBase = expertiseTerminee?.montant_evalue || sinistre?.montant_estime || 0;
//     setIndemnisationForm({ montant_indemnisation: montantBase, mode_paiement: indemnisation?.mode_paiement || 'virement', commentaire: indemnisation?.commentaire || '' });
//     setShowIndemnisationModal(true);
//   };

//   const handleSaveIndemnisation = async () => {
//     setSaving(true);
//     try {
//       if (indemnisation?.id) {
//         await supabase.from('indemnisations').update({ montant_indemnisation: indemnisationForm.montant_indemnisation, mode_paiement: indemnisationForm.mode_paiement, commentaire: indemnisationForm.commentaire, updated_at: new Date().toISOString() }).eq('id', indemnisation.id);
//       } else {
//         await supabase.from('indemnisations').insert({ sinistre_id: id, montant_indemnisation: indemnisationForm.montant_indemnisation, mode_paiement: indemnisationForm.mode_paiement, statut: 'en_attente', commentaire: indemnisationForm.commentaire, created_by: user?.id });
//         if (sinistre?.statut === 'expertise') await supabase.from('sinistres').update({ statut: 'en_indemnisation', updated_by: user?.id }).eq('id', id);
//       }
//       await ajouterCommunication('notification', `Indemnisation ${indemnisation?.id ? 'mise à jour' : 'initiée'} : ${formatMontant(indemnisationForm.montant_indemnisation)}`);
//       setSuccess('Indemnisation enregistrée'); setShowIndemnisationModal(false); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//     finally { setSaving(false); }
//   };

//   const handleValidateIndemnisation = async () => {
//     try {
//       await supabase.from('indemnisations').update({ statut: 'validee', date_validation: new Date().toISOString() }).eq('id', indemnisation?.id);
//       await ajouterCommunication('notification', `Indemnisation validée : ${formatMontant(indemnisation!.montant_indemnisation)}`);
//       setSuccess('Indemnisation validée'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handlePayerIndemnisation = async () => {
//     const reference = prompt('Référence de paiement (optionnel) :');
//     try {
//       await supabase.from('indemnisations').update({ statut: 'payee', date_paiement: new Date().toISOString(), reference_paiement: reference || null }).eq('id', indemnisation?.id);
//       await supabase.from('sinistres').update({ montant_indemnisation: indemnisation!.montant_indemnisation, updated_by: user?.id }).eq('id', id);
//       await ajouterCommunication('notification', `Paiement effectué : ${formatMontant(indemnisation!.montant_indemnisation)}${reference ? ` (Réf: ${reference})` : ''}`);
//       setSuccess('Paiement enregistré'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleAnnulerIndemnisation = async () => {
//     if (!confirm('Annuler cette indemnisation ?')) return;
//     try {
//       await supabase.from('indemnisations').update({ statut: 'annulee' }).eq('id', indemnisation?.id);
//       await ajouterCommunication('notification', 'Indemnisation annulée');
//       setSuccess('Indemnisation annulée'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const ajouterCommunication = async (type: string, contenu: string) => {
//     await supabase.from('sinistre_communications').insert({ sinistre_id: id, type, contenu, expediteur_id: user?.id });
//   };

//   const formatDate = (d: string) => { try { return format(new Date(d), 'dd MMMM yyyy à HH:mm', { locale: fr }); } catch { return d; } };
//   const formatDateShort = (d: string) => { try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); } catch { return d; } };
//   const formatMontant = (m: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);

//   if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><FaSpinner className="h-12 w-12 text-blue-500 animate-spin" /></div>;
//   if (!sinistre) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" /><p className="mt-4">Dossier non trouvé</p><Link href="/sinistres" className="mt-4 inline-block text-blue-600">Retour aux sinistres</Link></div></div>;

//   const statutInfo = STATUTS[statutEffectif] || STATUTS.en_attente;
//   const isAgent = ['admin', 'agent'].includes(user?.role || '');
//   const isExpert = user?.role === 'expert';
//   const expertiseTerminee = expertises.find(e => e.statut === 'terminee');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <Link href="/agent/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"><FaArrowLeft className="mr-2 h-4 w-4" />Retour aux sinistres</Link>
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-semibold">Dossier {sinistre.numero_dossier}</h1>
//               <div className="flex items-center space-x-3 mt-1">
//                 <StatutBadge statut={statutEffectif} />
//                 {isIndemnisationPayee && <span className="text-xs text-green-600 font-medium">(Indemnisation payée)</span>}
//                 <span className="text-sm text-gray-500">Créé le {formatDateShort(sinistre.created_at)}</span>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               {isAgent && (
//                 <>
//                   <button onClick={() => setShowDesignateExpert(true)} className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><FaUserTie className="mr-2 h-4 w-4" />Désigner expert</button>
//                   {expertiseTerminee && !indemnisation && (
//                     <button onClick={handleInitierIndemnisation} className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"><FaHandHoldingUsd className="mr-2 h-4 w-4" />Indemnisation</button>
//                   )}
//                   {indemnisation && (
//                     <button onClick={handleInitierIndemnisation} className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><FaEdit className="mr-2 h-4 w-4" />Indemnisation</button>
//                   )}
//                   <button onClick={() => { setNewStatus(sinistre.statut); setShowStatusModal(true); }} className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"><FaEdit className="mr-2 h-4 w-4" />Statut</button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-3 h-5 w-5" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4" /></button></div>}
//         {success && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-3 h-5 w-5" />{success}</div>}

//         {/* Progression */}
//         <div className="bg-white rounded-lg border p-6 mb-6">
//           <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">Progression</h2><StatutBadge statut={statutEffectif} /></div>
//           <ProgressBar progress={statutInfo.progress} />
//           <div className="flex justify-between mt-2 text-xs text-gray-500">
//             {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
//               <span key={key} className={statutEffectif === key ? 'font-semibold text-gray-900' : ''}>{val.label}</span>
//             ))}
//           </div>
//           <div className="mt-4 p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-800"><FaInfo className="inline mr-1" />{statutInfo.description}</p></div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             {/* Détails - SONAS ou Normal */}
//             {sonasDeclaration ? (
//               <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
//                 <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
//                   <div className="flex items-center gap-3"><FaCar className="h-5 w-5" /><h2 className="text-lg font-semibold">Déclaration d'Accident Automobile - SONAS</h2></div>
//                   <button onClick={() => setShowAllSonasDetails(!showAllSonasDetails)} className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
//                     {showAllSonasDetails ? <><FaMinus className="h-3 w-3" /> Moins de détails</> : <><FaPlus className="h-3 w-3" /> Plus de détails</>}
//                   </button>
//                 </div>
//                 <div className="p-6 space-y-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-4 rounded-lg">
//                     <div><p className="text-gray-500">N° Dossier</p><p className="font-semibold text-blue-700">{sonasDeclaration.claim_no}</p></div>
//                     <div><p className="text-gray-500">Date accident</p><p className="font-medium">{formatDate(sonasDeclaration.date_heure_accident)}</p></div>
//                     <div><p className="text-gray-500">Lieu</p><p className="font-medium truncate">{sonasDeclaration.lieu_accident}</p></div>
//                     <div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'} - {sonasDeclaration.vehicule_plaque || '-'}</p></div>
//                   </div>

//                   {showAllSonasDetails && (
//                     <div className="space-y-4 pt-4 border-t">
//                       <CollapsibleSection title="Informations générales" icon={<FaFileAlt className="h-4 w-4" />} defaultOpen={true}>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                           <div><p className="text-gray-500">Agence</p><p className="font-medium">{sonasDeclaration.agence}</p></div>
//                           <div><p className="text-gray-500">Police</p><p className="font-medium">{sonasDeclaration.police || '-'}</p></div>
//                           <div><p className="text-gray-500">Garantie</p><p className="font-medium">{sonasDeclaration.garantie || '-'}</p></div>
//                           <div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.telephone || '-'}</p></div>
//                           {sonasDeclaration.valable_du && <div><p className="text-gray-500">Valable du</p><p className="font-medium">{formatDateShort(sonasDeclaration.valable_du)}</p></div>}
//                           {sonasDeclaration.valable_au && <div><p className="text-gray-500">Au</p><p className="font-medium">{formatDateShort(sonasDeclaration.valable_au)}</p></div>}
//                         </div>
//                       </CollapsibleSection>
//                       <CollapsibleSection title="2. Preneur d'assurance" icon={<FaUser className="h-4 w-4" />}>
//                         <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.preneur_nom || '-'}</p></div><div><p className="text-gray-500">Prénoms</p><p className="font-medium">{sonasDeclaration.preneur_prenoms || '-'}</p></div><div className="col-span-2"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.preneur_adresse || '-'}</p></div></div>
//                       </CollapsibleSection>
//                       <CollapsibleSection title="3. Conducteur" icon={<FaIdCard className="h-4 w-4" />}>
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"><div><p className="text-gray-500">Nom et prénom</p><p className="font-medium">{sonasDeclaration.conducteur_nom_prenom || '-'}</p></div><div><p className="text-gray-500">Âge</p><p className="font-medium">{sonasDeclaration.conducteur_age || '-'}</p></div><div><p className="text-gray-500">À votre service ?</p><p className="font-medium">{sonasDeclaration.conducteur_a_service === true ? 'Oui' : sonasDeclaration.conducteur_a_service === false ? 'Non' : '-'}</p></div><div className="col-span-2"><p className="text-gray-500">Titre de conduite</p><p className="font-medium">{sonasDeclaration.conducteur_titre_conduite || '-'}</p></div><div><p className="text-gray-500">Permis n°</p><p className="font-medium">{sonasDeclaration.permis_no || '-'}</p></div><div><p className="text-gray-500">Délivré à</p><p className="font-medium">{sonasDeclaration.permis_delivre_a || '-'}</p></div><div><p className="text-gray-500">Date permis</p><p className="font-medium">{sonasDeclaration.permis_date ? formatDateShort(sonasDeclaration.permis_date) : '-'}</p></div></div>
//                       </CollapsibleSection>
//                       <CollapsibleSection title="4. Véhicule" icon={<FaCar className="h-4 w-4" />}>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-gray-500">Marque et type</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'}</p></div><div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.vehicule_plaque || '-'}</p></div><div><p className="text-gray-500">Châssis</p><p className="font-medium">{sonasDeclaration.vehicule_chassis || '-'}</p></div><div><p className="text-gray-500">Moteur</p><p className="font-medium">{sonasDeclaration.vehicule_moteur || '-'}</p></div><div><p className="text-gray-500">Puissance</p><p className="font-medium">{sonasDeclaration.vehicule_puissance || '-'}</p></div><div><p className="text-gray-500">Année</p><p className="font-medium">{sonasDeclaration.vehicule_annee || '-'}</p></div><div><p className="text-gray-500">Kilométrage</p><p className="font-medium">{sonasDeclaration.vehicule_kilometrage ? `${sonasDeclaration.vehicule_kilometrage} km` : '-'}</p></div><div><p className="text-gray-500">Valeur</p><p className="font-medium">{sonasDeclaration.vehicule_valeur ? formatMontant(sonasDeclaration.vehicule_valeur) : '-'}</p></div></div>
//                         <div className="mt-3 pt-3 border-t"><p className="text-xs text-gray-500 mb-2">Garanties :</p><div className="flex gap-4"><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_rc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>R.C.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_dm ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>D.M.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_inc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Inc.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_vol ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Vol</span></div></div>
//                       </CollapsibleSection>
//                       <CollapsibleSection title="5. Description de l'accident" icon={<FaClipboardList className="h-4 w-4" />}><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.description_accident || 'Aucune description'}</p></CollapsibleSection>
//                       <CollapsibleSection title="6. Dégâts de votre véhicule" icon={<FaTools className="h-4 w-4" />}><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_description || '-'}</p></div><div><p className="text-gray-500">Montant évalué</p><p className="font-medium">{sonasDeclaration.degats_montant_evalue ? formatMontant(sonasDeclaration.degats_montant_evalue) : '-'}</p></div></div></CollapsibleSection>
//                       <CollapsibleSection title="7. Garage"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Véhicule immobilisé ?</p><p className="font-medium">{sonasDeclaration.vehicule_immobilise === true ? 'Oui' : sonasDeclaration.vehicule_immobilise === false ? 'Non' : '-'}</p></div><div><p className="text-gray-500">Lieu de garde</p><p className="font-medium">{sonasDeclaration.lieu_garde_expertise || '-'}</p></div></div></CollapsibleSection>
//                       <CollapsibleSection title="8. Adversaire"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.adversaire_nom || '-'}</p></div><div><p className="text-gray-500">Post-nom</p><p className="font-medium">{sonasDeclaration.adversaire_post_nom || '-'}</p></div><div><p className="text-gray-500">Prénom</p><p className="font-medium">{sonasDeclaration.adversaire_prenom || '-'}</p></div><div className="col-span-4"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.adversaire_adresse || '-'}</p></div><div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.adversaire_vehicule || '-'}</p></div><div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.adversaire_plaque || '-'}</p></div><div><p className="text-gray-500">Assurance</p><p className="font-medium">{sonasDeclaration.adversaire_assurance || '-'}</p></div><div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.adversaire_telephone || '-'}</p></div></div></CollapsibleSection>
//                       <CollapsibleSection title="9. Dégâts matériels (tiers)"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_materiels_description || '-'}</p></div><div><p className="text-gray-500">Dégâts évalués à</p><p className="font-medium">{sonasDeclaration.degats_materiels_evalues ? formatMontant(sonasDeclaration.degats_materiels_evalues) : '-'}</p></div></div></CollapsibleSection>
//                       <CollapsibleSection title="10. Blessés ou morts" icon={<FaUserInjured className="h-4 w-4" />}><div className="space-y-3 text-sm"><div><p className="text-gray-500">Blessés ou morts ?</p><p className="font-medium">{sonasDeclaration.blesses_ou_morts ? 'Oui' : 'Non'}</p></div>{sonasDeclaration.victimes_infos && <div><p className="text-gray-500">Victimes</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.victimes_infos}</p></div>}{sonasDeclaration.victimes_soins_lieu && <div><p className="text-gray-500">Lieu des soins</p><p className="font-medium">{sonasDeclaration.victimes_soins_lieu}</p></div>}<div className="grid grid-cols-2 gap-4">{sonasDeclaration.hopital_nom_adresse && <div><p className="text-gray-500">Hôpital</p><p className="font-medium">{sonasDeclaration.hopital_nom_adresse}</p></div>}{sonasDeclaration.medecin_nom && <div><p className="text-gray-500">Médecin</p><p className="font-medium">{sonasDeclaration.medecin_nom}</p></div>}</div>{sonasDeclaration.medecin_telephone && <div><p className="text-gray-500">Tél médecin</p><p className="font-medium">{sonasDeclaration.medecin_telephone}</p></div>}</div></CollapsibleSection>
//                       {sonasDeclaration.tiers_transportes && <CollapsibleSection title="11. Tiers transportés"><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.tiers_transportes}</p></CollapsibleSection>}
//                       {sonasDeclaration.temoins && <CollapsibleSection title="12. Témoins"><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.temoins}</p></CollapsibleSection>}
//                       <CollapsibleSection title="13. Autorités"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">PV par</p><p className="font-medium">{sonasDeclaration.pv_par || '-'}</p></div><div><p className="text-gray-500">Localité</p><p className="font-medium">{sonasDeclaration.localite || '-'}</p></div><div><p className="text-gray-500">Gendarmerie</p><p className="font-medium">{sonasDeclaration.gendarmerie || '-'}</p></div><div><p className="text-gray-500">Officier</p><p className="font-medium">{sonasDeclaration.officier_gendarme || '-'}</p></div></div></CollapsibleSection>
//                       <CollapsibleSection title="14. Prime d'assurance"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Dernière prime payée ?</p><p className="font-medium">{sonasDeclaration.prime_payee === true ? 'Oui' : sonasDeclaration.prime_payee === false ? 'Non' : '-'}</p></div>{sonasDeclaration.prime_date && <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDateShort(sonasDeclaration.prime_date)}</p></div>}</div></CollapsibleSection>
//                       <CollapsibleSection title="Signature"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Fait à</p><p className="font-medium">{sonasDeclaration.fait_a || '-'}</p></div><div><p className="text-gray-500">Date</p><p className="font-medium">{sonasDeclaration.date_signature ? formatDateShort(sonasDeclaration.date_signature) : '-'}</p></div></div></CollapsibleSection>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg border p-6">
//                 <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Type</p><p>{TYPES_SINISTRE[sinistre.type_sinistre]?.icon} {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}</p></div>
//                   <div><p className="text-gray-500">Date</p><p>{formatDate(sinistre.date_sinistre)}</p></div>
//                   <div><p className="text-gray-500">Lieu</p><p>{sinistre.lieu}</p></div>
//                   <div><p className="text-gray-500">Montant estimé</p><p className="font-medium">{formatMontant(sinistre.montant_estime)}</p></div>
//                   {sinistre.montant_indemnisation > 0 && <div><p className="text-gray-500">Indemnisé</p><p className="font-medium text-green-600">{formatMontant(sinistre.montant_indemnisation)}</p></div>}
//                   {sinistre.souscription && <div><p className="text-gray-500">Police</p><p>{sinistre.souscription.police_numero || 'N/A'}</p></div>}
//                 </div>
//                 <div className="mt-4 pt-4 border-t"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-sm whitespace-pre-wrap">{sinistre.description}</p></div>
//               </div>
//             )}

//             {/* Indemnisation */}
//             {indemnisation && (
//               <div className="bg-white rounded-lg border border-green-200 p-6">
//                 <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold"><FaHandHoldingUsd className="inline mr-2 text-green-600" />Indemnisation</h2><span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${INDEMNISATION_STATUTS[indemnisation.statut]?.bgColor} ${INDEMNISATION_STATUTS[indemnisation.statut]?.color}`}>{INDEMNISATION_STATUTS[indemnisation.statut]?.label}</span></div>
//                 <div className="grid grid-cols-2 gap-4 text-sm mb-4"><div><p className="text-gray-500">Montant</p><p className="text-xl font-bold text-green-600">{formatMontant(indemnisation.montant_indemnisation)}</p></div><div><p className="text-gray-500">Mode</p><p className="font-medium">{MODES_PAIEMENT[indemnisation.mode_paiement] || indemnisation.mode_paiement}</p></div>{indemnisation.date_validation && <div><p className="text-gray-500">Date validation</p><p>{formatDateShort(indemnisation.date_validation)}</p></div>}{indemnisation.date_paiement && <div><p className="text-gray-500">Date paiement</p><p>{formatDateShort(indemnisation.date_paiement)}</p></div>}{indemnisation.reference_paiement && <div><p className="text-gray-500">Référence</p><p className="font-mono">{indemnisation.reference_paiement}</p></div>}</div>
//                 {indemnisation.commentaire && <div className="bg-gray-50 rounded-lg p-3 mb-4"><p className="text-sm text-gray-600">{indemnisation.commentaire}</p></div>}
//                 {isAgent && (
//                   <div className="flex flex-wrap gap-2 pt-2 border-t">
//                     <button onClick={handleInitierIndemnisation} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">Modifier</button>
//                     {indemnisation.statut === 'en_attente' && <button onClick={handleValidateIndemnisation} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">Valider</button>}
//                     {indemnisation.statut === 'validee' && <button onClick={handlePayerIndemnisation} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">Payer</button>}
//                     {(indemnisation.statut === 'en_attente' || indemnisation.statut === 'validee') && <button onClick={handleAnnulerIndemnisation} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Annuler</button>}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Expertises */}
//             {expertises.length > 0 && (
//               <div className="bg-white rounded-lg border p-6"><h2 className="text-lg font-semibold mb-4">Expertises ({expertises.length})</h2><div className="space-y-4">{expertises.map(expertise => (<div key={expertise.id} className="border rounded-lg p-4"><div className="flex items-center justify-between mb-3"><div className="flex items-center"><div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><FaUserCheck className="h-5 w-5 text-purple-600" /></div><div className="ml-3"><p className="text-sm font-medium">{expertise.expert_nom}</p><p className="text-xs text-gray-500">{expertise.expert_email}</p></div></div><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' : expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{expertise.statut === 'terminee' ? '✓ Terminée' : expertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}</span></div>{expertise.rapport && (<div className="mt-3 pt-3 border-t"><p className="text-sm font-medium mb-1">Rapport</p><p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>{expertise.montant_evalue != null && expertise.montant_evalue > 0 && <p className="text-sm font-semibold text-purple-600 mt-1">Montant évalué : {formatMontant(expertise.montant_evalue)}</p>}</div>)}</div>))}</div></div>
//             )}

//             {/* Documents */}
//             <div className="bg-white rounded-lg border p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Documents ({documents.length})</h2><label className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"><FaUpload className="mr-2 h-4 w-4" />Ajouter<input type="file" multiple className="hidden" onChange={(e) => e.target.files && handleUploadDocument(e.target.files)} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" /></label></div>{documents.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">Aucun document</p> : (<div className="space-y-2">{documents.map((doc: any) => (<div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center min-w-0"><FaFileAlt className="h-5 w-5 text-blue-500 mr-3" /><div className="min-w-0"><p className="text-sm font-medium truncate">{doc.nom_fichier}</p><p className="text-xs text-gray-500">{doc.created_at ? formatDateShort(doc.created_at) : ''}</p></div></div><a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-600"><FaDownload className="h-5 w-5" /></a></div>))}</div>)}</div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border p-6"><h2 className="text-lg font-semibold mb-4"><FaUser className="inline mr-2 text-gray-400" />Assuré</h2><div className="flex items-center mb-3"><AssureAvatar assure={sinistre.assure || { nom: '', email: '' }} size="lg" /><div className="ml-3"><p className="text-sm font-medium">{sinistre.assure?.nom || 'Inconnu'}</p><p className="text-xs text-gray-500">{sinistre.assure?.email}</p></div></div>{sinistre.assure?.telephone && <div className="flex items-center text-sm text-gray-600 border-t pt-3"><FaPhone className="mr-2 h-3 w-3 text-gray-400" />{sinistre.assure.telephone}</div>}</div>
//             <div className="bg-white rounded-lg border p-6"><h2 className="text-lg font-semibold mb-3"><FaComments className="inline mr-2 text-blue-500" />Communication</h2><div className="space-y-2 mb-3 max-h-64 overflow-y-auto">{communications.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Aucune communication</p> : communications.slice(0, 10).map(comm => (<div key={comm.id} className={`p-2 rounded text-sm ${comm.type === 'notification' ? 'bg-blue-50' : 'bg-gray-50'}`}><div className="flex justify-between mb-0.5"><span className="text-xs font-medium">{comm.expediteur_nom}</span><span className="text-xs text-gray-400">{formatDate(comm.created_at)}</span></div><p className="text-xs whitespace-pre-wrap">{comm.contenu}</p></div>))}</div><div className="flex space-x-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Message..." className="flex-1 text-sm border rounded-lg px-3 py-2" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} /><button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"><FaPaperPlane className="h-4 w-4" /></button></div></div>
//             <div className="bg-white rounded-lg border p-6"><h2 className="text-lg font-semibold mb-4"><FaHistory className="inline mr-2 text-gray-400" />Historique</h2>{historique.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p> : (<div className="space-y-3 max-h-80 overflow-y-auto">{historique.map(entry => (<div key={entry.id} className="border-l-2 border-blue-200 pl-3"><p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p><p className="text-sm"><span className="font-medium">{entry.commentaire || `${entry.ancien_statut} → ${entry.nouveau_statut}`}</span></p></div>))}</div>)}</div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {showDesignateExpert && (<Modal onClose={() => setShowDesignateExpert(false)} title="Désigner un expert"><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Expert *</label><select value={selectedExpert} onChange={(e) => setSelectedExpert(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Sélectionner</option>{experts.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Date expertise *</label><input type="datetime-local" value={dateExpertise} onChange={(e) => setDateExpertise(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div><div className="flex space-x-3 pt-2"><button onClick={handleDesignateExpert} disabled={!selectedExpert || !dateExpertise} className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50">Désigner</button><button onClick={() => setShowDesignateExpert(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div></div></Modal>)}
//       {showStatusModal && (<Modal onClose={() => setShowStatusModal(false)} title="Changer le statut"><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Nouveau statut *</label><select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Sélectionner</option>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Commentaire</label><textarea value={statusComment} onChange={(e) => setStatusComment(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" /></div><div className="flex space-x-3 pt-2"><button onClick={handleChangeStatus} disabled={!newStatus} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Confirmer</button><button onClick={() => setShowStatusModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div></div></Modal>)}
//       {showIndemnisationModal && (<Modal onClose={() => setShowIndemnisationModal(false)} title="Gérer l'indemnisation"><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Montant (CDF) *</label><input type="number" value={indemnisationForm.montant_indemnisation} onChange={(e) => setIndemnisationForm({...indemnisationForm, montant_indemnisation: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" min="0" /></div><div><label className="block text-sm font-medium mb-1">Mode de paiement</label><select value={indemnisationForm.mode_paiement} onChange={(e) => setIndemnisationForm({...indemnisationForm, mode_paiement: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">{Object.entries(MODES_PAIEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div><div><label className="block text-sm font-medium mb-1">Commentaire</label><textarea value={indemnisationForm.commentaire} onChange={(e) => setIndemnisationForm({...indemnisationForm, commentaire: e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" /></div><div className="flex space-x-3 pt-2"><button onClick={handleSaveIndemnisation} disabled={saving || !indemnisationForm.montant_indemnisation} className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">{saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}{indemnisation?.id ? 'Mettre à jour' : "Initier l'indemnisation"}</button><button onClick={() => setShowIndemnisationModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div></div></Modal>)}
//     </div>
//   );
// }
// app/agent/sinistres/[id]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaEdit, FaUpload, FaDownload, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
  FaHistory, FaTimes, FaExclamationTriangle, FaClipboardList,
  FaUserCheck, FaUserTie, FaInfo, FaPaperPlane,
  FaComments, FaPhone, FaFileContract,
  FaClipboardCheck, FaCheck, FaBan, FaPlus, FaTrash,
  FaHandHoldingUsd, FaCar, FaIdCard, FaTools, FaUserInjured,
  FaChevronDown, FaChevronUp, FaMinus, FaFilePdf
} from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==================== TYPES ====================

type Assure = {
  nom: string;
  email: string;
  telephone?: string;
  photo_profil?: string;
};

type Expert = {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
};

type Expertise = {
  id: string;
  expert_id: string;
  expert_nom: string;
  expert_email: string;
  date_designation: string;
  date_expertise: string | null;
  date_visite_lieu: string | null;
  rapport: string | null;
  conclusion: string | null;
  details_techniques: string | null;
  recommandations: string | null;
  montant_evalue: number | null;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  documents: ExpertiseDocument[];
  created_at: string;
};

type ExpertiseDocument = {
  id: string;
  nom_fichier: string;
  url_fichier: string;
  type_document: string;
  created_at: string;
};

type Communication = {
  id: string;
  type: 'message' | 'notification' | 'reclamation';
  contenu: string;
  expediteur_nom: string;
  expediteur_role: string;
  created_at: string;
};

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
  assure: Assure;
  souscription?: {
    police_numero?: string;
    produit?: { nom: string };
  };
};

type Indemnisation = {
  id: string;
  montant_indemnisation: number;
  mode_paiement: string;
  statut: string;
  date_validation: string | null;
  date_paiement: string | null;
  reference_paiement: string | null;
  commentaire: string | null;
};

type SonasDeclaration = {
  id: number;
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
};

// ==================== CONSTANTES ====================

const STATUTS: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number; description: string; }> = {
  en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 10, description: 'Dossier reçu, en attente de traitement' },
  en_cours: { label: 'En cours', icon: FaSpinner, color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 30, description: 'Dossier pris en charge par un agent' },
  expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-100', progress: 50, description: 'Expert désigné, évaluation en cours' },
  en_indemnisation: { label: 'En indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-100', progress: 75, description: 'Indemnisation en cours de versement' },
  cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', progress: 100, description: 'Dossier clôturé' },
  refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-100', progress: 0, description: 'Dossier refusé' },
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

const INDEMNISATION_STATUTS: Record<string, { label: string; color: string; bgColor: string }> = {
  en_attente: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  validee: { label: 'Validée', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  payee: { label: 'Payée', color: 'text-green-700', bgColor: 'bg-green-100' },
  annulee: { label: 'Annulée', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const MODES_PAIEMENT: Record<string, string> = {
  virement: 'Virement bancaire',
  cheque: 'Chèque',
  mobile_money: 'Mobile Money',
  especes: 'Espèces',
};

// ==================== COMPOSANTS ====================

function AssureAvatar({ assure, size = 'md' }: { assure: Assure; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  const getInitials = (nom: string) => nom?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || '??';
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
      {assure.photo_profil ? (
        <img src={assure.photo_profil} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-orange-600 flex items-center justify-center">
          <span className="text-white font-medium">{getInitials(assure.nom || '')}</span>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const info = STATUTS[statut] || STATUTS.en_attente;
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${info.bgColor} ${info.color}`}>
      <Icon className="mr-1.5 h-4 w-4" />{info.label}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const getColor = () => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-indigo-500';
    if (progress >= 50) return 'bg-purple-500';
    if (progress >= 30) return 'bg-blue-500';
    return 'bg-yellow-500';
  };
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div className={`h-3 rounded-full transition-all duration-500 ${getColor()}`} style={{ width: `${Math.max(progress, 2)}%` }} />
    </div>
  );
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2">{icon && <span className="text-blue-600">{icon}</span>}<h3 className="font-semibold text-sm text-gray-900">{title}</h3></div>
        {isOpen ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
      </button>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
}

// ==================== FONCTIONS PDF ====================

function generateRapportPDF(sinistre: Sinistre, expertise: Expertise, indemnisation: Indemnisation | null) {
  const doc = new jsPDF('p', 'mm', 'a4');
  let yPos = 20;

  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(41, 37, 140);
  doc.text('SONAS', 105, yPos, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  yPos += 8;
  doc.text('RAPPORT D\'EXPERTISE', 105, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(10);
  doc.text(`Date d'émission : ${formatDateShort(new Date().toISOString())}`, 105, yPos, { align: 'center' });

  // Ligne de séparation
  yPos += 5;
  doc.setDrawColor(41, 37, 140);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);

  // Informations du dossier
  yPos += 10;
  doc.setFontSize(13);
  doc.setTextColor(41, 37, 140);
  doc.text('INFORMATIONS DU DOSSIER', 15, yPos);

  yPos += 7;
  const infoDossier = [
    ['N° Dossier', sinistre.numero_dossier],
    ['Type de sinistre', TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre],
    ['Date du sinistre', formatDateShort(sinistre.date_sinistre)],
    ['Lieu', sinistre.lieu],
    ['Statut', STATUTS[sinistre.statut]?.label || sinistre.statut],
    ['Montant estimé initial', formatMontant(sinistre.montant_estime)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Champ', 'Valeur']],
    body: infoDossier,
    theme: 'grid',
    headStyles: { fillColor: [41, 37, 140], textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
    margin: { left: 15 },
  });

  // Informations de l'assuré
  yPos = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(13);
  doc.setTextColor(41, 37, 140);
  doc.text('INFORMATIONS DE L\'ASSURÉ', 15, yPos);

  yPos += 7;
  const infoAssure = [
    ['Nom', sinistre.assure?.nom || 'N/A'],
    ['Email', sinistre.assure?.email || 'N/A'],
    ['Téléphone', sinistre.assure?.telephone || 'N/A'],
    ['Police n°', sinistre.souscription?.police_numero || 'N/A'],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [['Champ', 'Valeur']],
    body: infoAssure,
    theme: 'grid',
    headStyles: { fillColor: [41, 37, 140], textColor: [255, 255, 255], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
    margin: { left: 15 },
  });

  // Rapport d'expertise
  yPos = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(13);
  doc.setTextColor(41, 37, 140);
  doc.text('RAPPORT D\'EXPERTISE', 15, yPos);

  yPos += 7;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Expert : ${expertise.expert_nom}`, 15, yPos);
  yPos += 5;
  doc.setFontSize(10);
  doc.text(`Date désignation : ${formatDateShort(expertise.date_designation)}`, 15, yPos);
  
  if (expertise.date_visite_lieu) {
    yPos += 5;
    doc.text(`Date visite : ${formatDateShort(expertise.date_visite_lieu)}`, 15, yPos);
  }

  if (expertise.rapport) {
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 140);
    doc.text('Constatations :', 15, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const rapportLines = doc.splitTextToSize(expertise.rapport, 180);
    doc.text(rapportLines, 15, yPos);
    yPos += rapportLines.length * 4.5 + 3;
  }

  if (expertise.details_techniques) {
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 140);
    doc.text('Détails techniques :', 15, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const detailsLines = doc.splitTextToSize(expertise.details_techniques, 180);
    doc.text(detailsLines, 15, yPos);
    yPos += detailsLines.length * 4.5 + 3;
  }

  if (expertise.montant_evalue) {
    yPos += 3;
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 140);
    doc.text(`Montant évalué : ${formatMontant(expertise.montant_evalue)}`, 15, yPos);
  }

  if (expertise.conclusion) {
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 140);
    doc.text('Conclusion :', 15, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const conclusionLines = doc.splitTextToSize(expertise.conclusion, 180);
    doc.text(conclusionLines, 15, yPos);
    yPos += conclusionLines.length * 4.5 + 3;
  }

  if (expertise.recommandations) {
    yPos += 5;
    doc.setFontSize(11);
    doc.setTextColor(41, 37, 140);
    doc.text('Recommandations :', 15, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    
    const recoLines = doc.splitTextToSize(expertise.recommandations, 180);
    doc.text(recoLines, 15, yPos);
    yPos += recoLines.length * 4.5 + 3;
  }

  // Nouvelle page si nécessaire
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  // Indemnisation
  if (indemnisation) {
    yPos += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, 195, yPos);
    yPos += 8;
    doc.setFontSize(13);
    doc.setTextColor(41, 37, 140);
    doc.text('INDEMNISATION', 15, yPos);

    yPos += 7;
    const infoIndemnisation = [
      ['Montant', formatMontant(indemnisation.montant_indemnisation)],
      ['Mode de paiement', MODES_PAIEMENT[indemnisation.mode_paiement] || indemnisation.mode_paiement],
      ['Statut', INDEMNISATION_STATUTS[indemnisation.statut]?.label || indemnisation.statut],
      ['Date validation', indemnisation.date_validation ? formatDateShort(indemnisation.date_validation) : 'N/A'],
      ['Date paiement', indemnisation.date_paiement ? formatDateShort(indemnisation.date_paiement) : 'N/A'],
      ['Référence', indemnisation.reference_paiement || 'N/A'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Champ', 'Valeur']],
      body: infoIndemnisation,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 120 } },
      margin: { left: 15 },
    });
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`SONAS - Rapport d'expertise - ${sinistre.numero_dossier} - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
  }

  // Sauvegarde du PDF
  doc.save(`Rapport_Expertise_${sinistre.numero_dossier}.pdf`);
}

// ==================== FONCTIONS UTILITAIRES ====================

function formatMontant(m: number) {
  if (!m) return '0 CDF';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
}

function formatDate(d: string) {
  try { return format(new Date(d), 'dd MMMM yyyy à HH:mm', { locale: fr }); }
  catch { return d; }
}

function formatDateShort(d: string) {
  try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); }
  catch { return d; }
}

// ==================== PAGE PRINCIPALE ====================

type Props = { params: Promise<{ id: string }> };

export default function SinistreDetailPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  const [sinistre, setSinistre] = useState<Sinistre | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [historique, setHistorique] = useState<any[]>([]);
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [indemnisation, setIndemnisation] = useState<Indemnisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sonasDeclaration, setSonasDeclaration] = useState<SonasDeclaration | null>(null);
  const [showAllSonasDetails, setShowAllSonasDetails] = useState(false);

  const [experts, setExperts] = useState<Expert[]>([]);
  const [showDesignateExpert, setShowDesignateExpert] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [dateExpertise, setDateExpertise] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');

  const [showIndemnisationModal, setShowIndemnisationModal] = useState(false);
  const [indemnisationForm, setIndemnisationForm] = useState({ montant_indemnisation: 0, mode_paiement: 'virement', commentaire: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && id) {
      chargerTout();
      if (['admin', 'agent'].includes(user.role || '')) chargerExperts();
    }
  }, [user, id]);

  const chargerTout = async () => {
    try { setLoading(true); await Promise.all([chargerSinistre(), chargerExpertises(), chargerCommunications(), chargerIndemnisation()]); }
    finally { setLoading(false); }
  };

  const chargerSinistre = async () => {
    const { data } = await supabase.from('sinistres').select('*').eq('id', id).single();
    if (!data) throw new Error('Sinistre non trouvé');

    const { data: assureData } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.assure_id).single();
    let souscription = null;
    if (data.souscription_id) {
      const { data: subData } = await supabase.from('souscriptions').select('police_numero').eq('id', data.souscription_id).single();
      souscription = subData;

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
        
        if (sonasData) setSonasDeclaration(sonasData as SonasDeclaration);
      }
    }

    setSinistre({ ...data, assure: assureData || { nom: 'Inconnu', email: '' }, souscription });

    const { data: docs } = await supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    setDocuments(docs || []);

    const { data: hist } = await supabase.from('sinistre_historique').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    setHistorique(hist || []);
  };

  const chargerExpertises = async () => {
    const { data } = await supabase.from('expertises').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    if (data && data.length > 0) {
      const expertIds = [...new Set(data.map(e => e.expert_id))];
      const { data: expertsData } = await supabase.from('users').select('id, nom, email').in('id', expertIds);
      const expertMap = new Map();
      if (expertsData) expertsData.forEach(e => expertMap.set(e.id, e));
      setExpertises(data.map(e => ({ ...e, expert_nom: expertMap.get(e.expert_id)?.nom || 'Inconnu', expert_email: expertMap.get(e.expert_id)?.email || '', documents: [] })));
    }
  };

  const chargerCommunications = async () => {
    const { data } = await supabase.from('sinistre_communications').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(50);
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(c => c.expediteur_id))];
      const { data: users } = await supabase.from('users').select('id, nom, role').in('id', userIds);
      const userMap = new Map();
      if (users) users.forEach(u => userMap.set(u.id, u));
      setCommunications(data.map(c => ({ ...c, expediteur_nom: userMap.get(c.expediteur_id)?.nom || 'Système', expediteur_role: userMap.get(c.expediteur_id)?.role || 'system' })));
    } else setCommunications([]);
  };

  const chargerExperts = async () => {
    const { data } = await supabase.from('users').select('id, nom, email, telephone').eq('role', 'expert').order('nom');
    setExperts(data || []);
  };

  const chargerIndemnisation = async () => {
    const { data } = await supabase.from('indemnisations').select('*').eq('sinistre_id', id).single();
    if (data) {
      setIndemnisation(data);
      setIndemnisationForm({ montant_indemnisation: data.montant_indemnisation, mode_paiement: data.mode_paiement, commentaire: data.commentaire || '' });
    }
  };

  const isIndemnisationPayee = indemnisation?.statut === 'payee';
  const statutEffectif = isIndemnisationPayee ? 'cloture' : (sinistre?.statut || 'en_attente');

  // ============ ACTIONS ============

  const handleDesignateExpert = async () => {
    if (!selectedExpert || !dateExpertise) { setError('Veuillez sélectionner un expert et une date'); return; }
    try {
      await supabase.from('expertises').insert({ sinistre_id: id, expert_id: selectedExpert, date_designation: new Date().toISOString(), date_expertise: dateExpertise, statut: 'planifiee' });
      if (sinistre?.statut === 'en_cours') await supabase.from('sinistres').update({ statut: 'expertise', updated_by: user?.id }).eq('id', id);
      await ajouterCommunication('notification', `Expert désigné. Date prévue : ${formatDate(dateExpertise)}`);
      setSuccess('Expert désigné'); setShowDesignateExpert(false); await chargerTout(); setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'message', contenu: newMessage, expediteur_id: user?.id });
      setNewMessage(''); await chargerCommunications();
    } catch (err: any) { setError(err.message); }
  };

  const handleChangeStatus = async () => {
    if (!newStatus) return;
    try {
      const updateData: any = { statut: newStatus, updated_by: user?.id, updated_at: new Date().toISOString() };
      if (newStatus === 'cloture') updateData.date_cloture = new Date().toISOString();
      await supabase.from('sinistres').update(updateData).eq('id', id);
      await ajouterCommunication('notification', `Statut mis à jour : ${STATUTS[newStatus]?.label}`);
      setSuccess('Statut mis à jour'); setShowStatusModal(false); await chargerSinistre(); setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleUploadDocument = async (files: FileList) => {
    try {
      for (const file of Array.from(files)) {
        const fileName = `${id}/${Date.now()}-${file.name}`;
        await supabase.storage.from('sinistres').upload(fileName, file);
        const { data } = supabase.storage.from('sinistres').getPublicUrl(fileName);
        await supabase.from('sinistre_documents').insert({ sinistre_id: id, nom_fichier: file.name, url_fichier: data.publicUrl, type_document: 'autre_document', taille_fichier: file.size, type_mime: file.type, uploaded_by: user?.id });
      }
      await chargerSinistre(); setSuccess('Documents téléchargés'); setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleInitierIndemnisation = () => {
    const expertiseTerminee = expertises.find(e => e.statut === 'terminee');
    const montantBase = expertiseTerminee?.montant_evalue || sinistre?.montant_estime || 0;
    setIndemnisationForm({ montant_indemnisation: montantBase, mode_paiement: indemnisation?.mode_paiement || 'virement', commentaire: indemnisation?.commentaire || '' });
    setShowIndemnisationModal(true);
  };

  const handleSaveIndemnisation = async () => {
    setSaving(true);
    try {
      if (indemnisation?.id) {
        await supabase.from('indemnisations').update({ montant_indemnisation: indemnisationForm.montant_indemnisation, mode_paiement: indemnisationForm.mode_paiement, commentaire: indemnisationForm.commentaire, updated_at: new Date().toISOString() }).eq('id', indemnisation.id);
      } else {
        await supabase.from('indemnisations').insert({ sinistre_id: id, montant_indemnisation: indemnisationForm.montant_indemnisation, mode_paiement: indemnisationForm.mode_paiement, statut: 'en_attente', commentaire: indemnisationForm.commentaire, created_by: user?.id });
        if (sinistre?.statut === 'expertise') await supabase.from('sinistres').update({ statut: 'en_indemnisation', updated_by: user?.id }).eq('id', id);
      }
      await ajouterCommunication('notification', `Indemnisation ${indemnisation?.id ? 'mise à jour' : 'initiée'} : ${formatMontant(indemnisationForm.montant_indemnisation)}`);
      setSuccess('Indemnisation enregistrée'); setShowIndemnisationModal(false); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleValidateIndemnisation = async () => {
    try {
      await supabase.from('indemnisations').update({ statut: 'validee', date_validation: new Date().toISOString() }).eq('id', indemnisation?.id);
      await ajouterCommunication('notification', `Indemnisation validée : ${formatMontant(indemnisation!.montant_indemnisation)}`);
      setSuccess('Indemnisation validée'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handlePayerIndemnisation = async () => {
    const reference = prompt('Référence de paiement (optionnel) :');
    try {
      await supabase.from('indemnisations').update({ statut: 'payee', date_paiement: new Date().toISOString(), reference_paiement: reference || null }).eq('id', indemnisation?.id);
      await supabase.from('sinistres').update({ montant_indemnisation: indemnisation!.montant_indemnisation, updated_by: user?.id }).eq('id', id);
      await ajouterCommunication('notification', `Paiement effectué : ${formatMontant(indemnisation!.montant_indemnisation)}${reference ? ` (Réf: ${reference})` : ''}`);
      setSuccess('Paiement enregistré'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handleAnnulerIndemnisation = async () => {
    if (!confirm('Annuler cette indemnisation ?')) return;
    try {
      await supabase.from('indemnisations').update({ statut: 'annulee' }).eq('id', indemnisation?.id);
      await ajouterCommunication('notification', 'Indemnisation annulée');
      setSuccess('Indemnisation annulée'); await chargerTout(); setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handleDownloadRapportPDF = (expertise: Expertise) => {
    if (!sinistre) return;
    generateRapportPDF(sinistre, expertise, indemnisation);
    setSuccess('📄 Rapport PDF téléchargé avec succès !');
    setTimeout(() => setSuccess(null), 2000);
  };

  const ajouterCommunication = async (type: string, contenu: string) => {
    await supabase.from('sinistre_communications').insert({ sinistre_id: id, type, contenu, expediteur_id: user?.id });
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><FaSpinner className="h-12 w-12 text-blue-500 animate-spin" /></div>;
  if (!sinistre) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" /><p className="mt-4">Dossier non trouvé</p><Link href="/sinistres" className="mt-4 inline-block text-blue-600">Retour aux sinistres</Link></div></div>;

  const statutInfo = STATUTS[statutEffectif] || STATUTS.en_attente;
  const isAgent = ['admin', 'agent'].includes(user?.role || '');
  const isExpert = user?.role === 'expert';
  const expertiseTerminee = expertises.find(e => e.statut === 'terminee');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/agent/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"><FaArrowLeft className="mr-2 h-4 w-4" />Retour aux sinistres</Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Dossier {sinistre.numero_dossier}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <StatutBadge statut={statutEffectif} />
                {isIndemnisationPayee && <span className="text-xs text-green-600 font-medium">(Indemnisation payée)</span>}
                <span className="text-sm text-gray-500">Créé le {formatDateShort(sinistre.created_at)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {isAgent && (
                <>
                  <button onClick={() => setShowDesignateExpert(true)} className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"><FaUserTie className="mr-2 h-4 w-4" />Désigner expert</button>
                  {expertiseTerminee && !indemnisation && (
                    <button onClick={handleInitierIndemnisation} className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"><FaHandHoldingUsd className="mr-2 h-4 w-4" />Indemnisation</button>
                  )}
                  {indemnisation && (
                    <button onClick={handleInitierIndemnisation} className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><FaEdit className="mr-2 h-4 w-4" />Indemnisation</button>
                  )}
                  <button onClick={() => { setNewStatus(sinistre.statut); setShowStatusModal(true); }} className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"><FaEdit className="mr-2 h-4 w-4" />Statut</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-3 h-5 w-5" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4" /></button></div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-3 h-5 w-5" />{success}</div>}

        {/* Progression */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-semibold">Progression</h2><StatutBadge statut={statutEffectif} /></div>
          <ProgressBar progress={statutInfo.progress} />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
              <span key={key} className={statutEffectif === key ? 'font-semibold text-gray-900' : ''}>{val.label}</span>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-800"><FaInfo className="inline mr-1" />{statutInfo.description}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Détails - SONAS ou Normal */}
            {sonasDeclaration ? (
              <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3"><FaCar className="h-5 w-5" /><h2 className="text-lg font-semibold">Déclaration d'Accident Automobile - SONAS</h2></div>
                  <button onClick={() => setShowAllSonasDetails(!showAllSonasDetails)} className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors">
                    {showAllSonasDetails ? <><FaMinus className="h-3 w-3" /> Moins de détails</> : <><FaPlus className="h-3 w-3" /> Plus de détails</>}
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-blue-50 p-4 rounded-lg">
                    <div><p className="text-gray-500">N° Dossier</p><p className="font-semibold text-blue-700">{sonasDeclaration.claim_no}</p></div>
                    <div><p className="text-gray-500">Date accident</p><p className="font-medium">{formatDate(sonasDeclaration.date_heure_accident)}</p></div>
                    <div><p className="text-gray-500">Lieu</p><p className="font-medium truncate">{sonasDeclaration.lieu_accident}</p></div>
                    <div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'} - {sonasDeclaration.vehicule_plaque || '-'}</p></div>
                  </div>

                  {showAllSonasDetails && (
                    <div className="space-y-4 pt-4 border-t">
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
                      <CollapsibleSection title="2. Preneur d'assurance" icon={<FaUser className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.preneur_nom || '-'}</p></div><div><p className="text-gray-500">Prénoms</p><p className="font-medium">{sonasDeclaration.preneur_prenoms || '-'}</p></div><div className="col-span-2"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.preneur_adresse || '-'}</p></div></div>
                      </CollapsibleSection>
                      <CollapsibleSection title="3. Conducteur" icon={<FaIdCard className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm"><div><p className="text-gray-500">Nom et prénom</p><p className="font-medium">{sonasDeclaration.conducteur_nom_prenom || '-'}</p></div><div><p className="text-gray-500">Âge</p><p className="font-medium">{sonasDeclaration.conducteur_age || '-'}</p></div><div><p className="text-gray-500">À votre service ?</p><p className="font-medium">{sonasDeclaration.conducteur_a_service === true ? 'Oui' : sonasDeclaration.conducteur_a_service === false ? 'Non' : '-'}</p></div><div className="col-span-2"><p className="text-gray-500">Titre de conduite</p><p className="font-medium">{sonasDeclaration.conducteur_titre_conduite || '-'}</p></div><div><p className="text-gray-500">Permis n°</p><p className="font-medium">{sonasDeclaration.permis_no || '-'}</p></div><div><p className="text-gray-500">Délivré à</p><p className="font-medium">{sonasDeclaration.permis_delivre_a || '-'}</p></div><div><p className="text-gray-500">Date permis</p><p className="font-medium">{sonasDeclaration.permis_date ? formatDateShort(sonasDeclaration.permis_date) : '-'}</p></div></div>
                      </CollapsibleSection>
                      <CollapsibleSection title="4. Véhicule" icon={<FaCar className="h-4 w-4" />}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-gray-500">Marque et type</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'}</p></div><div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.vehicule_plaque || '-'}</p></div><div><p className="text-gray-500">Châssis</p><p className="font-medium">{sonasDeclaration.vehicule_chassis || '-'}</p></div><div><p className="text-gray-500">Moteur</p><p className="font-medium">{sonasDeclaration.vehicule_moteur || '-'}</p></div><div><p className="text-gray-500">Puissance</p><p className="font-medium">{sonasDeclaration.vehicule_puissance || '-'}</p></div><div><p className="text-gray-500">Année</p><p className="font-medium">{sonasDeclaration.vehicule_annee || '-'}</p></div><div><p className="text-gray-500">Kilométrage</p><p className="font-medium">{sonasDeclaration.vehicule_kilometrage ? `${sonasDeclaration.vehicule_kilometrage} km` : '-'}</p></div><div><p className="text-gray-500">Valeur</p><p className="font-medium">{sonasDeclaration.vehicule_valeur ? formatMontant(sonasDeclaration.vehicule_valeur) : '-'}</p></div></div>
                        <div className="mt-3 pt-3 border-t"><p className="text-xs text-gray-500 mb-2">Garanties :</p><div className="flex gap-4"><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_rc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>R.C.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_dm ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>D.M.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_inc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Inc.</span><span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_vol ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Vol</span></div></div>
                      </CollapsibleSection>
                      <CollapsibleSection title="5. Description de l'accident" icon={<FaClipboardList className="h-4 w-4" />}><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.description_accident || 'Aucune description'}</p></CollapsibleSection>
                      <CollapsibleSection title="6. Dégâts de votre véhicule" icon={<FaTools className="h-4 w-4" />}><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_description || '-'}</p></div><div><p className="text-gray-500">Montant évalué</p><p className="font-medium">{sonasDeclaration.degats_montant_evalue ? formatMontant(sonasDeclaration.degats_montant_evalue) : '-'}</p></div></div></CollapsibleSection>
                      <CollapsibleSection title="7. Garage"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Véhicule immobilisé ?</p><p className="font-medium">{sonasDeclaration.vehicule_immobilise === true ? 'Oui' : sonasDeclaration.vehicule_immobilise === false ? 'Non' : '-'}</p></div><div><p className="text-gray-500">Lieu de garde</p><p className="font-medium">{sonasDeclaration.lieu_garde_expertise || '-'}</p></div></div></CollapsibleSection>
                      <CollapsibleSection title="8. Adversaire"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.adversaire_nom || '-'}</p></div><div><p className="text-gray-500">Post-nom</p><p className="font-medium">{sonasDeclaration.adversaire_post_nom || '-'}</p></div><div><p className="text-gray-500">Prénom</p><p className="font-medium">{sonasDeclaration.adversaire_prenom || '-'}</p></div><div className="col-span-4"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.adversaire_adresse || '-'}</p></div><div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.adversaire_vehicule || '-'}</p></div><div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.adversaire_plaque || '-'}</p></div><div><p className="text-gray-500">Assurance</p><p className="font-medium">{sonasDeclaration.adversaire_assurance || '-'}</p></div><div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.adversaire_telephone || '-'}</p></div></div></CollapsibleSection>
                      <CollapsibleSection title="9. Dégâts matériels (tiers)"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_materiels_description || '-'}</p></div><div><p className="text-gray-500">Dégâts évalués à</p><p className="font-medium">{sonasDeclaration.degats_materiels_evalues ? formatMontant(sonasDeclaration.degats_materiels_evalues) : '-'}</p></div></div></CollapsibleSection>
                      <CollapsibleSection title="10. Blessés ou morts" icon={<FaUserInjured className="h-4 w-4" />}><div className="space-y-3 text-sm"><div><p className="text-gray-500">Blessés ou morts ?</p><p className="font-medium">{sonasDeclaration.blesses_ou_morts ? 'Oui' : 'Non'}</p></div>{sonasDeclaration.victimes_infos && <div><p className="text-gray-500">Victimes</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.victimes_infos}</p></div>}{sonasDeclaration.victimes_soins_lieu && <div><p className="text-gray-500">Lieu des soins</p><p className="font-medium">{sonasDeclaration.victimes_soins_lieu}</p></div>}<div className="grid grid-cols-2 gap-4">{sonasDeclaration.hopital_nom_adresse && <div><p className="text-gray-500">Hôpital</p><p className="font-medium">{sonasDeclaration.hopital_nom_adresse}</p></div>}{sonasDeclaration.medecin_nom && <div><p className="text-gray-500">Médecin</p><p className="font-medium">{sonasDeclaration.medecin_nom}</p></div>}</div>{sonasDeclaration.medecin_telephone && <div><p className="text-gray-500">Tél médecin</p><p className="font-medium">{sonasDeclaration.medecin_telephone}</p></div>}</div></CollapsibleSection>
                      {sonasDeclaration.tiers_transportes && <CollapsibleSection title="11. Tiers transportés"><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.tiers_transportes}</p></CollapsibleSection>}
                      {sonasDeclaration.temoins && <CollapsibleSection title="12. Témoins"><p className="text-sm whitespace-pre-wrap">{sonasDeclaration.temoins}</p></CollapsibleSection>}
                      <CollapsibleSection title="13. Autorités"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">PV par</p><p className="font-medium">{sonasDeclaration.pv_par || '-'}</p></div><div><p className="text-gray-500">Localité</p><p className="font-medium">{sonasDeclaration.localite || '-'}</p></div><div><p className="text-gray-500">Gendarmerie</p><p className="font-medium">{sonasDeclaration.gendarmerie || '-'}</p></div><div><p className="text-gray-500">Officier</p><p className="font-medium">{sonasDeclaration.officier_gendarme || '-'}</p></div></div></CollapsibleSection>
                      <CollapsibleSection title="14. Prime d'assurance"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-gray-500">Dernière prime payée ?</p><p className="font-medium">{sonasDeclaration.prime_payee === true ? 'Oui' : sonasDeclaration.prime_payee === false ? 'Non' : '-'}</p></div>{sonasDeclaration.prime_date && <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDateShort(sonasDeclaration.prime_date)}</p></div>}</div></CollapsibleSection>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Type</p><p>{TYPES_SINISTRE[sinistre.type_sinistre]?.icon} {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}</p></div>
                  <div><p className="text-gray-500">Date</p><p>{formatDate(sinistre.date_sinistre)}</p></div>
                  <div><p className="text-gray-500">Lieu</p><p>{sinistre.lieu}</p></div>
                  <div><p className="text-gray-500">Montant estimé</p><p className="font-medium">{formatMontant(sinistre.montant_estime)}</p></div>
                  {sinistre.montant_indemnisation > 0 && <div><p className="text-gray-500">Indemnisé</p><p className="font-medium text-green-600">{formatMontant(sinistre.montant_indemnisation)}</p></div>}
                  {sinistre.souscription && <div><p className="text-gray-500">Police</p><p>{sinistre.souscription.police_numero || 'N/A'}</p></div>}
                </div>
                <div className="mt-4 pt-4 border-t"><p className="text-sm text-gray-500 mb-1">Description</p><p className="text-sm whitespace-pre-wrap">{sinistre.description}</p></div>
              </div>
            )}

            {/* Indemnisation */}
            {indemnisation && (
              <div className="bg-white rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold"><FaHandHoldingUsd className="inline mr-2 text-green-600" />Indemnisation</h2><span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${INDEMNISATION_STATUTS[indemnisation.statut]?.bgColor} ${INDEMNISATION_STATUTS[indemnisation.statut]?.color}`}>{INDEMNISATION_STATUTS[indemnisation.statut]?.label}</span></div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4"><div><p className="text-gray-500">Montant</p><p className="text-xl font-bold text-green-600">{formatMontant(indemnisation.montant_indemnisation)}</p></div><div><p className="text-gray-500">Mode</p><p className="font-medium">{MODES_PAIEMENT[indemnisation.mode_paiement] || indemnisation.mode_paiement}</p></div>{indemnisation.date_validation && <div><p className="text-gray-500">Date validation</p><p>{formatDateShort(indemnisation.date_validation)}</p></div>}{indemnisation.date_paiement && <div><p className="text-gray-500">Date paiement</p><p>{formatDateShort(indemnisation.date_paiement)}</p></div>}{indemnisation.reference_paiement && <div><p className="text-gray-500">Référence</p><p className="font-mono">{indemnisation.reference_paiement}</p></div>}</div>
                {indemnisation.commentaire && <div className="bg-gray-50 rounded-lg p-3 mb-4"><p className="text-sm text-gray-600">{indemnisation.commentaire}</p></div>}
                {isAgent && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button onClick={handleInitierIndemnisation} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">Modifier</button>
                    {indemnisation.statut === 'en_attente' && <button onClick={handleValidateIndemnisation} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700">Valider</button>}
                    {indemnisation.statut === 'validee' && <button onClick={handlePayerIndemnisation} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">Payer</button>}
                    {(indemnisation.statut === 'en_attente' || indemnisation.statut === 'validee') && <button onClick={handleAnnulerIndemnisation} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Annuler</button>}
                  </div>
                )}
              </div>
            )}

            {/* Expertises */}
            {expertises.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Expertises ({expertises.length})</h2>
                <div className="space-y-4">
                  {expertises.map(expertise => (
                    <div key={expertise.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaUserCheck className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{expertise.expert_nom}</p>
                            <p className="text-xs text-gray-500">{expertise.expert_email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' : 
                            expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {expertise.statut === 'terminee' ? '✓ Terminée' : 
                             expertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}
                          </span>
                          
                          {expertise.statut === 'terminee' && (
                            <button
                              onClick={() => handleDownloadRapportPDF(expertise)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                              title="Télécharger le rapport en PDF"
                            >
                              <FaFilePdf className="mr-1 h-3 w-3" />
                              PDF
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {expertise.rapport && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium mb-2">📝 Constatations</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>
                          </div>

                          {expertise.details_techniques && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-sm font-medium mb-2">🔧 Détails techniques</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.details_techniques}</p>
                            </div>
                          )}

                          {expertise.montant_evalue != null && expertise.montant_evalue > 0 && (
                            <div className="bg-green-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-green-800">💰 Montant évalué</p>
                              <p className="text-lg font-bold text-green-700">{formatMontant(expertise.montant_evalue)}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {expertise.conclusion && (
                              <div className="bg-purple-50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-1">✅ Conclusion</p>
                                <p className="text-sm text-gray-600">{expertise.conclusion}</p>
                              </div>
                            )}
                            {expertise.recommandations && (
                              <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-1">💡 Recommandations</p>
                                <p className="text-sm text-gray-600">{expertise.recommandations}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end pt-2 border-t">
                            <button
                              onClick={() => handleDownloadRapportPDF(expertise)}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <FaDownload className="mr-2 h-4 w-4" />
                              Télécharger le rapport complet (PDF)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Documents ({documents.length})</h2>
                <label className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
                  <FaUpload className="mr-2 h-4 w-4" />Ajouter
                  <input type="file" multiple className="hidden" onChange={(e) => e.target.files && handleUploadDocument(e.target.files)} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                </label>
              </div>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">Aucun document</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center min-w-0">
                        <FaFileAlt className="h-5 w-5 text-blue-500 mr-3" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{doc.nom_fichier}</p>
                          <p className="text-xs text-gray-500">{doc.created_at ? formatDateShort(doc.created_at) : ''}</p>
                        </div>
                      </div>
                      <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-600">
                        <FaDownload className="h-5 w-5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4"><FaUser className="inline mr-2 text-gray-400" />Assuré</h2>
              <div className="flex items-center mb-3">
                <AssureAvatar assure={sinistre.assure || { nom: '', email: '' }} size="lg" />
                <div className="ml-3">
                  <p className="text-sm font-medium">{sinistre.assure?.nom || 'Inconnu'}</p>
                  <p className="text-xs text-gray-500">{sinistre.assure?.email}</p>
                </div>
              </div>
              {sinistre.assure?.telephone && (
                <div className="flex items-center text-sm text-gray-600 border-t pt-3">
                  <FaPhone className="mr-2 h-3 w-3 text-gray-400" />{sinistre.assure.telephone}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-3"><FaComments className="inline mr-2 text-blue-500" />Communication</h2>
              <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                {communications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Aucune communication</p>
                ) : (
                  communications.slice(0, 10).map(comm => (
                    <div key={comm.id} className={`p-2 rounded text-sm ${comm.type === 'notification' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs font-medium">{comm.expediteur_nom}</span>
                        <span className="text-xs text-gray-400">{formatDate(comm.created_at)}</span>
                      </div>
                      <p className="text-xs whitespace-pre-wrap">{comm.contenu}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 text-sm border rounded-lg px-3 py-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaPaperPlane className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4"><FaHistory className="inline mr-2 text-gray-400" />Historique</h2>
              {historique.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {historique.map(entry => (
                    <div key={entry.id} className="border-l-2 border-blue-200 pl-3">
                      <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>
                      <p className="text-sm">
                        <span className="font-medium">
                          {entry.commentaire || `${entry.ancien_statut} → ${entry.nouveau_statut}`}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDesignateExpert && (
        <Modal onClose={() => setShowDesignateExpert(false)} title="Désigner un expert">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expert *</label>
              <select value={selectedExpert} onChange={(e) => setSelectedExpert(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Sélectionner</option>
                {experts.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date expertise *</label>
              <input type="datetime-local" value={dateExpertise} onChange={(e) => setDateExpertise(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={handleDesignateExpert} disabled={!selectedExpert || !dateExpertise} className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50">Désigner</button>
              <button onClick={() => setShowDesignateExpert(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}

      {showStatusModal && (
        <Modal onClose={() => setShowStatusModal(false)} title="Changer le statut">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nouveau statut *</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Sélectionner</option>
                {Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea value={statusComment} onChange={(e) => setStatusComment(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={handleChangeStatus} disabled={!newStatus} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Confirmer</button>
              <button onClick={() => setShowStatusModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}

      {showIndemnisationModal && (
        <Modal onClose={() => setShowIndemnisationModal(false)} title="Gérer l'indemnisation">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Montant (CDF) *</label>
              <input type="number" value={indemnisationForm.montant_indemnisation} onChange={(e) => setIndemnisationForm({...indemnisationForm, montant_indemnisation: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mode de paiement</label>
              <select value={indemnisationForm.mode_paiement} onChange={(e) => setIndemnisationForm({...indemnisationForm, mode_paiement: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                {Object.entries(MODES_PAIEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea value={indemnisationForm.commentaire} onChange={(e) => setIndemnisationForm({...indemnisationForm, commentaire: e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex space-x-3 pt-2">
              <button onClick={handleSaveIndemnisation} disabled={saving || !indemnisationForm.montant_indemnisation} className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}
                {indemnisation?.id ? 'Mettre à jour' : "Initier l'indemnisation"}
              </button>
              <button onClick={() => setShowIndemnisationModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}