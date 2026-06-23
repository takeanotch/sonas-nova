// // app/expert/sinistres/[id]/page.tsx
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
//   FaUserCheck, FaInfo, FaPaperPlane, FaComments, FaPhone,
//   FaFileContract, FaClipboardCheck
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
//   assure_nom: string;
//   assure_email: string;
//   assure_telephone: string;
//   assure_photo: string;
//   souscription_police: string;
// };

// type Expertise = {
//   id: string;
//   expert_id: string;
//   sinistre_id: string;
//   date_designation: string;
//   date_expertise: string | null;
//   rapport: string | null;
//   conclusion: string | null;
//   montant_evalue: number | null;
//   statut: string;
//   created_at: string;
// };

// type Document = {
//   id: string;
//   nom_fichier: string;
//   url_fichier: string;
//   type_document: string;
//   taille_fichier: number;
//   created_at: string;
// };

// type Communication = {
//   id: string;
//   type: string;
//   contenu: string;
//   expediteur_nom: string;
//   expediteur_role: string;
//   created_at: string;
// };

// // ==================== CONSTANTES ====================

// const STATUTS: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number; description: string }> = {
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

// // ==================== COMPOSANTS ====================

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
//       <div className={`h-3 rounded-full transition-all duration-500 ${getColor()}`}
//         style={{ width: `${Math.max(progress, 2)}%` }} />
//     </div>
//   );
// }

// // ==================== PAGE PRINCIPALE ====================

// type Props = { params: Promise<{ id: string }> };

// export default function ExpertSinistreDetailPage({ params }: Props) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { id } = use(params);

//   const [sinistre, setSinistre] = useState<Sinistre | null>(null);
//   const [monExpertise, setMonExpertise] = useState<Expertise | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [communications, setCommunications] = useState<Communication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   // Message
//   const [newMessage, setNewMessage] = useState('');

//   // Rapport
//   const [showRapportModal, setShowRapportModal] = useState(false);
//   const [rapportForm, setRapportForm] = useState({
//     rapport: '',
//     conclusion: '',
//     montant_evalue: 0,
//   });
//   const [rapportFiles, setRapportFiles] = useState<File[]>([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (user && id) {
//       chargerDonnees();
//     }
//   }, [user, id]);

//   const chargerDonnees = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Charger le sinistre
//       const { data: sinistreData, error: sinistreError } = await supabase
//         .from('sinistres')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (sinistreError || !sinistreData) throw new Error('Sinistre non trouvé');

//       // 2. Charger l'assuré séparément
//       const { data: assureData } = await supabase
//         .from('users')
//         .select('nom, email, telephone, photo_profil')
//         .eq('id', sinistreData.assure_id)
//         .single();

//       // 3. Charger la souscription séparément
//       let policeNumero = 'N/A';
//       if (sinistreData.souscription_id) {
//         const { data: subData } = await supabase
//           .from('souscriptions')
//           .select('police_numero')
//           .eq('id', sinistreData.souscription_id)
//           .single();
//         if (subData) policeNumero = subData.police_numero;
//       }

//       setSinistre({
//         ...sinistreData,
//         assure_nom: assureData?.nom || 'Inconnu',
//         assure_email: assureData?.email || '',
//         assure_telephone: assureData?.telephone || '',
//         assure_photo: assureData?.photo_profil || '',
//         souscription_police: policeNumero,
//       });

//       // 4. Charger MON expertise
//       const { data: expertiseData } = await supabase
//         .from('expertises')
//         .select('*')
//         .eq('sinistre_id', id)
//         .eq('expert_id', user?.id)
//         .single();

//       if (expertiseData) {
//         setMonExpertise(expertiseData);
//         // Pré-remplir le formulaire si déjà commencé
//         setRapportForm({
//           rapport: expertiseData.rapport || '',
//           conclusion: expertiseData.conclusion || '',
//           montant_evalue: expertiseData.montant_evalue || sinistreData.montant_estime || 0,
//         });
//       }

//       // 5. Charger les documents
//       const { data: docs } = await supabase
//         .from('sinistre_documents')
//         .select('*')
//         .eq('sinistre_id', id)
//         .order('created_at', { ascending: false });
//       setDocuments(docs || []);

//       // 6. Charger les communications
//       const { data: comms } = await supabase
//         .from('sinistre_communications')
//         .select('*')
//         .eq('sinistre_id', id)
//         .order('created_at', { ascending: false })
//         .limit(50);

//       // Charger les noms des expéditeurs
//       if (comms && comms.length > 0) {
//         const expediteurIds = [...new Set(comms.map(c => c.expediteur_id))];
//         const { data: users } = await supabase
//           .from('users')
//           .select('id, nom, role')
//           .in('id', expediteurIds);

//         const userMap = new Map();
//         if (users) users.forEach(u => userMap.set(u.id, u));

//         setCommunications(comms.map(c => ({
//           ...c,
//           expediteur_nom: userMap.get(c.expediteur_id)?.nom || 'Système',
//           expediteur_role: userMap.get(c.expediteur_id)?.role || 'system',
//         })));
//       }

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============ ACTIONS ============

//   const handleCommencerExpertise = async () => {
//     try {
//       const { error } = await supabase
//         .from('expertises')
//         .update({ statut: 'en_cours' })
//         .eq('id', monExpertise?.id);

//       if (error) throw error;
      
//       setMonExpertise(prev => prev ? { ...prev, statut: 'en_cours' } : null);
//       setSuccess('Expertise commencée');
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSubmitRapport = async () => {
//     if (!rapportForm.rapport || !rapportForm.montant_evalue) {
//       setError('Le rapport et le montant évalué sont obligatoires');
//       return;
//     }

//     setSaving(true);
//     try {
//       // Mettre à jour l'expertise
//       const { error } = await supabase
//         .from('expertises')
//         .update({
//           rapport: rapportForm.rapport,
//           conclusion: rapportForm.conclusion,
//           montant_evalue: rapportForm.montant_evalue,
//           statut: 'terminee',
//           date_expertise: new Date().toISOString(),
//         })
//         .eq('id', monExpertise?.id);

//       if (error) throw error;

//       // Upload des documents
//       for (const file of rapportFiles) {
//         const fileName = `expertises/${id}/${Date.now()}-${file.name}`;
        
//         const { error: uploadError } = await supabase.storage
//           .from('expertises')
//           .upload(fileName, file);
        
//         if (uploadError) {
//           console.error('Erreur upload:', uploadError);
//           continue;
//         }

//         const { data: { publicUrl } } = supabase.storage
//           .from('expertises')
//           .getPublicUrl(fileName);

//         await supabase.from('expertise_documents').insert({
//           expertise_id: monExpertise?.id,
//           nom_fichier: file.name,
//           url_fichier: publicUrl,
//           type_document: 'rapport',
//           taille_fichier: file.size,
//           type_mime: file.type,
//         });
//       }

//       // Ajouter une communication
//       await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'notification',
//         contenu: `Rapport d'expertise déposé. Montant évalué : ${rapportForm.montant_evalue.toLocaleString()} CDF`,
//         expediteur_id: user?.id,
//       });

//       setSuccess('Rapport soumis avec succès !');
//       setShowRapportModal(false);
//       setRapportFiles([]);
//       await chargerDonnees();
//       setTimeout(() => setSuccess(null), 3000);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;
//     try {
//       const { error } = await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'message',
//         contenu: newMessage,
//         expediteur_id: user?.id,
//       });
//       if (error) throw error;
//       setNewMessage('');
//       await chargerDonnees();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ============ HELPERS ============

//   const formatDate = (dateString: string) => {
//     try { return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr }); }
//     catch { return dateString; }
//   };

//   const formatDateShort = (dateString: string) => {
//     try { return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr }); }
//     catch { return dateString; }
//   };

//   const formatMontant = (montant: number) => {
//     if (!montant || montant === 0) return '0 CDF';
//     return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(montant);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <FaSpinner className="h-12 w-12 text-purple-500 animate-spin" />
//       </div>
//     );
//   }

//   if (!sinistre) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
//           <p className="mt-4 text-gray-600">Dossier non trouvé</p>
//           <Link href="/expert/missions" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
//             Retour aux missions
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* En-tête */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <Link href="/expert/missions" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3">
//             <FaArrowLeft className="mr-2 h-4 w-4" />
//             Retour à mes missions
//           </Link>
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//                 <FaFileContract className="mr-3 h-6 w-6 text-purple-600" />
//                 Dossier {sinistre.numero_dossier}
//               </h1>
//               <div className="flex items-center space-x-3 mt-1">
//                 <StatutBadge statut={sinistre.statut} />
//                 <span className="text-sm text-gray-500">Créé le {formatDateShort(sinistre.created_at)}</span>
//               </div>
//             </div>

//             {/* Boutons d'action expert */}
//             <div className="flex space-x-2">
//               {monExpertise?.statut === 'planifiee' && (
//                 <button onClick={handleCommencerExpertise}
//                   className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
//                   <FaClipboardList className="mr-2 h-4 w-4" /> Commencer l'expertise
//                 </button>
//               )}
//               {(monExpertise?.statut === 'planifiee' || monExpertise?.statut === 'en_cours') && (
//                 <button onClick={() => setShowRapportModal(true)}
//                   className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
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
//             <FaTimesCircle className="text-red-400 mr-3 h-5 w-5" />
//             <p className="text-sm text-red-700">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4" /></button>
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <FaCheckCircle className="text-green-400 mr-3 h-5 w-5" />
//             <p className="text-sm text-green-700">{success}</p>
//           </div>
//         )}

//         {/* Progression */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-3">
//             <h2 className="text-lg font-semibold">Progression du dossier</h2>
//             <StatutBadge statut={sinistre.statut} />
//           </div>
//           <ProgressBar progress={statutInfo.progress} />
//           <div className="flex justify-between mt-2 text-xs text-gray-500">
//             {Object.entries(STATUTS).filter(([k]) => !['refuse'].includes(k)).map(([key, val]) => (
//               <span key={key} className={sinistre.statut === key ? 'font-semibold text-gray-900' : ''}>
//                 {val.label}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Infos sinistre */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Type</p>
//                   <p className="font-medium">{TYPES_SINISTRE[sinistre.type_sinistre]?.icon} {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Date sinistre</p>
//                   <p className="font-medium">{formatDate(sinistre.date_sinistre)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Lieu</p>
//                   <p className="font-medium"><FaMapMarkerAlt className="inline mr-1 h-3 w-3 text-gray-400" />{sinistre.lieu}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Montant estimé</p>
//                   <p className="font-medium">{sinistre.montant_estime ? formatMontant(sinistre.montant_estime) : 'Non spécifié'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Police</p>
//                   <p className="font-medium">{sinistre.souscription_police}</p>
//                 </div>
//               </div>
//               <div className="mt-4 pt-4 border-t">
//                 <p className="text-sm text-gray-500 mb-1">Description</p>
//                 <p className="text-sm whitespace-pre-wrap">{sinistre.description}</p>
//               </div>
//             </div>

//             {/* Mon expertise */}
//             {monExpertise && (
//               <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-6">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaClipboardList className="mr-2 h-5 w-5 text-purple-600" />
//                   Mon expertise
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       monExpertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
//                       monExpertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
//                       'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {monExpertise.statut === 'terminee' ? '✓ Terminée' :
//                        monExpertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}
//                     </span>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div>
//                       <span className="text-gray-500">Désignation :</span>
//                       <span className="ml-1">{formatDateShort(monExpertise.date_designation)}</span>
//                     </div>
//                     {monExpertise.date_expertise && (
//                       <div>
//                         <span className="text-gray-500">Expertise :</span>
//                         <span className="ml-1">{formatDateShort(monExpertise.date_expertise)}</span>
//                       </div>
//                     )}
//                   </div>

//                   {monExpertise.rapport && (
//                     <div className="mt-3 pt-3 border-t">
//                       <p className="text-sm font-medium mb-1">Votre rapport</p>
//                       <p className="text-sm text-gray-600 whitespace-pre-wrap">{monExpertise.rapport}</p>
//                       {monExpertise.conclusion && (
//                         <p className="text-sm mt-2"><span className="font-medium">Conclusion :</span> {monExpertise.conclusion}</p>
//                       )}
//                      {monExpertise.montant_evalue ? (
//   <p className="text-sm font-semibold text-purple-600 mt-1">
//     Montant évalué : {formatMontant(monExpertise.montant_evalue)}
//   </p>
// ) : null}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Documents */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-4">Documents du dossier ({documents.length})</h2>
//               {documents.length === 0 ? (
//                 <div className="text-center py-8">
//                   <FaFileAlt className="mx-auto h-12 w-12 text-gray-300" />
//                   <p className="mt-2 text-sm text-gray-500">Aucun document</p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {documents.map(doc => (
//                     <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
//                 <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
//                   <FaUser className="h-6 w-6 text-orange-600" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium">{sinistre.assure_nom}</p>
//                   <p className="text-xs text-gray-500">{sinistre.assure_email}</p>
//                 </div>
//               </div>
//               {sinistre.assure_telephone && (
//                 <div className="flex items-center text-sm text-gray-600 border-t pt-3">
//                   <FaPhone className="mr-2 h-3 w-3 text-gray-400" />
//                   {sinistre.assure_telephone}
//                 </div>
//               )}
//             </div>

//             {/* Communication */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold mb-3 flex items-center">
//                 <FaComments className="mr-2 h-4 w-4 text-blue-500" />
//                 Communications
//               </h2>
//               <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
//                 {communications.length === 0 ? (
//                   <p className="text-sm text-gray-500 text-center py-4">Aucune communication</p>
//                 ) : (
//                   communications.map(comm => (
//                     <div key={comm.id} className="p-2 rounded text-sm bg-gray-50 border border-gray-100">
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
//                 <input type="text" value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Ajouter un message..."
//                   className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2"
//                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
//                 <button onClick={handleSendMessage} disabled={!newMessage.trim()}
//                   className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
//                   <FaPaperPlane className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal Rapport */}
//       {showRapportModal && (
//         <Modal onClose={() => setShowRapportModal(false)} title="Rapport d'expertise">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rapport détaillé <span className="text-red-500">*</span>
//               </label>
//               <textarea value={rapportForm.rapport}
//                 onChange={(e) => setRapportForm({...rapportForm, rapport: e.target.value})}
//                 rows={5} className="w-full border rounded-lg px-3 py-2 text-sm"
//                 placeholder="Décrivez les dommages constatés..." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Conclusion</label>
//               <textarea value={rapportForm.conclusion}
//                 onChange={(e) => setRapportForm({...rapportForm, conclusion: e.target.value})}
//                 rows={2} className="w-full border rounded-lg px-3 py-2 text-sm"
//                 placeholder="Votre conclusion..." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Montant évalué (CDF) <span className="text-red-500">*</span>
//               </label>
//               <input type="number" value={rapportForm.montant_evalue}
//                 onChange={(e) => setRapportForm({...rapportForm, montant_evalue: Number(e.target.value)})}
//                 className="w-full border rounded-lg px-3 py-2 text-sm" min="0" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Photos / Documents</label>
//               <input type="file" multiple
//                 onChange={(e) => setRapportFiles(e.target.files ? Array.from(e.target.files) : [])}
//                 className="w-full text-sm" accept=".jpg,.jpeg,.png,.pdf" />
//               {rapportFiles.length > 0 && (
//                 <p className="text-xs text-gray-500 mt-1">{rapportFiles.length} fichier(s)</p>
//               )}
//             </div>
//             <div className="flex space-x-3 pt-2">
//               <button onClick={handleSubmitRapport} disabled={saving || !rapportForm.rapport || !rapportForm.montant_evalue}
//                 className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
//                 {saving ? <FaSpinner className="animate-spin inline mr-2" /> : <FaPaperPlane className="inline mr-2" />}
//                 Soumettre le rapport
//               </button>
//               <button onClick={() => setShowRapportModal(false)}
//                 className="flex-1 border rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50">
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// app/expert/sinistres/[id]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaArrowLeft, FaDownload, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
  FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
  FaTimes, FaExclamationTriangle, FaClipboardList,
  FaInfo, FaPaperPlane, FaComments, FaPhone,
  FaFileContract, FaClipboardCheck
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
  created_at: string;
  assure_nom: string;
  assure_email: string;
  assure_telephone: string;
  souscription_police: string;
};

type Expertise = {
  id: string;
  date_designation: string;
  date_expertise: string | null;
  rapport: string | null;
  conclusion: string | null;
  montant_evalue: number | null;
  statut: string;
};

type Document = {
  id: string;
  nom_fichier: string;
  url_fichier: string;
  taille_fichier: number;
  created_at: string;
};

type Message = {
  id: string;
  contenu: string;
  expediteur_nom: string;
  created_at: string;
};

// ==================== CONSTANTES ====================

const STATUTS: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number }> = {
  en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 10 },
  en_cours: { label: 'En cours', icon: FaSpinner, color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 30 },
  expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-100', progress: 50 },
  en_indemnisation: { label: 'En indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-100', progress: 75 },
  cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', progress: 100 },
  refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-100', progress: 0 },
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
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

type Props = { params: Promise<{ id: string }> };

export default function ExpertSinistreDetailPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  const [sinistre, setSinistre] = useState<Sinistre | null>(null);
  const [monExpertise, setMonExpertise] = useState<Expertise | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState('');
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [rapportForm, setRapportForm] = useState({ rapport: '', conclusion: '', montant_evalue: 0 });
  const [rapportFiles, setRapportFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user && id) chargerDonnees();
  }, [user, id]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ TOUT charger en une seule requête parallèle
      const [
        { data: sinistreData },
        { data: expertiseData },
        { data: docs },
        { data: comms },
      ] = await Promise.all([
        supabase.from('sinistres').select('*').eq('id', id).single(),
        supabase.from('expertises').select('*').eq('sinistre_id', id).eq('expert_id', user?.id).single(),
        supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(20),
        supabase.from('sinistre_communications').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(30),
      ]);

      if (!sinistreData) {
        setError('Sinistre non trouvé');
        setLoading(false);
        return;
      }

      // Charger assuré et souscription en parallèle
      const [assureRes, subRes] = await Promise.all([
        supabase.from('users').select('nom, email, telephone').eq('id', sinistreData.assure_id).single(),
        sinistreData.souscription_id 
          ? supabase.from('souscriptions').select('police_numero').eq('id', sinistreData.souscription_id).single()
          : Promise.resolve({ data: null }),
      ]);

      setSinistre({
        id: sinistreData.id,
        numero_dossier: sinistreData.numero_dossier,
        type_sinistre: sinistreData.type_sinistre,
        description: sinistreData.description,
        date_sinistre: sinistreData.date_sinistre,
        lieu: sinistreData.lieu,
        statut: sinistreData.statut,
        montant_estime: sinistreData.montant_estime || 0,
        created_at: sinistreData.created_at,
        assure_nom: assureRes.data?.nom || 'Inconnu',
        assure_email: assureRes.data?.email || '',
        assure_telephone: assureRes.data?.telephone || '',
        souscription_police: subRes.data?.police_numero || 'N/A',
      });

      if (expertiseData) {
        setMonExpertise({
          id: expertiseData.id,
          date_designation: expertiseData.date_designation,
          date_expertise: expertiseData.date_expertise,
          rapport: expertiseData.rapport,
          conclusion: expertiseData.conclusion,
          montant_evalue: expertiseData.montant_evalue,
          statut: expertiseData.statut,
        });
        setRapportForm({
          rapport: expertiseData.rapport || '',
          conclusion: expertiseData.conclusion || '',
          montant_evalue: expertiseData.montant_evalue || sinistreData.montant_estime || 0,
        });
      }

      setDocuments(docs || []);

      // Formater les messages avec les noms des expéditeurs
      if (comms && comms.length > 0) {
        const expediteurIds = [...new Set(comms.map(c => c.expediteur_id))];
        const { data: users } = await supabase.from('users').select('id, nom').in('id', expediteurIds);
        const userMap = new Map();
        if (users) users.forEach(u => userMap.set(u.id, u.nom));
        
        setMessages(comms.map(c => ({
          id: c.id,
          contenu: c.contenu,
          expediteur_nom: userMap.get(c.expediteur_id) || 'Système',
          created_at: c.created_at,
        })));
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommencerExpertise = async () => {
    try {
      await supabase.from('expertises').update({ statut: 'en_cours' }).eq('id', monExpertise?.id);
      setMonExpertise(prev => prev ? { ...prev, statut: 'en_cours' } : null);
      setSuccess('Expertise commencée');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmitRapport = async () => {
    if (!rapportForm.rapport || !rapportForm.montant_evalue) {
      setError('Le rapport et le montant sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      await supabase.from('expertises').update({
        rapport: rapportForm.rapport,
        conclusion: rapportForm.conclusion,
        montant_evalue: rapportForm.montant_evalue,
        statut: 'terminee',
        date_expertise: new Date().toISOString(),
      }).eq('id', monExpertise?.id);

      // Upload documents en parallèle
      if (rapportFiles.length > 0) {
        await Promise.all(rapportFiles.map(async (file) => {
          const fileName = `expertises/${id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('expertises').upload(fileName, file);
          if (uploadError) return;
          const { data: { publicUrl } } = supabase.storage.from('expertises').getPublicUrl(fileName);
          await supabase.from('expertise_documents').insert({
            expertise_id: monExpertise?.id,
            nom_fichier: file.name,
            url_fichier: publicUrl,
            type_document: 'rapport',
            taille_fichier: file.size,
            type_mime: file.type,
          });
        }));
      }

      await supabase.from('sinistre_communications').insert({
        sinistre_id: id,
        type: 'notification',
        contenu: `Rapport déposé. Montant évalué : ${rapportForm.montant_evalue.toLocaleString()} CDF`,
        expediteur_id: user?.id,
      });

      setSuccess('Rapport soumis !');
      setShowRapportModal(false);
      setRapportFiles([]);
      chargerDonnees();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const { data } = await supabase.from('sinistre_communications').insert({
        sinistre_id: id,
        type: 'message',
        contenu: newMessage,
        expediteur_id: user?.id,
      }).select().single();

      if (data) {
        setMessages(prev => [{
          id: data.id,
          contenu: data.contenu,
          expediteur_nom: user?.nom || 'Vous',
          created_at: data.created_at,
        }, ...prev]);
      }
      setNewMessage('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'dd/MM/yyyy HH:mm', { locale: fr }); }
    catch { return d; }
  };

  const formatMontant = (m: number) => {
    if (!m) return '0 CDF';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="h-10 w-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!sinistre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-10 w-10 text-yellow-500" />
          <p className="mt-3 text-gray-600">{error || 'Dossier non trouvé'}</p>
          <Link href="/expert/missions" className="mt-3 inline-block text-blue-600">Retour aux missions</Link>
        </div>
      </div>
    );
  }

  const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Link href="/expert/missions" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            <FaArrowLeft className="mr-2 h-3 w-3" /> Retour
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-semibold">{sinistre.numero_dossier}</h1>
              <p className="text-sm text-gray-500">{TYPES_SINISTRE[sinistre.type_sinistre] || sinistre.type_sinistre}</p>
            </div>
            <div className="flex gap-2">
              {monExpertise?.statut === 'planifiee' && (
                <button onClick={handleCommencerExpertise}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Commencer
                </button>
              )}
              {(monExpertise?.statut === 'planifiee' || monExpertise?.statut === 'en_cours') && (
                <button onClick={() => setShowRapportModal(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  <FaClipboardCheck className="inline mr-1" /> Rapport
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Messages */}
        {error && <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-2 h-4 w-4" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-3 w-3" /></button></div>}
        {success && <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-2 h-4 w-4" />{success}</div>}

        {/* Progression */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statutInfo.bgColor} ${statutInfo.color}`}>
              {statutInfo.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${statutInfo.progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-4">
            {/* Infos */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="font-semibold mb-3">Détails du sinistre</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-500">Date</p><p>{formatDate(sinistre.date_sinistre)}</p></div>
                <div><p className="text-gray-500">Lieu</p><p>{sinistre.lieu}</p></div>
                <div><p className="text-gray-500">Montant estimé</p><p className="font-medium">{formatMontant(sinistre.montant_estime)}</p></div>
                <div><p className="text-gray-500">Police</p><p>{sinistre.souscription_police}</p></div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-sm whitespace-pre-wrap">{sinistre.description}</p>
              </div>
            </div>

            {/* Mon expertise */}
            {monExpertise && (
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <h2 className="font-semibold mb-2 flex items-center">
                  <FaClipboardList className="mr-2 h-4 w-4 text-purple-600" /> Mon expertise
                </h2>
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    monExpertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                    monExpertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {monExpertise.statut === 'terminee' ? 'Terminée' : monExpertise.statut === 'en_cours' ? 'En cours' : 'Planifiée'}
                  </span>
                  <span className="text-gray-500">Désignée le {formatDate(monExpertise.date_designation)}</span>
                </div>
                {monExpertise.rapport && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Rapport</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{monExpertise.rapport}</p>
                    {monExpertise.conclusion && <p className="text-sm mt-1"><b>Conclusion :</b> {monExpertise.conclusion}</p>}
                    {monExpertise.montant_evalue != null && monExpertise.montant_evalue > 0 && (
                      <p className="text-sm font-semibold text-purple-600 mt-1">Montant évalué : {formatMontant(monExpertise.montant_evalue)}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="font-semibold mb-2">Documents ({documents.length})</h2>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">Aucun document</p>
              ) : (
                <div className="space-y-1">
                  {documents.map(doc => (
                    <a key={doc.id} href={doc.url_fichier} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
                      <div className="flex items-center min-w-0">
                        <FaFileAlt className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">{doc.nom_fichier}</span>
                      </div>
                      <FaDownload className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Assuré */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="font-semibold mb-2"><FaUser className="inline mr-1 text-gray-400" /> Assuré</h2>
              <p className="text-sm font-medium">{sinistre.assure_nom}</p>
              <p className="text-xs text-gray-500">{sinistre.assure_email}</p>
              {sinistre.assure_telephone && <p className="text-xs text-gray-500 mt-1"><FaPhone className="inline mr-1 h-2 w-2" />{sinistre.assure_telephone}</p>}
            </div>

            {/* Messages */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="font-semibold mb-2"><FaComments className="inline mr-1 text-blue-500" /> Messages</h2>
              <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">Aucun message</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="bg-gray-50 rounded p-2 text-xs">
                      <div className="flex justify-between mb-0.5">
                        <span className="font-medium">{msg.expediteur_nom}</span>
                        <span className="text-gray-400">{formatDate(msg.created_at)}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.contenu}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  placeholder="Message..." className="flex-1 text-xs border rounded px-2 py-1.5"
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                <button onClick={handleSendMessage} disabled={!newMessage.trim() || sending}
                  className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 disabled:opacity-50">
                  {sending ? <FaSpinner className="animate-spin h-3 w-3" /> : <FaPaperPlane className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Rapport */}
      {showRapportModal && (
        <Modal onClose={() => setShowRapportModal(false)} title="Rapport d'expertise">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Rapport *</label>
              <textarea value={rapportForm.rapport} onChange={e => setRapportForm(p => ({...p, rapport: e.target.value}))}
                rows={5} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Dommages constatés..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Conclusion</label>
              <textarea value={rapportForm.conclusion} onChange={e => setRapportForm(p => ({...p, conclusion: e.target.value}))}
                rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Votre conclusion..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Montant évalué (CDF) *</label>
              <input type="number" value={rapportForm.montant_evalue} onChange={e => setRapportForm(p => ({...p, montant_evalue: Number(e.target.value)}))}
                className="w-full border rounded-lg px-3 py-2 text-sm" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photos / Documents</label>
              <input type="file" multiple onChange={e => setRapportFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="w-full text-sm" accept=".jpg,.jpeg,.png,.pdf" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmitRapport} disabled={saving || !rapportForm.rapport}
                className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                {saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}Soumettre
              </button>
              <button onClick={() => setShowRapportModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}