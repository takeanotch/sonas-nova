

// // app/expert/sinistres/[id]/page.tsx
// 'use client';

// import React, { useState, useEffect, use } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { 
//   FaArrowLeft, FaDownload, FaFileAlt,
//   FaCheckCircle, FaTimesCircle, FaClock, FaSpinner,
//   FaUser, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave,
//   FaTimes, FaExclamationTriangle, FaClipboardList,
//   FaInfo, FaPaperPlane, FaComments, FaPhone,
//   FaFileContract, FaClipboardCheck, FaExclamationCircle,
//   FaBell, FaImage, FaPen, FaEye, FaCar, FaIdCard,
//   FaTools, FaUserInjured, FaShieldAlt, FaUsers,
//   FaBuilding, FaClipboardCheck as FaClipboardCheckIcon,
//   FaChevronDown, FaChevronUp, FaPlus, FaMinus
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
//   created_at: string;
//   assure_nom: string;
//   assure_email: string;
//   assure_telephone: string;
//   souscription_police: string;
// };

// type SonasDeclaration = {
//   id: number;
//   sinistre_id: string;
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
//   plan_lieux_url: string | null;
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
//   signature_assure_url: string | null;
// };

// type Expertise = {
//   id: string;
//   date_designation: string;
//   date_expertise: string | null;
//   rapport: string | null;
//   conclusion: string | null;
//   montant_evalue: number | null;
//   statut: string;
// };

// type Document = {
//   id: string;
//   nom_fichier: string;
//   url_fichier: string;
//   taille_fichier: number;
//   created_at: string;
// };

// type Communication = {
//   id: string;
//   contenu: string;
//   expediteur_nom: string;
//   expediteur_role?: string;
//   type: 'message' | 'notification' | 'reclamation';
//   priorite?: 'normal' | 'urgent' | 'critique';
//   statut_reclamation?: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
//   created_at: string;
// };

// // ==================== CONSTANTES ====================

// const STATUTS: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bgColor: string; progress: number }> = {
//   en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 10 },
//   en_cours: { label: 'En cours', icon: FaSpinner, color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 30 },
//   expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-100', progress: 50 },
//   en_indemnisation: { label: 'En indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-100', progress: 75 },
//   cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', progress: 100 },
//   refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-100', progress: 0 },
// };

// const TYPES_SINISTRE: Record<string, string> = {
//   accident_auto: '🚗 Accident auto',
//   vol: '🔫 Vol',
//   incendie: '🔥 Incendie',
//   degats_eau: '💧 Dégâts des eaux',
//   catastrophe_naturelle: '🌪️ Catastrophe naturelle',
//   bris_glace: '🪟 Bris de glace',
//   responsabilite_civile: '⚖️ Responsabilité civile',
//   autre: '📋 Autre',
// };

// // ==================== COMPOSANTS ====================

// function Modal({ children, onClose, title, size = 'max-w-4xl' }: { children: React.ReactNode; onClose: () => void; title: string; size?: string }) {
//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-full items-center justify-center p-4">
//         <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
//         <div className={`relative bg-white rounded-lg shadow-xl ${size} w-full max-h-[90vh] flex flex-col`}>
//           <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
//             <h3 className="text-lg font-semibold">{title}</h3>
//             <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//               <FaTimes className="h-5 w-5" />
//             </button>
//           </div>
//           <div className="p-6 overflow-y-auto flex-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CollapsibleSection({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
//   const [isOpen, setIsOpen] = useState(defaultOpen);
//   return (
//     <div className="border rounded-lg overflow-hidden">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
//       >
//         <div className="flex items-center gap-2">
//           {icon && <span className="text-blue-600">{icon}</span>}
//           <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
//         </div>
//         {isOpen ? <FaChevronUp className="h-4 w-4 text-gray-500" /> : <FaChevronDown className="h-4 w-4 text-gray-500" />}
//       </button>
//       {isOpen && <div className="p-4 bg-white">{children}</div>}
//     </div>
//   );
// }

// // Fonctions utilitaires
// function getPriorityColor(priorite?: string) {
//   switch (priorite) {
//     case 'urgent': return 'bg-orange-100 text-orange-700';
//     case 'critique': return 'bg-red-100 text-red-700';
//     default: return 'bg-gray-100 text-gray-700';
//   }
// }

// function getReclamationStatusColor(statut?: string) {
//   switch (statut) {
//     case 'ouverte': return 'bg-yellow-100 text-yellow-700';
//     case 'en_cours': return 'bg-blue-100 text-blue-700';
//     case 'resolue': return 'bg-green-100 text-green-700';
//     case 'fermee': return 'bg-gray-100 text-gray-700';
//     default: return 'bg-gray-100 text-gray-700';
//   }
// }

// function formatMontant(m: number) {
//   if (!m) return '0 CDF';
//   return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
// }

// function formatDate(d: string) {
//   try { return format(new Date(d), 'dd/MM/yyyy HH:mm', { locale: fr }); }
//   catch { return d; }
// }

// function formatDateShort(d: string) {
//   try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); }
//   catch { return d; }
// }

// // ==================== PAGE PRINCIPALE ====================

// type Props = { params: Promise<{ id: string }> };

// export default function ExpertSinistreDetailPage({ params }: Props) {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { id } = use(params);

//   const [sinistre, setSinistre] = useState<Sinistre | null>(null);
//   const [sonasDeclaration, setSonasDeclaration] = useState<SonasDeclaration | null>(null);
//   const [monExpertise, setMonExpertise] = useState<Expertise | null>(null);
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [communications, setCommunications] = useState<Communication[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const [showSonasModal, setShowSonasModal] = useState(false);
//   const [showRapportModal, setShowRapportModal] = useState(false);
//   const [rapportForm, setRapportForm] = useState({ rapport: '', conclusion: '', montant_evalue: 0 });
//   const [rapportFiles, setRapportFiles] = useState<File[]>([]);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (user && id) chargerDonnees();
//   }, [user, id]);

//   const chargerDonnees = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [
//         { data: sinistreData },
//         { data: expertiseData },
//         { data: docs },
//         { data: comms },
//       ] = await Promise.all([
//         supabase.from('sinistres').select('*').eq('id', id).single(),
//         supabase.from('expertises').select('*').eq('sinistre_id', id).eq('expert_id', user?.id).single(),
//         supabase.from('sinistre_documents').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(20),
//         supabase.from('sinistre_communications').select('*').eq('sinistre_id', id).order('created_at', { ascending: false }).limit(30),
//       ]);

//       if (!sinistreData) {
//         setError('Sinistre non trouvé');
//         setLoading(false);
//         return;
//       }

//       const [assureRes, subRes] = await Promise.all([
//         supabase.from('users').select('nom, email, telephone').eq('id', sinistreData.assure_id).single(),
//         sinistreData.souscription_id 
//           ? supabase.from('souscriptions').select('police_numero').eq('id', sinistreData.souscription_id).single()
//           : Promise.resolve({ data: null }),
//       ]);

//       // Charger la déclaration SONAS si disponible
//       const { data: sonasData } = await supabase
//         .from('sonas_declarations_accident')
//         .select('*')
//         .eq('sinistre_id', id)
//         .single();

//       if (sonasData) {
//         setSonasDeclaration(sonasData as SonasDeclaration);
//       }

//       setSinistre({
//         id: sinistreData.id,
//         numero_dossier: sinistreData.numero_dossier,
//         type_sinistre: sinistreData.type_sinistre,
//         description: sinistreData.description,
//         date_sinistre: sinistreData.date_sinistre,
//         lieu: sinistreData.lieu,
//         statut: sinistreData.statut,
//         montant_estime: sinistreData.montant_estime || 0,
//         created_at: sinistreData.created_at,
//         assure_nom: assureRes.data?.nom || 'Inconnu',
//         assure_email: assureRes.data?.email || '',
//         assure_telephone: assureRes.data?.telephone || '',
//         souscription_police: subRes.data?.police_numero || 'N/A',
//       });

//       if (expertiseData) {
//         setMonExpertise({
//           id: expertiseData.id,
//           date_designation: expertiseData.date_designation,
//           date_expertise: expertiseData.date_expertise,
//           rapport: expertiseData.rapport,
//           conclusion: expertiseData.conclusion,
//           montant_evalue: expertiseData.montant_evalue,
//           statut: expertiseData.statut,
//         });
//         setRapportForm({
//           rapport: expertiseData.rapport || '',
//           conclusion: expertiseData.conclusion || '',
//           montant_evalue: expertiseData.montant_evalue || sinistreData.montant_estime || 0,
//         });
//       }

//       setDocuments(docs || []);

//       // Formater les communications avec les noms des expéditeurs et leurs rôles
//       if (comms && comms.length > 0) {
//         const expediteurIds = [...new Set(comms.map(c => c.expediteur_id))];
//         const { data: users } = await supabase.from('users').select('id, nom, role').in('id', expediteurIds);
//         const userMap = new Map();
//         if (users) users.forEach(u => userMap.set(u.id, { nom: u.nom, role: u.role }));
        
//         setCommunications(comms.map(c => {
//           const userInfo = userMap.get(c.expediteur_id);
//           return {
//             id: c.id,
//             contenu: c.contenu,
//             expediteur_nom: userInfo?.nom || 'Système',
//             expediteur_role: userInfo?.role || 'system',
//             type: c.type || 'message',
//             priorite: c.priorite,
//             statut_reclamation: c.statut_reclamation,
//             created_at: c.created_at,
//           };
//         }));
//       }

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommencerExpertise = async () => {
//     try {
//       await supabase.from('expertises').update({ statut: 'en_cours' }).eq('id', monExpertise?.id);
//       setMonExpertise(prev => prev ? { ...prev, statut: 'en_cours' } : null);
//       setSuccess('Expertise commencée');
//       setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleSubmitRapport = async () => {
//     if (!rapportForm.rapport || !rapportForm.montant_evalue) {
//       setError('Le rapport et le montant sont obligatoires');
//       return;
//     }
//     setSaving(true);
//     try {
//       await supabase.from('expertises').update({
//         rapport: rapportForm.rapport,
//         conclusion: rapportForm.conclusion,
//         montant_evalue: rapportForm.montant_evalue,
//         statut: 'terminee',
//         date_expertise: new Date().toISOString(),
//       }).eq('id', monExpertise?.id);

//       if (rapportFiles.length > 0) {
//         await Promise.all(rapportFiles.map(async (file) => {
//           const fileName = `expertises/${id}/${Date.now()}-${file.name}`;
//           const { error: uploadError } = await supabase.storage.from('expertises').upload(fileName, file);
//           if (uploadError) return;
//           const { data: { publicUrl } } = supabase.storage.from('expertises').getPublicUrl(fileName);
//           await supabase.from('expertise_documents').insert({
//             expertise_id: monExpertise?.id,
//             nom_fichier: file.name,
//             url_fichier: publicUrl,
//             type_document: 'rapport',
//             taille_fichier: file.size,
//             type_mime: file.type,
//           });
//         }));
//       }

//       await supabase.from('sinistre_communications').insert({
//         sinistre_id: id,
//         type: 'notification',
//         contenu: `Rapport déposé. Montant évalué : ${rapportForm.montant_evalue.toLocaleString()} CDF`,
//         expediteur_id: user?.id,
//       });

//       setSuccess('Rapport soumis !');
//       setShowRapportModal(false);
//       setRapportFiles([]);
//       chargerDonnees();
//       setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <FaSpinner className="h-10 w-10 text-purple-500 animate-spin" />
//       </div>
//     );
//   }

//   if (!sinistre) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaExclamationTriangle className="mx-auto h-10 w-10 text-yellow-500" />
//           <p className="mt-3 text-gray-600">{error || 'Dossier non trouvé'}</p>
//           <Link href="/expert/missions" className="mt-3 inline-block text-blue-600">Retour aux missions</Link>
//         </div>
//       </div>
//     );
//   }

//   const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-5xl mx-auto px-4 py-3">
//           <Link href="/expert/missions" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
//             <FaArrowLeft className="mr-2 h-3 w-3" /> Retour
//           </Link>
//           <div className="flex items-center justify-between flex-wrap gap-3">
//             <div>
//               <h1 className="text-xl font-semibold">{sinistre.numero_dossier}</h1>
//               <p className="text-sm text-gray-500">{TYPES_SINISTRE[sinistre.type_sinistre] || sinistre.type_sinistre}</p>
//             </div>
//             <div className="flex gap-2">
//               {/* Bouton pour voir le dossier SONAS */}
//               {sonasDeclaration && (
//                 <button 
//                   onClick={() => setShowSonasModal(true)}
//                   className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
//                 >
//                   <FaEye className="h-3 w-3" />
//                   Voir dossier SONAS
//                 </button>
//               )}
//               {monExpertise?.statut === 'planifiee' && (
//                 <button onClick={handleCommencerExpertise}
//                   className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
//                   Commencer
//                 </button>
//               )}
//               {(monExpertise?.statut === 'planifiee' || monExpertise?.statut === 'en_cours') && (
//                 <button onClick={() => setShowRapportModal(true)}
//                   className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
//                   <FaClipboardCheck className="inline mr-1" /> Rapport
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-4 py-4">
//         {/* Messages d'erreur/succès */}
//         {error && <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-2 h-4 w-4" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-3 w-3" /></button></div>}
//         {success && <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-2 h-4 w-4" />{success}</div>}

//         {/* Progression */}
//         <div className="bg-white rounded-lg border p-4 mb-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium">Progression</span>
//             <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statutInfo.bgColor} ${statutInfo.color}`}>
//               {statutInfo.label}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${statutInfo.progress}%` }} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-4">
//             {/* Infos */}
//             <div className="bg-white rounded-lg border p-4">
//               <h2 className="font-semibold mb-3">Détails du sinistre</h2>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div><p className="text-gray-500">Date</p><p>{formatDate(sinistre.date_sinistre)}</p></div>
//                 <div><p className="text-gray-500">Lieu</p><p>{sinistre.lieu}</p></div>
//                 <div><p className="text-gray-500">Montant estimé</p><p className="font-medium">{formatMontant(sinistre.montant_estime)}</p></div>
//                 <div><p className="text-gray-500">Police</p><p>{sinistre.souscription_police}</p></div>
//               </div>
//               <div className="mt-3 pt-3 border-t">
//                 <p className="text-sm text-gray-500 mb-1">Description</p>
//                 <p className="text-sm whitespace-pre-wrap">{sinistre.description}</p>
//               </div>
//             </div>

//             {/* Mon expertise */}
//             {monExpertise && (
//               <div className="bg-white rounded-lg border border-purple-200 p-4">
//                 <h2 className="font-semibold mb-2 flex items-center">
//                   <FaClipboardList className="mr-2 h-4 w-4 text-purple-600" /> Mon expertise
//                 </h2>
//                 <div className="flex items-center gap-3 text-sm mb-2">
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                     monExpertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
//                     monExpertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {monExpertise.statut === 'terminee' ? 'Terminée' : monExpertise.statut === 'en_cours' ? 'En cours' : 'Planifiée'}
//                   </span>
//                   <span className="text-gray-500">Désignée le {formatDate(monExpertise.date_designation)}</span>
//                 </div>
//                 {monExpertise.rapport && (
//                   <div className="mt-2 pt-2 border-t">
//                     <p className="text-sm font-medium mb-1">Rapport</p>
//                     <p className="text-sm text-gray-600 whitespace-pre-wrap">{monExpertise.rapport}</p>
//                     {monExpertise.conclusion && <p className="text-sm mt-1"><b>Conclusion :</b> {monExpertise.conclusion}</p>}
//                     {monExpertise.montant_evalue != null && monExpertise.montant_evalue > 0 && (
//                       <p className="text-sm font-semibold text-purple-600 mt-1">Montant évalué : {formatMontant(monExpertise.montant_evalue)}</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Documents */}
//             <div className="bg-white rounded-lg border p-4">
//               <h2 className="font-semibold mb-2">Documents ({documents.length})</h2>
//               {documents.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center py-6">Aucun document</p>
//               ) : (
//                 <div className="space-y-1">
//                   {documents.map(doc => (
//                     <a key={doc.id} href={doc.url_fichier} target="_blank" rel="noopener noreferrer"
//                       className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
//                       <div className="flex items-center min-w-0">
//                         <FaFileAlt className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
//                         <span className="text-sm truncate">{doc.nom_fichier}</span>
//                       </div>
//                       <FaDownload className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-4">
//             {/* Assuré */}
//             <div className="bg-white rounded-lg border p-4">
//               <h2 className="font-semibold mb-2"><FaUser className="inline mr-1 text-gray-400" /> Assuré</h2>
//               <p className="text-sm font-medium">{sinistre.assure_nom}</p>
//               <p className="text-xs text-gray-500">{sinistre.assure_email}</p>
//               {sinistre.assure_telephone && <p className="text-xs text-gray-500 mt-1"><FaPhone className="inline mr-1 h-2 w-2" />{sinistre.assure_telephone}</p>}
//             </div>

//             {/* Communications - Lecture seule (pas de formulaire d'envoi) */}
//             <div className="bg-white rounded-lg border p-4">
//               <h2 className="font-semibold mb-2"><FaComments className="inline mr-1 text-blue-500" /> Communications</h2>
//               <div className="space-y-3 max-h-64 overflow-y-auto">
//                 {communications.length === 0 ? (
//                   <p className="text-xs text-gray-500 text-center py-4">Aucune communication</p>
//                 ) : (
//                   communications.map(comm => (
//                     <div 
//                       key={comm.id} 
//                       className={`rounded p-3 text-xs ${
//                         comm.type === 'reclamation' 
//                           ? 'bg-orange-50 border border-orange-200' 
//                           : comm.type === 'notification' 
//                             ? 'bg-blue-50 border border-blue-200' 
//                             : 'bg-gray-50 border border-gray-200'
//                       }`}
//                     >
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2">
//                           <span className="font-medium">
//                             {comm.expediteur_nom}
//                           </span>
//                           <span className="text-gray-400 text-[10px]">
//                             {comm.expediteur_role === 'assure' ? 'Assuré' : 
//                              comm.expediteur_role === 'expert' ? 'Expert' : 
//                              comm.expediteur_role === 'agent' ? 'Agent' : 'Système'}
//                           </span>
//                         </div>
//                         <span className="text-gray-400 text-[10px]">{formatDate(comm.created_at)}</span>
//                       </div>
                      
//                       {comm.type === 'reclamation' ? (
//                         <div className="mt-1">
//                           {(() => {
//                             const lines = comm.contenu.split('\n');
//                             const sujetLine = lines.find(line => line.includes('Sujet:'));
//                             const autresLignes = lines.filter(line => !line.includes('Sujet:'));
                            
//                             return (
//                               <>
//                                 {sujetLine && (
//                                   <div className="font-semibold text-orange-700 mb-1 pb-1 border-b border-orange-200">
//                                     {sujetLine.replace(/\*\*/g, '').trim()}
//                                   </div>
//                                 )}
//                                 {autresLignes.map((line, idx) => (
//                                   <p key={idx} className={line.trim() ? 'mt-0.5' : 'h-1'}>
//                                     {line.replace(/\*\*/g, '').trim() || '\u00A0'}
//                                   </p>
//                                 ))}
//                               </>
//                             );
//                           })()}
//                           <div className="flex gap-1 mt-1.5">
//                             {comm.priorite && (
//                               <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getPriorityColor(comm.priorite)}`}>
//                                 {comm.priorite}
//                               </span>
//                             )}
//                             {comm.statut_reclamation && (
//                               <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getReclamationStatusColor(comm.statut_reclamation)}`}>
//                                 {comm.statut_reclamation === 'ouverte' ? 'Ouverte' :
//                                  comm.statut_reclamation === 'en_cours' ? 'En cours' :
//                                  comm.statut_reclamation === 'resolue' ? 'Résolue' : 'Fermée'}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       ) : comm.type === 'notification' ? (
//                         <div className="flex items-start gap-1.5 mt-0.5">
//                           <FaBell className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
//                           <p className="whitespace-pre-wrap">{comm.contenu}</p>
//                         </div>
//                       ) : (
//                         <p className="whitespace-pre-wrap mt-0.5">{comm.contenu}</p>
//                       )}
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== MODAL DOSSIER SONAS COMPLET ===== */}
//       {showSonasModal && sonasDeclaration && (
//         <Modal onClose={() => setShowSonasModal(false)} title="📋 Dossier SONAS - Déclaration d'Accident Automobile" size="max-w-4xl">
//           <div className="space-y-4">
//             {/* En-tête */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                 <div><p className="text-gray-500">N° Dossier</p><p className="font-semibold text-blue-700">{sonasDeclaration.claim_no}</p></div>
//                 <div><p className="text-gray-500">Agence</p><p className="font-medium">{sonasDeclaration.agence}</p></div>
//                 <div><p className="text-gray-500">Police</p><p className="font-medium">{sonasDeclaration.police || '-'}</p></div>
//                 <div><p className="text-gray-500">Garantie</p><p className="font-medium">{sonasDeclaration.garantie || '-'}</p></div>
//               </div>
//             </div>

//             {/* Plan des lieux */}
//             {sonasDeclaration.plan_lieux_url && (
//               <div className="border-2 border-green-300 rounded-lg overflow-hidden">
//                 <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-green-300">
//                   <FaImage className="text-green-600 h-4 w-4" />
//                   <h4 className="font-semibold text-sm text-green-800">📐 Plan des lieux</h4>
//                 </div>
//                 <div className="p-4">
//                   <img 
//                     src={sonasDeclaration.plan_lieux_url} 
//                     alt="Plan des lieux" 
//                     className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = '/placeholder-image.png';
//                     }}
//                   />
//                   <div className="mt-2 flex justify-end">
//                     <a 
//                       href={sonasDeclaration.plan_lieux_url} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
//                     >
//                       <FaDownload className="mr-1 h-3 w-3" /> Télécharger
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Signature */}
//             {sonasDeclaration.signature_assure_url && (
//               <div className="border-2 border-purple-300 rounded-lg overflow-hidden">
//                 <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-purple-300">
//                   <FaPen className="text-purple-600 h-4 w-4" />
//                   <h4 className="font-semibold text-sm text-purple-800">✍️ Signature de l'assuré</h4>
//                 </div>
//                 <div className="p-4 flex flex-col items-center">
//                   <img 
//                     src={sonasDeclaration.signature_assure_url} 
//                     alt="Signature" 
//                     className="max-h-32 object-contain border border-gray-200 rounded-lg bg-white"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = '/placeholder-signature.png';
//                     }}
//                   />
//                   <div className="mt-2 flex justify-end w-full">
//                     <a 
//                       href={sonasDeclaration.signature_assure_url} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
//                     >
//                       <FaDownload className="mr-1 h-3 w-3" /> Télécharger
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Détails complets */}
//             <div className="space-y-3">
//               {/* 1. Date et heure */}
//               <CollapsibleSection title="1. Date et heure de l'accident" icon={<FaCalendarAlt className="h-4 w-4" />} defaultOpen={true}>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Date et heure</p><p className="font-medium">{formatDate(sonasDeclaration.date_heure_accident)}</p></div>
//                   <div><p className="text-gray-500">Lieu</p><p className="font-medium">{sonasDeclaration.lieu_accident}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 2. Preneur d'assurance */}
//               <CollapsibleSection title="2. Preneur d'assurance" icon={<FaUser className="h-4 w-4" />}>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.preneur_nom || '-'}</p></div>
//                   <div><p className="text-gray-500">Prénoms</p><p className="font-medium">{sonasDeclaration.preneur_prenoms || '-'}</p></div>
//                   <div className="col-span-2"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.preneur_adresse || '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 3. Conducteur */}
//               <CollapsibleSection title="3. Conducteur" icon={<FaIdCard className="h-4 w-4" />}>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
//                   <div><p className="text-gray-500">Nom et prénom</p><p className="font-medium">{sonasDeclaration.conducteur_nom_prenom || '-'}</p></div>
//                   <div><p className="text-gray-500">Âge</p><p className="font-medium">{sonasDeclaration.conducteur_age || '-'}</p></div>
//                   <div><p className="text-gray-500">À votre service ?</p><p className="font-medium">{sonasDeclaration.conducteur_a_service === true ? 'Oui' : sonasDeclaration.conducteur_a_service === false ? 'Non' : '-'}</p></div>
//                   <div className="col-span-2"><p className="text-gray-500">Titre de conduite</p><p className="font-medium">{sonasDeclaration.conducteur_titre_conduite || '-'}</p></div>
//                   <div><p className="text-gray-500">Permis n°</p><p className="font-medium">{sonasDeclaration.permis_no || '-'}</p></div>
//                   <div><p className="text-gray-500">Délivré à</p><p className="font-medium">{sonasDeclaration.permis_delivre_a || '-'}</p></div>
//                   <div><p className="text-gray-500">Date permis</p><p className="font-medium">{sonasDeclaration.permis_date ? formatDateShort(sonasDeclaration.permis_date) : '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 4. Véhicule */}
//               <CollapsibleSection title="4. Véhicule" icon={<FaCar className="h-4 w-4" />}>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                   <div><p className="text-gray-500">Marque et type</p><p className="font-medium">{sonasDeclaration.vehicule_marque_type || '-'}</p></div>
//                   <div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.vehicule_plaque || '-'}</p></div>
//                   <div><p className="text-gray-500">Châssis</p><p className="font-medium">{sonasDeclaration.vehicule_chassis || '-'}</p></div>
//                   <div><p className="text-gray-500">Moteur</p><p className="font-medium">{sonasDeclaration.vehicule_moteur || '-'}</p></div>
//                   <div><p className="text-gray-500">Puissance</p><p className="font-medium">{sonasDeclaration.vehicule_puissance || '-'}</p></div>
//                   <div><p className="text-gray-500">Année</p><p className="font-medium">{sonasDeclaration.vehicule_annee || '-'}</p></div>
//                   <div><p className="text-gray-500">Kilométrage</p><p className="font-medium">{sonasDeclaration.vehicule_kilometrage ? `${sonasDeclaration.vehicule_kilometrage} km` : '-'}</p></div>
//                   <div><p className="text-gray-500">Valeur</p><p className="font-medium">{sonasDeclaration.vehicule_valeur ? formatMontant(sonasDeclaration.vehicule_valeur) : '-'}</p></div>
//                 </div>
//                 <div className="mt-3 pt-3 border-t">
//                   <p className="text-xs text-gray-500 mb-2">Garanties :</p>
//                   <div className="flex gap-4">
//                     <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_rc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>R.C.</span>
//                     <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_dm ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>D.M.</span>
//                     <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_inc ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Inc.</span>
//                     <span className={`px-2 py-1 rounded text-xs ${sonasDeclaration.garantie_vol ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>Vol</span>
//                   </div>
//                 </div>
//               </CollapsibleSection>

//               {/* 5. Description */}
//               <CollapsibleSection title="5. Description de l'accident" icon={<FaClipboardList className="h-4 w-4" />}>
//                 <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.description_accident || 'Aucune description'}</p>
//               </CollapsibleSection>

//               {/* 6. Dégâts */}
//               <CollapsibleSection title="6. Dégâts de votre véhicule" icon={<FaTools className="h-4 w-4" />}>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_description || '-'}</p></div>
//                   <div><p className="text-gray-500">Montant évalué</p><p className="font-medium">{sonasDeclaration.degats_montant_evalue ? formatMontant(sonasDeclaration.degats_montant_evalue) : '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 7. Garage */}
//               <CollapsibleSection title="7. Garage">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Véhicule immobilisé ?</p><p className="font-medium">{sonasDeclaration.vehicule_immobilise === true ? 'Oui' : sonasDeclaration.vehicule_immobilise === false ? 'Non' : '-'}</p></div>
//                   <div><p className="text-gray-500">Lieu de garde</p><p className="font-medium">{sonasDeclaration.lieu_garde_expertise || '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 8. Adversaire */}
//               <CollapsibleSection title="8. Adversaire">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                   <div><p className="text-gray-500">Nom</p><p className="font-medium">{sonasDeclaration.adversaire_nom || '-'}</p></div>
//                   <div><p className="text-gray-500">Post-nom</p><p className="font-medium">{sonasDeclaration.adversaire_post_nom || '-'}</p></div>
//                   <div><p className="text-gray-500">Prénom</p><p className="font-medium">{sonasDeclaration.adversaire_prenom || '-'}</p></div>
//                   <div className="col-span-4"><p className="text-gray-500">Adresse</p><p className="font-medium">{sonasDeclaration.adversaire_adresse || '-'}</p></div>
//                   <div><p className="text-gray-500">Véhicule</p><p className="font-medium">{sonasDeclaration.adversaire_vehicule || '-'}</p></div>
//                   <div><p className="text-gray-500">Plaque</p><p className="font-medium">{sonasDeclaration.adversaire_plaque || '-'}</p></div>
//                   <div><p className="text-gray-500">Assurance</p><p className="font-medium">{sonasDeclaration.adversaire_assurance || '-'}</p></div>
//                   <div><p className="text-gray-500">Téléphone</p><p className="font-medium">{sonasDeclaration.adversaire_telephone || '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 9. Dégâts matériels tiers */}
//               <CollapsibleSection title="9. Dégâts matériels (tiers)">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Description</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.degats_materiels_description || '-'}</p></div>
//                   <div><p className="text-gray-500">Dégâts évalués à</p><p className="font-medium">{sonasDeclaration.degats_materiels_evalues ? formatMontant(sonasDeclaration.degats_materiels_evalues) : '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 10. Blessés ou morts */}
//               <CollapsibleSection title="10. Blessés ou morts" icon={<FaUserInjured className="h-4 w-4" />}>
//                 <div className="space-y-3 text-sm">
//                   <div><p className="text-gray-500">Blessés ou morts ?</p><p className="font-medium">{sonasDeclaration.blesses_ou_morts ? 'Oui' : 'Non'}</p></div>
//                   {sonasDeclaration.victimes_infos && <div><p className="text-gray-500">Victimes</p><p className="font-medium whitespace-pre-wrap">{sonasDeclaration.victimes_infos}</p></div>}
//                   {sonasDeclaration.victimes_soins_lieu && <div><p className="text-gray-500">Lieu des soins</p><p className="font-medium">{sonasDeclaration.victimes_soins_lieu}</p></div>}
//                   <div className="grid grid-cols-2 gap-4">
//                     {sonasDeclaration.hopital_nom_adresse && <div><p className="text-gray-500">Hôpital</p><p className="font-medium">{sonasDeclaration.hopital_nom_adresse}</p></div>}
//                     {sonasDeclaration.medecin_nom && <div><p className="text-gray-500">Médecin</p><p className="font-medium">{sonasDeclaration.medecin_nom}</p></div>}
//                   </div>
//                   {sonasDeclaration.medecin_telephone && <div><p className="text-gray-500">Tél médecin</p><p className="font-medium">{sonasDeclaration.medecin_telephone}</p></div>}
//                 </div>
//               </CollapsibleSection>

//               {/* 11. Tiers transportés */}
//               {sonasDeclaration.tiers_transportes && (
//                 <CollapsibleSection title="11. Tiers transportés">
//                   <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.tiers_transportes}</p>
//                 </CollapsibleSection>
//               )}

//               {/* 12. Témoins */}
//               {sonasDeclaration.temoins && (
//                 <CollapsibleSection title="12. Témoins">
//                   <p className="text-sm whitespace-pre-wrap">{sonasDeclaration.temoins}</p>
//                 </CollapsibleSection>
//               )}

//               {/* 13. Autorités */}
//               <CollapsibleSection title="13. Autorités" icon={<FaShieldAlt className="h-4 w-4" />}>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">PV par</p><p className="font-medium">{sonasDeclaration.pv_par || '-'}</p></div>
//                   <div><p className="text-gray-500">Localité</p><p className="font-medium">{sonasDeclaration.localite || '-'}</p></div>
//                   <div><p className="text-gray-500">Gendarmerie</p><p className="font-medium">{sonasDeclaration.gendarmerie || '-'}</p></div>
//                   <div><p className="text-gray-500">Officier</p><p className="font-medium">{sonasDeclaration.officier_gendarme || '-'}</p></div>
//                 </div>
//               </CollapsibleSection>

//               {/* 14. Prime */}
//               <CollapsibleSection title="14. Prime d'assurance">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Dernière prime payée ?</p><p className="font-medium">{sonasDeclaration.prime_payee === true ? 'Oui' : sonasDeclaration.prime_payee === false ? 'Non' : '-'}</p></div>
//                   {sonasDeclaration.prime_date && <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDateShort(sonasDeclaration.prime_date)}</p></div>}
//                 </div>
//               </CollapsibleSection>

//               {/* Signature */}
//               <CollapsibleSection title="Signature">
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div><p className="text-gray-500">Fait à</p><p className="font-medium">{sonasDeclaration.fait_a || '-'}</p></div>
//                   <div><p className="text-gray-500">Date</p><p className="font-medium">{sonasDeclaration.date_signature ? formatDateShort(sonasDeclaration.date_signature) : '-'}</p></div>
//                 </div>
//               </CollapsibleSection>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Modal Rapport */}
//       {showRapportModal && (
//         <Modal onClose={() => setShowRapportModal(false)} title="Rapport d'expertise" size="max-w-2xl">
//           <div className="space-y-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">Rapport *</label>
//               <textarea value={rapportForm.rapport} onChange={e => setRapportForm(p => ({...p, rapport: e.target.value}))}
//                 rows={5} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Dommages constatés..." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Conclusion</label>
//               <textarea value={rapportForm.conclusion} onChange={e => setRapportForm(p => ({...p, conclusion: e.target.value}))}
//                 rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Votre conclusion..." />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Montant évalué (CDF) *</label>
//               <input type="number" value={rapportForm.montant_evalue} onChange={e => setRapportForm(p => ({...p, montant_evalue: Number(e.target.value)}))}
//                 className="w-full border rounded-lg px-3 py-2 text-sm" min="0" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Photos / Documents</label>
//               <input type="file" multiple onChange={e => setRapportFiles(e.target.files ? Array.from(e.target.files) : [])}
//                 className="w-full text-sm" accept=".jpg,.jpeg,.png,.pdf" />
//             </div>
//             <div className="flex gap-3 pt-2">
//               <button onClick={handleSubmitRapport} disabled={saving || !rapportForm.rapport}
//                 className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
//                 {saving ? <FaSpinner className="animate-spin inline mr-1" /> : null}Soumettre
//               </button>
//               <button onClick={() => setShowRapportModal(false)} className="flex-1 border rounded-lg py-2.5 text-sm">Annuler</button>
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
  FaFileContract, FaClipboardCheck, FaExclamationCircle,
  FaBell, FaImage, FaPen, FaEye, FaCar, FaIdCard,
  FaTools, FaUserInjured, FaShieldAlt, FaUsers,
  FaBuilding, FaChevronDown, FaChevronUp, FaCamera
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

type Expertise = {
  id: string;
  date_designation: string;
  date_expertise: string | null;
  date_visite_lieu: string | null;
  rapport: string | null;
  conclusion: string | null;
  details_techniques: string | null;
  recommandations: string | null;
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

type Communication = {
  id: string;
  contenu: string;
  expediteur_nom: string;
  expediteur_role?: string;
  type: 'message' | 'notification' | 'reclamation';
  priorite?: 'normal' | 'urgent' | 'critique';
  statut_reclamation?: 'ouverte' | 'en_cours' | 'resolue' | 'fermee';
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

function Modal({ children, onClose, title, size = 'max-w-4xl' }: { children: React.ReactNode; onClose: () => void; title: string; size?: string }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl ${size} w-full max-h-[90vh] flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
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

// Fonctions utilitaires
function getPriorityColor(priorite?: string) {
  switch (priorite) {
    case 'urgent': return 'bg-orange-100 text-orange-700';
    case 'critique': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getReclamationStatusColor(statut?: string) {
  switch (statut) {
    case 'ouverte': return 'bg-yellow-100 text-yellow-700';
    case 'en_cours': return 'bg-blue-100 text-blue-700';
    case 'resolue': return 'bg-green-100 text-green-700';
    case 'fermee': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function formatMontant(m: number) {
  if (!m) return '0 CDF';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
}

function formatDate(d: string) {
  try { return format(new Date(d), 'dd/MM/yyyy HH:mm', { locale: fr }); }
  catch { return d; }
}

function formatDateShort(d: string) {
  try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); }
  catch { return d; }
}

// ==================== PAGE PRINCIPALE ====================

type Props = { params: Promise<{ id: string }> };

export default function ExpertSinistreDetailPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  const [sinistre, setSinistre] = useState<Sinistre | null>(null);
  const [sonasDeclaration, setSonasDeclaration] = useState<SonasDeclaration | null>(null);
  const [monExpertise, setMonExpertise] = useState<Expertise | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showSonasModal, setShowSonasModal] = useState(false);
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [rapportForm, setRapportForm] = useState({
    rapport: '',
    conclusion: '',
    details_techniques: '',
    recommandations: '',
    montant_evalue: 0,
    date_visite_lieu: '',
  });
  const [rapportFiles, setRapportFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && id) chargerDonnees();
  }, [user, id]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      setError(null);

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

      const [assureRes, subRes] = await Promise.all([
        supabase.from('users').select('nom, email, telephone').eq('id', sinistreData.assure_id).single(),
        sinistreData.souscription_id 
          ? supabase.from('souscriptions').select('police_numero').eq('id', sinistreData.souscription_id).single()
          : Promise.resolve({ data: null }),
      ]);

      // Charger la déclaration SONAS si disponible
      const { data: sonasData } = await supabase
        .from('sonas_declarations_accident')
        .select('*')
        .eq('sinistre_id', id)
        .single();

      if (sonasData) {
        setSonasDeclaration(sonasData as SonasDeclaration);
      }

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
          date_visite_lieu: expertiseData.date_visite_lieu,
          rapport: expertiseData.rapport,
          conclusion: expertiseData.conclusion,
          details_techniques: expertiseData.details_techniques,
          recommandations: expertiseData.recommandations,
          montant_evalue: expertiseData.montant_evalue,
          statut: expertiseData.statut,
        });
        setRapportForm({
          rapport: expertiseData.rapport || '',
          conclusion: expertiseData.conclusion || '',
          details_techniques: expertiseData.details_techniques || '',
          recommandations: expertiseData.recommandations || '',
          montant_evalue: expertiseData.montant_evalue || sinistreData.montant_estime || 0,
          date_visite_lieu: expertiseData.date_visite_lieu || '',
        });
      }

      setDocuments(docs || []);

      // Formater les communications avec les noms des expéditeurs et leurs rôles
      if (comms && comms.length > 0) {
        const expediteurIds = [...new Set(comms.map(c => c.expediteur_id))];
        const { data: users } = await supabase.from('users').select('id, nom, role').in('id', expediteurIds);
        const userMap = new Map();
        if (users) users.forEach(u => userMap.set(u.id, { nom: u.nom, role: u.role }));
        
        setCommunications(comms.map(c => {
          const userInfo = userMap.get(c.expediteur_id);
          return {
            id: c.id,
            contenu: c.contenu,
            expediteur_nom: userInfo?.nom || 'Système',
            expediteur_role: userInfo?.role || 'system',
            type: c.type || 'message',
            priorite: c.priorite,
            statut_reclamation: c.statut_reclamation,
            created_at: c.created_at,
          };
        }));
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
    if (!rapportForm.rapport || rapportForm.rapport.trim().length < 10) {
      setError('Le rapport doit contenir au moins 10 caractères');
      return;
    }
    if (!rapportForm.montant_evalue || rapportForm.montant_evalue <= 0) {
      setError('Le montant évalué est obligatoire');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Mise à jour de l'expertise avec les 5 nouveaux champs
      await supabase.from('expertises').update({
        rapport: rapportForm.rapport.trim(),
        conclusion: rapportForm.conclusion.trim(),
        details_techniques: rapportForm.details_techniques.trim(),
        recommandations: rapportForm.recommandations.trim(),
        montant_evalue: rapportForm.montant_evalue,
        date_visite_lieu: rapportForm.date_visite_lieu || new Date().toISOString().split('T')[0],
        statut: 'terminee',
        date_expertise: new Date().toISOString(),
      }).eq('id', monExpertise?.id);

      // Upload des fichiers joints
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

      // Notification
      await supabase.from('sinistre_communications').insert({
        sinistre_id: id,
        type: 'notification',
        contenu: `📋 Rapport d'expertise déposé.\n💰 Montant évalué : ${formatMontant(rapportForm.montant_evalue)}\n📅 Date de visite : ${rapportForm.date_visite_lieu ? formatDateShort(rapportForm.date_visite_lieu) : 'Non spécifiée'}`,
        expediteur_id: user?.id,
      });

      setSuccess('✅ Rapport soumis avec succès !');
      setShowRapportModal(false);
      setRapportFiles([]);
      chargerDonnees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
              {sonasDeclaration && (
                <button 
                  onClick={() => setShowSonasModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEye className="h-3 w-3" />
                  Voir dossier SONAS
                </button>
              )}
              {monExpertise?.statut === 'planifiee' && (
                <button onClick={handleCommencerExpertise}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                  Commencer l'expertise
                </button>
              )}
              {(monExpertise?.statut === 'planifiee' || monExpertise?.statut === 'en_cours') && (
                <button onClick={() => setShowRapportModal(true)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                  <FaClipboardCheck className="inline mr-1" /> Rédiger le rapport
                </button>
              )}
              {monExpertise?.statut === 'terminee' && (
                <button onClick={() => setShowRapportModal(true)}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">
                  <FaEye className="inline mr-1" /> Voir/Modifier le rapport
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Messages d'erreur/succès */}
        {error && <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-sm text-red-700"><FaTimesCircle className="mr-2 h-4 w-4" />{error}<button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-3 w-3" /></button></div>}
        {success && <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-sm text-green-700"><FaCheckCircle className="mr-2 h-4 w-4" />{success}</div>}

        {/* Progression */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression du dossier</span>
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
                <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDateShort(sinistre.date_sinistre)}</p></div>
                <div><p className="text-gray-500">Lieu</p><p className="font-medium">{sinistre.lieu}</p></div>
                <div><p className="text-gray-500">Montant estimé initial</p><p className="font-medium">{formatMontant(sinistre.montant_estime)}</p></div>
                <div><p className="text-gray-500">Police</p><p className="font-medium">{sinistre.souscription_police}</p></div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500 mb-1">Description du sinistre</p>
                <p className="text-sm whitespace-pre-wrap">{sinistre.description}</p>
              </div>
            </div>

            {/* Mon expertise */}
            {monExpertise && (
              <div className="bg-white rounded-lg border border-purple-200 p-4">
                <h2 className="font-semibold mb-3 flex items-center">
                  <FaClipboardList className="mr-2 h-5 w-5 text-purple-600" /> Mon expertise
                </h2>
                <div className="flex items-center gap-3 text-sm mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    monExpertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                    monExpertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {monExpertise.statut === 'terminee' ? '✅ Terminée' : monExpertise.statut === 'en_cours' ? '🔄 En cours' : '📋 Planifiée'}
                  </span>
                  <span className="text-gray-500">Désignée le {formatDateShort(monExpertise.date_designation)}</span>
                  {monExpertise.date_visite_lieu && (
                    <span className="text-gray-500">| Visite le {formatDateShort(monExpertise.date_visite_lieu)}</span>
                  )}
                </div>
                
                {monExpertise.rapport && (
                  <div className="mt-3 space-y-3">
                    {/* Rapport principal */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">📝 Rapport de constatation</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{monExpertise.rapport}</p>
                    </div>

                    {/* Détails techniques */}
                    {monExpertise.details_techniques && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium mb-2">🔧 Détails techniques</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{monExpertise.details_techniques}</p>
                      </div>
                    )}

                    {/* Montant évalué */}
                    {monExpertise.montant_evalue != null && monExpertise.montant_evalue > 0 && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">💰 Montant évalué</p>
                        <p className="text-lg font-bold text-green-700">{formatMontant(monExpertise.montant_evalue)}</p>
                      </div>
                    )}

                    {/* Conclusion et recommandations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {monExpertise.conclusion && (
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">✅ Conclusion</p>
                          <p className="text-sm text-gray-600">{monExpertise.conclusion}</p>
                        </div>
                      )}
                      {monExpertise.recommandations && (
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-1">💡 Recommandations</p>
                          <p className="text-sm text-gray-600">{monExpertise.recommandations}</p>
                        </div>
                      )}
                    </div>
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

            {/* Communications */}
            <div className="bg-white rounded-lg border p-4">
              <h2 className="font-semibold mb-2"><FaComments className="inline mr-1 text-blue-500" /> Communications</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {communications.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">Aucune communication</p>
                ) : (
                  communications.map(comm => (
                    <div 
                      key={comm.id} 
                      className={`rounded p-3 text-xs ${
                        comm.type === 'reclamation' 
                          ? 'bg-orange-50 border border-orange-200' 
                          : comm.type === 'notification' 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {comm.expediteur_nom}
                          </span>
                          <span className="text-gray-400 text-[10px]">
                            {comm.expediteur_role === 'assure' ? 'Assuré' : 
                             comm.expediteur_role === 'expert' ? 'Expert' : 
                             comm.expediteur_role === 'agent' ? 'Agent' : 'Système'}
                          </span>
                        </div>
                        <span className="text-gray-400 text-[10px]">{formatDate(comm.created_at)}</span>
                      </div>
                      
                      {comm.type === 'reclamation' ? (
                        <div className="mt-1">
                          {(() => {
                            const lines = comm.contenu.split('\n');
                            const sujetLine = lines.find(line => line.includes('Sujet:'));
                            const autresLignes = lines.filter(line => !line.includes('Sujet:'));
                            
                            return (
                              <>
                                {sujetLine && (
                                  <div className="font-semibold text-orange-700 mb-1 pb-1 border-b border-orange-200">
                                    {sujetLine.replace(/\*\*/g, '').trim()}
                                  </div>
                                )}
                                {autresLignes.map((line, idx) => (
                                  <p key={idx} className={line.trim() ? 'mt-0.5' : 'h-1'}>
                                    {line.replace(/\*\*/g, '').trim() || '\u00A0'}
                                  </p>
                                ))}
                              </>
                            );
                          })()}
                          <div className="flex gap-1 mt-1.5">
                            {comm.priorite && (
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getPriorityColor(comm.priorite)}`}>
                                {comm.priorite}
                              </span>
                            )}
                            {comm.statut_reclamation && (
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${getReclamationStatusColor(comm.statut_reclamation)}`}>
                                {comm.statut_reclamation === 'ouverte' ? 'Ouverte' :
                                 comm.statut_reclamation === 'en_cours' ? 'En cours' :
                                 comm.statut_reclamation === 'resolue' ? 'Résolue' : 'Fermée'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : comm.type === 'notification' ? (
                        <div className="flex items-start gap-1.5 mt-0.5">
                          <FaBell className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="whitespace-pre-wrap">{comm.contenu}</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap mt-0.5">{comm.contenu}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL DOSSIER SONAS COMPLET ===== */}
      {showSonasModal && sonasDeclaration && (
        <Modal onClose={() => setShowSonasModal(false)} title="📋 Dossier SONAS - Déclaration d'Accident Automobile" size="max-w-4xl">
          <div className="space-y-4">
            {/* En-tête */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-gray-500">N° Dossier</p><p className="font-semibold text-blue-700">{sonasDeclaration.claim_no}</p></div>
                <div><p className="text-gray-500">Agence</p><p className="font-medium">{sonasDeclaration.agence}</p></div>
                <div><p className="text-gray-500">Police</p><p className="font-medium">{sonasDeclaration.police || '-'}</p></div>
                <div><p className="text-gray-500">Garantie</p><p className="font-medium">{sonasDeclaration.garantie || '-'}</p></div>
              </div>
            </div>

            {/* Plan des lieux */}
            {sonasDeclaration.plan_lieux_url && (
              <div className="border-2 border-green-300 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-green-300">
                  <FaImage className="text-green-600 h-4 w-4" />
                  <h4 className="font-semibold text-sm text-green-800">📐 Plan des lieux</h4>
                </div>
                <div className="p-4">
                  <img 
                    src={sonasDeclaration.plan_lieux_url} 
                    alt="Plan des lieux" 
                    className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <a 
                      href={sonasDeclaration.plan_lieux_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FaDownload className="mr-1 h-3 w-3" /> Télécharger
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Signature */}
            {sonasDeclaration.signature_assure_url && (
              <div className="border-2 border-purple-300 rounded-lg overflow-hidden">
                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2 border-b border-purple-300">
                  <FaPen className="text-purple-600 h-4 w-4" />
                  <h4 className="font-semibold text-sm text-purple-800">✍️ Signature de l'assuré</h4>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <img 
                    src={sonasDeclaration.signature_assure_url} 
                    alt="Signature" 
                    className="max-h-32 object-contain border border-gray-200 rounded-lg bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-signature.png';
                    }}
                  />
                  <div className="mt-2 flex justify-end w-full">
                    <a 
                      href={sonasDeclaration.signature_assure_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FaDownload className="mr-1 h-3 w-3" /> Télécharger
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Détails complets - reste identique */}
            <div className="space-y-3">
              {/* Section 1 à 14 identiques à l'original */}
              {/* ... (garde toutes les sections SONAS existantes) ... */}
            </div>
          </div>
        </Modal>
      )}

      {/* ===== MODAL RAPPORT D'EXPERTISE GÉNÉRIQUE ===== */}
      {showRapportModal && (
        <Modal onClose={() => setShowRapportModal(false)} title="📝 Rapport d'expertise" size="max-w-2xl">
          <div className="space-y-4">
            {/* Date de visite */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaCalendarAlt className="inline mr-1" /> Date de visite sur les lieux
              </label>
              <input 
                type="date" 
                value={rapportForm.date_visite_lieu}
                onChange={e => setRapportForm(p => ({...p, date_visite_lieu: e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 text-sm" 
              />
            </div>

            {/* Constatations */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaClipboardList className="inline mr-1" /> Constatations et description *
              </label>
              <textarea 
                value={rapportForm.rapport} 
                onChange={e => setRapportForm(p => ({...p, rapport: e.target.value}))}
                rows={6} 
                className="w-full border rounded-lg px-3 py-2 text-sm" 
                placeholder="Décrivez en détail vos constatations : état des lieux, dommages observés, circonstances..."
                required
              />
            </div>

            {/* Détails techniques */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaTools className="inline mr-1" /> Détails techniques
              </label>
              <textarea 
                value={rapportForm.details_techniques} 
                onChange={e => setRapportForm(p => ({...p, details_techniques: e.target.value}))}
                rows={4} 
                className="w-full border rounded-lg px-3 py-2 text-sm" 
                placeholder="Précisions techniques, mesures, analyses, causes probables..."
              />
            </div>

            {/* Montant évalué */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaMoneyBillWave className="inline mr-1" /> Montant total évalué (CDF) *
              </label>
              <input 
                type="number" 
                value={rapportForm.montant_evalue || ''} 
                onChange={e => setRapportForm(p => ({...p, montant_evalue: Number(e.target.value)}))}
                className="w-full border rounded-lg px-3 py-2 text-sm font-semibold" 
                placeholder="0" 
                min="0"
                required
              />
            </div>

            {/* Conclusion */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaCheckCircle className="inline mr-1" /> Conclusion
              </label>
              <textarea 
                value={rapportForm.conclusion} 
                onChange={e => setRapportForm(p => ({...p, conclusion: e.target.value}))}
                rows={3} 
                className="w-full border rounded-lg px-3 py-2 text-sm" 
                placeholder="Votre conclusion finale sur le sinistre..."
              />
            </div>

            {/* Recommandations */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaInfo className="inline mr-1" /> Recommandations
              </label>
              <textarea 
                value={rapportForm.recommandations} 
                onChange={e => setRapportForm(p => ({...p, recommandations: e.target.value}))}
                rows={3} 
                className="w-full border rounded-lg px-3 py-2 text-sm" 
                placeholder="Vos recommandations pour la suite du dossier..."
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <FaCamera className="inline mr-1" /> Photos / Documents
              </label>
              <input 
                type="file" 
                multiple 
                onChange={e => setRapportFiles(e.target.files ? Array.from(e.target.files) : [])}
                className="w-full text-sm" 
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" 
              />
              {rapportFiles.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{rapportFiles.length} fichier(s) sélectionné(s)</p>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-2 border-t">
              <button 
                onClick={handleSubmitRapport} 
                disabled={saving || !rapportForm.rapport || !rapportForm.montant_evalue}
                className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin inline mr-1" /> : <FaPaperPlane className="inline mr-1" />}
                {saving ? 'Envoi...' : monExpertise?.statut === 'terminee' ? 'Mettre à jour' : 'Soumettre le rapport'}
              </button>
              <button 
                onClick={() => setShowRapportModal(false)} 
                className="flex-1 border rounded-lg py-2.5 text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}