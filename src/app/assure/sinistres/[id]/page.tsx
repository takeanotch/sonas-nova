// // app/assure/sinistres/[id]/page.tsx
// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { 
//   FaArrowLeft, FaUpload, FaDownload, FaFileAlt,
//   FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
//   FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
//   FaHistory, FaTimes, FaExclamationTriangle, FaClipboardList,
//   FaUserCheck, FaPaperPlane, FaComments, FaPhone, 
//   FaFileContract, FaQuestionCircle, FaExclamationCircle,
//   FaBell, FaPlus, FaEnvelope, FaCommentMedical, FaHeadset,
//   FaInfo
// } from 'react-icons/fa';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

// // ==================== TYPES ====================

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
//   assure: {
//     nom: string;
//     email: string;
//     telephone?: string;
//     photo_profil?: string;
//   };
//     agent?: {  // ✅ Ajouter l'agent optionnel
//     nom: string;
//     email: string;
//     telephone?: string;
//     photo_profil?: string;
//   } | null;
//   souscription?: {
//     police_numero?: string;
//     produit?: {
//       nom: string;
//     };
//   };
// };

// type Document = {
//   id: string;
//   nom_fichier: string;
//   url_fichier: string;
//   type_document: string;
//   taille_fichier?: number;
//   created_at: string;
// };

// type Communication = {
//   id: string;
//   type: 'message' | 'notification' | 'reclamation';
//   contenu: string;
//   expediteur_nom: string;
//   expediteur_role: string;
//   priorite?: 'normal' | 'urgent' | 'critique';
//   statut_reclamation?: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
//   created_at: string;
// };

// type Expertise = {
//   id: string;
//   expert_nom: string;
//   expert_email: string;
//   expert_photo?: string;
//   date_designation: string;
//   date_expertise: string | null;
//   rapport: string | null;
//   conclusion: string | null;
//   montant_evalue: number | null;
//   statut: string;
//   documents: ExpertiseDocument[];
// };

// type ExpertiseDocument = {
//   id: string;
//   nom_fichier: string;
//   url_fichier: string;
//   created_at: string;
// };

// type Notification = {
//   id: string;
//   type: string;
//   titre: string;
//   message: string;
//   lu: boolean;
//   created_at: string;
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
//     color: 'text-yellow-700',
//     bgColor: 'bg-yellow-100',
//     progress: 10,
//     description: 'Votre dossier a été reçu et est en attente de traitement'
//   },
//   en_cours: { 
//     label: 'En cours de traitement', 
//     icon: FaSpinner, 
//     color: 'text-blue-700',
//     bgColor: 'bg-blue-100',
//     progress: 30,
//     description: 'Votre dossier est en cours de traitement par nos équipes'
//   },
//   expertise: { 
//     label: 'En expertise', 
//     icon: FaClipboardList, 
//     color: 'text-purple-700',
//     bgColor: 'bg-purple-100',
//     progress: 50,
//     description: 'Un expert évalue actuellement votre sinistre'
//   },
//   en_indemnisation: { 
//     label: 'En indemnisation', 
//     icon: FaMoneyBillWave, 
//     color: 'text-indigo-700',
//     bgColor: 'bg-indigo-100',
//     progress: 75,
//     description: 'Votre indemnisation est en cours de traitement'
//   },
//   cloture: { 
//     label: 'Clôturé', 
//     icon: FaCheckCircle, 
//     color: 'text-green-700',
//     bgColor: 'bg-green-100',
//     progress: 100,
//     description: 'Votre dossier est clôturé'
//   },
//   refuse: { 
//     label: 'Refusé', 
//     icon: FaTimesCircle, 
//     color: 'text-red-700',
//     bgColor: 'bg-red-100',
//     progress: 0,
//     description: 'Votre dossier a été refusé'
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

// function UserAvatar({ user, size = 'md' }: { 
//   user: { nom?: string; email?: string; photo_profil?: string; role?: string }; 
//   size?: 'sm' | 'md' | 'lg';
// }) {
//   const sizeClasses = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  
//   const getInitials = (nom?: string) => {
//     if (!nom) return '?';
//     return nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
//   };

//   return (
//     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
//       {user.photo_profil ? (
//         <img src={user.photo_profil} alt="" className="w-full h-full object-cover" />
//       ) : (
//         <div className="w-full h-full bg-orange-500 flex items-center justify-center">
//           <span className="text-white font-medium">{getInitials(user.nom)}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// function Modal({ children, onClose, title }: { 
//   children: React.ReactNode; 
//   onClose: () => void; 
//   title: string;
// }) {
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

// function ProgressBar({ progress, color }: { progress: number; color: string }) {
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div 
//         className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
//         style={{ width: `${Math.min(progress, 100)}%` }}
//       />
//     </div>
//   );
// }

// // ==================== PAGE PRINCIPALE ====================

// type Props = { params: Promise<{ id: string }> };

// export default function AssureSinistreDetailPage({ params }: Props) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { id } = use(params);
  
//   // États principaux
//   const [sinistre, setSinistre] = useState<Sinistre | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [communications, setCommunications] = useState<Communication[]>([]);
//   const [expertises, setExpertises] = useState<Expertise[]>([]);
//   const [historique, setHistorique] = useState<any[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // États des modals
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showReclamationModal, setShowReclamationModal] = useState(false);
//   const [showMessageModal, setShowMessageModal] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [documentType, setDocumentType] = useState('autre_document');
  
//   // États formulaires
//   const [reclamationForm, setReclamationForm] = useState({
//     sujet: '',
//     contenu: '',
//     priorite: 'normal' as 'normal' | 'urgent' | 'critique',
//   });
  
//   const [messageForm, setMessageForm] = useState({
//     contenu: '',
//   });

//   useEffect(() => {
//     if (user && id) {
//       chargerTout();
//     }
//   }, [user, id]);

//   // ==================== CHARGEMENT DONNÉES ====================

//   const chargerTout = async () => {
//     try {
//       setLoading(true);
//       await Promise.all([
//         chargerSinistre(),
//         chargerExpertises(),
//         chargerCommunications(),
//         chargerNotifications(),
//       ]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const chargerSinistre = async () => {
//   // ✅ VERSION CORRIGÉE - Avec l'agent qui a pris en charge
//   const { data, error } = await supabase
//     .from('sinistres')
//     .select(`
//       *,
//       assure:users!sinistres_assure_id_fkey(nom, email, telephone, photo_profil),
//       agent:users!sinistres_updated_by_fkey(nom, email, telephone, photo_profil)
//     `)
//     .eq('id', id)
//     .eq('assure_id', user?.id)
//     .single();
  
//   if (error) {
//     console.error('Erreur chargement sinistre:', error);
//     throw error;
//   }
  
//   if (!data) throw new Error('Sinistre non trouvé');
  
//   // ✅ Charger la souscription séparément
//   let souscription = null;
//   if (data.souscription_id) {
//     const { data: souscriptionData } = await supabase
//       .from('souscriptions')
//       .select('police_numero')
//       .eq('id', data.souscription_id)
//       .single();
//     souscription = souscriptionData;
//   }
  
//   setSinistre({
//     ...data,
//     souscription,
//     agent: data.agent || null
//   });

//   const { data: docs } = await supabase
//     .from('sinistre_documents')
//     .select('*')
//     .eq('sinistre_id', id)
//     .order('created_at', { ascending: false });
  
//   setDocuments(docs || []);

//   const { data: hist } = await supabase
//     .from('sinistre_historique')
//     .select('*, modifie_par:users(nom)')
//     .eq('sinistre_id', id)
//     .order('created_at', { ascending: false });
  
//   setHistorique(hist || []);
// };



// // const chargerSinistre = async () => {
// //   // ✅ VERSION CORRIGÉE - Sans la jointure problématique
// //   const { data, error } = await supabase
// //     .from('sinistres')
// //     .select(`
// //       *,
// //       assure:users!sinistres_assure_id_fkey(nom, email, telephone, photo_profil)
// //     `)
// //     .eq('id', id)
// //     .eq('assure_id', user?.id)
// //     .single();
  
// //   if (error) {
// //     console.error('Erreur chargement sinistre:', error);
// //     throw error;
// //   }
  
// //   if (!data) throw new Error('Sinistre non trouvé');
  
// //   // ✅ Charger la souscription séparément
// //   let souscription = null;
// //   if (data.souscription_id) {
// //     const { data: souscriptionData } = await supabase
// //       .from('souscriptions')
// //       .select('police_numero')
// //       .eq('id', data.souscription_id)
// //       .single();
// //     souscription = souscriptionData;
// //   }
  
// //   setSinistre({
// //     ...data,
// //     souscription
// //   });

// //   const { data: docs } = await supabase
// //     .from('sinistre_documents')
// //     .select('*')
// //     .eq('sinistre_id', id)
// //     .order('created_at', { ascending: false });
  
// //   setDocuments(docs || []);

// //   const { data: hist } = await supabase
// //     .from('sinistre_historique')
// //     .select('*, modifie_par:users(nom)')
// //     .eq('sinistre_id', id)
// //     .order('created_at', { ascending: false });
  
// //   setHistorique(hist || []);
// // };
//   const chargerExpertises = async () => {
//     const { data } = await supabase
//       .from('expertises')
//       .select(`
//         *,
//         expert:users!expertises_expert_id_fkey(nom, email, photo_profil),
//         documents:expertise_documents(*)
//       `)
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false });
    
//     if (data) {
//       setExpertises(data.map(e => ({
//         ...e,
//         expert_nom: e.expert?.nom,
//         expert_email: e.expert?.email,
//         expert_photo: e.expert?.photo_profil,
//       })));
//     }
//   };

//   const chargerCommunications = async () => {
//     const { data } = await supabase
//       .from('sinistre_communications')
//       .select('*, expediteur:users(nom, role, photo_profil)')
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false })
//       .limit(100);
    
//     setCommunications((data || []).map(c => ({
//       ...c,
//       expediteur_nom: c.expediteur?.nom || 'Système',
//       expediteur_role: c.expediteur?.role || 'system',
//     })));
//   };

//   const chargerNotifications = async () => {
//     if (!user) return;
    
//     const { data } = await supabase
//       .from('notifications')
//       .select('*')
//       .eq('user_id', user.id)
//       .eq('sinistre_id', id)
//       .order('created_at', { ascending: false })
//       .limit(20);
    
//     setNotifications(data || []);
//   };

//   // ==================== ACTIONS ====================

//   const handleUploadDocuments = async () => {
//     if (selectedFiles.length === 0) {
//       setError('Veuillez sélectionner au moins un fichier');
//       return;
//     }

//     try {
//       for (const file of selectedFiles) {
//         const fileName = `${id}/${Date.now()}-${file.name}`;
//         const { error: uploadError } = await supabase.storage
//           .from('sinistres')
//           .upload(fileName, file);
        
//         if (uploadError) throw uploadError;

//         const { data: { publicUrl } } = supabase.storage
//           .from('sinistres')
//           .getPublicUrl(fileName);

//         await supabase.from('sinistre_documents').insert({
//           sinistre_id: id,
//           nom_fichier: file.name,
//           url_fichier: publicUrl,
//           type_document: documentType,
//           taille_fichier: file.size,
//           type_mime: file.type,
//           uploaded_by: user?.id,
//         });
//       }

//       setSuccess('Documents téléchargés avec succès');
//       setShowUploadModal(false);
//       setSelectedFiles([]);
//       setDocumentType('autre_document');
//       await chargerSinistre();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSendReclamation = async () => {
//     if (!reclamationForm.sujet || !reclamationForm.contenu) {
//       setError('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     try {
//       const { error } = await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'reclamation',
//         contenu: `**Sujet:** ${reclamationForm.sujet}\n\n${reclamationForm.contenu}`,
//         expediteur_id: user?.id,
//         priorite: reclamationForm.priorite,
//         statut_reclamation: 'ouverte',
//       });

//       if (error) throw error;

//       setSuccess('Votre réclamation a été envoyée avec succès');
//       setShowReclamationModal(false);
//       setReclamationForm({ sujet: '', contenu: '', priorite: 'normal' });
//       await chargerCommunications();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!messageForm.contenu.trim()) return;

//     try {
//       const { error } = await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'message',
//         contenu: messageForm.contenu,
//         expediteur_id: user?.id,
//       });

//       if (error) throw error;

//       setMessageForm({ contenu: '' });
//       setShowMessageModal(false);
//       await chargerCommunications();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleMarkNotificationAsRead = async (notificationId: string) => {
//     await supabase
//       .from('notifications')
//       .update({ lu: true })
//       .eq('id', notificationId);
    
//     await chargerNotifications();
//   };

//   // ==================== HELPERS ====================

//   const formatDate = (dateString: string) => {
//     try { 
//       return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr }); 
//     } catch { 
//       return dateString; 
//     }
//   };

//   const formatDateShort = (dateString: string) => {
//     try { 
//       return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr }); 
//     } catch { 
//       return dateString; 
//     }
//   };

//   const formatMontant = (montant: number) => {
//     return new Intl.NumberFormat('fr-FR', { 
//       style: 'currency', 
//       currency: 'CDF' 
//     }).format(montant);
//   };

//   const getProgressColor = (progress: number) => {
//     if (progress >= 100) return 'bg-green-500';
//     if (progress >= 75) return 'bg-indigo-500';
//     if (progress >= 50) return 'bg-purple-500';
//     if (progress >= 30) return 'bg-blue-500';
//     return 'bg-yellow-500';
//   };

//   const getPriorityColor = (priorite?: string) => {
//     switch (priorite) {
//       case 'urgent': return 'bg-orange-100 text-orange-700';
//       case 'critique': return 'bg-red-100 text-red-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   const getReclamationStatusColor = (statut?: string) => {
//     switch (statut) {
//       case 'ouverte': return 'bg-yellow-100 text-yellow-700';
//       case 'en_cours': return 'bg-blue-100 text-blue-700';
//       case 'resolue': return 'bg-green-100 text-green-700';
//       case 'fermee': return 'bg-gray-100 text-gray-700';
//       default: return 'bg-gray-100 text-gray-700';
//     }
//   };

//   // ==================== RENDU ====================

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
//           <p className="mt-4 text-gray-600">Chargement de votre dossier...</p>
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
//           <Link href="/assure/sinistres" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
//             Retour à mes sinistres
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;
//   const notificationsNonLues = notifications.filter(n => !n.lu);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* En-tête */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
//                 <FaArrowLeft className="mr-2 h-4 w-4" />
//                 Retour à mes sinistres
//               </Link>
//               <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//                 <FaFileContract className="mr-3 h-6 w-6 text-blue-600" />
//                 Dossier {sinistre.numero_dossier}
//               </h1>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setShowUploadModal(true)}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <FaUpload className="mr-2 h-4 w-4" />
//                 Ajouter documents
//               </button>
//               <button
//                 onClick={() => setShowReclamationModal(true)}
//                 className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//               >
//                 <FaExclamationCircle className="mr-2 h-4 w-4" />
//                 Faire une réclamation
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Messages */}
//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <FaTimesCircle className="text-red-400 mr-3 h-5 w-5" />
//             <p className="text-sm text-red-700">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto">
//               <FaTimes className="h-4 w-4 text-red-400" />
//             </button>
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <FaCheckCircle className="text-green-400 mr-3 h-5 w-5" />
//             <p className="text-sm text-green-700">{success}</p>
//           </div>
//         )}

//         {/* Notifications non lues */}
//         {notificationsNonLues.length > 0 && (
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-3 flex items-center">
//               <FaBell className="mr-2 h-5 w-5 text-yellow-500" />
//               Notifications importantes
//               <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
//                 {notificationsNonLues.length}
//               </span>
//             </h3>
//             <div className="space-y-2">
//               {notificationsNonLues.map(notif => (
//                 <div 
//                   key={notif.id} 
//                   className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start cursor-pointer hover:bg-yellow-100 transition-colors"
//                   onClick={() => handleMarkNotificationAsRead(notif.id)}
//                 >
//                   <FaBell className="text-yellow-500 mr-3 h-5 w-5 mt-0.5" />
//                   <div className="flex-1">
//                     <p className="font-medium text-yellow-900">{notif.titre}</p>
//                     <p className="text-sm text-yellow-700 mt-1">{notif.message}</p>
//                     <p className="text-xs text-yellow-600 mt-2">
//                       {formatDate(notif.created_at)}
//                     </p>
//                   </div>
//                   <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
//                     Nouveau
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Statut et progression */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">État de votre dossier</h2>
//                 <StatutBadge statut={sinistre.statut} />
//               </div>
              
//               <ProgressBar 
//                 progress={statutInfo.progress} 
//                 color={getProgressColor(statutInfo.progress)} 
//               />
              
//               <div className="flex justify-between mt-2 text-xs text-gray-500">
//                 {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
//                   <span key={key} className={sinistre.statut === key ? 'font-semibold text-gray-900' : ''}>
//                     {val.label}
//                   </span>
//                 ))}
//               </div>

//               <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                 <p className="text-sm text-blue-800">
//                   <FaInfo className="inline mr-1 h-4 w-4" />
//                   {statutInfo.description}
                  
//                 </p>
//               </div>
//             </div>

//             {/* Détails du sinistre */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4">Détails du sinistre</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">Type de sinistre</dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     {TYPES_SINISTRE[sinistre.type_sinistre]?.icon} {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}
//                   </dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">Date du sinistre</dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     <FaCalendarAlt className="inline mr-1 h-3 w-3 text-gray-400" />
//                     {formatDate(sinistre.date_sinistre)}
//                   </dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">Lieu</dt>
//                   <dd className="mt-1 text-sm text-gray-900">
//                     <FaMapMarkerAlt className="inline mr-1 h-3 w-3 text-gray-400" />
//                     {sinistre.lieu}
//                   </dd>
//                 </div>
//                 <div>
//                   <dt className="text-sm font-medium text-gray-500">Montant estimé</dt>
//                   <dd className="mt-1 text-sm text-gray-900 font-semibold">
//                     <FaMoneyBillWave className="inline mr-1 h-3 w-3 text-gray-400" />
//                     {sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : 'Non spécifié'}
//                   </dd>
//                 </div>
//                 {sinistre.montant_indemnisation > 0 && (
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Indemnisation</dt>
//                     <dd className="mt-1 text-sm text-green-600 font-semibold">
//                       <FaMoneyBillWave className="inline mr-1 h-3 w-3" />
//                       {formatMontant(sinistre.montant_indemnisation)}
//                     </dd>
//                   </div>
//                 )}
//                 {sinistre.souscription && (
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Police d'assurance</dt>
//                     <dd className="mt-1 text-sm text-gray-900">
//                       {sinistre.souscription.police_numero || 'N/A'}
//                       {sinistre.souscription.produit?.nom && (
//                         <span className="text-gray-500"> - {sinistre.souscription.produit.nom}</span>
//                       )}
//                     </dd>
//                   </div>
//                 )}
//               </div>
              
//               <div className="mt-4 pt-4 border-t">
//                 <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
//                 <p className="text-sm text-gray-900 whitespace-pre-wrap">{sinistre.description}</p>
//               </div>
//             </div>

//             {/* Expertises */}
//             {expertises.length > 0 && (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaUserCheck className="mr-2 h-5 w-5 text-purple-600" />
//                   Expertise
//                 </h2>
//                 {expertises.map(expertise => (
//                   <div key={expertise.id} className="border border-purple-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <UserAvatar 
//                           user={{
//                             nom: expertise.expert_nom,
//                             email: expertise.expert_email,
//                             photo_profil: expertise.expert_photo,
//                           }} 
//                           size="md" 
//                         />
//                         <div>
//                           <p className="font-medium text-purple-900">{expertise.expert_nom}</p>
//                           <p className="text-sm text-purple-600">{expertise.expert_email}</p>
//                         </div>
//                       </div>
//                       <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
//                         expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
//                         expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
//                         'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {expertise.statut === 'terminee' ? 'Terminée' :
//                          expertise.statut === 'en_cours' ? 'En cours' : 'Planifiée'}
//                       </span>
//                     </div>
                    
//                     {expertise.date_expertise && (
//                       <p className="text-sm text-gray-600 mb-2">
//                         <FaCalendarAlt className="inline mr-1 h-3 w-3" />
//                         Expertise {expertise.statut === 'terminee' ? 'réalisée' : 'prévue'} le {formatDateShort(expertise.date_expertise)}
//                       </p>
//                     )}

//                     {expertise.rapport && (
//                       <div className="mt-3 pt-3 border-t">
//                         <p className="font-medium text-gray-700 mb-2">Rapport d'expertise</p>
//                         <p className="text-sm text-gray-600 whitespace-pre-wrap">{expertise.rapport}</p>
//                         {expertise.conclusion && (
//                           <div className="mt-2">
//                             <p className="font-medium text-gray-700">Conclusion</p>
//                             <p className="text-sm text-gray-600">{expertise.conclusion}</p>
//                           </div>
//                         )}
//                         {expertise.montant_evalue != null && expertise.montant_evalue > 0 && (
//                           <p className="text-lg font-semibold text-purple-600 mt-2">
//                             Montant évalué : {formatMontant(expertise.montant_evalue)}
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     {expertise.documents?.length > 0 && (
//                       <div className="mt-3 pt-3 border-t">
//                         <p className="text-sm font-medium text-gray-500 mb-2">Documents d'expertise</p>
//                         <div className="space-y-1">
//                           {expertise.documents.map((doc: ExpertiseDocument) => (
//                             <a key={doc.id} href={doc.url_fichier} target="_blank" rel="noopener noreferrer"
//                               className="flex items-center text-sm text-blue-600 hover:text-blue-800">
//                               <FaDownload className="mr-2 h-3 w-3" /> {doc.nom_fichier}
//                             </a>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Documents */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold">Documents</h2>
//                 <button
//                   onClick={() => setShowUploadModal(true)}
//                   className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
//                 >
//                   <FaUpload className="mr-2 h-3 w-3" />
//                   Ajouter
//                 </button>
//               </div>
              
//               {documents.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
//                   <p className="mt-2 text-sm text-gray-500">Aucun document</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 gap-2">
//                   {documents.map(doc => (
//                     <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
//                       <div className="flex items-center flex-1 min-w-0">
//                         <FaFileAlt className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium truncate">{doc.nom_fichier}</p>
//                           <p className="text-xs text-gray-500">
//                             {doc.taille_fichier ? `${(doc.taille_fichier / 1024 / 1024).toFixed(2)} MB - ` : ''}
//                             {formatDateShort(doc.created_at)}
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
//             {/* Support & Contact */}
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaHeadset className="mr-2 h-5 w-5" />
//                 Besoin d'aide ?
//               </h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={() => setShowReclamationModal(true)}
//                   className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors"
//                 >
//                   <FaExclamationCircle className="inline mr-2 h-4 w-4" />
//                   <span className="font-medium">Faire une réclamation</span>
//                 </button>
//                 <button
//                   onClick={() => setShowMessageModal(true)}
//                   className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors"
//                 >
//                   <FaCommentMedical className="inline mr-2 h-4 w-4" />
//                   <span className="font-medium">Envoyer un message</span>
//                 </button>
               
//               </div>
//             </div>

//             {/* Carte Agent en charge */}
// <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//   <h3 className="text-lg font-semibold mb-4 flex items-center">
//     <FaUserCheck className="mr-2 h-4 w-4 text-green-600" />
//    Agent en charge du dossier
//   </h3>
  
//   {sinistre.agent ? (
//     <>
//       <div className="flex items-center mb-3">
//         <UserAvatar 
//           user={{
//             nom: sinistre.agent.nom,
//             email: sinistre.agent.email,
//             photo_profil: sinistre.agent.photo_profil,
//           }} 
//           size="lg" 
//         />
//         <div className="ml-3">
//           <p className="font-medium text-gray-900">{sinistre.agent.nom}</p>
//           <p className="text-sm text-green-600 font-medium">Agent ARCA</p>
//           <p className="text-xs text-gray-500">{sinistre.agent.email}</p>
//         </div>
//       </div>
      
//       {sinistre.agent.telephone && (
//         <div className="flex items-center text-sm text-gray-600 border-t pt-3">
//           <FaPhone className="mr-2 h-3 w-3 text-gray-400" />
//           {sinistre.agent.telephone}
//         </div>
//       )}
      
//       <div className="mt-3 pt-3 border-t">
//         <div className="flex items-center text-xs text-green-700 bg-green-50 rounded-lg p-2">
//           <FaCheckCircle className="mr-1.5 h-3 w-3" />
//           En charge de votre dossier
//         </div>
//       </div>
//     </>
//   ) : sinistre.statut === 'en_attente' ? (
//     <div className="text-center py-3">
//       <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
//         <FaClock className="h-6 w-6 text-yellow-600" />
//       </div>
//       <p className="text-sm font-medium text-yellow-800">En attente d'affectation</p>
//       <p className="text-xs text-gray-500 mt-1">
//         Un agent va bientôt prendre en charge votre dossier
//       </p>
//     </div>
//   ) : (
//     <div className="text-center py-3">
//       <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//         <FaUser className="h-6 w-6 text-blue-600" />
//       </div>
//       <p className="text-sm font-medium text-blue-800">Agent ARCA</p>
//       <p className="text-xs text-gray-500 mt-1">
//         Votre dossier est en cours de traitement
//       </p>
//     </div>
//   )}
// </div>

//             {/* Historique récent */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold mb-4 flex items-center">
//                 <FaHistory className="mr-2 h-4 w-4 text-gray-400" />
//                 Activité récente
//               </h3>
//               {historique.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center py-4">Aucune activité</p>
//               ) : (
//                 <div className="space-y-3 max-h-80 overflow-y-auto">
//                   {historique.slice(0, 10).map(entry => (
//                     <div key={entry.id} className="border-l-2 border-blue-200 pl-3">
//                       <p className="text-xs text-gray-400">{formatDateShort(entry.created_at)}</p>
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
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Section Communication */}
//         <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center">
//             <FaComments className="mr-2 h-5 w-5 text-blue-500" />
//             Communications
//           </h2>
          
//           <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
//             {communications.length === 0 ? (
//               <div className="text-center py-8">
//                 <FaEnvelope className="mx-auto h-12 w-12 text-gray-300" />
//                 <p className="mt-2 text-sm text-gray-500">Aucune communication</p>
//               </div>
//             ) : (
//               communications.map(comm => (
//                 <div key={comm.id} className={`p-4 rounded-lg ${
//                   comm.type === 'reclamation' ? 'bg-orange-50 border border-orange-200' :
//                   comm.type === 'notification' ? 'bg-blue-50 border border-blue-200' :
//                   'bg-gray-50 border border-gray-200'
//                 }`}>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center">
//                       <UserAvatar 
//                         user={{ nom: comm.expediteur_nom }} 
//                         size="sm" 
//                       />
//                       <div className="ml-2">
//                         <p className="text-sm font-medium">
//                           {comm.expediteur_nom}
//                           <span className="ml-2 text-xs text-gray-500">
//                             {comm.expediteur_role === 'assure' ? 'Vous' : 
//                              comm.expediteur_role === 'agent' ? 'Agent ARCA' :
//                              comm.expediteur_role === 'expert' ? 'Expert' : ''}
//                           </span>
//                         </p>
//                         <p className="text-xs text-gray-400">{formatDate(comm.created_at)}</p>
//                       </div>
//                     </div>
//                     {comm.type === 'reclamation' && (
//                       <div className="flex space-x-2">
//                         {comm.priorite && (
//                           <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(comm.priorite)}`}>
//                             {comm.priorite}
//                           </span>
//                         )}
//                         {comm.statut_reclamation && (
//                           <span className={`px-2 py-0.5 rounded-full text-xs ${getReclamationStatusColor(comm.statut_reclamation)}`}>
//                             {comm.statut_reclamation}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-700 whitespace-pre-wrap">{comm.contenu}</p>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={() => setShowMessageModal(true)}
//               className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <FaPaperPlane className="mr-2 h-4 w-4" />
//               Envoyer un message
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal Upload Documents */}
//       {showUploadModal && (
//         <Modal onClose={() => setShowUploadModal(false)} title="Ajouter des documents">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Type de document
//               </label>
//               <select
//                 value={documentType}
//                 onChange={(e) => setDocumentType(e.target.value)}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
//               >
//                 <option value="photo_dommage">Photo des dommages</option>
//                 <option value="constat_amiable">Constat amiable</option>
//                 <option value="rapport_police">Rapport de police</option>
//                 <option value="facture">Facture</option>
//                 <option value="devis">Devis</option>
//                 <option value="autre_document">Autre document</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Fichiers
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                   className="hidden"
//                   id="file-upload"
//                 />
//                 <label htmlFor="file-upload" className="cursor-pointer">
//                   <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
//                   <p className="mt-2 text-sm text-gray-600">
//                     Cliquez pour sélectionner des fichiers
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     PDF, DOC, JPG, PNG (max 10MB)
//                   </p>
//                 </label>
//               </div>
//               {selectedFiles.length > 0 && (
//                 <div className="mt-3 space-y-1">
//                   {selectedFiles.map((file, index) => (
//                     <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
//                       <FaFileAlt className="mr-2 h-4 w-4 text-blue-500" />
//                       {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex space-x-3 pt-2">
//               <button
//                 onClick={handleUploadDocuments}
//                 disabled={selectedFiles.length === 0}
//                 className="flex-1 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaUpload className="inline mr-2 h-4 w-4" />
//                 Télécharger
//               </button>
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className="flex-1 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal Réclamation */}
//       {showReclamationModal && (
//         <Modal onClose={() => setShowReclamationModal(false)} title="Faire une réclamation">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Sujet *
//               </label>
//               <input
//                 type="text"
//                 value={reclamationForm.sujet}
//                 onChange={(e) => setReclamationForm({...reclamationForm, sujet: e.target.value})}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
//                 placeholder="Objet de votre réclamation"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Priorité
//               </label>
//               <select
//                 value={reclamationForm.priorite}
//                 onChange={(e) => setReclamationForm({...reclamationForm, priorite: e.target.value as any})}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
//               >
//                 <option value="normal">Normale</option>
//                 <option value="urgent">Urgente</option>
//                 <option value="critique">Critique</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description *
//               </label>
//               <textarea
//                 value={reclamationForm.contenu}
//                 onChange={(e) => setReclamationForm({...reclamationForm, contenu: e.target.value})}
//                 rows={5}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
//                 placeholder="Décrivez votre problème en détail..."
//               />
//             </div>

//             <div className="flex space-x-3 pt-2">
//               <button
//                 onClick={handleSendReclamation}
//                 disabled={!reclamationForm.sujet || !reclamationForm.contenu}
//                 className="flex-1 bg-orange-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaExclamationCircle className="inline mr-2 h-4 w-4" />
//                 Envoyer la réclamation
//               </button>
//               <button
//                 onClick={() => setShowReclamationModal(false)}
//                 className="flex-1 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal Message */}
//       {showMessageModal && (
//         <Modal onClose={() => setShowMessageModal(false)} title="Envoyer un message">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Votre message
//               </label>
//               <textarea
//                 value={messageForm.contenu}
//                 onChange={(e) => setMessageForm({contenu: e.target.value})}
//                 rows={4}
//                 className="w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Écrivez votre message..."
//               />
//             </div>

//             <div className="flex space-x-3 pt-2">
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!messageForm.contenu.trim()}
//                 className="flex-1 bg-blue-600 text-white rounded-md py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <FaPaperPlane className="inline mr-2 h-4 w-4" />
//                 Envoyer
//               </button>
//               <button
//                 onClick={() => setShowMessageModal(false)}
//                 className="flex-1 border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
  FaCommentMedical, FaHeadset, FaInfo, FaHandHoldingUsd
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
  // ✅ Nouveaux champs pour l'indemnisation
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
    // ✅ Charger le sinistre SANS jointure
    const { data, error } = await supabase.from('sinistres').select('*').eq('id', id).eq('assure_id', user?.id).single();
    if (error || !data) throw new Error('Sinistre non trouvé');

    // Charger l'assuré
    const { data: assureData } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.assure_id).single();

    // Charger l'agent
    let agentData = null;
    if (data.updated_by) {
      const { data: ag } = await supabase.from('users').select('nom, email, telephone, photo_profil').eq('id', data.updated_by).single();
      agentData = ag;
    }

    // Charger la souscription
    let souscription = null;
    if (data.souscription_id) {
      const { data: sub } = await supabase.from('souscriptions').select('police_numero').eq('id', data.souscription_id).single();
      souscription = sub;
    }

    // ✅ Charger l'indemnisation
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

    // Documents
    const { data: docs } = await supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false });
    setDocuments(docs || []);

    // Historique
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
      await supabase.from('sinistre_communications').insert({ sinistre_id: id, type: 'reclamation', contenu: `**Sujet:** ${reclamationForm.sujet}\n\n${reclamationForm.contenu}`, expediteur_id: user?.id, priorite: reclamationForm.priorite, statut_reclamation: 'ouverte' });
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

  // ✅ Statut effectif : si indemnisé, afficher comme clôturé
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
            {/* ✅ Progression avec statut effectif */}
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

            {/* Détails */}
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

            {/* ✅ Section indemnisation visible pour l'assuré */}
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
            <div><label className="block text-sm font-medium mb-1">Sujet *</label><input type="text" value={reclamationForm.sujet} onChange={(e) => setReclamationForm({...reclamationForm, sujet: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Priorité</label><select value={reclamationForm.priorite} onChange={(e) => setReclamationForm({...reclamationForm, priorite: e.target.value as any})} className="w-full border rounded-md px-3 py-2 text-sm"><option value="normal">Normale</option><option value="urgent">Urgente</option><option value="critique">Critique</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Description *</label><textarea value={reclamationForm.contenu} onChange={(e) => setReclamationForm({...reclamationForm, contenu: e.target.value})} rows={5} className="w-full border rounded-md px-3 py-2 text-sm" /></div>
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