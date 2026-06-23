
// // app/sinistres/[id]/page.tsx
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
//   FaUserCheck, FaUserTie,FaInfo, FaSearch, FaPaperPlane,
//   FaComments, FaPhone, FaEnvelope, FaBuilding, FaChevronRight,
//   FaClipboardCheck, FaFileContract, FaHandshake,
//   FaCheck, FaBan, FaPlus, FaEye, FaTrash
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
//   specialite?: string;
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
//   type: 'message' | 'notification' | 'reclamation'; // ✅ Correction: retiré "note"
//   contenu: string;
//   expediteur_nom: string;
//   expediteur_role: string;
//   priorite?: 'normal' | 'urgent' | 'critique';
//   statut_reclamation?: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
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

// // ==================== CONSTANTES ====================

// const STATUTS: Record<string, { 
//   label: string; 
//   icon: React.ComponentType<any>; 
//   color: string;
//   bgColor: string;
//   progress: number;
//   description: string;
// }> = {
//   en_attente: { 
//     label: 'En attente', 
//     icon: FaClock, 
//     color: 'text-yellow-600',
//     bgColor: 'bg-yellow-100',
//     progress: 10,
//     description: 'Dossier reçu, en attente de traitement'
//   },
//   en_cours: { 
//     label: 'En cours', 
//     icon: FaSpinner, 
//     color: 'text-blue-600',
//     bgColor: 'bg-blue-100',
//     progress: 30,
//     description: 'Dossier pris en charge par un agent'
//   },
//   expertise: { 
//     label: 'En expertise', 
//     icon: FaClipboardList, 
//     color: 'text-purple-600',
//     bgColor: 'bg-purple-100',
//     progress: 50,
//     description: 'Expert désigné, évaluation en cours'
//   },
//   en_indemnisation: { 
//     label: 'En indemnisation', 
//     icon: FaMoneyBillWave, 
//     color: 'text-indigo-600',
//     bgColor: 'bg-indigo-100',
//     progress: 75,
//     description: 'Indemnisation en cours de versement'
//   },
//   cloture: { 
//     label: 'Clôturé', 
//     icon: FaCheckCircle, 
//     color: 'text-green-600',
//     bgColor: 'bg-green-100',
//     progress: 100,
//     description: 'Dossier clôturé'
//   },
//   refuse: { 
//     label: 'Refusé', 
//     icon: FaTimesCircle, 
//     color: 'text-red-600',
//     bgColor: 'bg-red-100',
//     progress: 0,
//     description: 'Dossier refusé'
//   },
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

// // ==================== COMPOSANTS ====================

// function AssureAvatar({ assure, size = 'md' }: { assure: Assure; size?: 'sm' | 'md' | 'lg' }) {
//   const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg' };
//   const getInitials = (nom: string) => nom?.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2) || '??';
  
//   return (
//     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
//       {assure.photo_profil ? (
//         <img src={assure.photo_profil} alt={assure.nom} className="w-full h-full object-cover"
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.style.display = 'none';
//             target.parentElement!.classList.add('bg-orange-600', 'flex', 'items-center', 'justify-center');
//             target.parentElement!.innerHTML = `<span class="text-white font-medium">${getInitials(assure.nom || '')}</span>`;
//           }}
//         />
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
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//               <FaTimes className="h-5 w-5" />
//             </button>
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
//       <Icon className="mr-1.5 h-4 w-4" />
//       {info.label}
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
//       <div 
//         className={`h-3 rounded-full transition-all duration-500 ${getColor()}`}
//         style={{ width: `${Math.max(progress, 2)}%` }}
//       />
//     </div>
//   );
// }

// function InfoItem({ label, value, icon: Icon, color }: { label: string; value: string; icon?: any; color?: string }) {
//   return (
//     <div>
//       <dt className="text-sm font-medium text-gray-500">{label}</dt>
//       <dd className={`mt-1 text-sm ${color || 'text-gray-900'}`}>
//         {Icon && <Icon className="inline mr-1 h-3 w-3 text-gray-400" />}
//         {value}
//       </dd>
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
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Experts disponibles
//   const [experts, setExperts] = useState<Expert[]>([]);
//   const [showDesignateExpert, setShowDesignateExpert] = useState(false);
//   const [selectedExpert, setSelectedExpert] = useState('');
//   const [dateExpertise, setDateExpertise] = useState('');

//   // Rapport expertise
//   const [showRapportModal, setShowRapportModal] = useState(false);
//   const [editingExpertise, setEditingExpertise] = useState<Expertise | null>(null);
//   const [rapportForm, setRapportForm] = useState({
//     rapport: '',
//     conclusion: '',
//     montant_evalue: 0,
//   });
//   const [rapportFiles, setRapportFiles] = useState<File[]>([]);

//   // Communication
//   const [newMessage, setNewMessage] = useState('');
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusComment, setStatusComment] = useState('');

//   useEffect(() => {
//     if (user && id) {
//       chargerTout();
//       if (['admin', 'agent'].includes(user.role || '')) {
//         chargerExperts();
//       }
//     }
//   }, [user, id]);

//   const chargerTout = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         chargerSinistre(),
//         chargerExpertises(),
//         chargerCommunications(),
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chargerSinistre = async () => {
//     const { data, error } = await supabase
//       .from('sinistres')
//       .select(`*, assure:users!sinistres_assure_id_fkey(nom, email, telephone, photo_profil)`)
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     if (!data) throw new Error('Sinistre non trouvé');

//     // Charger souscription
//     let souscription = null;
//     if (data.souscription_id) {
//       const { data: subData } = await supabase
//         .from('souscriptions')
//         .select('police_numero, produit:produits(nom)')
//         .eq('id', data.souscription_id)
//         .single();
//       souscription = subData;
//     }

//     setSinistre({ ...data, souscription });

//     // Documents
//     const { data: docs } = await supabase
//       .from('sinistre_documents')
//       .select('*')
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false });
//     setDocuments(docs || []);

//     // Historique
//     const { data: hist } = await supabase
//       .from('sinistre_historique')
//       .select('*, modifie_par:users(nom)')
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false });
//     setHistorique(hist || []);
//   };

//   const chargerExpertises = async () => {
//     const { data, error } = await supabase
//       .from('expertises')
//       .select(`*, expert:users!expertises_expert_id_fkey(nom, email), documents:expertise_documents(*)`)
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false });
    
//     if (!error && data) {
//       setExpertises(data.map(e => ({
//         ...e,
//         expert_nom: e.expert?.nom || 'Inconnu',
//         expert_email: e.expert?.email || '',
//       })));
//     }
//   };

//   const chargerCommunications = async () => {
//     const { data } = await supabase
//       .from('sinistre_communications')
//       .select(`*, expediteur:users(nom, role)`)
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false })
//       .limit(50);
    
//     setCommunications((data || []).map(c => ({
//       ...c,
//       expediteur_nom: c.expediteur?.nom || 'Système',
//       expediteur_role: c.expediteur?.role || 'system',
//     })));
//   };

//   const chargerExperts = async () => {
//     const { data } = await supabase
//       .from('users')
//       .select('id, nom, email, telephone')
//       .eq('role', 'expert')
//       .order('nom');
//     setExperts(data || []);
//   };

//   // ============ ACTIONS ============
  
//   const handleDesignateExpert = async () => {
//     if (!selectedExpert || !dateExpertise) {
//       setError('Veuillez sélectionner un expert et une date');
//       return;
//     }
//     try {
//       const { error } = await supabase.from('expertises').insert({
//         sinistre_id: id,
//         expert_id: selectedExpert,
//         date_designation: new Date().toISOString(),
//         date_expertise: dateExpertise,
//         statut: 'planifiee',
//       });
//       if (error) throw error;

//       // Mettre à jour le statut du sinistre si nécessaire
//       if (sinistre?.statut === 'en_cours') {
//         await supabase.from('sinistres')
//           .update({ statut: 'expertise', updated_by: user?.id })
//           .eq('id', id);
//       }

//       await ajouterHistorique('expertise', `Expert ${experts.find(e => e.id === selectedExpert)?.nom} désigné`);
//       await ajouterCommunication('notification', `Expert désigné. Date d'expertise prévue : ${formatDate(dateExpertise)}`);
      
//       setSuccess('Expert désigné avec succès');
//       setShowDesignateExpert(false);
//       setSelectedExpert('');
//       setDateExpertise('');
//       await chargerTout();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSubmitRapport = async () => {
//     if (!editingExpertise) return;
//     try {
//       const { error } = await supabase.from('expertises').update({
//         rapport: rapportForm.rapport,
//         conclusion: rapportForm.conclusion,
//         montant_evalue: rapportForm.montant_evalue,
//         statut: 'terminee',
//         date_expertise: new Date().toISOString(),
//       }).eq('id', editingExpertise.id);
//       if (error) throw error;

//       // Upload documents expertise
//       for (const file of rapportFiles) {
//         const fileName = `expertises/${id}/${Date.now()}-${file.name}`;
//         await supabase.storage.from('expertises').upload(fileName, file);
//         const { data: { publicUrl } } = supabase.storage.from('expertises').getPublicUrl(fileName);
//         await supabase.from('expertise_documents').insert({
//           expertise_id: editingExpertise.id,
//           nom_fichier: file.name,
//           url_fichier: publicUrl,
//           type_document: 'rapport',
//           taille_fichier: file.size,
//           type_mime: file.type,
//         });
//       }

//       await ajouterHistorique('expertise_terminee', 'Rapport d\'expertise soumis');
//       await ajouterCommunication('notification', `Rapport d'expertise déposé. Montant évalué : ${formatMontant(rapportForm.montant_evalue)}`);
      
//       setSuccess('Rapport d\'expertise soumis avec succès');
//       setShowRapportModal(false);
//       setRapportFiles([]);
//       await chargerTout();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const { error } = await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'message', // ✅ Utiliser 'message' au lieu de 'note'
//         contenu: newMessage,
//         expediteur_id: user?.id,
//       });
//       if (error) {
//         console.error('Erreur envoi message:', error);
//         throw error;
//       }
//       setNewMessage('');
//       await chargerCommunications();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleChangeStatus = async () => {
//     if (!newStatus) return;
//     try {
//       const updateData: any = { 
//         statut: newStatus, 
//         updated_by: user?.id,
//         updated_at: new Date().toISOString(),
//       };

//       if (newStatus === 'cloture') {
//         updateData.date_cloture = new Date().toISOString();
//       }

//       const { error } = await supabase.from('sinistres').update(updateData).eq('id', id);
//       if (error) throw error;

//       await ajouterHistorique(sinistre?.statut || '', statusComment || `Statut changé en "${STATUTS[newStatus]?.label}"`);
//       await ajouterCommunication('notification', `Statut mis à jour : ${STATUTS[newStatus]?.label}. ${statusComment}`);
      
//       setSuccess('Statut mis à jour avec succès');
//       setShowStatusModal(false);
//       setNewStatus('');
//       setStatusComment('');
//       await chargerSinistre();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleUploadDocument = async (files: FileList) => {
//     try {
//       for (const file of Array.from(files)) {
//         const fileName = `${id}/${Date.now()}-${file.name}`;
//         await supabase.storage.from('sinistres').upload(fileName, file);
//         const { data: { publicUrl } } = supabase.storage.from('sinistres').getPublicUrl(fileName);
//         await supabase.from('sinistre_documents').insert({
//           sinistre_id: id,
//           nom_fichier: file.name,
//           url_fichier: publicUrl,
//           type_document: 'autre_document',
//           taille_fichier: file.size,
//           type_mime: file.type,
//           uploaded_by: user?.id,
//         });
//       }
//       await chargerSinistre();
//       setSuccess('Documents téléchargés avec succès');
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ============ HELPERS ============
  
//   const ajouterHistorique = async (ancienStatut: string, commentaire: string) => {
//     await supabase.from('sinistre_historique').insert({
//       sinistre_id: id,
//       ancien_statut: ancienStatut,
//       nouveau_statut: sinistre?.statut || ancienStatut,
//       commentaire,
//       modifie_par: user?.id,
//     });
//   };

//   const ajouterCommunication = async (type: string, contenu: string) => {
//     await supabase.from('sinistre_communications').insert({
//       sinistre_id: id,
//       type,
//       contenu,
//       expediteur_id: user?.id,
//     });
//   };

//   const formatDate = (dateString: string) => {
//     try { return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr }); }
//     catch { return dateString; }
//   };

//   const formatDateShort = (dateString: string) => {
//     try { return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr }); }
//     catch { return dateString; }
//   };

//   const formatMontant = (montant: number) => {
//     return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(montant);
//   };

//   const getProgressColor = (progress: number) => {
//     if (progress >= 100) return 'bg-green-500';
//     if (progress >= 75) return 'bg-indigo-500';
//     if (progress >= 50) return 'bg-purple-500';
//     if (progress >= 30) return 'bg-blue-500';
//     return 'bg-yellow-500';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
//           <p className="mt-4 text-gray-600">Chargement du dossier...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!sinistre) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
//           <p className="mt-4 text-gray-600">Dossier non trouvé</p>
//           <Link href="/sinistres" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
//             Retour aux sinistres
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;
//   const StatutIcon = statutInfo.icon;
//   const isAgent = ['admin', 'agent'].includes(user?.role || '');
//   const isExpert = user?.role === 'expert';
//   const monExpertise = isExpert ? expertises.find(e => e.expert_id === user?.id) : null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* En-tête */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <Link href="/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3">
//             <FaArrowLeft className="mr-2 h-4 w-4" />
//             Retour aux sinistres
//           </Link>
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//                 <FaFileContract className="mr-3 h-6 w-6 text-blue-600" />
//                 Dossier {sinistre.numero_dossier}
//               </h1>
//               <div className="flex items-center space-x-3 mt-1">
//                 <StatutBadge statut={sinistre.statut} />
//                 <span className="text-sm text-gray-500">
//                   Créé le {formatDateShort(sinistre.created_at)}
//                 </span>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               {isAgent && (
//                 <>
//                   <button onClick={() => setShowDesignateExpert(true)}
//                     className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
//                     <FaUserTie className="mr-2 h-4 w-4" /> Désigner expert
//                   </button>
//                   <button onClick={() => {
//                     setNewStatus(sinistre.statut);
//                     setStatusComment('');
//                     setShowStatusModal(true);
//                   }}
//                     className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
//                     <FaEdit className="mr-2 h-4 w-4" /> Changer statut
//                   </button>
//                 </>
//               )}
//               {isExpert && monExpertise && monExpertise.statut !== 'terminee' && (
//                 <button onClick={() => { 
//                   setEditingExpertise(monExpertise); 
//                   setRapportForm({
//                     rapport: monExpertise.rapport || '',
//                     conclusion: monExpertise.conclusion || '',
//                     montant_evalue: monExpertise.montant_evalue || sinistre.montant_estime || 0,
//                   }); 
//                   setShowRapportModal(true); 
//                 }}
//                   className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors">
//                   <FaClipboardCheck className="mr-2 h-4 w-4" /> Soumettre rapport
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Messages */}
//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <FaTimesCircle className="text-red-400 mr-3 h-5 w-5 flex-shrink-0" />
//             <p className="text-sm text-red-700 flex-1">{error}</p>
//             <button onClick={() => setError(null)} className="ml-2">
//               <FaTimes className="h-4 w-4 text-red-400" />
//             </button>
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <FaCheckCircle className="text-green-400 mr-3 h-5 w-5 flex-shrink-0" />
//             <p className="text-sm text-green-700 flex-1">{success}</p>
//           </div>
//         )}

//         {/* ✅ Barre de progression CORRIGÉE */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-3">
//             <h2 className="text-lg font-semibold text-gray-900">Progression du dossier</h2>
//             <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statutInfo.bgColor} ${statutInfo.color}`}>
//               <StatutIcon className="mr-1.5 h-4 w-4" />
//               {statutInfo.label}
//             </span>
//           </div>
          
//           {/* Barre de progression */}
//           <div className="mb-3">
//             <ProgressBar progress={statutInfo.progress} />
//           </div>
          
//           {/* Étapes de progression */}
//           <div className="flex justify-between mt-1">
//             {Object.entries(STATUTS)
//               .filter(([key]) => !['refuse'].includes(key))
//               .map(([key, val]) => {
//                 const IconComponent = val.icon;
//                 const isActive = statutInfo.progress >= val.progress && val.progress > 0;
//                 const isCurrent = sinistre.statut === key;
                
//                 return (
//                   <div key={key} className="flex flex-col items-center">
//                     <div className={`
//                       w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
//                       ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
//                       ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
//                     `}>
//                       <IconComponent className="h-4 w-4" />
//                     </div>
//                     <span className={`text-xs mt-1.5 text-center max-w-[70px] leading-tight ${
//                       isCurrent ? 'font-semibold text-gray-900' : 'text-gray-500'
//                     }`}>
//                       {val.label}
//                     </span>
//                   </div>
//                 );
//               })}
//           </div>
          
//           {/* Description du statut actuel */}
//           <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-800">
//               <FaInfo className="inline mr-1 h-4 w-4" />
//               {statutInfo.description}
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Infos sinistre */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <InfoItem 
//                   label="Type" 
//                   value={`${TYPES_SINISTRE[sinistre.type_sinistre]?.icon || '📋'} ${TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}`} 
//                 />
//                 <InfoItem label="Date sinistre" value={formatDate(sinistre.date_sinistre)} icon={FaCalendarAlt} />
//                 <InfoItem label="Lieu" value={sinistre.lieu} icon={FaMapMarkerAlt} />
//                 <InfoItem 
//                   label="Montant estimé" 
//                   value={sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : 'Non spécifié'} 
//                   icon={FaMoneyBillWave} 
//                 />
//                 {sinistre.montant_indemnisation > 0 && (
//                   <InfoItem 
//                     label="Indemnisation" 
//                     value={formatMontant(sinistre.montant_indemnisation)} 
//                     icon={FaMoneyBillWave} 
//                     color="text-green-600 font-semibold" 
//                   />
//                 )}
//                 {sinistre.souscription && (
//                   <InfoItem 
//                     label="Police" 
//                     value={sinistre.souscription.police_numero || 'N/A'} 
//                     icon={FaFileContract} 
//                   />
//                 )}
//               </div>
//               <div className="mt-4 pt-4 border-t">
//                 <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
//                 <p className="text-sm text-gray-900 whitespace-pre-wrap">{sinistre.description}</p>
//               </div>
//             </div>

//             {/* Expertises */}
//             {expertises.length > 0 && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaClipboardList className="mr-2 h-5 w-5 text-purple-600" />
//                   Expertises ({expertises.length})
//                 </h2>
//                 <div className="space-y-4">
//                   {expertises.map(expertise => (
//                     <div key={expertise.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
//                             <FaUserCheck className="h-5 w-5 text-purple-600" />
//                           </div>
//                           <div className="ml-3">
//                             <p className="text-sm font-medium">{expertise.expert_nom}</p>
//                             <p className="text-xs text-gray-500">{expertise.expert_email}</p>
//                           </div>
//                         </div>
//                         <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
//                           expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
//                           'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {expertise.statut === 'terminee' ? '✓ Terminée' :
//                            expertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}
//                         </span>
//                       </div>
                      
//                       <div className="grid grid-cols-2 gap-3 text-sm">
//                         <div>
//                           <span className="text-gray-500">Date désignation :</span>
//                           <span className="ml-1">{formatDateShort(expertise.date_designation)}</span>
//                         </div>
//                         {expertise.date_expertise && (
//                           <div>
//                             <span className="text-gray-500">Date expertise :</span>
//                             <span className="ml-1">{formatDateShort(expertise.date_expertise)}</span>
//                           </div>
//                         )}
//                       </div>

//                       {expertise.rapport && (
//                         <div className="mt-3 pt-3 border-t">
//                           <p className="text-sm font-medium text-gray-700 mb-1">Rapport d'expertise</p>
//                           <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>
//                           {expertise.conclusion && (
//                             <p className="text-sm mt-2">
//                               <span className="font-medium">Conclusion :</span> {expertise.conclusion}
//                             </p>
//                           )}
//                           {expertise.montant_evalue != null && expertise.montant_evalue > 0 && (
//                             <p className="text-sm font-semibold text-purple-600 mt-1">
//                               Montant évalué : {formatMontant(expertise.montant_evalue)}
//                             </p>
//                           )}
//                         </div>
//                       )}

//                       {expertise.documents?.length > 0 && (
//                         <div className="mt-3 pt-3 border-t">
//                           <p className="text-xs text-gray-500 mb-2">Documents d'expertise</p>
//                           <div className="space-y-1">
//                             {expertise.documents.map((doc: ExpertiseDocument) => (
//                               <a key={doc.id} href={doc.url_fichier} target="_blank" rel="noopener noreferrer"
//                                 className="flex items-center text-sm text-blue-600 hover:text-blue-800">
//                                 <FaDownload className="mr-2 h-3 w-3" /> {doc.nom_fichier}
//                               </a>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Documents */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">Documents ({documents.length})</h2>
//                 <label className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer transition-colors">
//                   <FaUpload className="mr-2 h-4 w-4" />
//                   Ajouter
//                   <input 
//                     type="file" 
//                     multiple 
//                     className="hidden" 
//                     onChange={(e) => e.target.files && handleUploadDocument(e.target.files)}
//                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                   />
//                 </label>
//               </div>
//               {documents.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
//                   <p className="mt-2 text-sm text-gray-500">Aucun document</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {documents.map((doc: any) => (
//                     <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                       <div className="flex items-center flex-1 min-w-0">
//                         <FaFileAlt className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium truncate">{doc.nom_fichier}</p>
//                           <p className="text-xs text-gray-500">
//                             {doc.taille_fichier ? `${(doc.taille_fichier / 1024 / 1024).toFixed(2)} MB` : ''}
//                             {doc.created_at ? ` • ${formatDateShort(doc.created_at)}` : ''}
//                           </p>
//                         </div>
//                       </div>
//                       <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" 
//                         className="ml-3 text-blue-600 hover:text-blue-800 flex-shrink-0">
//                         <FaDownload className="h-5 w-5" />
//                       </a>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Carte Assuré */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaUser className="mr-2 h-4 w-4 text-gray-400" />
//                 Assuré
//               </h2>
//               <div className="flex items-center mb-3">
//                 <AssureAvatar assure={sinistre.assure || { nom: '', email: '' }} size="lg" />
//                 <div className="ml-3">
//                   <p className="text-sm font-medium">{sinistre.assure?.nom || 'Inconnu'}</p>
//                   <p className="text-xs text-gray-500">{sinistre.assure?.email}</p>
//                 </div>
//               </div>
//               {sinistre.assure?.telephone && (
//                 <div className="flex items-center text-sm text-gray-600 border-t pt-3">
//                   <FaPhone className="mr-2 h-3 w-3 text-gray-400" />
//                   {sinistre.assure.telephone}
//                 </div>
//               )}
//             </div>

//             {/* Communication rapide */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-3 flex items-center">
//                 <FaComments className="mr-2 h-4 w-4 text-blue-500" />
//                 Communication
//               </h2>
//               <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
//                 {communications.length === 0 ? (
//                   <p className="text-sm text-gray-500 text-center py-4">Aucune communication</p>
//                 ) : (
//                   communications.slice(0, 10).map(comm => (
//                     <div key={comm.id} className={`p-2 rounded text-sm ${
//                       comm.type === 'notification' ? 'bg-blue-50 border border-blue-100' :
//                       comm.type === 'reclamation' ? 'bg-orange-50 border border-orange-100' :
//                       'bg-gray-50 border border-gray-100'
//                     }`}>
//                       <div className="flex items-center justify-between mb-0.5">
//                         <span className="text-xs font-medium">{comm.expediteur_nom}</span>
//                         <span className="text-xs text-gray-400">{formatDate(comm.created_at)}</span>
//                       </div>
//                       <p className="text-xs text-gray-700 whitespace-pre-wrap">{comm.contenu}</p>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 <input 
//                   type="text" 
//                   value={newMessage} 
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Ajouter un message..."
//                   className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
//                 />
//                 <button 
//                   onClick={handleSendMessage}
//                   disabled={!newMessage.trim()}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
//                 >
//                   <FaPaperPlane className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Historique */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaHistory className="mr-2 h-4 w-4 text-gray-400" />
//                 Historique
//               </h2>
//               {historique.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p>
//               ) : (
//                 <div className="space-y-3 max-h-80 overflow-y-auto">
//                   {historique.map(entry => (
//                     <div key={entry.id} className="border-l-2 border-blue-200 pl-3">
//                       <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>
//                       <p className="text-sm">
//                         {entry.ancien_statut && (
//                           <span className="text-gray-500">
//                             {STATUTS[entry.ancien_statut]?.label || entry.ancien_statut} →{' '}
//                           </span>
//                         )}
//                         <span className="font-medium">
//                           {STATUTS[entry.nouveau_statut]?.label || entry.nouveau_statut}
//                         </span>
//                       </p>
//                       {entry.commentaire && (
//                         <p className="text-xs text-gray-600 mt-0.5">{entry.commentaire}</p>
//                       )}
//                       <p className="text-xs text-gray-400">
//                         Par {entry.modifie_par?.nom || 'Système'}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal Désignation Expert */}
//       {showDesignateExpert && (
//         <Modal onClose={() => setShowDesignateExpert(false)} title="Désigner un expert">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Expert <span className="text-red-500">*</span>
//               </label>
//               <select 
//                 value={selectedExpert} 
//                 onChange={(e) => setSelectedExpert(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               >
//                 <option value="">Sélectionner un expert</option>
//                 {experts.map(expert => (
//                   <option key={expert.id} value={expert.id}>
//                     {expert.nom} ({expert.email})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date d'expertise <span className="text-red-500">*</span>
//               </label>
//               <input 
//                 type="datetime-local" 
//                 value={dateExpertise} 
//                 onChange={(e) => setDateExpertise(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
//               />
//             </div>
//             <div className="flex space-x-3 pt-2">
//               <button 
//                 onClick={handleDesignateExpert}
//                 disabled={!selectedExpert || !dateExpertise}
//                 className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaUserCheck className="inline mr-2 h-4 w-4" />
//                 Désigner
//               </button>
//               <button 
//                 onClick={() => setShowDesignateExpert(false)}
//                 className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal Rapport Expertise */}
//       {showRapportModal && (
//         <Modal onClose={() => setShowRapportModal(false)} title="Rapport d'expertise">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rapport détaillé <span className="text-red-500">*</span>
//               </label>
//               <textarea 
//                 value={rapportForm.rapport} 
//                 onChange={(e) => setRapportForm({...rapportForm, rapport: e.target.value})}
//                 rows={5} 
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Décrivez les dommages constatés, les circonstances..." 
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
//               <textarea 
//                 value={rapportForm.conclusion} 
//                 onChange={(e) => setRapportForm({...rapportForm, conclusion: e.target.value})}
//                 rows={2} 
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Votre conclusion sur le sinistre..." 
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Montant évalué (CDF) <span className="text-red-500">*</span>
//               </label>
//               <input 
//                 type="number" 
//                 value={rapportForm.montant_evalue}
//                 onChange={(e) => setRapportForm({...rapportForm, montant_evalue: Number(e.target.value)})}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//                 min="0"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Photos / Documents</label>
//               <input 
//                 type="file" 
//                 multiple 
//                 onChange={(e) => setRapportFiles(e.target.files ? Array.from(e.target.files) : [])}
//                 className="w-full text-sm" 
//                 accept=".jpg,.jpeg,.png,.pdf" 
//               />
//               {rapportFiles.length > 0 && (
//                 <p className="text-xs text-gray-500 mt-1">{rapportFiles.length} fichier(s) sélectionné(s)</p>
//               )}
//             </div>
//             <div className="flex space-x-3 pt-2">
//               <button 
//                 onClick={handleSubmitRapport}
//                 disabled={!rapportForm.rapport || !rapportForm.montant_evalue}
//                 className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaPaperPlane className="inline mr-2 h-4 w-4" />
//                 Soumettre le rapport
//               </button>
//               <button 
//                 onClick={() => setShowRapportModal(false)}
//                 className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal Changement Statut */}
//       {showStatusModal && (
//         <Modal onClose={() => setShowStatusModal(false)} title="Changer le statut">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Nouveau statut <span className="text-red-500">*</span>
//               </label>
//               <select 
//                 value={newStatus} 
//                 onChange={(e) => setNewStatus(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Sélectionner un statut</option>
//                 {Object.entries(STATUTS).map(([key, val]) => (
//                   <option key={key} value={key}>
//                     {val.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
//               <textarea 
//                 value={statusComment} 
//                 onChange={(e) => setStatusComment(e.target.value)}
//                 rows={2} 
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Raison du changement de statut..." 
//               />
//             </div>
//             <div className="flex space-x-3 pt-2">
//               <button 
//                 onClick={handleChangeStatus} 
//                 disabled={!newStatus}
//                 className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaCheck className="inline mr-2 h-4 w-4" />
//                 Confirmer
//               </button>
//               <button 
//                 onClick={() => setShowStatusModal(false)}
//                 className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// app/sinistres/[id]/page.tsx
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
  FaHandHoldingUsd
} from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  rapport: string | null;
  conclusion: string | null;
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

  const [experts, setExperts] = useState<Expert[]>([]);
  const [showDesignateExpert, setShowDesignateExpert] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('');
  const [dateExpertise, setDateExpertise] = useState('');

  const [showRapportModal, setShowRapportModal] = useState(false);
  const [editingExpertise, setEditingExpertise] = useState<Expertise | null>(null);
  const [rapportForm, setRapportForm] = useState({ rapport: '', conclusion: '', montant_evalue: 0 });
  const [rapportFiles, setRapportFiles] = useState<File[]>([]);

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
    try {
      setLoading(true);
      await Promise.all([chargerSinistre(), chargerExpertises(), chargerCommunications(), chargerIndemnisation()]);
    } finally {
      setLoading(false);
    }
  };

  const chargerSinistre = async () => {
    const { data } = await supabase.from('sinistres').select('*').eq('id', id).single();
    if (!data) throw new Error('Sinistre non trouvé');

    const { data: assureData } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.assure_id).single();
    let souscription = null;
    if (data.souscription_id) {
      const { data: subData } = await supabase.from('souscriptions').select('police_numero').eq('id', data.souscription_id).single();
      souscription = subData;
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

      setExpertises(data.map(e => ({
        ...e,
        expert_nom: expertMap.get(e.expert_id)?.nom || 'Inconnu',
        expert_email: expertMap.get(e.expert_id)?.email || '',
        documents: [],
      })));
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
    } else {
      setCommunications([]);
    }
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

  // ✅ Vérifier si l'indemnisation est payée
  const isIndemnisationPayee = indemnisation?.statut === 'payee';
  
  // ✅ Le statut effectif : si payé, on considère comme clôturé
  const statutEffectif = isIndemnisationPayee ? 'cloture' : (sinistre?.statut || 'en_attente');

  // ============ ACTIONS ============

  const handleDesignateExpert = async () => {
    if (!selectedExpert || !dateExpertise) { setError('Veuillez sélectionner un expert et une date'); return; }
    try {
      await supabase.from('expertises').insert({ sinistre_id: id, expert_id: selectedExpert, date_designation: new Date().toISOString(), date_expertise: dateExpertise, statut: 'planifiee' });
      if (sinistre?.statut === 'en_cours') await supabase.from('sinistres').update({ statut: 'expertise', updated_by: user?.id }).eq('id', id);
      await ajouterCommunication('notification', `Expert désigné. Date prévue : ${formatDate(dateExpertise)}`);
      setSuccess('Expert désigné');
      setShowDesignateExpert(false);
      await chargerTout();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'message', contenu: newMessage, expediteur_id: user?.id });
      setNewMessage('');
      await chargerCommunications();
    } catch (err: any) { setError(err.message); }
  };

  const handleChangeStatus = async () => {
    if (!newStatus) return;
    try {
      const updateData: any = { statut: newStatus, updated_by: user?.id, updated_at: new Date().toISOString() };
      if (newStatus === 'cloture') updateData.date_cloture = new Date().toISOString();
      await supabase.from('sinistres').update(updateData).eq('id', id);
      await ajouterCommunication('notification', `Statut mis à jour : ${STATUTS[newStatus]?.label}`);
      setSuccess('Statut mis à jour');
      setShowStatusModal(false);
      await chargerSinistre();
      setTimeout(() => setSuccess(null), 3000);
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
      await chargerSinistre();
      setSuccess('Documents téléchargés');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) { setError(err.message); }
  };

  // ============ ACTIONS INDEMNISATION ============

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
      setSuccess('Indemnisation enregistrée');
      setShowIndemnisationModal(false);
      await chargerTout();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleValidateIndemnisation = async () => {
    try {
      await supabase.from('indemnisations').update({ statut: 'validee', date_validation: new Date().toISOString() }).eq('id', indemnisation?.id);
      await ajouterCommunication('notification', `Indemnisation validée : ${formatMontant(indemnisation!.montant_indemnisation)}`);
      setSuccess('Indemnisation validée');
      await chargerTout();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handlePayerIndemnisation = async () => {
    const reference = prompt('Référence de paiement (optionnel) :');
    try {
      await supabase.from('indemnisations').update({ statut: 'payee', date_paiement: new Date().toISOString(), reference_paiement: reference || null }).eq('id', indemnisation?.id);
      await supabase.from('sinistres').update({ montant_indemnisation: indemnisation!.montant_indemnisation, updated_by: user?.id }).eq('id', id);
      await ajouterCommunication('notification', `Paiement effectué : ${formatMontant(indemnisation!.montant_indemnisation)}${reference ? ` (Réf: ${reference})` : ''}`);
      setSuccess('Paiement enregistré');
      await chargerTout();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handleAnnulerIndemnisation = async () => {
    if (!confirm('Annuler cette indemnisation ?')) return;
    try {
      await supabase.from('indemnisations').update({ statut: 'annulee' }).eq('id', indemnisation?.id);
      await ajouterCommunication('notification', 'Indemnisation annulée');
      setSuccess('Indemnisation annulée');
      await chargerTout();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  // ============ HELPERS ============

  const ajouterCommunication = async (type: string, contenu: string) => {
    await supabase.from('sinistre_communications').insert({ sinistre_id: id, type, contenu, expediteur_id: user?.id });
  };

  const formatDate = (d: string) => { try { return format(new Date(d), 'dd MMMM yyyy à HH:mm', { locale: fr }); } catch { return d; } };
  const formatDateShort = (d: string) => { try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); } catch { return d; } };
  const formatMontant = (m: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><FaSpinner className="h-12 w-12 text-blue-500 animate-spin" /></div>;
  if (!sinistre) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" /><p className="mt-4">Dossier non trouvé</p><Link href="/sinistres" className="mt-4 inline-block text-blue-600">Retour aux sinistres</Link></div></div>;

  const statutInfo = STATUTS[statutEffectif] || STATUTS.en_attente;
  const StatutIcon = statutInfo.icon;
  const isAgent = ['admin', 'agent'].includes(user?.role || '');
  const isExpert = user?.role === 'expert';
  const monExpertise = isExpert ? expertises.find(e => e.expert_id === user?.id) : null;
  const expertiseTerminee = expertises.find(e => e.statut === 'terminee');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3"><FaArrowLeft className="mr-2 h-4 w-4" />Retour aux sinistres</Link>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Progression</h2>
            <StatutBadge statut={statutEffectif} />
          </div>
          <ProgressBar progress={statutInfo.progress} />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
              <span key={key} className={statutEffectif === key ? 'font-semibold text-gray-900' : ''}>{val.label}</span>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800"><FaInfo className="inline mr-1" />{statutInfo.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Infos */}
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

            {/* Indemnisation */}
            {indemnisation && (
              <div className="bg-white rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold"><FaHandHoldingUsd className="inline mr-2 text-green-600" />Indemnisation</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${INDEMNISATION_STATUTS[indemnisation.statut]?.bgColor} ${INDEMNISATION_STATUTS[indemnisation.statut]?.color}`}>
                    {INDEMNISATION_STATUTS[indemnisation.statut]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div><p className="text-gray-500">Montant</p><p className="text-xl font-bold text-green-600">{formatMontant(indemnisation.montant_indemnisation)}</p></div>
                  <div><p className="text-gray-500">Mode</p><p className="font-medium">{MODES_PAIEMENT[indemnisation.mode_paiement] || indemnisation.mode_paiement}</p></div>
                  {indemnisation.date_validation && <div><p className="text-gray-500">Date validation</p><p>{formatDateShort(indemnisation.date_validation)}</p></div>}
                  {indemnisation.date_paiement && <div><p className="text-gray-500">Date paiement</p><p>{formatDateShort(indemnisation.date_paiement)}</p></div>}
                  {indemnisation.reference_paiement && <div><p className="text-gray-500">Référence</p><p className="font-mono">{indemnisation.reference_paiement}</p></div>}
                </div>
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
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center"><FaUserCheck className="h-5 w-5 text-purple-600" /></div>
                          <div className="ml-3"><p className="text-sm font-medium">{expertise.expert_nom}</p><p className="text-xs text-gray-500">{expertise.expert_email}</p></div>
                        </div>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' : expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {expertise.statut === 'terminee' ? '✓ Terminée' : expertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}
                        </span>
                      </div>
                      {expertise.rapport && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium mb-1">Rapport</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>
                          {expertise.montant_evalue != null && expertise.montant_evalue > 0 && <p className="text-sm font-semibold text-purple-600 mt-1">Montant évalué : {formatMontant(expertise.montant_evalue)}</p>}
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
                <label className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"><FaUpload className="mr-2 h-4 w-4" />Ajouter<input type="file" multiple className="hidden" onChange={(e) => e.target.files && handleUploadDocument(e.target.files)} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" /></label>
              </div>
              {documents.length === 0 ? <p className="text-sm text-gray-500 text-center py-8">Aucun document</p> : (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center min-w-0"><FaFileAlt className="h-5 w-5 text-blue-500 mr-3" /><div className="min-w-0"><p className="text-sm font-medium truncate">{doc.nom_fichier}</p><p className="text-xs text-gray-500">{doc.created_at ? formatDateShort(doc.created_at) : ''}</p></div></div>
                      <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-600"><FaDownload className="h-5 w-5" /></a>
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
                <div className="ml-3"><p className="text-sm font-medium">{sinistre.assure?.nom || 'Inconnu'}</p><p className="text-xs text-gray-500">{sinistre.assure?.email}</p></div>
              </div>
              {sinistre.assure?.telephone && <div className="flex items-center text-sm text-gray-600 border-t pt-3"><FaPhone className="mr-2 h-3 w-3 text-gray-400" />{sinistre.assure.telephone}</div>}
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-3"><FaComments className="inline mr-2 text-blue-500" />Communication</h2>
              <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                {communications.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Aucune communication</p> : communications.slice(0, 10).map(comm => (
                  <div key={comm.id} className={`p-2 rounded text-sm ${comm.type === 'notification' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between mb-0.5"><span className="text-xs font-medium">{comm.expediteur_nom}</span><span className="text-xs text-gray-400">{formatDate(comm.created_at)}</span></div>
                    <p className="text-xs whitespace-pre-wrap">{comm.contenu}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Message..." className="flex-1 text-sm border rounded-lg px-3 py-2" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"><FaPaperPlane className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4"><FaHistory className="inline mr-2 text-gray-400" />Historique</h2>
              {historique.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p> : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {historique.map(entry => (
                    <div key={entry.id} className="border-l-2 border-blue-200 pl-3">
                      <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>
                      <p className="text-sm"><span className="font-medium">{entry.commentaire || `${entry.ancien_statut} → ${entry.nouveau_statut}`}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals (DesignateExpert, Statut, Indemnisation) - gardés identiques */}
      {showDesignateExpert && (
        <Modal onClose={() => setShowDesignateExpert(false)} title="Désigner un expert">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Expert *</label><select value={selectedExpert} onChange={(e) => setSelectedExpert(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Sélectionner</option>{experts.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Date expertise *</label><input type="datetime-local" value={dateExpertise} onChange={(e) => setDateExpertise(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleDesignateExpert} disabled={!selectedExpert || !dateExpertise} className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-purple-700 disabled:opacity-50">Désigner</button><button onClick={() => setShowDesignateExpert(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}

      {showStatusModal && (
        <Modal onClose={() => setShowStatusModal(false)} title="Changer le statut">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Nouveau statut *</label><select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Sélectionner</option>{Object.entries(STATUTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Commentaire</label><textarea value={statusComment} onChange={(e) => setStatusComment(e.target.value)} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleChangeStatus} disabled={!newStatus} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">Confirmer</button><button onClick={() => setShowStatusModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}

      {showIndemnisationModal && (
        <Modal onClose={() => setShowIndemnisationModal(false)} title="Gérer l'indemnisation">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Montant (CDF) *</label><input type="number" value={indemnisationForm.montant_indemnisation} onChange={(e) => setIndemnisationForm({...indemnisationForm, montant_indemnisation: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-2 text-sm" min="0" /></div>
            <div><label className="block text-sm font-medium mb-1">Mode de paiement</label><select value={indemnisationForm.mode_paiement} onChange={(e) => setIndemnisationForm({...indemnisationForm, mode_paiement: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">{Object.entries(MODES_PAIEMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Commentaire</label><textarea value={indemnisationForm.commentaire} onChange={(e) => setIndemnisationForm({...indemnisationForm, commentaire: e.target.value})} rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="flex space-x-3 pt-2"><button onClick={handleSaveIndemnisation} disabled={saving || !indemnisationForm.montant_indemnisation} className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">{saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}{indemnisation?.id ? 'Mettre à jour' : "Initier l'indemnisation"}</button><button onClick={() => setShowIndemnisationModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}