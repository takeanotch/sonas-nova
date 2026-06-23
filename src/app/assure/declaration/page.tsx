

// // app/sinistres/declaration/page.tsx
// 'use client';

// import { useState, useEffect, useRef,useCallback } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { 
//   FaFileAlt, FaArrowLeft, FaSave, FaUpload, FaTimes,
//   FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
//   FaCalendarAlt, FaMapMarkerAlt, FaExclamationTriangle,
//   FaSearch, FaChevronDown, FaShieldAlt, FaIdCard, FaTrash
// } from 'react-icons/fa';
// import Link from 'next/link';

// type User = {
//   id: string;
//   email: string;
//   nom: string;
//   role: string;
//   telephone?: string;
//   photo_profil?: string;
// };

// type Souscription = {
//   id: string;
//   numero_assure: string;
//   type_assurance_code: string;
//   type_assurance_nom: string;
//   date_expiration: string;
//   statut: string;
// };

// type TypeSinistreInfo = {
//   value: string;
//   label: string;
//   icon: string;
//   codes_assurance: string[];
// };

// const TYPES_SINISTRE: TypeSinistreInfo[] = [
//   { value: 'accident_auto', label: 'Accident auto', icon: '🚗', codes_assurance: ['automobile'] },
//   { value: 'vol', label: 'Vol', icon: '🔫', codes_assurance: ['automobile', 'incendie', 'rc'] },
//   { value: 'incendie', label: 'Incendie', icon: '🔥', codes_assurance: ['incendie', 'rc'] },
//   { value: 'degats_eau', label: 'Dégâts des eaux', icon: '💧', codes_assurance: ['incendie', 'rc'] },
//   { value: 'catastrophe_naturelle', label: 'Catastrophe naturelle', icon: '🌪️', codes_assurance: ['automobile', 'incendie', 'transport'] },
//   { value: 'bris_glace', label: 'Bris de glace', icon: '🪟', codes_assurance: ['automobile'] },
//   { value: 'responsabilite_civile', label: 'Responsabilité civile', icon: '⚖️', codes_assurance: ['rc'] },
//   { value: 'autre', label: 'Autre', icon: '📋', codes_assurance: [] },
// ];

// function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
//   const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg' };

//   const getInitials = (nom: string) => {
//     return nom.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
//   };

//   return (
//     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
//       {user.photo_profil ? (
//         <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover"
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.style.display = 'none';
//             target.parentElement!.classList.add('bg-orange-600', 'flex', 'items-center', 'justify-center');
//             target.parentElement!.innerHTML = `<span class="text-white font-medium">${getInitials(user.nom)}</span>`;
//           }}
//         />
//       ) : (
//         <div className="w-full h-full bg-orange-600 flex items-center justify-center">
//           <span className="text-white font-medium">{getInitials(user.nom)}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function DeclarationSinistrePage() {
//   const { user } = useAuth();
//   const router = useRouter();
  
//   const [assures, setAssures] = useState<User[]>([]);
//   const [filteredAssures, setFilteredAssures] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
  
//   // Recherche assuré
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
//   const searchRef = useRef<HTMLDivElement>(null);

//   // Souscriptions de l'assuré sélectionné
//   const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
//   const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);
//   const [verificationResult, setVerificationResult] = useState<{
//     contrat_valide: boolean;
//     message: string;
//     type_couvert: boolean;
//   } | null>(null);

//   const [formData, setFormData] = useState({
//     assure_id: user?.role === 'assure' ? user.id : '',
//     souscription_id: '',
//     type_sinistre: '',
//     description: '',
//     date_sinistre: new Date().toISOString().split('T')[0],
//     lieu: '',
//     montant_estime: '',
//   });

//   useEffect(() => {
//     if (user?.role === 'assure') {
//       setFormData(prev => ({ ...prev, assure_id: user.id }));
//       const currentUser: User = {
//         id: user.id, email: user.email || '', nom: user.nom || user.email || '',
//         role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
//       };
//       setSelectedAssure(currentUser);
//       chargerSouscriptions(user.id);
//     } else {
//       chargerAssures();
//     }
//   }, [user]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredAssures(assures);
//     } else {
//       const term = searchTerm.toLowerCase();
//       setFilteredAssures(assures.filter(a => 
//         a.nom?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term) || a.telephone?.includes(term)
//       ));
//     }
//   }, [searchTerm, assures]);

//   // Vérifier la couverture quand souscription ou type changent
//   useEffect(() => {
//     if (formData.souscription_id && formData.type_sinistre) {
//       verifierCouverture();
//     } else {
//       setVerificationResult(null);
//     }
//   }, [formData.souscription_id, formData.type_sinistre]);

//   const chargerAssures = async () => {
//     try {
//       const { data } = await supabase.from('users')
//         .select('id, email, nom, role, telephone, photo_profil')
//         .eq('role', 'assure').order('nom');
//       const users = (data || []).map(u => ({ ...u, role: u.role as string }));
//       setAssures(users);
//       setFilteredAssures(users);
//     } catch (err) {
//       console.error('Erreur chargement assurés:', err);
//     }
//   };

//   // const chargerSouscriptions = async (assureId: string) => {
//   //   setSouscriptionsLoading(true);
//   //   setSouscriptions([]);
//   //   setFormData(prev => ({ ...prev, souscription_id: '' }));
//   //   setVerificationResult(null);

//   //   try {
//   //     const { data, error } = await supabase
//   //       .from('souscriptions')
//   //       .select(`
//   //         id, numero_assure, type_assurance_id, date_expiration, statut,
//   //         type_assurance:types_assurance(code, nom)
//   //       `)
//   //       .eq('assure_id', assureId)
//   //       .eq('statut', 'active');

//   //     if (error) throw error;

//   //     const formatted: Souscription[] = (data || []).map((s: any) => ({
//   //       id: s.id,
//   //       numero_assure: s.numero_assure,
//   //       type_assurance_code: s.type_assurance?.code || '',
//   //       type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
//   //       date_expiration: s.date_expiration,
//   //       statut: s.statut,
//   //     }));

//   //     setSouscriptions(formatted);
//   //   } catch (err) {
//   //     console.error('Erreur chargement souscriptions:', err);
//   //   } finally {
//   //     setSouscriptionsLoading(false);
//   //   }
//   // };


  





//   // app/sinistres/declaration/page.tsx - Fonction chargerSouscriptions corrigée





// const chargerSouscriptions = async (assureId: string) => {
//   setSouscriptionsLoading(true);
//   setSouscriptions([]);
//   setFormData(prev => ({ ...prev, souscription_id: '' }));
//   setVerificationResult(null);

//   try {
//     console.log('=== CHARGEMENT SOUSCRIPTIONS ===');
//     console.log('AssureId:', assureId);

//     // Étape 1: Récupérer les souscriptions avec jointure explicite
//     const { data: souscriptionsData, error } = await supabase
//       .from('souscriptions')
//       .select(`
//         id,
//         numero_assure,
//         type_assurance_id,
//         date_expiration,
//         statut,
//         type_assurance:types_assurance!souscriptions_type_assurance_id_fkey (
//           id,
//           code,
//           nom
//         )
//       `)
//       .eq('assure_id', assureId)
//       .eq('statut', 'active');

//     if (error) {
//       console.error('Erreur requête avec jointure:', error);
      
//       // Fallback: requête simple sans jointure
//       const { data: simpleData, error: simpleError } = await supabase
//         .from('souscriptions')
//         .select('*')
//         .eq('assure_id', assureId)
//         .eq('statut', 'active');

//       if (simpleError) throw simpleError;
      
//       console.log('Données simples récupérées:', simpleData);

//       if (!simpleData || simpleData.length === 0) {
//         console.log('Aucune souscription trouvée');
//         setSouscriptions([]);
//         return;
//       }

//       // Récupérer les types séparément
//       const typeIds = [...new Set(simpleData.map(s => s.type_assurance_id))];
//       const { data: typesData } = await supabase
//         .from('types_assurance')
//         .select('*')
//         .in('id', typeIds);

//       const typesMap = new Map(typesData?.map(t => [t.id, t]) || []);

//       const formatted = simpleData.map(s => {
//         const type = typesMap.get(s.type_assurance_id);
//         return {
//           id: s.id,
//           numero_assure: s.numero_assure || 'N/A',
//           type_assurance_code: type?.code || 'inconnu',
//           type_assurance_nom: type?.nom || 'Type inconnu',
//           date_expiration: s.date_expiration,
//           statut: s.statut,
//         };
//       });

//       console.log('Souscriptions formatées (fallback):', formatted);
//       setSouscriptions(formatted);
//       return;
//     }

//     console.log('Données avec jointure récupérées:', souscriptionsData);

//     if (!souscriptionsData || souscriptionsData.length === 0) {
//       console.log('Aucune souscription trouvée');
//       setSouscriptions([]);
//       return;
//     }

//     // Formater les données avec la jointure
//     const formatted = souscriptionsData.map((s: any) => ({
//       id: s.id,
//       numero_assure: s.numero_assure || 'N/A',
//       type_assurance_code: s.type_assurance?.code || 'inconnu',
//       type_assurance_nom: s.type_assurance?.nom || 'Type inconnu',
//       date_expiration: s.date_expiration,
//       statut: s.statut,
//     }));

//     console.log('Souscriptions formatées (jointure):', formatted);
//     setSouscriptions(formatted);

//   } catch (err: any) {
//     console.error('Erreur finale:', err);
//     setError(`Erreur lors du chargement des contrats: ${err.message}`);
//   } finally {
//     setSouscriptionsLoading(false);
//   }
// };






// const verifierCouverture = useCallback(() => {
//   if (!formData.souscription_id || !formData.type_sinistre) {
//     setVerificationResult(null);
//     return;
//   }

//   const souscription = souscriptions.find(s => s.id === formData.souscription_id);
//   const typeSinistre = TYPES_SINISTRE.find(t => t.value === formData.type_sinistre);
  
//   if (!souscription || !typeSinistre) {
//     setVerificationResult({
//       contrat_valide: false,
//       message: '❌ Contrat ou type de sinistre non trouvé.',
//       type_couvert: false,
//     });
//     return;
//   }

//   const dateExpiration = new Date(souscription.date_expiration);
//   const aujourdhui = new Date();
  
//   if (dateExpiration < aujourdhui) {
//     setVerificationResult({
//       contrat_valide: false,
//       message: '❌ Ce contrat a expiré. Le sinistre ne sera pas couvert.',
//       type_couvert: false,
//     });
//     return;
//   }

//   // Vérifier si le type de sinistre est compatible avec le type d'assurance
//   const typeCouvert = typeSinistre.codes_assurance.length === 0 || 
//     typeSinistre.codes_assurance.includes(souscription.type_assurance_code);

//   setVerificationResult({
//     contrat_valide: true,
//     message: typeCouvert 
//       ? '✅ Votre contrat couvre ce type de sinistre.' 
//       : '⚠️ Ce sinistre n\'est pas couvert par ce contrat. Déclaration possible mais sans garantie de prise en charge.',
//     type_couvert: typeCouvert,
//   });
// }, [formData.souscription_id, formData.type_sinistre, souscriptions]);



// // const verifierCouverture = () => {
// //   const souscription = souscriptions.find(s => s.id === formData.souscription_id);
// //   const typeSinistre = TYPES_SINISTRE.find(t => t.value === formData.type_sinistre);
// //   if (!souscription || !typeSinistre) return;

// //   const dateExpiration = new Date(souscription.date_expiration);
// //   const aujourdhui = new Date();
  
// //   if (dateExpiration < aujourdhui) {
// //     setVerificationResult({
// //       contrat_valide: false,
// //       message: '❌ Ce contrat a expiré. Le sinistre ne sera pas couvert.',
// //       type_couvert: false,
// //     });
// //     return;
// //   }

// //   // Type "autre" toujours accepté, ou vérifier la correspondance
// //   const typeCouvert = typeSinistre.codes_assurance.length === 0 || 
// //     typeSinistre.codes_assurance.includes(souscription.type_assurance_code);

// //   setVerificationResult({
// //     contrat_valide: true,
// //     message: typeCouvert 
// //       ? '✅ Votre contrat couvre ce type de sinistre.' 
// //       : '⚠️ Ce sinistre n\'est pas couvert par ce contrat. Déclaration possible mais sans garantie de prise en charge.',
// //     type_couvert: typeCouvert, // Correction : utiliser la variable définie
// //   });
// // };

//   const getSouscriptionsCompatibles = () => {
//     if (!formData.type_sinistre) return souscriptions;
//     const type = TYPES_SINISTRE.find(t => t.value === formData.type_sinistre);
//     if (!type || type.codes_assurance.length === 0) return souscriptions;
//     return souscriptions.filter(s => type.codes_assurance.includes(s.type_assurance_code));
//   };

//   const souscriptionsCompatibles = getSouscriptionsCompatibles();

//   const handleSelectAssure = (assure: User) => {
//     setSelectedAssure(assure);
//     setFormData({ ...formData, assure_id: assure.id, souscription_id: '', type_sinistre: '' });
//     setSearchTerm('');
//     setShowDropdown(false);
//     chargerSouscriptions(assure.id);
//   };

//   const handleRemoveAssure = () => {
//     setSelectedAssure(null);
//     setFormData({ ...formData, assure_id: '', souscription_id: '', type_sinistre: '' });
//     setSouscriptions([]);
//     setVerificationResult(null);
//     setSearchTerm('');
//   };
// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files && e.target.files.length > 0) {
//     const newFiles = Array.from(e.target.files);
//     setUploadedFiles(prev => [...prev, ...newFiles]);
//   }
// };

//   const removeFile = (index: number) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const generateNumeroDossier = async (): Promise<string> => {
//     const now = new Date();
//     const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    
//     const { data } = await supabase
//       .from('sinistres')
//       .select('numero_dossier')
//       .like('numero_dossier', `${prefix}%`)
//       .order('numero_dossier', { ascending: false })
//       .limit(1);

//     let sequence = 1;
//     if (data && data.length > 0) {
//       const parts = data[0].numero_dossier.split('-');
//       sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
//     }

//     return `${prefix}-${String(sequence).padStart(4, '0')}`;
//   };

//   const uploadDocuments = async (sinistreId: string) => {
//     for (let i = 0; i < uploadedFiles.length; i++) {
//       const file = uploadedFiles[i];
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${sinistreId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
//       setUploadProgress(Math.round(((i + 1) / uploadedFiles.length) * 100));

//       const { error: uploadError } = await supabase.storage
//         .from('sinistres').upload(fileName, file);
//       if (uploadError) continue;

//       const { data: { publicUrl } } = supabase.storage
//         .from('sinistres').getPublicUrl(fileName);

//       let typeDocument = 'autre';
//       const name = file.name.toLowerCase();
//       if (name.includes('police') || name.includes('assurance')) typeDocument = 'police_assurance';
//       else if (name.includes('rapport')) typeDocument = 'rapport_police';
//       else if (file.type.startsWith('image/')) typeDocument = 'photo_dommage';
//       else if (name.includes('facture')) typeDocument = 'facture';
//       else if (name.includes('devis')) typeDocument = 'devis';

//       await supabase.from('sinistre_documents').insert({
//         sinistre_id: sinistreId,
//         type_document: typeDocument,
//         nom_fichier: file.name,
//         url_fichier: publicUrl,
//         taille_fichier: file.size,
//         type_mime: file.type,
//         uploaded_by: user?.id,
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.assure_id || !formData.souscription_id || !formData.type_sinistre || 
//         !formData.description || !formData.date_sinistre || !formData.lieu) {
//       setError('Veuillez remplir tous les champs obligatoires');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const numeroDossier = await generateNumeroDossier();

//       const { data: sinistre, error: sinistreError } = await supabase
//         .from('sinistres')
//         .insert({
//           assure_id: formData.assure_id,
//           souscription_id: formData.souscription_id,
//           numero_dossier: numeroDossier,
//           type_sinistre: formData.type_sinistre,
//           description: formData.description,
//           date_sinistre: formData.date_sinistre,
//           lieu: formData.lieu,
//           montant_estime: formData.montant_estime ? parseFloat(formData.montant_estime) : null,
//           statut: 'en_attente',
//           created_by: user?.id,
//         })
//         .select()
//         .single();

//       if (sinistreError) throw sinistreError;

//       if (uploadedFiles.length > 0) {
//         await uploadDocuments(sinistre.id);
//       }

//       setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
//       setTimeout(() => router.push(`/assure/sinistres/${sinistre.id}`), 2000);

//     } catch (err: any) {
//       setError(err.message || 'Erreur lors de la déclaration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* En-tête */}
//       <div className="mb-8">
//         <Link href="/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
//           <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
//         </Link>
//         <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//           <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
//           Déclaration de Sinistre
//         </h1>
//         <p className="mt-2 text-sm text-gray-700">
//           Remplissez ce formulaire pour déclarer un nouveau sinistre
//         </p>
//       </div>

//       {/* Messages */}
//       {error && (
//         <div className="mb-6 rounded-md bg-red-50 p-4 flex">
//           <FaTimesCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
//           <p className="ml-3 text-sm text-red-700">{error}</p>
//           <button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button>
//         </div>
//       )}
//       {success && (
//         <div className="mb-6 rounded-md bg-green-50 p-4 flex">
//           <FaCheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
//           <p className="ml-3 text-sm text-green-700">{success}</p>
//         </div>
//       )}

//       {/* Formulaire */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Sélection de l'assuré (admin/agent) */}
//           {user?.role !== 'assure' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FaUser className="inline mr-2 h-4 w-4 text-gray-400" /> Assuré *
//               </label>
//               {selectedAssure ? (
//                 <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <div className="flex items-center space-x-3">
//                     <UserAvatar user={selectedAssure} size="md" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{selectedAssure.nom}</p>
//                       <p className="text-xs text-gray-500">{selectedAssure.email}</p>
//                       {selectedAssure.telephone && <p className="text-xs text-gray-400">{selectedAssure.telephone}</p>}
//                     </div>
//                   </div>
//                   <button type="button" onClick={handleRemoveAssure} className="text-gray-400 hover:text-red-500">
//                     <FaTimes className="h-4 w-4" />
//                   </button>
//                 </div>
//               ) : (
//                 <div ref={searchRef} className="relative">
//                   <div className="relative">
//                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input type="text" value={searchTerm}
//                       onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
//                       onFocus={() => setShowDropdown(true)}
//                       placeholder="Rechercher un assuré par nom, email..."
//                       className="block w-full rounded-md border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//                     />
//                   </div>
//                   {showDropdown && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//                       {filteredAssures.length === 0 ? (
//                         <div className="p-4 text-center text-sm text-gray-500">Aucun assuré trouvé</div>
//                       ) : (
//                         filteredAssures.map((assure) => (
//                           <button key={assure.id} type="button" onClick={() => handleSelectAssure(assure)}
//                             className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-left border-b last:border-b-0">
//                             <UserAvatar user={assure} size="sm" />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-gray-900 truncate">{assure.nom}</p>
//                               <p className="text-xs text-gray-500 truncate">{assure.email}</p>
//                             </div>
//                           </button>
//                         ))
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Assuré connecté */}
//           {user?.role === 'assure' && selectedAssure && (
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center space-x-3">
//                 <UserAvatar user={selectedAssure} size="md" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{selectedAssure.nom}</p>
//                   <p className="text-xs text-gray-500">{selectedAssure.email}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Sélection du contrat */}
//           {selectedAssure && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FaIdCard className="inline mr-2 h-4 w-4 text-gray-400" /> Contrat d'assurance *
//               </label>
//               {souscriptionsLoading ? (
//                 <div className="flex items-center text-sm text-gray-500 py-2">
//                   <FaSpinner className="animate-spin mr-2" /> Chargement des contrats...
//                 </div>
//               ) : souscriptions.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
//                   <FaExclamationTriangle className="inline mr-2" />
// Aucun contrat actif trouvé pour votre compte. Veuillez vous rendre dans l'un de nos bureaux pour effectuer une souscription.                </div>
//               ) : (
//                 <select
//                   value={formData.souscription_id}
//                   onChange={(e) => setFormData({ ...formData, souscription_id: e.target.value })}
//                   className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">-- Sélectionnez un contrat --</option>
//                   {souscriptions.map(s => (
//                     <option key={s.id} value={s.id}>
//                       {s.type_assurance_nom} - N° {s.numero_assure} (Expire: {new Date(s.date_expiration).toLocaleDateString('fr-FR')})
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           )}

//         {/* Type de sinistre */}
// {/* Sélection du contrat */}
// {selectedAssure && (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       <FaIdCard className="inline mr-2 h-4 w-4 text-gray-400" /> Contrat d'assurance *
//     </label>
//     {souscriptionsLoading ? (
//       <div className="flex items-center text-sm text-gray-500 py-2">
//         <FaSpinner className="animate-spin mr-2" /> Chargement des contrats...
//       </div>
//     ) : souscriptions.length === 0 ? (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
//         <FaExclamationTriangle className="inline mr-2" />
//         Aucun contrat actif trouvé pour votre compte.
//       </div>
//     ) : (
//       <div>
//         <select
//           value={formData.souscription_id}
//           onChange={(e) => {
//             const selectedId = e.target.value;
//             console.log('Contrat sélectionné:', selectedId);
//             const selected = souscriptions.find(s => s.id === selectedId);
//             console.log('Détails du contrat:', selected);
//             setFormData({ ...formData, souscription_id: selectedId });
//           }}
//           className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//           required
//         >
//           <option value="">-- Sélectionnez un contrat --</option>
//           {souscriptions.map(s => (
//             <option key={s.id} value={s.id}>
//               {s.type_assurance_nom} - N° {s.numero_assure} (Expire: {new Date(s.date_expiration).toLocaleDateString('fr-FR')}) [ID: {s.id}]
//             </option>
//           ))}
//         </select>
        
//         {/* Débogage du contrat sélectionné */}
//         {formData.souscription_id && (
//           <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs">
//             <p className="font-semibold">Contrat sélectionné :</p>
//             {(() => {
//               const selected = souscriptions.find(s => s.id === formData.souscription_id);
//               if (selected) {
//                 return (
//                   <>
//                     <p>✅ ID: {selected.id}</p>
//                     <p>✅ Type: {selected.type_assurance_nom}</p>
//                     <p>✅ Code: {selected.type_assurance_code}</p>
//                     <p>✅ N°: {selected.numero_assure}</p>
//                   </>
//                 );
//               } else {
//                 return (
//                   <p className="text-red-600">
//                     ❌ Aucune souscription trouvée avec l'ID: {formData.souscription_id}
//                   </p>
//                 );
//               }
//             })()}
//           </div>
//         )}
//       </div>
//     )}
//   </div>
// )}

//           {/* Vérification contrat */}
//           {verificationResult && (
//             <div className={`rounded-lg p-4 text-sm flex items-start ${
//               verificationResult.type_couvert 
//                 ? 'bg-green-50 border border-green-200 text-green-700' 
//                 : verificationResult.contrat_valide 
//                 ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
//                 : 'bg-red-50 border border-red-200 text-red-700'
//             }`}>
//               {verificationResult.type_couvert ? <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" /> : 
//                verificationResult.contrat_valide ? <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" /> :
//                <FaTimesCircle className="mr-2 mt-0.5 flex-shrink-0" />}
//               {verificationResult.message}
//             </div>
//           )}

//           {/* Date et lieu */}
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FaCalendarAlt className="inline mr-2 h-4 w-4 text-gray-400" /> Date du sinistre *
//               </label>
//               <input type="date" value={formData.date_sinistre}
//                 onChange={(e) => setFormData({ ...formData, date_sinistre: e.target.value })}
//                 max={new Date().toISOString().split('T')[0]}
//                 className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" required />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <FaMapMarkerAlt className="inline mr-2 h-4 w-4 text-gray-400" /> Lieu du sinistre *
//               </label>
//               <input type="text" value={formData.lieu}
//                 onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
//                 className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="Adresse ou lieu du sinistre" required />
//             </div>
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée *</label>
//             <textarea value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               rows={4}
//               className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//               placeholder="Décrivez les circonstances du sinistre en détail..." required />
//           </div>

//           {/* Montant estimé */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Montant estimé des dommages (optionnel)
//             </label>
//             <div className="relative">
//               <input type="number" value={formData.montant_estime}
//                 onChange={(e) => setFormData({ ...formData, montant_estime: e.target.value })}
//                 className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
//                 placeholder="0" min="0" step="0.01" />
//               <span className="absolute right-3 top-2.5 text-sm text-gray-500">CDF</span>
//             </div>
//           </div>

//           {/* Upload documents */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <FaUpload className="inline mr-2 h-4 w-4 text-gray-400" /> Documents justificatifs
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
//               <div className="space-y-1 text-center">
//                 <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
//                 <div className="flex text-sm text-gray-600">
//                   <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
//                     <span>Télécharger des fichiers</span>
//                     <input type="file" multiple onChange={handleFileChange} className="sr-only"
//                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" />
//                   </label>
//                   <p className="pl-1">ou glisser-déposer</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF, Word, JPG, PNG jusqu'à 10MB</p>
//               </div>
//             </div>
//             {uploadedFiles.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 {uploadedFiles.map((file, index) => (
//                   <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
//                     <div className="flex items-center">
//                       <FaFileAlt className="h-4 w-4 text-blue-500 mr-2" />
//                       <span className="text-sm text-gray-700">{file.name}</span>
//                       <span className="ml-2 text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
//                     </div>
//                     <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
//                       <FaTrash className="h-4 w-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Progression upload */}
//           {uploadProgress > 0 && uploadProgress < 100 && (
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
//             </div>
//           )}

//           {/* Boutons */}
//           <div className="flex space-x-4 pt-4">
//             <button type="submit" disabled={loading}
//               className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
//               {loading ? <><FaSpinner className="animate-spin mr-2 h-4 w-4" /> Déclaration en cours...</> :
//                 <><FaSave className="mr-2 h-4 w-4" /> Déclarer le sinistre</>}
//             </button>
//             <Link href="/sinistres"
//               className="flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
//               Annuler
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// app/sinistres/declaration/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaFileAlt, FaArrowLeft, FaSave, FaUpload, FaTimes,
  FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
  FaCalendarAlt, FaMapMarkerAlt, FaExclamationTriangle,
  FaSearch, FaShieldAlt, FaIdCard, FaTrash, FaBug
} from 'react-icons/fa';
import Link from 'next/link';

type User = {
  id: string;
  email: string;
  nom: string;
  role: string;
  telephone?: string;
  photo_profil?: string;
};

type Souscription = {
  id: string;
  numero_assure: string;
  type_assurance_code: string;
  type_assurance_nom: string;
  date_expiration: string;
  statut: string;
};

type TypeSinistreInfo = {
  value: string;
  label: string;
  icon: string;
  codes_assurance: string[];
};

const TYPES_SINISTRE: TypeSinistreInfo[] = [
  { value: 'accident_auto', label: 'Accident auto', icon: '🚗', codes_assurance: ['automobile'] },
  { value: 'vol', label: 'Vol', icon: '🔫', codes_assurance: ['automobile', 'incendie', 'rc'] },
  { value: 'incendie', label: 'Incendie', icon: '🔥', codes_assurance: ['incendie', 'rc'] },
  { value: 'degats_eau', label: 'Dégâts des eaux', icon: '💧', codes_assurance: ['incendie', 'rc'] },
  { value: 'catastrophe_naturelle', label: 'Catastrophe naturelle', icon: '🌪️', codes_assurance: ['automobile', 'incendie', 'transport'] },
  { value: 'bris_glace', label: 'Bris de glace', icon: '🪟', codes_assurance: ['automobile'] },
  { value: 'responsabilite_civile', label: 'Responsabilité civile', icon: '⚖️', codes_assurance: ['rc'] },
  { value: 'autre', label: 'Autre', icon: '📋', codes_assurance: [] },
];

function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg' };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
      {user.photo_profil ? (
        <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.classList.add('bg-orange-600', 'flex', 'items-center', 'justify-center');
            target.parentElement!.innerHTML = `<span class="text-white font-medium">${getInitials(user.nom)}</span>`;
          }}
        />
      ) : (
        <div className="w-full h-full bg-orange-600 flex items-center justify-center">
          <span className="text-white font-medium">{getInitials(user.nom)}</span>
        </div>
      )}
    </div>
  );
}

export default function DeclarationSinistrePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [assures, setAssures] = useState<User[]>([]);
  const [filteredAssures, setFilteredAssures] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Logs de diagnostic
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };
  
  // Recherche assuré
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Souscriptions de l'assuré sélectionné
  const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
  const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    contrat_valide: boolean;
    message: string;
    type_couvert: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    assure_id: '',
    souscription_id: '',
    type_sinistre: '',
    description: '',
    date_sinistre: new Date().toISOString().split('T')[0],
    lieu: '',
    montant_estime: '',
  });

  useEffect(() => {
    addLog(`=== INITIALISATION ===`);
    addLog(`User connecté: ${user?.email || 'Non connecté'}`);
    addLog(`User ID: ${user?.id || 'N/A'}`);
    addLog(`User role: ${user?.role || 'N/A'}`);
    
    if (user?.role === 'assure' && user.id) {
      addLog(`Mode: Assuré connecté`);
      setFormData(prev => ({ ...prev, assure_id: user.id }));
      const currentUser: User = {
        id: user.id, email: user.email || '', nom: user.nom || user.email || '',
        role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
      };
      setSelectedAssure(currentUser);
      chargerSouscriptions(user.id);
    } else {
      addLog(`Mode: Admin/Agent - chargement des assurés`);
      chargerAssures();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAssures(assures);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredAssures(assures.filter(a => 
        a.nom?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term) || a.telephone?.includes(term)
      ));
    }
  }, [searchTerm, assures]);

  useEffect(() => {
    addLog(`Vérification couverture - souscription_id: ${formData.souscription_id}, type_sinistre: ${formData.type_sinistre}`);
    if (formData.souscription_id && formData.type_sinistre) {
      verifierCouverture();
    } else {
      setVerificationResult(null);
    }
  }, [formData.souscription_id, formData.type_sinistre]);

  const chargerAssures = async () => {
    try {
      addLog('Chargement des assurés...');
      const { data } = await supabase.from('users')
        .select('id, email, nom, role, telephone, photo_profil')
        .eq('role', 'assure').order('nom');
      const users = (data || []).map(u => ({ ...u, role: u.role as string }));
      setAssures(users);
      setFilteredAssures(users);
      addLog(`${users.length} assurés trouvés`);
    } catch (err) {
      addLog(`Erreur chargement assurés: ${err}`);
    }
  };

  const chargerSouscriptions = async (assureId: string) => {
    setSouscriptionsLoading(true);
    setSouscriptions([]);
    setFormData(prev => ({ ...prev, souscription_id: '', type_sinistre: '' }));
    setVerificationResult(null);
    
    addLog(`=== CHARGEMENT SOUSCRIPTIONS ===`);
    addLog(`AssureId: ${assureId}`);

    try {
      const { data: souscriptionsData, error } = await supabase
        .from('souscriptions')
        .select('*')
        .eq('assure_id', assureId)
        .eq('statut', 'active');

      if (error) {
        addLog(`❌ Erreur requête: ${error.message}`);
        throw error;
      }

      addLog(`Souscriptions brutes trouvées: ${souscriptionsData?.length || 0}`);
      
      if (souscriptionsData) {
        souscriptionsData.forEach(s => {
          addLog(`  - ID: ${s.id}, Type ID: ${s.type_assurance_id}, Statut: ${s.statut}`);
        });
      }

      if (!souscriptionsData || souscriptionsData.length === 0) {
        addLog('Aucune souscription active trouvée');
        setSouscriptions([]);
        return;
      }

      const typeIds = [...new Set(souscriptionsData.map(s => s.type_assurance_id))];
      addLog(`Type IDs à récupérer: ${typeIds.join(', ')}`);

      const { data: typesData } = await supabase
        .from('types_assurance')
        .select('*')
        .in('id', typeIds);

      addLog(`Types trouvés: ${typesData?.length || 0}`);
      
      if (typesData) {
        typesData.forEach(t => {
          addLog(`  - ID: ${t.id}, Code: ${t.code}, Nom: ${t.nom}`);
        });
      }

      const typesMap = new Map(typesData?.map(t => [t.id, t]) || []);

      const formatted = souscriptionsData.map(s => {
        const type = typesMap.get(s.type_assurance_id);
        addLog(`Formatage souscription ${s.id}: type trouvé = ${type ? `${type.code} (${type.nom})` : 'NON TROUVÉ'}`);
        return {
          id: s.id,
          numero_assure: s.numero_assure || 'N/A',
          type_assurance_code: type?.code || 'inconnu',
          type_assurance_nom: type?.nom || 'Type inconnu',
          date_expiration: s.date_expiration,
          statut: s.statut,
        };
      });

      addLog(`Souscriptions formatées: ${formatted.length}`);
      formatted.forEach(s => {
        addLog(`  - ID: ${s.id}, Code: ${s.type_assurance_code}, Nom: ${s.type_assurance_nom}`);
      });

      setSouscriptions(formatted);
      addLog('✅ Souscriptions chargées avec succès');
    } catch (err: any) {
      addLog(`❌ Erreur finale: ${err.message}`);
      setError('Impossible de charger vos contrats. Veuillez réessayer.');
    } finally {
      setSouscriptionsLoading(false);
    }
  };

  const verifierCouverture = useCallback(() => {
  addLog(`=== VÉRIFICATION COUVERTURE ===`);
  addLog(`souscription_id: "${formData.souscription_id}"`);
  addLog(`type_sinistre: "${formData.type_sinistre}"`);
  addLog(`Nombre de souscriptions disponibles: ${souscriptions.length}`);
  
  if (!formData.souscription_id || !formData.type_sinistre) {
    setVerificationResult(null);
    return;
  }

  addLog('Recherche de la souscription...');
  addLog('IDs des souscriptions disponibles:');
  souscriptions.forEach(s => addLog(`  - "${s.id}" (${typeof s.id}) - ${s.type_assurance_nom}`));
  
  // CORRECTION : Convertir les deux en string et trim
  const searchId = String(formData.souscription_id).trim();
  addLog(`Recherche de l'ID: "${searchId}" (type: ${typeof searchId}, longueur: ${searchId.length})`);
  
  // Chercher avec comparaison stricte après conversion
  const souscription = souscriptions.find(s => String(s.id).trim() === searchId);
  
  if (!souscription) {
    addLog(`❌ Souscription NON TROUVÉE`);
    addLog(`Vérification manuelle:`);
    souscriptions.forEach(s => {
      const sId = String(s.id).trim();
      const match = sId === searchId;
      addLog(`  "${sId}" === "${searchId}" ? ${match} (longueurs: ${sId.length} vs ${searchId.length})`);
    });
    
    setVerificationResult({
      contrat_valide: false,
      message: `❌ Contrat non trouvé. Veuillez re-sélectionner un contrat.`,
      type_couvert: false,
    });
    return;
  }

  addLog(`✅ Souscription trouvée: ${souscription.type_assurance_nom} (${souscription.type_assurance_code})`);
  
  const typeSinistre = TYPES_SINISTRE.find(t => t.value === formData.type_sinistre);
  
  if (!typeSinistre) {
    addLog('❌ Type de sinistre non trouvé');
    setVerificationResult({
      contrat_valide: false,
      message: '❌ Type de sinistre non valide.',
      type_couvert: false,
    });
    return;
  }

  addLog(`Type sinistre: ${typeSinistre.label}, Codes acceptés: ${typeSinistre.codes_assurance.join(', ') || 'Tous'}`);

  const dateExpiration = new Date(souscription.date_expiration);
  const aujourdhui = new Date();
  
  if (dateExpiration < aujourdhui) {
    addLog('❌ Contrat expiré');
    setVerificationResult({
      contrat_valide: false,
      message: '❌ Ce contrat a expiré. Le sinistre ne sera pas couvert.',
      type_couvert: false,
    });
    return;
  }

  const typeCouvert = typeSinistre.codes_assurance.length === 0 || 
    typeSinistre.codes_assurance.includes(souscription.type_assurance_code);

  addLog(`Code contrat: ${souscription.type_assurance_code}`);
  addLog(`Est couvert: ${typeCouvert}`);

  setVerificationResult({
    contrat_valide: true,
    message: typeCouvert 
      ? '✅ Votre contrat couvre ce type de sinistre.' 
      : '⚠️ Ce sinistre n\'est pas couvert par ce contrat. Déclaration possible mais sans garantie de prise en charge.',
    type_couvert: typeCouvert,
  });
}, [formData.souscription_id, formData.type_sinistre, souscriptions]);


  const handleSelectAssure = (assure: User) => {
    addLog(`Assuré sélectionné: ${assure.nom} (ID: ${assure.id})`);
    setSelectedAssure(assure);
    setFormData({ ...formData, assure_id: assure.id, souscription_id: '', type_sinistre: '' });
    setSearchTerm('');
    setShowDropdown(false);
    chargerSouscriptions(assure.id);
  };

  const handleRemoveAssure = () => {
    addLog('Assuré retiré');
    setSelectedAssure(null);
    setFormData({ ...formData, assure_id: '', souscription_id: '', type_sinistre: '' });
    setSouscriptions([]);
    setVerificationResult(null);
    setSearchTerm('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      addLog(`${newFiles.length} fichier(s) ajouté(s)`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateNumeroDossier = async (): Promise<string> => {
    const now = new Date();
    const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const { data } = await supabase
      .from('sinistres')
      .select('numero_dossier')
      .like('numero_dossier', `${prefix}%`)
      .order('numero_dossier', { ascending: false })
      .limit(1);

    let sequence = 1;
    if (data && data.length > 0) {
      const parts = data[0].numero_dossier.split('-');
      sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
    }

    return `${prefix}-${String(sequence).padStart(4, '0')}`;
  };

  const uploadDocuments = async (sinistreId: string) => {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${sinistreId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      setUploadProgress(Math.round(((i + 1) / uploadedFiles.length) * 100));

      const { error: uploadError } = await supabase.storage
        .from('sinistres').upload(fileName, file);
      if (uploadError) continue;

      const { data: { publicUrl } } = supabase.storage
        .from('sinistres').getPublicUrl(fileName);

      let typeDocument = 'autre';
      const name = file.name.toLowerCase();
      if (name.includes('police') || name.includes('assurance')) typeDocument = 'police_assurance';
      else if (name.includes('rapport')) typeDocument = 'rapport_police';
      else if (file.type.startsWith('image/')) typeDocument = 'photo_dommage';
      else if (name.includes('facture')) typeDocument = 'facture';
      else if (name.includes('devis')) typeDocument = 'devis';

      await supabase.from('sinistre_documents').insert({
        sinistre_id: sinistreId,
        type_document: typeDocument,
        nom_fichier: file.name,
        url_fichier: publicUrl,
        taille_fichier: file.size,
        type_mime: file.type,
        uploaded_by: user?.id,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog(`=== SOUMISSION FORMULAIRE ===`);
    addLog(`Données: ${JSON.stringify(formData, null, 2)}`);
    
    if (!formData.assure_id || !formData.souscription_id || !formData.type_sinistre || 
        !formData.description || !formData.date_sinistre || !formData.lieu) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const numeroDossier = await generateNumeroDossier();
      addLog(`Numéro dossier généré: ${numeroDossier}`);

      const { data: sinistre, error: sinistreError } = await supabase
        .from('sinistres')
        .insert({
          assure_id: formData.assure_id,
          souscription_id: formData.souscription_id,
          numero_dossier: numeroDossier,
          type_sinistre: formData.type_sinistre,
          description: formData.description,
          date_sinistre: formData.date_sinistre,
          lieu: formData.lieu,
          montant_estime: formData.montant_estime ? parseFloat(formData.montant_estime) : null,
          statut: 'en_attente',
          created_by: user?.id,
        })
        .select()
        .single();

      if (sinistreError) throw sinistreError;

      addLog(`Sinistre créé: ${sinistre.id}`);

      if (uploadedFiles.length > 0) {
        await uploadDocuments(sinistre.id);
      }

      setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
      addLog('✅ Déclaration réussie');
      setTimeout(() => router.push(`/assure/sinistres/${sinistre.id}`), 2000);

    } catch (err: any) {
      addLog(`❌ Erreur soumission: ${err.message}`);
      setError(err.message || 'Erreur lors de la déclaration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <Link href="/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
              Déclaration de Sinistre
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Remplissez ce formulaire pour déclarer un nouveau sinistre
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaBug className="mr-2 h-4 w-4" />
            {showLogs ? 'Cacher logs' : 'Afficher logs'}
          </button>
        </div>
      </div>

      {/* Panneau de logs */}
      {showLogs && (
        <div className="mb-6 bg-gray-900 text-green-400 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Logs de diagnostic</h3>
            <button 
              onClick={() => setLogs([])} 
              className="text-gray-400 hover:text-white text-xs"
            >
              Effacer
            </button>
          </div>
          {logs.length === 0 ? (
            <p className="text-gray-500">Aucun log pour le moment...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="py-0.5">
                {log}
              </div>
            ))
          )}
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 flex">
          <FaTimesCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="ml-3 text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button>
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-md bg-green-50 p-4 flex">
          <FaCheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
          <p className="ml-3 text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de l'assuré (admin/agent) */}
          {user?.role !== 'assure' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 h-4 w-4 text-gray-400" /> Assuré *
              </label>
              {selectedAssure ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <UserAvatar user={selectedAssure} size="md" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedAssure.nom}</p>
                      <p className="text-xs text-gray-500">{selectedAssure.email}</p>
                      {selectedAssure.telephone && <p className="text-xs text-gray-400">{selectedAssure.telephone}</p>}
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveAssure} className="text-gray-400 hover:text-red-500">
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Rechercher un assuré par nom, email..."
                      className="block w-full rounded-md border border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredAssures.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">Aucun assuré trouvé</div>
                      ) : (
                        filteredAssures.map((assure) => (
                          <button key={assure.id} type="button" onClick={() => handleSelectAssure(assure)}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-left border-b last:border-b-0">
                            <UserAvatar user={assure} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{assure.nom}</p>
                              <p className="text-xs text-gray-500 truncate">{assure.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Assuré connecté */}
          {user?.role === 'assure' && selectedAssure && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <UserAvatar user={selectedAssure} size="md" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedAssure.nom}</p>
                  <p className="text-xs text-gray-500">{selectedAssure.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Sélection du contrat */}
          {selectedAssure && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 h-4 w-4 text-gray-400" /> Contrat d'assurance *
              </label>
              {souscriptionsLoading ? (
                <div className="flex items-center text-sm text-gray-500 py-2">
                  <FaSpinner className="animate-spin mr-2" /> Chargement des contrats...
                </div>
              ) : souscriptions.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  <FaExclamationTriangle className="inline mr-2" />
                  Aucun contrat actif trouvé pour votre compte.
                </div>
              ) : (
                <select
                  value={formData.souscription_id}
                  onChange={(e) => {
                    addLog(`Contrat sélectionné dans select: ${e.target.value}`);
                    setFormData({ ...formData, souscription_id: e.target.value, type_sinistre: '' });
                  }}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Sélectionnez un contrat --</option>
                  {souscriptions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.type_assurance_nom} - N° {s.numero_assure} (Expire: {new Date(s.date_expiration).toLocaleDateString('fr-FR')})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Type de sinistre */}
          {formData.souscription_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaExclamationTriangle className="inline mr-2 h-4 w-4 text-gray-400" /> Type de sinistre *
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TYPES_SINISTRE.map(type => {
                  const souscriptionSelectionnee = souscriptions.find(s => s.id === formData.souscription_id);
                  
                  let estCompatible = true;
                  if (souscriptionSelectionnee && type.codes_assurance.length > 0) {
                    estCompatible = type.codes_assurance.includes(souscriptionSelectionnee.type_assurance_code);
                  }
                  
                  const estDesactive = !estCompatible;
                  const estSelectionne = formData.type_sinistre === type.value;

                  return (
                    <button 
                      key={type.value} 
                      type="button"
                      onClick={() => {
                        if (!estDesactive) {
                          addLog(`Type sinistre sélectionné: ${type.label}`);
                          setFormData({ ...formData, type_sinistre: type.value });
                        }
                      }}
                      disabled={estDesactive}
                      className={`p-3 text-sm rounded-md border-2 transition-all ${
                        estSelectionne
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : estDesactive
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-xl block mb-1">{type.icon}</span>
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vérification contrat */}
          {verificationResult && (
            <div className={`rounded-lg p-4 text-sm flex items-start ${
              verificationResult.type_couvert 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : verificationResult.contrat_valide 
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {verificationResult.type_couvert ? <FaCheckCircle className="mr-2 mt-0.5 flex-shrink-0" /> : 
               verificationResult.contrat_valide ? <FaExclamationTriangle className="mr-2 mt-0.5 flex-shrink-0" /> :
               <FaTimesCircle className="mr-2 mt-0.5 flex-shrink-0" />}
              {verificationResult.message}
            </div>
          )}

          {/* Date et lieu */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 h-4 w-4 text-gray-400" /> Date du sinistre *
              </label>
              <input type="date" value={formData.date_sinistre}
                onChange={(e) => setFormData({ ...formData, date_sinistre: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 h-4 w-4 text-gray-400" /> Lieu du sinistre *
              </label>
              <input type="text" value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Adresse ou lieu du sinistre" required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée *</label>
            <textarea value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Décrivez les circonstances du sinistre en détail..." required />
          </div>

          {/* Montant estimé */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant estimé des dommages (optionnel)
            </label>
            <div className="relative">
              <input type="number" value={formData.montant_estime}
                onChange={(e) => setFormData({ ...formData, montant_estime: e.target.value })}
                className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0" min="0" step="0.01" />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">CDF</span>
            </div>
          </div>

          {/* Upload documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUpload className="inline mr-2 h-4 w-4 text-gray-400" /> Documents justificatifs
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Télécharger des fichiers</span>
                    <input type="file" multiple onChange={handleFileChange} className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">PDF, Word, JPG, PNG jusqu'à 10MB</p>
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                    <div className="flex items-center">
                      <FaFileAlt className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="ml-2 text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progression upload */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {/* Boutons */}
          <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={loading}
              className="flex-1 inline-flex justify-center items-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><FaSpinner className="animate-spin mr-2 h-4 w-4" /> Déclaration en cours...</> :
                <><FaSave className="mr-2 h-4 w-4" /> Déclarer le sinistre</>}
            </button>
            <Link href="/sinistres"
              className="flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}