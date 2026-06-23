// // app/assure/sinistres/page.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import {
//   FaSearch,
//   FaFilter,
//   FaPlus,
//   FaFileAlt,
//   FaClock,
//   FaSpinner,
//   FaClipboardList,
//   FaMoneyBillWave,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaExclamationTriangle,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaChevronRight,
//   FaSort,
//   FaHistory,
//   FaHeadset,
//   FaQuestionCircle,
//   FaFileContract,
//   FaChartBar,
//   FaBell,
//   FaEye,
// } from 'react-icons/fa';

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
//   souscription?: {
//     police_numero?: string;
//     produit?: {
//       nom: string;
//     };
//   };
//   communications_count?: number;
//   expertises?: {
//     id: string;
//     statut: string;
//     expert: {
//       nom: string;
//     };
//   }[];
// };

// type StatsType = {
//   total: number;
//   en_attente: number;
//   en_cours: number;
//   expertise: number;
//   en_indemnisation: number;
//   cloture: number;
//   refuse: number;
// };

// // ==================== CONSTANTES ====================

// const STATUTS: Record<string, {
//   label: string;
//   icon: React.ComponentType<any>;
//   color: string;
//   bgColor: string;
//   progress: number;
// }> = {
//   en_attente: { 
//     label: 'En attente', 
//     icon: FaClock, 
//     color: 'text-yellow-600',
//     bgColor: 'bg-yellow-100',
//     progress: 10 
//   },
//   en_cours: { 
//     label: 'En cours', 
//     icon: FaSpinner, 
//     color: 'text-blue-600',
//     bgColor: 'bg-blue-100',
//     progress: 30 
//   },
//   expertise: { 
//     label: 'En expertise', 
//     icon: FaClipboardList, 
//     color: 'text-purple-600',
//     bgColor: 'bg-purple-100',
//     progress: 50 
//   },
//   en_indemnisation: { 
//     label: 'Indemnisation', 
//     icon: FaMoneyBillWave, 
//     color: 'text-indigo-600',
//     bgColor: 'bg-indigo-100',
//     progress: 75 
//   },
//   cloture: { 
//     label: 'Clôturé', 
//     icon: FaCheckCircle, 
//     color: 'text-green-600',
//     bgColor: 'bg-green-100',
//     progress: 100 
//   },
//   refuse: { 
//     label: 'Refusé', 
//     icon: FaTimesCircle, 
//     color: 'text-red-600',
//     bgColor: 'bg-red-100',
//     progress: 0 
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

// function StatutBadge({ statut, mini = false }: { statut: string; mini?: boolean }) {
//   const info = STATUTS[statut] || STATUTS.en_attente;
//   const Icon = info.icon;
  
//   if (mini) {
//     return (
//       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${info.bgColor} ${info.color}`}>
//         <Icon className="mr-1 h-3 w-3" />
//         {info.label}
//       </span>
//     );
//   }

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
//     <div className="w-full bg-gray-200 rounded-full h-2">
//       <div 
//         className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   );
// }

// function EmptyState({ onNewSinistre }: { onNewSinistre: () => void }) {
//   return (
//     <div className="text-center py-16">
//       <FaFileAlt className="mx-auto h-16 w-16 text-gray-300" />
//       <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun sinistre</h3>
//       <p className="mt-2 text-sm text-gray-500">
//         Vous n'avez pas encore déclaré de sinistre. En cas de besoin, n'hésitez pas à en créer un.
//       </p>
//       <button
//         onClick={onNewSinistre}
//         className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         <FaPlus className="mr-2 h-4 w-4" />
//         Déclarer un nouveau sinistre
//       </button>
//     </div>
//   );
// }

// function StatCard({ 
//   label, 
//   value, 
//   icon: Icon, 
//   color, 
//   bgColor,
//   onClick,
//   isActive
// }: { 
//   label: string; 
//   value: number; 
//   icon: React.ComponentType<any>; 
//   color: string;
//   bgColor: string;
//   onClick?: () => void;
//   isActive?: boolean;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`${bgColor} rounded-lg p-4 text-left transition-all hover:shadow-md ${
//         isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-2xl font-bold">{value}</p>
//           <p className="text-sm mt-1">{label}</p>
//         </div>
//         <Icon className={`h-8 w-8 ${color} opacity-50`} />
//       </div>
//     </button>
//   );
// }

// // ==================== PAGE PRINCIPALE ====================

// export default function AssureSinistresPage() {
//   const { user } = useAuth();
//   const router = useRouter();

//   // États
//   const [sinistres, setSinistres] = useState<Sinistre[]>([]);
//   const [filteredSinistres, setFilteredSinistres] = useState<Sinistre[]>([]);
//   const [stats, setStats] = useState<StatsType>({
//     total: 0,
//     en_attente: 0,
//     en_cours: 0,
//     expertise: 0,
//     en_indemnisation: 0,
//     cloture: 0,
//     refuse: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Filtres
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<string>('');
//   const [filterType, setFilterType] = useState<string>('');
//   const [sortBy, setSortBy] = useState<string>('date_desc');
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     if (user) {
//       chargerSinistres();
//     }
//   }, [user]);

//   useEffect(() => {
//     appliquerFiltres();
//   }, [sinistres, searchTerm, filterStatus, filterType, sortBy]);

//  const chargerSinistres = async () => {
//   try {
//     setLoading(true);

//     // Charger les sinistres SANS la relation problématique
//     const { data, error } = await supabase
//       .from('sinistres')
//       .select(`
//         *,
//         expertises(
//           id,
//           statut,
//           expert:users!expertises_expert_id_fkey(nom)
//         )
//       `)
//       .eq('assure_id', user?.id)
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     // Charger les souscriptions séparément
//     const sinistresWithCounts = await Promise.all(
//       (data || []).map(async (sinistre) => {
//         // Charger la souscription si elle existe
//         let souscription = null;
//         if (sinistre.souscription_id) {
//           const { data: souscriptionData } = await supabase
//             .from('souscriptions')
//             .select('police_numero')
//             .eq('id', sinistre.souscription_id)
//             .single();
//           souscription = souscriptionData;
//         }

//         // Compter les communications
//         const { count } = await supabase
//           .from('sinistre_communications')
//           .select('id', { count: 'exact', head: true })
//           .eq('sinistre_id', sinistre.id);
        
//         return {
//           ...sinistre,
//           souscription,
//           communications_count: count || 0,
//         };
//       })
//     );

//     setSinistres(sinistresWithCounts);
//     calculerStats(sinistresWithCounts);
//   } catch (err: any) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const calculerStats = (data: Sinistre[]) => {
//     const newStats: StatsType = {
//       total: data.length,
//       en_attente: 0,
//       en_cours: 0,
//       expertise: 0,
//       en_indemnisation: 0,
//       cloture: 0,
//       refuse: 0,
//     };

//     data.forEach(s => {
//       if (s.statut in newStats) {
//         (newStats as any)[s.statut]++;
//       }
//     });

//     setStats(newStats);
//   };

//   // ==================== FILTRES ====================

//   const appliquerFiltres = () => {
//     let filtered = [...sinistres];

//     // Filtre par statut
//     if (filterStatus) {
//       filtered = filtered.filter(s => s.statut === filterStatus);
//     }

//     // Filtre par type
//     if (filterType) {
//       filtered = filtered.filter(s => s.type_sinistre === filterType);
//     }

//     // Recherche
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(s => 
//         s.numero_dossier.toLowerCase().includes(term) ||
//         s.description.toLowerCase().includes(term) ||
//         s.lieu.toLowerCase().includes(term) ||
//         (s.souscription?.police_numero && s.souscription.police_numero.toLowerCase().includes(term))
//       );
//     }

//     // Tri
//     switch (sortBy) {
//       case 'date_asc':
//         filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
//         break;
//       case 'date_desc':
//         filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//         break;
//       case 'montant_asc':
//         filtered.sort((a, b) => (a.montant_estime || 0) - (b.montant_estime || 0));
//         break;
//       case 'montant_desc':
//         filtered.sort((a, b) => (b.montant_estime || 0) - (a.montant_estime || 0));
//         break;
//       case 'statut':
//         filtered.sort((a, b) => {
//           const order = ['en_attente', 'en_cours', 'expertise', 'en_indemnisation', 'cloture', 'refuse'];
//           return order.indexOf(a.statut) - order.indexOf(b.statut);
//         });
//         break;
//     }

//     setFilteredSinistres(filtered);
//   };

//   // ==================== HELPERS ====================

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
//     } catch {
//       return dateString;
//     }
//   };

//   const formatMontant = (montant: number) => {
//     if (!montant) return 'Non spécifié';
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'CDF',
//       maximumFractionDigits: 0,
//     }).format(montant);
//   };

//   const getDerniereActivite = (sinistre: Sinistre) => {
//     const dates = [sinistre.updated_at, sinistre.created_at].filter(Boolean);
//     return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
//   };

//   // ==================== RENDU ====================

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
//           <p className="mt-4 text-gray-600">Chargement de vos sinistres...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* En-tête */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900">Mes sinistres</h1>
//               <p className="mt-1 text-sm text-gray-500">
//                 Gérez et suivez vos déclarations de sinistre
//               </p>
//             </div>
//             <button
//               onClick={() => router.push('/assure/declaration')}
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <FaPlus className="mr-2 h-4 w-4" />
//               Déclarer un sinistre
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {error && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <FaExclamationTriangle className="text-red-400 mr-3 h-5 w-5" />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         )}

//         {sinistres.length === 0 ? (
//           <EmptyState onNewSinistre={() => router.push('/assure/sinistres/nouveau')} />
//         ) : (
//           <>
//             {/* Statistiques */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
//               <StatCard
//                 label="Tous"
//                 value={stats.total}
//                 icon={FaFileAlt}
//                 color="text-gray-600"
//                 bgColor="bg-gray-50 border border-gray-200"
//                 onClick={() => setFilterStatus('')}
//                 isActive={!filterStatus}
//               />
//               {Object.entries(STATUTS).map(([key, info]) => (
//                 <StatCard
//                   key={key}
//                   label={info.label}
//                   value={(stats as any)[key] || 0}
//                   icon={info.icon}
//                   color={info.color}
//                   bgColor={info.bgColor}
//                   onClick={() => setFilterStatus(key === filterStatus ? '' : key)}
//                   isActive={filterStatus === key}
//                 />
//               ))}
//             </div>

//             {/* Barre de recherche et filtres */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//               <div className="flex items-center space-x-4">
//                 <div className="flex-1 relative">
//                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Rechercher par numéro, description, lieu..."
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm transition-colors ${
//                     showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <FaFilter className="mr-2 h-4 w-4" />
//                   Filtres
//                   {filterType && (
//                     <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
//                       1
//                     </span>
//                   )}
//                 </button>

//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="date_desc">Plus récent</option>
//                   <option value="date_asc">Plus ancien</option>
//                   <option value="montant_desc">Montant ↓</option>
//                   <option value="montant_asc">Montant ↑</option>
//                   <option value="statut">Par statut</option>
//                 </select>
//               </div>

//               {/* Filtres avancés */}
//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Type de sinistre
//                       </label>
//                       <select
//                         value={filterType}
//                         onChange={(e) => setFilterType(e.target.value)}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
//                       >
//                         <option value="">Tous les types</option>
//                         {Object.entries(TYPES_SINISTRE).map(([key, val]) => (
//                           <option key={key} value={key}>{val.icon} {val.label}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setFilterType('');
//                       setSortBy('date_desc');
//                     }}
//                     className="mt-4 text-sm text-blue-600 hover:text-blue-800"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Liste des sinistres */}
//             {filteredSinistres.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
//                 <FaSearch className="mx-auto h-12 w-12 text-gray-300" />
//                 <p className="mt-4 text-gray-500">Aucun sinistre ne correspond à vos critères</p>
//                 <button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setFilterStatus('');
//                     setFilterType('');
//                   }}
//                   className="mt-2 text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Réinitialiser les filtres
//                 </button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredSinistres.map(sinistre => {
//                   const statutInfo = STATUTS[sinistre.statut] || STATUTS.en_attente;
//                   const derniereActivite = getDerniereActivite(sinistre);

//                   return (
//                     <div
//                       key={sinistre.id}
//                       className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
//                       onClick={() => router.push(`/assure/sinistres/${sinistre.id}`)}
//                     >
//                       <div className="p-6">
//                         <div className="flex items-start justify-between mb-4">
//                           <div className="flex items-start space-x-3">
//                             <div className="text-3xl">
//                               {TYPES_SINISTRE[sinistre.type_sinistre]?.icon || '📋'}
//                             </div>
//                             <div>
//                               <div className="flex items-center space-x-2">
//                                 <h3 className="text-lg font-semibold text-gray-900">
//                                   {sinistre.numero_dossier}
//                                 </h3>
//                                 <StatutBadge statut={sinistre.statut} mini />
//                               </div>
//                               <p className="text-sm text-gray-500 mt-1">
//                                 {TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}
//                               </p>
//                               <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
//                                 <span className="flex items-center">
//                                   <FaCalendarAlt className="mr-1 h-3 w-3" />
//                                   {formatDate(sinistre.date_sinistre)}
//                                 </span>
//                                 <span className="flex items-center">
//                                   <FaMapMarkerAlt className="mr-1 h-3 w-3" />
//                                   {sinistre.lieu}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <FaChevronRight className="h-5 w-5 text-gray-400" />
//                         </div>

//                         {/* Barre de progression */}
//                         <div className="mb-3">
//                           <ProgressBar progress={statutInfo.progress} />
//                         </div>

//                         <div className="flex items-center justify-between text-sm">
//                           <div className="flex items-center space-x-4">
//                             {sinistre.montant_estime && (
//                               <span className="flex items-center text-gray-700">
//                                 <FaMoneyBillWave className="mr-1 h-3 w-3 text-gray-400" />
//                                 {formatMontant(sinistre.montant_estime)}
//                               </span>
//                             )}
//                             {sinistre.expertises && sinistre.expertises.length > 0 && (
//                               <span className="flex items-center text-purple-600">
//                                 <FaClipboardList className="mr-1 h-3 w-3" />
//                                 Expert: {sinistre.expertises[0].expert?.nom || 'Assigné'}
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center space-x-3 text-xs text-gray-500">
//                             {sinistre.communications_count && sinistre.communications_count > 0 && (
//                               <span className="flex items-center">
//                                 <FaBell className="mr-1 h-3 w-3" />
//                                 {sinistre.communications_count} message{sinistre.communications_count > 1 ? 's' : ''}
//                               </span>
//                             )}
//                             <span className="flex items-center">
//                               <FaHistory className="mr-1 h-3 w-3" />
//                               {formatDate(derniereActivite)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Informations utiles */}
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
             

           

//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <FaChartBar className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-900">Statistiques</h4>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {stats.total} sinistre{stats.total > 1 ? 's' : ''} déclaré{stats.total > 1 ? 's' : ''}
//                       {' • '}
//                       {stats.cloture + stats.refuse} traité{stats.cloture + stats.refuse > 1 ? 's' : ''}
//                     </p>
//                     <div className="mt-2 text-xs text-gray-500">
//                       <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                       {((stats.cloture / stats.total) * 100).toFixed(0)}% résolus
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// app/assure/sinistres/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FaSearch, FaFilter, FaPlus, FaFileAlt, FaClock, FaSpinner,
  FaClipboardList, FaMoneyBillWave, FaCheckCircle, FaTimesCircle,
  FaExclamationTriangle, FaCalendarAlt, FaMapMarkerAlt, FaChevronRight,
  FaSort, FaHistory, FaChartBar, FaBell, FaHandHoldingUsd
} from 'react-icons/fa';

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
  souscription?: {
    police_numero?: string;
  };
  communications_count?: number;
  expertises?: {
    id: string;
    statut: string;
    expert_nom: string;
  }[];
  indemnisation_payee: boolean; // ✅ Nouveau
};

type StatsType = {
  total: number;
  en_attente: number;
  en_cours: number;
  expertise: number;
  en_indemnisation: number;
  cloture: number;
  refuse: number;
};

// ==================== CONSTANTES ====================

const STATUTS: Record<string, {
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  progress: number;
}> = {
  en_attente: { label: 'En attente', icon: FaClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', progress: 10 },
  en_cours: { label: 'En cours', icon: FaSpinner, color: 'text-blue-600', bgColor: 'bg-blue-100', progress: 30 },
  expertise: { label: 'En expertise', icon: FaClipboardList, color: 'text-purple-600', bgColor: 'bg-purple-100', progress: 50 },
  en_indemnisation: { label: 'Indemnisation', icon: FaMoneyBillWave, color: 'text-indigo-600', bgColor: 'bg-indigo-100', progress: 75 },
  cloture: { label: 'Clôturé', icon: FaCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', progress: 100 },
  refuse: { label: 'Refusé', icon: FaTimesCircle, color: 'text-red-600', bgColor: 'bg-red-100', progress: 0 },
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

function StatutBadge({ statut, mini = false }: { statut: string; mini?: boolean }) {
  const info = STATUTS[statut] || STATUTS.en_attente;
  const Icon = info.icon;
  
  if (mini) {
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${info.bgColor} ${info.color}`}>
        <Icon className="mr-1 h-3 w-3" />{info.label}
      </span>
    );
  }
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
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all duration-500 ${getColor()}`} style={{ width: `${progress}%` }} />
    </div>
  );
}

function EmptyState({ onNewSinistre }: { onNewSinistre: () => void }) {
  return (
    <div className="text-center py-16">
      <FaFileAlt className="mx-auto h-16 w-16 text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun sinistre</h3>
      <p className="mt-2 text-sm text-gray-500">Vous n'avez pas encore déclaré de sinistre.</p>
      <button onClick={onNewSinistre} className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <FaPlus className="mr-2 h-4 w-4" />Déclarer un nouveau sinistre
      </button>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bgColor, onClick, isActive }: { 
  label: string; value: number; icon: React.ComponentType<any>; 
  color: string; bgColor: string; onClick?: () => void; isActive?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`${bgColor} rounded-lg p-4 text-left transition-all hover:shadow-md ${isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
      <div className="flex items-center justify-between">
        <div><p className="text-2xl font-bold">{value}</p><p className="text-sm mt-1">{label}</p></div>
        <Icon className={`h-8 w-8 ${color} opacity-50`} />
      </div>
    </button>
  );
}

// ==================== PAGE PRINCIPALE ====================

export default function AssureSinistresPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [sinistres, setSinistres] = useState<Sinistre[]>([]);
  const [filteredSinistres, setFilteredSinistres] = useState<Sinistre[]>([]);
  const [stats, setStats] = useState<StatsType>({
    total: 0, en_attente: 0, en_cours: 0, expertise: 0, en_indemnisation: 0, cloture: 0, refuse: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { if (user) chargerSinistres(); }, [user]);
  useEffect(() => { appliquerFiltres(); }, [sinistres, searchTerm, filterStatus, filterType, sortBy]);

  const chargerSinistres = async () => {
    try {
      setLoading(true);

      // 1. Charger les sinistres
      const { data, error } = await supabase
        .from('sinistres')
        .select(`
          *,
          expertises(id, statut, expert_id)
        `)
        .eq('assure_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) { setSinistres([]); setLoading(false); return; }

      // 2. Récupérer les indemnisations payées
      const sinistreIds = data.map((s: any) => s.id);
      const { data: indemnisations } = await supabase
        .from('indemnisations')
        .select('sinistre_id')
        .eq('statut', 'payee')
        .in('sinistre_id', sinistreIds);

      const sinistresPayes = new Set((indemnisations || []).map((i: any) => i.sinistre_id));

      // 3. Récupérer les experts
      const allExpertiseIds = data.flatMap((s: any) => (s.expertises || []).map((e: any) => e.expert_id));
      const expertIds = [...new Set(allExpertiseIds)];
      const { data: experts } = await supabase.from('users').select('id, nom').in('id', expertIds);
      const expertMap = new Map();
      if (experts) experts.forEach((e: any) => expertMap.set(e.id, e));

      // 4. Formater
      const formatted: Sinistre[] = await Promise.all(
        data.map(async (sinistre: any) => {
          // Souscription
          let souscription = null;
          if (sinistre.souscription_id) {
            const { data: subData } = await supabase
              .from('souscriptions').select('police_numero').eq('id', sinistre.souscription_id).single();
            souscription = subData;
          }

          // Communications count
          const { count } = await supabase
            .from('sinistre_communications')
            .select('id', { count: 'exact', head: true })
            .eq('sinistre_id', sinistre.id);

          return {
            ...sinistre,
            souscription,
            communications_count: count || 0,
            indemnisation_payee: sinistresPayes.has(sinistre.id),
            expertises: (sinistre.expertises || []).map((e: any) => ({
              ...e,
              expert_nom: expertMap.get(e.expert_id)?.nom || 'Non assigné',
            })),
          };
        })
      );

      setSinistres(formatted);
      calculerStats(formatted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculerStats = (data: Sinistre[]) => {
    const newStats: StatsType = {
      total: data.length,
      en_attente: 0, en_cours: 0, expertise: 0, en_indemnisation: 0, cloture: 0, refuse: 0,
    };

    data.forEach(s => {
      // ✅ Si indemnisé, compter comme clôturé
      if (s.indemnisation_payee) {
        newStats.cloture++;
      } else if (s.statut === 'en_attente') newStats.en_attente++;
      else if (s.statut === 'en_cours') newStats.en_cours++;
      else if (s.statut === 'expertise') newStats.expertise++;
      else if (s.statut === 'en_indemnisation') newStats.en_indemnisation++;
      else if (s.statut === 'cloture') newStats.cloture++;
      else if (s.statut === 'refuse') newStats.refuse++;
    });

    setStats(newStats);
  };

  // ✅ Statut effectif
  const getStatutEffectif = (s: Sinistre): string => {
    if (s.indemnisation_payee) return 'cloture';
    return s.statut;
  };

  const appliquerFiltres = () => {
    let filtered = [...sinistres];

    if (filterStatus) {
      if (filterStatus === 'cloture') {
        // ✅ Inclure les payés
        filtered = filtered.filter(s => s.statut === 'cloture' || s.indemnisation_payee);
      } else {
        filtered = filtered.filter(s => s.statut === filterStatus && !s.indemnisation_payee);
      }
    }

    if (filterType) {
      filtered = filtered.filter(s => s.type_sinistre === filterType);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.numero_dossier.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        s.lieu.toLowerCase().includes(term) ||
        (s.souscription?.police_numero && s.souscription.police_numero.toLowerCase().includes(term))
      );
    }

    switch (sortBy) {
      case 'date_asc': filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
      case 'date_desc': filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'montant_asc': filtered.sort((a, b) => (a.montant_estime || 0) - (b.montant_estime || 0)); break;
      case 'montant_desc': filtered.sort((a, b) => (b.montant_estime || 0) - (a.montant_estime || 0)); break;
      case 'statut': 
        const order = ['en_attente', 'en_cours', 'expertise', 'en_indemnisation', 'cloture', 'refuse'];
        filtered.sort((a, b) => order.indexOf(getStatutEffectif(a)) - order.indexOf(getStatutEffectif(b)));
        break;
    }

    setFilteredSinistres(filtered);
  };

  const formatDate = (d: string) => { try { return format(new Date(d), 'dd MMMM yyyy', { locale: fr }); } catch { return d; } };
  const formatMontant = (m: number) => { if (!m) return 'Non spécifié'; return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m); };
  const getDerniereActivite = (s: Sinistre) => { const dates = [s.updated_at, s.created_at].filter(Boolean); return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]; };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><FaSpinner className="h-12 w-12 text-blue-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Mes sinistres</h1>
              <p className="mt-1 text-sm text-gray-500">Gérez et suivez vos déclarations de sinistre</p>
            </div>
            <button onClick={() => router.push('/assure/declaration')} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm">
              <FaPlus className="mr-2 h-4 w-4" />Déclarer un sinistre
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center"><FaExclamationTriangle className="text-red-400 mr-3 h-5 w-5" /><p className="text-sm text-red-700">{error}</p></div>}

        {sinistres.length === 0 ? (
          <EmptyState onNewSinistre={() => router.push('/assure/declaration')} />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
              <StatCard label="Tous" value={stats.total} icon={FaFileAlt} color="text-gray-600" bgColor="bg-gray-50 border border-gray-200" onClick={() => setFilterStatus('')} isActive={!filterStatus} />
              {Object.entries(STATUTS).map(([key, info]) => (
                <StatCard key={key} label={info.label} value={(stats as any)[key] || 0} icon={info.icon} color={info.color} bgColor={info.bgColor} onClick={() => setFilterStatus(key === filterStatus ? '' : key)} isActive={filterStatus === key} />
              ))}
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" /></div>
                <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}><FaFilter className="mr-2 h-4 w-4" />Filtres{filterType && <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">1</span>}</button>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg text-sm"><option value="date_desc">Plus récent</option><option value="date_asc">Plus ancien</option><option value="montant_desc">Montant ↓</option><option value="montant_asc">Montant ↑</option><option value="statut">Par statut</option></select>
              </div>
              {showFilters && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-2">Type de sinistre</label><select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm"><option value="">Tous les types</option>{Object.entries(TYPES_SINISTRE).map(([key, val]) => <option key={key} value={key}>{val.icon} {val.label}</option>)}</select></div>
                  </div>
                  <button onClick={() => { setFilterType(''); setSortBy('date_desc'); }} className="mt-4 text-sm text-blue-600 hover:text-blue-800">Réinitialiser les filtres</button>
                </div>
              )}
            </div>

            {/* Liste */}
            {filteredSinistres.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center"><FaSearch className="mx-auto h-12 w-12 text-gray-300" /><p className="mt-4 text-gray-500">Aucun sinistre trouvé</p></div>
            ) : (
              <div className="space-y-4">
                {filteredSinistres.map(sinistre => {
                  const statutEffectif = getStatutEffectif(sinistre);
                  const statutInfo = STATUTS[statutEffectif] || STATUTS.en_attente;
                  const derniereActivite = getDerniereActivite(sinistre);

                  return (
                    <div key={sinistre.id} className="bg-white rounded-lg shadow-sm border hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onClick={() => router.push(`/assure/sinistres/${sinistre.id}`)}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="text-3xl">{TYPES_SINISTRE[sinistre.type_sinistre]?.icon || '📋'}</div>
                            <div>
                              <div className="flex items-center space-x-2 flex-wrap gap-1">
                                <h3 className="text-lg font-semibold text-gray-900">{sinistre.numero_dossier}</h3>
                                <StatutBadge statut={statutEffectif} mini />
                                {sinistre.indemnisation_payee && <span className="text-xs text-green-600 font-medium">💰 Payé</span>}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{TYPES_SINISTRE[sinistre.type_sinistre]?.label || sinistre.type_sinistre}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span><FaCalendarAlt className="inline mr-1 h-3 w-3" />{formatDate(sinistre.date_sinistre)}</span>
                                <span><FaMapMarkerAlt className="inline mr-1 h-3 w-3" />{sinistre.lieu}</span>
                              </div>
                            </div>
                          </div>
                          <FaChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="mb-3"><ProgressBar progress={statutInfo.progress} /></div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            {sinistre.montant_estime ? <span className="flex items-center text-gray-700"><FaMoneyBillWave className="mr-1 h-3 w-3 text-gray-400" />{formatMontant(sinistre.montant_estime)}</span> : null}
                            {sinistre.montant_indemnisation > 0 && <span className="flex items-center text-green-600"><FaHandHoldingUsd className="mr-1 h-3 w-3" />{formatMontant(sinistre.montant_indemnisation)}</span>}
                            {sinistre.expertises && sinistre.expertises.length > 0 && <span className="flex items-center text-purple-600"><FaClipboardList className="mr-1 h-3 w-3" />Expert: {sinistre.expertises[0].expert_nom}</span>}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {sinistre.communications_count ? <span><FaBell className="inline mr-1 h-3 w-3" />{sinistre.communications_count}</span> : null}
                            <span><FaHistory className="inline mr-1 h-3 w-3" />{formatDate(derniereActivite)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stats résumé */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg"><FaChartBar className="h-5 w-5 text-purple-600" /></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Statistiques</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats.total} sinistre{stats.total > 1 ? 's' : ''} • {stats.cloture + stats.refuse} traité{stats.cloture + stats.refuse > 1 ? 's' : ''}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      {stats.total > 0 ? Math.round((stats.cloture / stats.total) * 100) : 0}% résolus
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}