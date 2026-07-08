
// // app/admin/souscriptions/page.tsx
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import {
//   FaFileContract, FaPlus, FaSearch, FaTimes, FaExclamationTriangle,
//   FaCheckCircle, FaUser, FaCalendarAlt, FaUpload, FaTrash, FaEye,
//   FaSpinner, FaCar, FaFire, FaShip, FaBuilding, FaHeart, FaShieldAlt,
//   FaBan, FaRedo, FaVenusMars, FaBriefcase, FaMapMarkerAlt, FaBirthdayCake,
//   FaUserPlus, FaList, FaChevronDown, FaChevronRight, FaIdCard, FaLayerGroup
// } from 'react-icons/fa';
// import { 
//   getAssures, 
//   getTypesAssurance, 
//   createSouscription, 
//   deleteSouscription, 
//   updateSouscriptionStatus,
//   uploadSouscriptionDocument,
//   TypeAssurance,
//   AssureInfo
// } from './action';

// type Assure = AssureInfo;

// const TYPES_ASSURANCE_ICONS: Record<string, any> = {
//   automobile: FaCar, incendie: FaFire, transport: FaShip, rc: FaBuilding, vie: FaHeart,
// };

// const TYPES_COLORS: Record<string, string> = {
//   automobile: 'bg-blue-100 text-blue-800 border-blue-200',
//   incendie: 'bg-red-100 text-red-800 border-red-200',
//   transport: 'bg-teal-100 text-teal-800 border-teal-200',
//   rc: 'bg-purple-100 text-purple-800 border-purple-200',
//   vie: 'bg-pink-100 text-pink-800 border-pink-200',
// };

// const DOCUMENTS_REQUIS: Record<string, { nom: string; obligatoire: boolean }[]> = {
//   automobile: [
//     { nom: 'Carte rose', obligatoire: true }, { nom: 'Permis de conduire', obligatoire: true },
//     { nom: "Pièce d'identité", obligatoire: true }, { nom: "Facture d'achat", obligatoire: false },
//   ],
//   incendie: [
//     { nom: 'Titre de propriété', obligatoire: true }, { nom: 'Plan de construction', obligatoire: false },
//     { nom: "Rapport d'évaluation", obligatoire: true }, { nom: 'Inventaire valorisé', obligatoire: false },
//   ],
//   transport: [
//     { nom: 'Facture commerciale', obligatoire: true }, { nom: 'Titre de transport', obligatoire: true },
//     { nom: 'Liste de colisage', obligatoire: true },
//   ],
//   rc: [
//     { nom: 'RCCM', obligatoire: true }, { nom: 'ID Nat', obligatoire: true },
//     { nom: "Statuts de l'entreprise", obligatoire: true },
//   ],
//   vie: [
//     { nom: "Pièce d'identité", obligatoire: true }, { nom: 'Questionnaire médical', obligatoire: true },
//   ],
// };

// const MODES_PAIEMENT = [
//   { value: 'mensuel', label: 'Mensuel', multiplicateur: 1.1 },
//   { value: 'trimestriel', label: 'Trimestriel', multiplicateur: 1.05 },
//   { value: 'semestriel', label: 'Semestriel', multiplicateur: 1.02 },
//   { value: 'annuel', label: 'Annuel', multiplicateur: 1 },
// ];

// const PRIMES_BASE: Record<string, number> = {
//   automobile: 50000, incendie: 75000, transport: 100000, rc: 150000, vie: 200000,
// };

// const calculerAge = (dateNaissance: string): number | null => {
//   if (!dateNaissance) return null;
//   const aujourdhui = new Date();
//   const naissance = new Date(dateNaissance);
//   let age = aujourdhui.getFullYear() - naissance.getFullYear();
//   const mois = aujourdhui.getMonth() - naissance.getMonth();
//   if (mois < 0 || (mois === 0 && aujourdhui.getDate() < naissance.getDate())) age--;
//   return age;
// };

// const formatDate = (dateString: string) => {
//   if (!dateString) return '-';
//   return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// const formatMontant = (montant: number) => {
//   return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF' }).format(montant);
// };

// const getStatutBadge = (statut: string) => {
//   const badges: Record<string, string> = {
//     active: 'bg-green-100 text-green-800', suspendue: 'bg-yellow-100 text-yellow-800',
//     resiliee: 'bg-red-100 text-red-800', expiree: 'bg-gray-100 text-gray-800',
//   };
//   return badges[statut] || 'bg-gray-100';
// };

// const getSexeLabel = (sexe?: string) => {
//   const labels: Record<string, string> = { M: 'M', F: 'F', autre: 'Autre' };
//   return sexe ? labels[sexe] || sexe : '-';
// };

// const getNumeroPrefix = (numero: string) => {
//   const prefix = numero.substring(0, 2);
//   if (prefix === '10') return { label: 'Simple', color: 'text-blue-600 bg-blue-50' };
//   if (prefix === '12') return { label: 'Multiple', color: 'text-orange-600 bg-orange-50' };
//   return { label: prefix, color: 'text-gray-600 bg-gray-50' };
// };

// export default function SouscriptionsPage() {
//   const { user } = useAuth();
//   const [assures, setAssures] = useState<Assure[]>([]);
//   const [filteredAssures, setFilteredAssures] = useState<Assure[]>([]);
//   const [typesAssurance, setTypesAssurance] = useState<TypeAssurance[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filtreType, setFiltreType] = useState<string>('tous');
//   const [expandedAssures, setExpandedAssures] = useState<Set<string>>(new Set());
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [detailAssure, setDetailAssure] = useState<Assure | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [modeAjout, setModeAjout] = useState<'nouveau' | 'existant'>('nouveau');
//   const [selectedAssure, setSelectedAssure] = useState<Assure | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [selectedType, setSelectedType] = useState<TypeAssurance | null>(null);
//   const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
//   const [formData, setFormData] = useState({
//     email: '', nom: '', telephone: '', mot_de_passe: '',
//     date_naissance: '', sexe: '', profession: '', adresse: '',
//     type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
//   });
//   const [stats, setStats] = useState({ totalAssures: 0, totalSouscriptions: 0, actives: 0, multiAssures: 0 });

//   // Chargement
//   const chargerDonnees = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [assuresData, typesData] = await Promise.all([getAssures(), getTypesAssurance()]);
//       setAssures(assuresData);
//       setTypesAssurance(typesData);
//       let totalSouscriptions = 0, actives = 0;
//       assuresData.forEach(a => {
//         a.souscriptions.forEach(s => { totalSouscriptions++; if (s.statut === 'active') actives++; });
//       });
//       setStats({
//         totalAssures: assuresData.length,
//         totalSouscriptions,
//         actives,
//         multiAssures: assuresData.filter(a => a.nombre_assurances >= 2).length,
//       });
//     } catch (err: any) {
//       setError(err.message || 'Erreur de chargement');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { if (user) chargerDonnees(); }, [user, chargerDonnees]);

//   // Filtres
//   useEffect(() => {
//     let filtered = [...assures];
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(a =>
//         a.nom?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term) ||
//         a.souscriptions.some(s => s.numero_assure?.toLowerCase().includes(term))
//       );
//     }
//     if (filtreType !== 'tous') {
//       filtered = filtered.filter(a => a.souscriptions.some(s => s.type_assurance_code === filtreType && s.statut !== 'resiliee'));
//     }
//     setFilteredAssures(filtered);
//   }, [assures, searchTerm, filtreType]);

//   const toggleExpand = (assureId: string) => {
//     setExpandedAssures(prev => {
//       const newSet = new Set(prev);
//       newSet.has(assureId) ? newSet.delete(assureId) : newSet.add(assureId);
//       return newSet;
//     });
//   };
// // Remplace temporairement handleNouvelAssure par :
// const handleNouvelAssure = () => {
//   alert('Bouton cliqué !'); // ← Test simple
//   console.log('handleNouvelAssure appelé');
  
//   setModeAjout('nouveau');
//   setSelectedAssure(null);
//   setFormData({
//     email: '', nom: '', telephone: '', mot_de_passe: '',
//     date_naissance: '', sexe: '', profession: '', adresse: '',
//     type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
//   });
//   setSelectedType(null);
//   setUploadedFiles({});
//   setShowModal(true);
//   setError(null);
// };
//   // const handleNouvelAssure = () => {
//   //   setModeAjout('nouveau'); setSelectedAssure(null);
//   //   setFormData({ email: '', nom: '', telephone: '', mot_de_passe: '', date_naissance: '', sexe: '', profession: '', adresse: '', type_assurance_id: '', prime: 0, mode_paiement: 'annuel' });
//   //   setSelectedType(null); setUploadedFiles({}); setShowModal(true); setError(null);
//   // };

//   const handleAjoutAssurance = (assure: Assure) => {
//     setModeAjout('existant'); setSelectedAssure(assure);
//     setFormData({
//       email: assure.email, nom: assure.nom, telephone: assure.telephone || '', mot_de_passe: '',
//       date_naissance: assure.date_naissance || '', sexe: assure.sexe || '', profession: assure.profession || '',
//       adresse: assure.adresse || '', type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
//     });
//     setSelectedType(null); setUploadedFiles({}); setShowModal(true); setError(null);
//   };

//   const handleTypeChange = (typeId: string) => {
//     const type = typesAssurance.find(t => t.id === typeId);
//     setSelectedType(type || null);
//     setFormData({ ...formData, type_assurance_id: typeId, prime: type ? PRIMES_BASE[type.code] || 50000 : 0 });
//     setUploadedFiles({});
//   };

//   const handleModePaiementChange = (mode: string) => {
//     const modeInfo = MODES_PAIEMENT.find(m => m.value === mode);
//     if (selectedType && modeInfo) {
//       setFormData({ ...formData, mode_paiement: mode, prime: Math.round((PRIMES_BASE[selectedType.code] || 50000) * modeInfo.multiplicateur) });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.type_assurance_id) { setError('Veuillez sélectionner un type d\'assurance'); return; }
//     if (modeAjout === 'nouveau' && !formData.mot_de_passe) { setError('Le mot de passe est obligatoire'); return; }

//     setSaving(true); setError(null);
//     try {
//       const result = await createSouscription({
//         assure_id: modeAjout === 'existant' ? selectedAssure?.id : undefined,
//         email: formData.email, nom: formData.nom, telephone: formData.telephone || undefined,
//         mot_de_passe: formData.mot_de_passe || undefined,
//         date_naissance: formData.date_naissance || undefined,
//         sexe: formData.sexe || undefined, profession: formData.profession || undefined,
//         adresse: formData.adresse || undefined,
//         type_assurance_id: formData.type_assurance_id,
//         prime: formData.prime, mode_paiement: formData.mode_paiement,
//       });

//       for (const [docNom, file] of Object.entries(uploadedFiles)) {
//         await uploadSouscriptionDocument(result.souscription.id, docNom, file,
//           DOCUMENTS_REQUIS[selectedType?.code || '']?.find(d => d.nom === docNom)?.obligatoire || false
//         );
//       }

//       setSuccess(modeAjout === 'existant' ? 'Nouvelle assurance ajoutée !' : 'Souscription créée !');
//       setShowModal(false);
//       await chargerDonnees();
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: any) {
//       setError(err.message || 'Erreur');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleStatusChange = async (id: string, newStatus: string) => {
//     try {
//       await updateSouscriptionStatus(id, newStatus);
//       await chargerDonnees();
//       setSuccess(`Statut mis à jour : ${newStatus}`);
//       setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const handleDelete = async (souscriptionId: string) => {
//     if (!confirm('Supprimer cette souscription ?')) return;
//     try {
//       await deleteSouscription(souscriptionId);
//       await chargerDonnees();
//       setSuccess('Souscription supprimée.');
//       setTimeout(() => setSuccess(null), 2000);
//     } catch (err: any) { setError(err.message); }
//   };

//   const getTypeIcon = (code: string) => {
//     const Icon = TYPES_ASSURANCE_ICONS[code] || FaShieldAlt;
//     return <Icon className="h-4 w-4" />;
//   };

//   // ==================== RENDU ====================

//   if (user?.role !== 'admin') {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8 text-center">
//         <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
//         <h3 className="mt-2 text-lg font-medium">Accès non autorisé</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* En-tête */}
//       <div className="sm:flex sm:items-center sm:justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//             <FaFileContract className="mr-3 h-6 w-6 text-blue-600" />
//             Gestion des Souscriptions
//           </h1>
//           <p className="mt-2 text-sm text-gray-700">Gérez les assurés et leurs contrats</p>
//         </div>
//         <button onClick={handleNouvelAssure}
//           className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
//           <FaPlus className="mr-2 h-4 w-4" />Nouvelle souscription
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
//         <div className="rounded-lg bg-white p-4 shadow-sm border"><p className="text-sm text-gray-500">Assurés</p><p className="text-2xl font-semibold">{stats.totalAssures}</p></div>
//         <div className="rounded-lg bg-blue-50 p-4 shadow-sm border border-blue-200"><p className="text-sm text-blue-700">Souscriptions</p><p className="text-2xl font-semibold text-blue-800">{stats.totalSouscriptions}</p></div>
//         <div className="rounded-lg bg-green-50 p-4 shadow-sm border border-green-200"><p className="text-sm text-green-700">Actives</p><p className="text-2xl font-semibold text-green-800">{stats.actives}</p></div>
//         <div className="rounded-lg bg-orange-50 p-4 shadow-sm border border-orange-200"><p className="text-sm text-orange-700">Multi-assurances</p><p className="text-2xl font-semibold text-orange-800">{stats.multiAssures}</p></div>
//       </div>

//       {/* Messages */}
//       {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaExclamationTriangle className="h-5 w-5 text-red-400 flex-shrink-0" /><p className="ml-3 text-sm text-red-700">{error}</p><button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button></div>}
//       {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" /><p className="ml-3 text-sm text-green-700">{success}</p><button onClick={() => setSuccess(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-green-500" /></button></div>}

//       {/* Filtres */}
//       <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm" /></div>
//           <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="tous">Tous les types</option>{typesAssurance.map(t => <option key={t.id} value={t.code}>{t.nom}</option>)}</select>
//           <div className="flex items-center text-sm text-gray-500">{filteredAssures.length} assuré(s)</div>
//         </div>
//       </div>

//       {/* Liste */}
//       {loading ? (
//         <div className="text-center py-12 bg-white rounded-lg border"><FaSpinner className="mx-auto h-12 w-12 text-gray-400 animate-spin" /><p className="mt-2 text-gray-500">Chargement...</p></div>
//       ) : filteredAssures.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg border"><FaUser className="mx-auto h-12 w-12 text-gray-300" /><p className="mt-2 text-gray-500">Aucun assuré trouvé</p></div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAssures.map(assure => {
//             const isExpanded = expandedAssures.has(assure.id);
//             return (
//               <div key={assure.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
//                 <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(assure.id)}>
//                   <div className="flex items-center space-x-4">
//                     <button className="text-gray-400">{isExpanded ? <FaChevronDown className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}</button>
//                     <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center"><FaUser className="h-5 w-5 text-orange-600" /></div>
//                     <div>
//                       <p className="font-medium text-gray-900">{assure.nom}</p>
//                       <p className="text-xs text-gray-500">{assure.email}</p>
//                     </div>
//                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${assure.nombre_assurances >= 3 ? 'bg-orange-100 text-orange-800' : assure.nombre_assurances >= 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
//                       <FaLayerGroup className="mr-1 h-3 w-3" />{assure.nombre_assurances} contrat{assure.nombre_assurances > 1 ? 's' : ''}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button onClick={(e) => { e.stopPropagation(); setDetailAssure(assure); setShowDetailModal(true); }} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"><FaEye className="mr-1 h-3 w-3" />Détail</button>
//                     <button onClick={(e) => { e.stopPropagation(); handleAjoutAssurance(assure); }} className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"><FaPlus className="mr-1 h-3 w-3" />Ajouter</button>
//                   </div>
//                 </div>
//                 {isExpanded && (
//                   <div className="border-t">
//                     {assure.souscriptions.length === 0 ? (
//                       <p className="p-4 text-sm text-gray-500 text-center">Aucune souscription</p>
//                     ) : (
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">N° Assuré</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Prime</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Expiration</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Statut</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th></tr></thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {assure.souscriptions.map(souscr => {
//                             const isExpired = new Date(souscr.date_expiration) < new Date();
//                             const prefixInfo = getNumeroPrefix(souscr.numero_assure);
//                             return (
//                               <tr key={souscr.id} className="hover:bg-gray-50">
//                                 <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${prefixInfo.color}`}>{prefixInfo.label}</span><span className="ml-1 text-sm font-mono font-semibold text-blue-600">{souscr.numero_assure}</span></td>
//                                 <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPES_COLORS[souscr.type_assurance_code || ''] || ''}`}>{getTypeIcon(souscr.type_assurance_code || '')}<span className="ml-1">{souscr.type_assurance_nom}</span></span></td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-sm"><span className="font-medium">{formatMontant(souscr.prime)}</span><span className="text-xs text-gray-500 block">{souscr.mode_paiement}</span></td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-sm"><FaCalendarAlt className={`inline mr-1 h-3 w-3 ${isExpired ? 'text-red-500' : 'text-gray-400'}`} /><span className={isExpired ? 'text-red-600 font-medium' : 'text-gray-500'}>{formatDate(souscr.date_expiration)}</span></td>
//                                 <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(souscr.statut)}`}>{souscr.statut}</span></td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-right">
//                                   <div className="flex items-center justify-end space-x-1">
//                                     {souscr.statut === 'active' && <button onClick={() => handleStatusChange(souscr.id, 'suspendue')} className="text-yellow-600 hover:bg-yellow-50 p-1 rounded" title="Suspendre"><FaBan className="h-3.5 w-3.5" /></button>}
//                                     {souscr.statut === 'suspendue' && <button onClick={() => handleStatusChange(souscr.id, 'active')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Réactiver"><FaRedo className="h-3.5 w-3.5" /></button>}
//                                     <button onClick={() => handleDelete(souscr.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Supprimer"><FaTrash className="h-3.5 w-3.5" /></button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Modal Nouvelle Souscription */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
//             <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold flex items-center">
//                   {modeAjout === 'existant' ? <><FaLayerGroup className="mr-2 h-5 w-5 text-green-600" />Ajouter une assurance - {selectedAssure?.nom}</> : <><FaUserPlus className="mr-2 h-5 w-5 text-blue-600" />Nouvelle souscription</>}
//                 </h3>
//                 <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
//               </div>
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {modeAjout === 'nouveau' && (
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h4 className="font-medium mb-3"><FaUser className="inline mr-1 h-4 w-4" />Profil de l'assuré</h4>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
//                       <div><label className="block text-sm font-medium mb-1">Nom complet *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
//                       <div><label className="block text-sm font-medium mb-1">Téléphone</label><input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
//                       <div><label className="block text-sm font-medium mb-1">Mot de passe *</label><input type="password" value={formData.mot_de_passe} onChange={(e) => setFormData({...formData, mot_de_passe: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
//                       <div><label className="block text-sm font-medium mb-1"><FaBirthdayCake className="inline mr-1 h-3 w-3" />Date naissance</label><input type="date" value={formData.date_naissance} onChange={(e) => setFormData({...formData, date_naissance: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
//                       <div><label className="block text-sm font-medium mb-1"><FaVenusMars className="inline mr-1 h-3 w-3" />Sexe</label><select value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm"><option value="">Sélectionner</option><option value="M">Masculin</option><option value="F">Féminin</option><option value="autre">Autre</option></select></div>
//                       <div><label className="block text-sm font-medium mb-1"><FaBriefcase className="inline mr-1 h-3 w-3" />Profession</label><input type="text" value={formData.profession} onChange={(e) => setFormData({...formData, profession: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
//                       <div><label className="block text-sm font-medium mb-1"><FaMapMarkerAlt className="inline mr-1 h-3 w-3" />Adresse</label><input type="text" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Type d'assurance *</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {typesAssurance.map(type => {
//                       const Icon = TYPES_ASSURANCE_ICONS[type.code] || FaShieldAlt;
//                       const dejaSouscrit = modeAjout === 'existant' && selectedAssure?.souscriptions.some(s => s.type_assurance_id === type.id && s.statut !== 'resiliee');
//                       return (
//                         <button key={type.id} type="button" onClick={() => !dejaSouscrit && handleTypeChange(type.id)} disabled={dejaSouscrit}
//                           className={`p-3 text-left rounded-lg border-2 transition-all ${dejaSouscrit ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : formData.type_assurance_id === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
//                           <div className="flex items-center"><Icon className={`h-5 w-5 ${formData.type_assurance_id === type.id ? 'text-blue-600' : 'text-gray-400'}`} /><span className="ml-2 font-medium text-sm">{type.nom}</span>{dejaSouscrit && <span className="ml-auto text-xs text-red-500">Déjà souscrit</span>}</div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 {selectedType && (
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <div><label className="block text-sm font-medium mb-1">Prime (CDF)</label><input type="number" value={formData.prime} onChange={(e) => setFormData({...formData, prime: Number(e.target.value)})} className="block w-full rounded-md border-gray-300 p-2 border text-sm font-semibold" /></div>
//                       <div><label className="block text-sm font-medium mb-1">Paiement</label><select value={formData.mode_paiement} onChange={(e) => handleModePaiementChange(e.target.value)} className="block w-full rounded-md border-gray-300 p-2 border text-sm">{MODES_PAIEMENT.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">Expire le {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('fr-FR')}</p>
//                   </div>
//                 )}
//                 {selectedType && (
//                   <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
//                     <h4 className="font-medium mb-2"><FaUpload className="inline mr-1 h-4 w-4 text-yellow-600" />Documents (* obligatoire)</h4>
//                     <div className="space-y-2">
//                       {DOCUMENTS_REQUIS[selectedType.code]?.map(doc => (
//                         <div key={doc.nom} className="flex items-center justify-between bg-white rounded-md p-2 border">
//                           <span className="text-sm">{doc.nom}{doc.obligatoire && <span className="text-red-500 ml-1">*</span>}</span>
//                           <div>
//                             {uploadedFiles[doc.nom] ? (
//                               <div className="flex items-center"><span className="text-xs text-green-600 mr-2">{uploadedFiles[doc.nom].name.substring(0, 15)}...</span><button type="button" onClick={() => { setUploadedFiles(prev => { const n = {...prev}; delete n[doc.nom]; return n; }); }} className="text-red-500"><FaTrash className="h-3 w-3" /></button></div>
//                             ) : (
//                               <label className="cursor-pointer inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"><FaUpload className="mr-1 h-3 w-3" />Upload<input type="file" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) setUploadedFiles(prev => ({...prev, [doc.nom]: e.target.files![0]})); }} /></label>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex space-x-3 pt-2">
//                   <button type="submit" disabled={saving} className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
//                     {saving ? <><FaSpinner className="animate-spin mr-2 h-4 w-4" />En cours...</> : <><FaPlus className="mr-2 h-4 w-4" />{modeAjout === 'existant' ? "Ajouter l'assurance" : 'Créer la souscription'}</>}
//                   </button>
//                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Détail Assuré */}
//       {showDetailModal && detailAssure && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
//             <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold flex items-center"><FaIdCard className="mr-2 h-5 w-5 text-blue-600" />Détail de l'assuré</h3>
//                 <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                 <h4 className="font-semibold text-gray-900 mb-3"><FaUser className="mr-2 h-4 w-4 text-gray-600" />Informations personnelles</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div><p className="text-xs text-gray-500">Nom complet</p><p className="font-medium">{detailAssure.nom}</p></div>
//                   <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-blue-600">{detailAssure.email}</p></div>
//                   {detailAssure.telephone && <div><p className="text-xs text-gray-500">Téléphone</p><p className="font-medium">{detailAssure.telephone}</p></div>}
//                   {detailAssure.date_naissance && <div><p className="text-xs text-gray-500">Date de naissance</p><p className="font-medium">{formatDate(detailAssure.date_naissance)} ({calculerAge(detailAssure.date_naissance)} ans)</p></div>}
//                   {detailAssure.sexe && <div><p className="text-xs text-gray-500">Sexe</p><p className="font-medium">{getSexeLabel(detailAssure.sexe)}</p></div>}
//                   {detailAssure.profession && <div><p className="text-xs text-gray-500">Profession</p><p className="font-medium">{detailAssure.profession}</p></div>}
//                   {detailAssure.adresse && <div className="col-span-2"><p className="text-xs text-gray-500">Adresse</p><p className="font-medium">{detailAssure.adresse}</p></div>}
//                 </div>
//               </div>
//               <h4 className="font-semibold text-gray-900 mb-3"><FaList className="mr-2 h-4 w-4 text-gray-600" />Contrats d'assurance</h4>
//               <div className="space-y-2">
//                 {detailAssure.souscriptions.map(souscr => (
//                   <div key={souscr.id} className="border rounded-lg p-3">
//                     <div className="flex items-center justify-between">
//                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPES_COLORS[souscr.type_assurance_code || ''] || ''}`}>{getTypeIcon(souscr.type_assurance_code || '')}<span className="ml-1">{souscr.type_assurance_nom}</span></span>
//                       <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(souscr.statut)}`}>{souscr.statut}</span>
//                     </div>
//                     <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
//                       <div>Prime: <span className="font-medium">{formatMontant(souscr.prime)}</span></div>
//                       <div>Paiement: {souscr.mode_paiement}</div>
//                       <div>Expire: <span className={new Date(souscr.date_expiration) < new Date() ? 'text-red-600 font-medium' : ''}>{formatDate(souscr.date_expiration)}</span></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-6 flex justify-end">
//                 <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">Fermer</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// app/admin/souscriptions/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FaFileContract, FaPlus, FaSearch, FaTimes, FaExclamationTriangle,
  FaCheckCircle, FaUser, FaCalendarAlt, FaUpload, FaTrash, FaEye,
  FaSpinner, FaCar, FaFire, FaShip, FaBuilding, FaHeart, FaShieldAlt,
  FaBan, FaRedo, FaVenusMars, FaMapMarkerAlt,
  FaUserPlus, FaList, FaChevronDown, FaChevronRight, FaIdCard, FaLayerGroup
} from 'react-icons/fa';
import { 
  getAssures, 
  getTypesAssurance, 
  createSouscription, 
  deleteSouscription, 
  updateSouscriptionStatus,
  uploadSouscriptionDocument,
  TypeAssurance,
  AssureInfo
} from './action';

type Assure = AssureInfo;

const TYPES_ASSURANCE_ICONS: Record<string, any> = {
  automobile: FaCar, incendie: FaFire, transport: FaShip, rc: FaBuilding, vie: FaHeart,
};

const TYPES_COLORS: Record<string, string> = {
  automobile: 'bg-blue-100 text-blue-800 border-blue-200',
  incendie: 'bg-red-100 text-red-800 border-red-200',
  transport: 'bg-teal-100 text-teal-800 border-teal-200',
  rc: 'bg-purple-100 text-purple-800 border-purple-200',
  vie: 'bg-pink-100 text-pink-800 border-pink-200',
};

const DOCUMENTS_REQUIS: Record<string, { nom: string; obligatoire: boolean }[]> = {
  automobile: [
    { nom: 'Carte rose', obligatoire: true }, { nom: 'Permis de conduire', obligatoire: true },
    { nom: "Pièce d'identité", obligatoire: true }, { nom: "Facture d'achat", obligatoire: false },
  ],
  incendie: [
    { nom: 'Titre de propriété', obligatoire: true }, { nom: 'Plan de construction', obligatoire: false },
    { nom: "Rapport d'évaluation", obligatoire: true }, { nom: 'Inventaire valorisé', obligatoire: false },
  ],
  transport: [
    { nom: 'Facture commerciale', obligatoire: true }, { nom: 'Titre de transport', obligatoire: true },
    { nom: 'Liste de colisage', obligatoire: true },
  ],
  rc: [
    { nom: 'RCCM', obligatoire: true }, { nom: 'ID Nat', obligatoire: true },
    { nom: "Statuts de l'entreprise", obligatoire: true },
  ],
  vie: [
    { nom: "Pièce d'identité", obligatoire: true }, { nom: 'Questionnaire médical', obligatoire: true },
  ],
};

const MODES_PAIEMENT = [
  { value: 'mensuel', label: 'Mensuel', multiplicateur: 1.1 },
  { value: 'trimestriel', label: 'Trimestriel', multiplicateur: 1.05 },
  { value: 'semestriel', label: 'Semestriel', multiplicateur: 1.02 },
  { value: 'annuel', label: 'Annuel', multiplicateur: 1 },
];

const PRIMES_BASE: Record<string, number> = {
  automobile: 50000, incendie: 75000, transport: 100000, rc: 150000, vie: 200000,
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF' }).format(montant);
};

const getStatutBadge = (statut: string) => {
  const badges: Record<string, string> = {
    active: 'bg-green-100 text-green-800', suspendue: 'bg-yellow-100 text-yellow-800',
    resiliee: 'bg-red-100 text-red-800', expiree: 'bg-gray-100 text-gray-800',
  };
  return badges[statut] || 'bg-gray-100';
};

const getSexeLabel = (sexe?: string) => {
  const labels: Record<string, string> = { M: 'M', F: 'F', autre: 'Autre' };
  return sexe ? labels[sexe] || sexe : '-';
};

const getNumeroPrefix = (numero: string) => {
  const prefix = numero.substring(0, 2);
  if (prefix === '10') return { label: 'Simple', color: 'text-blue-600 bg-blue-50' };
  if (prefix === '12') return { label: 'Multiple', color: 'text-orange-600 bg-orange-50' };
  return { label: prefix, color: 'text-gray-600 bg-gray-50' };
};

export default function SouscriptionsPage() {
  const { user } = useAuth();
  const [assures, setAssures] = useState<Assure[]>([]);
  const [filteredAssures, setFilteredAssures] = useState<Assure[]>([]);
  const [typesAssurance, setTypesAssurance] = useState<TypeAssurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtreType, setFiltreType] = useState<string>('tous');
  const [expandedAssures, setExpandedAssures] = useState<Set<string>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailAssure, setDetailAssure] = useState<Assure | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modeAjout, setModeAjout] = useState<'nouveau' | 'existant'>('nouveau');
  const [selectedAssure, setSelectedAssure] = useState<Assure | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<TypeAssurance | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [formData, setFormData] = useState({
    email: '', nom: '', telephone: '', mot_de_passe: '',
    sexe: '', adresse: '',
    type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
  });
  const [vehiculeData, setVehiculeData] = useState({
    marque_type: '',
    plaque_immatriculation: '',
    numero_chassis: '',
    numero_moteur: '',
    puissance: '',
    annee: new Date().getFullYear(),
    kilometrage: 0,
    valeur: 0,
  });
  const [stats, setStats] = useState({ totalAssures: 0, totalSouscriptions: 0, actives: 0, multiAssures: 0 });

  // Chargement
  const chargerDonnees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assuresData, typesData] = await Promise.all([getAssures(), getTypesAssurance()]);
      setAssures(assuresData);
      setTypesAssurance(typesData);
      let totalSouscriptions = 0, actives = 0;
      assuresData.forEach(a => {
        a.souscriptions.forEach(s => { totalSouscriptions++; if (s.statut === 'active') actives++; });
      });
      setStats({
        totalAssures: assuresData.length,
        totalSouscriptions,
        actives,
        multiAssures: assuresData.filter(a => a.nombre_assurances >= 2).length,
      });
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) chargerDonnees(); }, [user, chargerDonnees]);

  // Filtres
  useEffect(() => {
    let filtered = [...assures];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.nom?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term) ||
        a.souscriptions.some(s => s.numero_assure?.toLowerCase().includes(term))
      );
    }
    if (filtreType !== 'tous') {
      filtered = filtered.filter(a => a.souscriptions.some(s => s.type_assurance_code === filtreType && s.statut !== 'resiliee'));
    }
    setFilteredAssures(filtered);
  }, [assures, searchTerm, filtreType]);

  const toggleExpand = (assureId: string) => {
    setExpandedAssures(prev => {
      const newSet = new Set(prev);
      newSet.has(assureId) ? newSet.delete(assureId) : newSet.add(assureId);
      return newSet;
    });
  };

  const handleNouvelAssure = () => {
    setModeAjout('nouveau');
    setSelectedAssure(null);
    setFormData({
      email: '', nom: '', telephone: '', mot_de_passe: '',
      sexe: '', adresse: '',
      type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
    });
    setVehiculeData({
      marque_type: '',
      plaque_immatriculation: '',
      numero_chassis: '',
      numero_moteur: '',
      puissance: '',
      annee: new Date().getFullYear(),
      kilometrage: 0,
      valeur: 0,
    });
    setSelectedType(null);
    setUploadedFiles({});
    setShowModal(true);
    setError(null);
  };

  const handleAjoutAssurance = (assure: Assure) => {
    setModeAjout('existant'); setSelectedAssure(assure);
    setFormData({
      email: assure.email, nom: assure.nom, telephone: assure.telephone || '', mot_de_passe: '',
      sexe: assure.sexe || '', adresse: assure.adresse || '',
      type_assurance_id: '', prime: 0, mode_paiement: 'annuel',
    });
    setVehiculeData({
      marque_type: '',
      plaque_immatriculation: '',
      numero_chassis: '',
      numero_moteur: '',
      puissance: '',
      annee: new Date().getFullYear(),
      kilometrage: 0,
      valeur: 0,
    });
    setSelectedType(null); setUploadedFiles({}); setShowModal(true); setError(null);
  };

  const handleTypeChange = (typeId: string) => {
    const type = typesAssurance.find(t => t.id === typeId);
    setSelectedType(type || null);
    setFormData({ ...formData, type_assurance_id: typeId, prime: type ? PRIMES_BASE[type.code] || 50000 : 0 });
    setUploadedFiles({});
  };

  const handleModePaiementChange = (mode: string) => {
    const modeInfo = MODES_PAIEMENT.find(m => m.value === mode);
    if (selectedType && modeInfo) {
      setFormData({ ...formData, mode_paiement: mode, prime: Math.round((PRIMES_BASE[selectedType.code] || 50000) * modeInfo.multiplicateur) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type_assurance_id) { setError('Veuillez sélectionner un type d\'assurance'); return; }
    if (modeAjout === 'nouveau' && !formData.mot_de_passe) { setError('Le mot de passe est obligatoire'); return; }
    
    // Validation véhicule pour assurance automobile
    if (selectedType?.code === 'automobile') {
      if (!vehiculeData.marque_type || !vehiculeData.plaque_immatriculation) {
        setError('La marque et la plaque d\'immatriculation sont obligatoires pour l\'assurance automobile');
        return;
      }
    }

    setSaving(true); setError(null);
    try {
      const result = await createSouscription({
        assure_id: modeAjout === 'existant' ? selectedAssure?.id : undefined,
        email: formData.email, nom: formData.nom, telephone: formData.telephone || undefined,
        mot_de_passe: formData.mot_de_passe || undefined,
        sexe: formData.sexe || undefined,
        adresse: formData.adresse || undefined,
        type_assurance_id: formData.type_assurance_id,
        prime: formData.prime, mode_paiement: formData.mode_paiement,
        vehicule: selectedType?.code === 'automobile' ? vehiculeData : undefined,
      });

      for (const [docNom, file] of Object.entries(uploadedFiles)) {
        await uploadSouscriptionDocument(result.souscription.id, docNom, file,
          DOCUMENTS_REQUIS[selectedType?.code || '']?.find(d => d.nom === docNom)?.obligatoire || false
        );
      }

      setSuccess(modeAjout === 'existant' ? 'Nouvelle assurance ajoutée !' : 'Souscription créée !');
      setShowModal(false);
      await chargerDonnees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateSouscriptionStatus(id, newStatus);
      await chargerDonnees();
      setSuccess(`Statut mis à jour : ${newStatus}`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const handleDelete = async (souscriptionId: string) => {
    if (!confirm('Supprimer cette souscription ?')) return;
    try {
      await deleteSouscription(souscriptionId);
      await chargerDonnees();
      setSuccess('Souscription supprimée.');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) { setError(err.message); }
  };

  const getTypeIcon = (code: string) => {
    const Icon = TYPES_ASSURANCE_ICONS[code] || FaShieldAlt;
    return <Icon className="h-4 w-4" />;
  };

  // ==================== RENDU ====================

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-400" />
        <h3 className="mt-2 text-lg font-medium">Accès non autorisé</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <FaFileContract className="mr-3 h-6 w-6 text-blue-600" />
            Gestion des Souscriptions
          </h1>
          <p className="mt-2 text-sm text-gray-700">Gérez les assurés et leurs contrats</p>
        </div>
        <button onClick={handleNouvelAssure}
          className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <FaPlus className="mr-2 h-4 w-4" />Nouvelle souscription
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm border"><p className="text-sm text-gray-500">Assurés</p><p className="text-2xl font-semibold">{stats.totalAssures}</p></div>
        <div className="rounded-lg bg-blue-50 p-4 shadow-sm border border-blue-200"><p className="text-sm text-blue-700">Souscriptions</p><p className="text-2xl font-semibold text-blue-800">{stats.totalSouscriptions}</p></div>
        <div className="rounded-lg bg-green-50 p-4 shadow-sm border border-green-200"><p className="text-sm text-green-700">Actives</p><p className="text-2xl font-semibold text-green-800">{stats.actives}</p></div>
        <div className="rounded-lg bg-orange-50 p-4 shadow-sm border border-orange-200"><p className="text-sm text-orange-700">Multi-assurances</p><p className="text-2xl font-semibold text-orange-800">{stats.multiAssures}</p></div>
      </div>

      {/* Messages */}
      {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaExclamationTriangle className="h-5 w-5 text-red-400 flex-shrink-0" /><p className="ml-3 text-sm text-red-700">{error}</p><button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button></div>}
      {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" /><p className="ml-3 text-sm text-green-700">{success}</p><button onClick={() => setSuccess(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-green-500" /></button></div>}

      {/* Filtres */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm" /></div>
          <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"><option value="tous">Tous les types</option>{typesAssurance.map(t => <option key={t.id} value={t.code}>{t.nom}</option>)}</select>
          <div className="flex items-center text-sm text-gray-500">{filteredAssures.length} assuré(s)</div>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg border"><FaSpinner className="mx-auto h-12 w-12 text-gray-400 animate-spin" /><p className="mt-2 text-gray-500">Chargement...</p></div>
      ) : filteredAssures.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border"><FaUser className="mx-auto h-12 w-12 text-gray-300" /><p className="mt-2 text-gray-500">Aucun assuré trouvé</p></div>
      ) : (
        <div className="space-y-4">
          {filteredAssures.map(assure => {
            const isExpanded = expandedAssures.has(assure.id);
            return (
              <div key={assure.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(assure.id)}>
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-400">{isExpanded ? <FaChevronDown className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}</button>
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center"><FaUser className="h-5 w-5 text-orange-600" /></div>
                    <div>
                      <p className="font-medium text-gray-900">{assure.nom}</p>
                      <p className="text-xs text-gray-500">{assure.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${assure.nombre_assurances >= 3 ? 'bg-orange-100 text-orange-800' : assure.nombre_assurances >= 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      <FaLayerGroup className="mr-1 h-3 w-3" />{assure.nombre_assurances} contrat{assure.nombre_assurances > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); setDetailAssure(assure); setShowDetailModal(true); }} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"><FaEye className="mr-1 h-3 w-3" />Détail</button>
                    <button onClick={(e) => { e.stopPropagation(); handleAjoutAssurance(assure); }} className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"><FaPlus className="mr-1 h-3 w-3" />Ajouter</button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t">
                    {assure.souscriptions.length === 0 ? (
                      <p className="p-4 text-sm text-gray-500 text-center">Aucune souscription</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">N° Assuré</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Prime</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Expiration</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Statut</th><th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-200">
                          {assure.souscriptions.map(souscr => {
                            const isExpired = new Date(souscr.date_expiration) < new Date();
                            const prefixInfo = getNumeroPrefix(souscr.numero_assure);
                            return (
                              <tr key={souscr.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${prefixInfo.color}`}>{prefixInfo.label}</span><span className="ml-1 text-sm font-mono font-semibold text-blue-600">{souscr.numero_assure}</span></td>
                                <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPES_COLORS[souscr.type_assurance_code || ''] || ''}`}>{getTypeIcon(souscr.type_assurance_code || '')}<span className="ml-1">{souscr.type_assurance_nom}</span></span></td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm"><span className="font-medium">{formatMontant(souscr.prime)}</span><span className="text-xs text-gray-500 block">{souscr.mode_paiement}</span></td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm"><FaCalendarAlt className={`inline mr-1 h-3 w-3 ${isExpired ? 'text-red-500' : 'text-gray-400'}`} /><span className={isExpired ? 'text-red-600 font-medium' : 'text-gray-500'}>{formatDate(souscr.date_expiration)}</span></td>
                                <td className="px-4 py-2 whitespace-nowrap"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(souscr.statut)}`}>{souscr.statut}</span></td>
                                <td className="px-4 py-2 whitespace-nowrap text-right">
                                  <div className="flex items-center justify-end space-x-1">
                                    {souscr.statut === 'active' && <button onClick={() => handleStatusChange(souscr.id, 'suspendue')} className="text-yellow-600 hover:bg-yellow-50 p-1 rounded" title="Suspendre"><FaBan className="h-3.5 w-3.5" /></button>}
                                    {souscr.statut === 'suspendue' && <button onClick={() => handleStatusChange(souscr.id, 'active')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Réactiver"><FaRedo className="h-3.5 w-3.5" /></button>}
                                    <button onClick={() => handleDelete(souscr.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Supprimer"><FaTrash className="h-3.5 w-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nouvelle Souscription */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {modeAjout === 'existant' ? <><FaLayerGroup className="mr-2 h-5 w-5 text-green-600" />Ajouter une assurance - {selectedAssure?.nom}</> : <><FaUserPlus className="mr-2 h-5 w-5 text-blue-600" />Nouvelle souscription</>}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {modeAjout === 'nouveau' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3"><FaUser className="inline mr-1 h-4 w-4" />Profil de l'assuré</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
                      <div><label className="block text-sm font-medium mb-1">Nom complet *</label><input type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
                      <div><label className="block text-sm font-medium mb-1">Téléphone</label><input type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
                      <div><label className="block text-sm font-medium mb-1">Mot de passe *</label><input type="password" value={formData.mot_de_passe} onChange={(e) => setFormData({...formData, mot_de_passe: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" required /></div>
                      <div><label className="block text-sm font-medium mb-1"><FaVenusMars className="inline mr-1 h-3 w-3" />Sexe</label><select value={formData.sexe} onChange={(e) => setFormData({...formData, sexe: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm"><option value="">Sélectionner</option><option value="M">Masculin</option><option value="F">Féminin</option><option value="autre">Autre</option></select></div>
                      <div><label className="block text-sm font-medium mb-1"><FaMapMarkerAlt className="inline mr-1 h-3 w-3" />Adresse</label><input type="text" value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="block w-full rounded-md border-gray-300 p-2 border text-sm" /></div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Type d'assurance *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {typesAssurance.map(type => {
                      const Icon = TYPES_ASSURANCE_ICONS[type.code] || FaShieldAlt;
                      const dejaSouscrit = modeAjout === 'existant' && selectedAssure?.souscriptions.some(s => s.type_assurance_id === type.id && s.statut !== 'resiliee');
                      return (
                        <button key={type.id} type="button" onClick={() => !dejaSouscrit && handleTypeChange(type.id)} disabled={dejaSouscrit}
                          className={`p-3 text-left rounded-lg border-2 transition-all ${dejaSouscrit ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : formData.type_assurance_id === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center"><Icon className={`h-5 w-5 ${formData.type_assurance_id === type.id ? 'text-blue-600' : 'text-gray-400'}`} /><span className="ml-2 font-medium text-sm">{type.nom}</span>{dejaSouscrit && <span className="ml-auto text-xs text-red-500">Déjà souscrit</span>}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedType && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="block text-sm font-medium mb-1">Prime (CDF)</label><input type="number" value={formData.prime} onChange={(e) => setFormData({...formData, prime: Number(e.target.value)})} className="block w-full rounded-md border-gray-300 p-2 border text-sm font-semibold" /></div>
                      <div><label className="block text-sm font-medium mb-1">Paiement</label><select value={formData.mode_paiement} onChange={(e) => handleModePaiementChange(e.target.value)} className="block w-full rounded-md border-gray-300 p-2 border text-sm">{MODES_PAIEMENT.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Expire le {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                
                {/* Formulaire véhicule pour assurance automobile */}
                {selectedType && selectedType.code === 'automobile' && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium mb-3 flex items-center">
                      <FaCar className="mr-2 h-4 w-4 text-green-600" />
                      Informations du véhicule
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Ces informations seront utilisées pour pré-remplir le formulaire de déclaration de sinistre automobile.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Marque et type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={vehiculeData.marque_type}
                          onChange={(e) => setVehiculeData({...vehiculeData, marque_type: e.target.value})}
                          placeholder="Ex: Toyota Corolla"
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Plaque d'immatriculation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={vehiculeData.plaque_immatriculation}
                          onChange={(e) => setVehiculeData({...vehiculeData, plaque_immatriculation: e.target.value.toUpperCase()})}
                          placeholder="Ex: 1234AB01"
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm uppercase"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">N° de châssis</label>
                        <input
                          type="text"
                          value={vehiculeData.numero_chassis}
                          onChange={(e) => setVehiculeData({...vehiculeData, numero_chassis: e.target.value})}
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">N° de moteur</label>
                        <input
                          type="text"
                          value={vehiculeData.numero_moteur}
                          onChange={(e) => setVehiculeData({...vehiculeData, numero_moteur: e.target.value})}
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Puissance</label>
                        <input
                          type="text"
                          value={vehiculeData.puissance}
                          onChange={(e) => setVehiculeData({...vehiculeData, puissance: e.target.value})}
                          placeholder="Ex: 110ch"
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Année</label>
                        <input
                          type="number"
                          value={vehiculeData.annee}
                          onChange={(e) => setVehiculeData({...vehiculeData, annee: parseInt(e.target.value)})}
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Kilométrage</label>
                        <input
                          type="number"
                          value={vehiculeData.kilometrage}
                          onChange={(e) => setVehiculeData({...vehiculeData, kilometrage: parseInt(e.target.value)})}
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Valeur (CDF)</label>
                        <input
                          type="number"
                          value={vehiculeData.valeur}
                          onChange={(e) => setVehiculeData({...vehiculeData, valeur: parseFloat(e.target.value)})}
                          className="block w-full rounded-md border-gray-300 p-2 border text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedType && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-medium mb-2"><FaUpload className="inline mr-1 h-4 w-4 text-yellow-600" />Documents (* obligatoire)</h4>
                    <div className="space-y-2">
                      {DOCUMENTS_REQUIS[selectedType.code]?.map(doc => (
                        <div key={doc.nom} className="flex items-center justify-between bg-white rounded-md p-2 border">
                          <span className="text-sm">{doc.nom}{doc.obligatoire && <span className="text-red-500 ml-1">*</span>}</span>
                          <div>
                            {uploadedFiles[doc.nom] ? (
                              <div className="flex items-center"><span className="text-xs text-green-600 mr-2">{uploadedFiles[doc.nom].name.substring(0, 15)}...</span><button type="button" onClick={() => { setUploadedFiles(prev => { const n = {...prev}; delete n[doc.nom]; return n; }); }} className="text-red-500"><FaTrash className="h-3 w-3" /></button></div>
                            ) : (
                              <label className="cursor-pointer inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"><FaUpload className="mr-1 h-3 w-3" />Upload<input type="file" className="sr-only" onChange={(e) => { if (e.target.files?.[0]) setUploadedFiles(prev => ({...prev, [doc.nom]: e.target.files![0]})); }} /></label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex space-x-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                    {saving ? <><FaSpinner className="animate-spin mr-2 h-4 w-4" />En cours...</> : <><FaPlus className="mr-2 h-4 w-4" />{modeAjout === 'existant' ? "Ajouter l'assurance" : 'Créer la souscription'}</>}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Assuré */}
      {showDetailModal && detailAssure && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center"><FaIdCard className="mr-2 h-5 w-5 text-blue-600" />Détail de l'assuré</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3"><FaUser className="mr-2 h-4 w-4 text-gray-600" />Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Nom complet</p><p className="font-medium">{detailAssure.nom}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-blue-600">{detailAssure.email}</p></div>
                  {detailAssure.telephone && <div><p className="text-xs text-gray-500">Téléphone</p><p className="font-medium">{detailAssure.telephone}</p></div>}
                  {detailAssure.sexe && <div><p className="text-xs text-gray-500">Sexe</p><p className="font-medium">{getSexeLabel(detailAssure.sexe)}</p></div>}
                  {detailAssure.adresse && <div className="col-span-2"><p className="text-xs text-gray-500">Adresse</p><p className="font-medium">{detailAssure.adresse}</p></div>}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-3"><FaList className="mr-2 h-4 w-4 text-gray-600" />Contrats d'assurance</h4>
              <div className="space-y-2">
                {detailAssure.souscriptions.map(souscr => (
                  <div key={souscr.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPES_COLORS[souscr.type_assurance_code || ''] || ''}`}>{getTypeIcon(souscr.type_assurance_code || '')}<span className="ml-1">{souscr.type_assurance_nom}</span></span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(souscr.statut)}`}>{souscr.statut}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>Prime: <span className="font-medium">{formatMontant(souscr.prime)}</span></div>
                      <div>Paiement: {souscr.mode_paiement}</div>
                      <div>Expire: <span className={new Date(souscr.date_expiration) < new Date() ? 'text-red-600 font-medium' : ''}>{formatDate(souscr.date_expiration)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}