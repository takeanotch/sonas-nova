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
// app/assure/dashboard/page.tsx
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
  AreaChart, Area
} from 'recharts';
import {
  FaArrowLeft, FaChartBar, FaChartPie, FaChartLine,
  FaCalendarAlt, FaSpinner, FaExclamationTriangle,
  FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle,
  FaClipboardList, FaMoneyBillWave
} from 'react-icons/fa';

// ==================== TYPES ====================

type DashboardStats = {
  total: number;
  en_attente: number;
  en_cours: number;
  expertise: number;
  en_indemnisation: number;
  cloture: number;
  refuse: number;
  montant_total_estime: number;
  montant_total_indemnisation: number;
  temps_moyen_traitement: number;
};

type MonthlyData = {
  mois: string;
  declarations: number;
  clotures: number;
  montant: number;
};

type TypeDistribution = {
  name: string;
  value: number;
  icon: string;
};

// ==================== CONSTANTES ====================

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

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
  expertise: 'Expertise',
  en_indemnisation: 'Indemnisation',
  cloture: 'Clôturé',
  refuse: 'Refusé',
};

// ==================== COMPOSANTS ====================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, color, bgColor, subtitle }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  subtitle?: string;
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

// ==================== PAGE PRINCIPALE ====================

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    en_attente: 0,
    en_cours: 0,
    expertise: 0,
    en_indemnisation: 0,
    cloture: 0,
    refuse: 0,
    montant_total_estime: 0,
    montant_total_indemnisation: 0,
    temps_moyen_traitement: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<TypeDistribution[]>([]);

  useEffect(() => {
    if (user) {
      chargerDonnees();
    }
  }, [user]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      await Promise.all([
        chargerStats(),
        chargerDonneesMensuelles(),
        chargerDistributionTypes(),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chargerStats = async () => {
    const { data, error } = await supabase
      .from('sinistres')
      .select('statut, montant_estime, montant_indemnisation, created_at, updated_at')
      .eq('assure_id', user?.id);

    if (error) throw error;

    const newStats: DashboardStats = {
      total: data.length,
      en_attente: 0,
      en_cours: 0,
      expertise: 0,
      en_indemnisation: 0,
      cloture: 0,
      refuse: 0,
      montant_total_estime: 0,
      montant_total_indemnisation: 0,
      temps_moyen_traitement: 0,
    };

    let totalTraitementJours = 0;
    let cloturesCount = 0;

    data.forEach(s => {
      if (s.statut in newStats) {
        (newStats as any)[s.statut]++;
      }
      newStats.montant_total_estime += s.montant_estime || 0;
      newStats.montant_total_indemnisation += s.montant_indemnisation || 0;

      if (s.statut === 'cloture') {
        const debut = new Date(s.created_at);
        const fin = new Date(s.updated_at);
        totalTraitementJours += (fin.getTime() - debut.getTime()) / (1000 * 3600 * 24);
        cloturesCount++;
      }
    });

    newStats.temps_moyen_traitement = cloturesCount > 0 
      ? Math.round(totalTraitementJours / cloturesCount) 
      : 0;

    setStats(newStats);
  };

  const chargerDonneesMensuelles = async () => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    
    const { data, error } = await supabase
      .from('sinistres')
      .select('created_at, statut, montant_estime')
      .eq('assure_id', user?.id)
      .gte('created_at', sixMonthsAgo.toISOString());

    if (error) throw error;

    const monthlyMap = new Map<string, MonthlyData>();

    // Initialiser les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const key = format(date, 'yyyy-MM');
      monthlyMap.set(key, {
        mois: format(date, 'MMM yyyy', { locale: fr }),
        declarations: 0,
        clotures: 0,
        montant: 0,
      });
    }

    data.forEach(s => {
      const key = format(new Date(s.created_at), 'yyyy-MM');
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.declarations++;
        existing.montant += s.montant_estime || 0;
        if (s.statut === 'cloture') {
          existing.clotures++;
        }
      }
    });

    setMonthlyData(Array.from(monthlyMap.values()));
  };

  const chargerDistributionTypes = async () => {
    const { data, error } = await supabase
      .from('sinistres')
      .select('type_sinistre')
      .eq('assure_id', user?.id);

    if (error) throw error;

    const typeMap = new Map<string, number>();
    const typeIcons: Record<string, string> = {
      accident_auto: '🚗',
      vol: '🔫',
      incendie: '🔥',
      degats_eau: '💧',
      catastrophe_naturelle: '🌪️',
      bris_glace: '🪟',
      responsabilite_civile: '⚖️',
      autre: '📋',
    };

    data.forEach(s => {
      typeMap.set(s.type_sinistre, (typeMap.get(s.type_sinistre) || 0) + 1);
    });

    const distribution = Array.from(typeMap.entries()).map(([name, value]) => ({
      name: typeIcons[name] || '📋',
      value,
      icon: typeIcons[name] || '📋',
    }));

    setTypeDistribution(distribution);
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      maximumFractionDigits: 0,
    }).format(montant);
  };

  const statutData = Object.entries(STATUT_LABELS).map(([key, label]) => ({
    name: label,
    value: (stats as any)[key] || 0,
    color: STATUT_COLORS[key],
  }));

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Retour aux sinistres
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-sm text-gray-500">
                Vue d'ensemble de vos sinistres
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-3 h-5 w-5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total sinistres"
            value={stats.total}
            icon={FaFileAlt}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="En cours"
            value={stats.en_cours + stats.expertise + stats.en_indemnisation}
            icon={FaClock}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
            subtitle={`${stats.en_attente} en attente`}
          />
          <StatCard
            title="Clôturés"
            value={stats.cloture}
            icon={FaCheckCircle}
            color="text-green-600"
            bgColor="bg-green-50"
            subtitle={`${stats.refuse} refusés`}
          />
          <StatCard
            title="Montant total"
            value={formatMontant(stats.montant_total_estime)}
            icon={FaMoneyBillWave}
            color="text-purple-600"
            bgColor="bg-purple-50"
            subtitle={stats.temps_moyen_traitement > 0 ? `Délai moyen: ${stats.temps_moyen_traitement}j` : undefined}
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Répartition par statut */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartPie className="mr-2 h-5 w-5 text-blue-500" />
              Répartition par statut
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statutData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution mensuelle */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-green-500" />
              Évolution mensuelle
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="declarations"
                  name="Déclarations"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="clotures"
                  name="Clôtures"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution par type */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartBar className="mr-2 h-5 w-5 text-purple-500" />
              Distribution par type
            </h3>
            {typeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="icon" tick={{ fontSize: 20 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Nombre" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">Aucune donnée disponible</p>
              </div>
            )}
          </div>

          {/* Montants mensuels */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-orange-500" />
              Montants estimés par mois
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="montant"
                  name="Montant (CDF)"
                  fill="#F97316"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Barre de statut en bas */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progression globale</h3>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            {Object.entries(STATUT_COLORS).map(([key, color]) => {
              const count = (stats as any)[key] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return percentage > 0 ? (
                <div
                  key={key}
                  className="h-full float-left"
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
      </div>
    </div>
  );
}