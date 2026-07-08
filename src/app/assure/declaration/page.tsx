
// // // // app/assure/declaration/page.tsx
// // // 'use client';

// // // import { useState, useEffect, useRef } from 'react';
// // // import { useAuth } from '@/context/AuthContext';
// // // import { supabase } from '@/lib/supabase';
// // // import { useRouter } from 'next/navigation';
// // // import { 
// // //   FaFileAlt, FaArrowLeft, FaSave, FaTimes,
// // //   FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
// // //   FaCalendarAlt, FaExclamationTriangle,
// // //   FaSearch, FaTrash, FaCar,
// // //   FaBuilding, FaClipboardList, FaIdCard, FaTools,
// // //   FaUsers, FaUserInjured, FaFileSignature, FaShieldAlt
// // // } from 'react-icons/fa';
// // // import Link from 'next/link';

// // // // Types
// // // type User = {
// // //   id: string;
// // //   email: string;
// // //   nom: string;
// // //   role: string;
// // //   telephone?: string;
// // //   photo_profil?: string;
// // // };

// // // type Souscription = {
// // //   id: string;
// // //   numero_assure: string;
// // //   police_numero?: string;
// // //   type_assurance_code: string;
// // //   type_assurance_nom: string;
// // //   type_assurance_id: string;
// // //   date_expiration: string;
// // //   statut: string;
// // // };

// // // type TypeSinistreInfo = {
// // //   value: string;
// // //   label: string;
// // //   icon: string;
// // //   codes_assurance: string[];
// // // };

// // // const TYPES_SINISTRE: TypeSinistreInfo[] = [
// // //   { value: 'accident_auto', label: 'Accident auto', icon: '🚗', codes_assurance: ['automobile'] },
// // //   { value: 'vol', label: 'Vol', icon: '🔫', codes_assurance: ['automobile', 'incendie', 'rc'] },
// // //   { value: 'incendie', label: 'Incendie', icon: '🔥', codes_assurance: ['incendie', 'rc'] },
// // //   { value: 'degats_eau', label: 'Dégâts des eaux', icon: '💧', codes_assurance: ['incendie', 'rc'] },
// // //   { value: 'catastrophe_naturelle', label: 'Catastrophe naturelle', icon: '🌪️', codes_assurance: ['automobile', 'incendie', 'transport'] },
// // //   { value: 'bris_glace', label: 'Bris de glace', icon: '🪟', codes_assurance: ['automobile'] },
// // //   { value: 'responsabilite_civile', label: 'Responsabilité civile', icon: '⚖️', codes_assurance: ['rc'] },
// // //   { value: 'autre', label: 'Autre', icon: '📋', codes_assurance: [] },
// // // ];

// // // function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
// // //   const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg' };
// // //   const getInitials = (nom: string) => nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
// // //   return (
// // //     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
// // //       {user.photo_profil ? (
// // //         <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover" />
// // //       ) : (
// // //         <div className="w-full h-full bg-orange-600 flex items-center justify-center">
// // //           <span className="text-white font-medium">{getInitials(user.nom)}</span>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default function DeclarationSinistrePage() {
// // //   const { user } = useAuth();
// // //   const router = useRouter();
  
// // //   const [assures, setAssures] = useState<User[]>([]);
// // //   const [filteredAssures, setFilteredAssures] = useState<User[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [success, setSuccess] = useState<string | null>(null);
// // //   const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
// // //   const [showSonasForm, setShowSonasForm] = useState(false);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [showDropdown, setShowDropdown] = useState(false);
// // //   const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
// // //   const searchRef = useRef<HTMLDivElement>(null);
// // //   const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
// // //   const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);

// // //   const [formData, setFormData] = useState({
// // //     assure_id: '',
// // //     souscription_id: '',
// // //     type_sinistre: '',
// // //     description: '',
// // //     date_sinistre: new Date().toISOString().split('T')[0],
// // //     lieu: '',
// // //     montant_estime: '',
// // //   });

// // //   // État du formulaire SONAS
// // //   const [sonasForm, setSonasForm] = useState({
// // //     police: '',
// // //     valable_du: '',
// // //     valable_au: '',
// // //     claim_no: '',
// // //     garantie: '',
// // //     telephone: '',
// // //     date_heure_accident: '',
// // //     lieu_accident: '',
// // //     preneur_nom: '',
// // //     preneur_prenoms: '',
// // //     preneur_adresse: '',
// // //     conducteur_nom_prenom: '',
// // //     conducteur_age: '',
// // //     conducteur_a_service: null as boolean | null,
// // //     conducteur_titre_conduite: '',
// // //     permis_no: '',
// // //     permis_delivre_a: '',
// // //     permis_date: '',
// // //     vehicule_marque_type: '',
// // //     vehicule_plaque: '',
// // //     vehicule_chassis: '',
// // //     vehicule_moteur: '',
// // //     vehicule_puissance: '',
// // //     vehicule_annee: '',
// // //     vehicule_kilometrage: '',
// // //     vehicule_valeur: '',
// // //     garantie_rc: false,
// // //     garantie_dm: false,
// // //     garantie_inc: false,
// // //     garantie_vol: false,
// // //     description_accident: '',
// // //     degats_description: '',
// // //     degats_montant_evalue: '',
// // //     vehicule_immobilise: null as boolean | null,
// // //     lieu_garde_expertise: '',
// // //     adversaire_nom: '',
// // //     adversaire_post_nom: '',
// // //     adversaire_prenom: '',
// // //     adversaire_adresse: '',
// // //     adversaire_vehicule: '',
// // //     adversaire_plaque: '',
// // //     adversaire_assurance: '',
// // //     adversaire_telephone: '',
// // //     degats_materiels_description: '',
// // //     degats_materiels_evalues: '',
// // //     blesses_ou_morts: null as boolean | null,
// // //     victimes_infos: '',
// // //     victimes_soins_lieu: '',
// // //     hopital_nom_adresse: '',
// // //     medecin_nom: '',
// // //     medecin_telephone: '',
// // //     tiers_transportes: '',
// // //     temoins: '',
// // //     pv_par: '',
// // //     localite: '',
// // //     gendarmerie: '',
// // //     officier_gendarme: '',
// // //     prime_payee: null as boolean | null,
// // //     prime_date: '',
// // //     fait_a: '',
// // //     date_signature: '',
// // //   });

// // //   // Handlers SONAS
// // //   const handleSonasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value } = e.target;
// // //     setSonasForm(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSonasRadio = (name: string, value: boolean) => {
// // //     setSonasForm(prev => ({ ...prev, [name]: value }));
// // //   };

// // //   const handleSonasCheckbox = (name: string, checked: boolean) => {
// // //     setSonasForm(prev => ({ ...prev, [name]: checked }));
// // //   };

// // //   // INITIALISATION
// // //   useEffect(() => {
// // //     if (user?.role === 'assure' && user.id) {
// // //       setFormData(prev => ({ ...prev, assure_id: user.id }));
// // //       setSelectedAssure({
// // //         id: user.id, email: user.email || '', nom: user.nom || '',
// // //         role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
// // //       });
// // //       chargerSouscriptions(user.id);
// // //     } else if (user?.role !== 'assure') {
// // //       chargerAssures();
// // //     }
// // //   }, [user]);

// // //   // DÉTECTION AUTOMOBILE
// // //   useEffect(() => {
// // //     if (!formData.souscription_id) {
// // //       setShowSonasForm(false);
// // //       return;
// // //     }
    
// // //     const selected = souscriptions.find(s => String(s.id) === String(formData.souscription_id));
    
// // //     if (selected && selected.type_assurance_code === 'automobile') {
// // //       setShowSonasForm(true);
// // //       setSonasForm(prev => ({
// // //         ...prev,
// // //         police: selected.police_numero || '',
// // //         telephone: selectedAssure?.telephone || user?.telephone || '',
// // //         preneur_nom: selectedAssure?.nom || user?.nom || '',
// // //         date_heure_accident: formData.date_sinistre + 'T00:00',
// // //         lieu_accident: formData.lieu,
// // //         description_accident: formData.description,
// // //         degats_montant_evalue: formData.montant_estime,
// // //       }));
// // //     } else {
// // //       setShowSonasForm(false);
// // //     }
// // //   }, [formData.souscription_id, souscriptions]);

// // //   const chargerAssures = async () => {
// // //     const { data } = await supabase.from('users').select('id, email, nom, role, telephone, photo_profil').eq('role', 'assure').order('nom');
// // //     if (data) { setAssures(data); setFilteredAssures(data); }
// // //   };

// // //   const chargerSouscriptions = async (assureId: string) => {
// // //     setSouscriptionsLoading(true);
// // //     setSouscriptions([]);
// // //     setFormData(prev => ({ ...prev, souscription_id: '', type_sinistre: '' }));
// // //     setShowSonasForm(false);

// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('souscriptions')
// // //         .select(`
// // //           id, numero_assure, police_numero, type_assurance_id, date_expiration, statut,
// // //           type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(id, code, nom)
// // //         `)
// // //         .eq('assure_id', assureId)
// // //         .eq('statut', 'active');

// // //       if (error) throw error;

// // //       if (data) {
// // //         const formatted = data.map((s: any) => ({
// // //           id: String(s.id),
// // //           numero_assure: s.numero_assure || 'N/A',
// // //           police_numero: s.police_numero,
// // //           type_assurance_id: s.type_assurance_id,
// // //           type_assurance_code: s.type_assurance?.code || 'inconnu',
// // //           type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
// // //           date_expiration: s.date_expiration,
// // //           statut: s.statut,
// // //         }));
// // //         setSouscriptions(formatted);
// // //       }
// // //     } catch (err: any) {
// // //       setError('Erreur chargement contrats: ' + err.message);
// // //     } finally {
// // //       setSouscriptionsLoading(false);
// // //     }
// // //   };

// // //   const handleSelectAssure = (assure: User) => {
// // //     setSelectedAssure(assure);
// // //     setFormData(prev => ({ ...prev, assure_id: assure.id, souscription_id: '', type_sinistre: '' }));
// // //     setSearchTerm('');
// // //     setShowDropdown(false);
// // //     setShowSonasForm(false);
// // //     chargerSouscriptions(assure.id);
// // //   };

// // //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// // //     const { name, value } = e.target;
// // //     setFormData(prev => ({ ...prev, [name]: value }));
// // //   };

// // //  const handleSubmit = async (e: React.FormEvent) => {
// // //   e.preventDefault();
  
// // //   console.log('=== SOUMISSION ===');
// // //   console.log('formData:', formData);
// // //   console.log('sonasForm:', sonasForm);
// // //   console.log('showSonasForm:', showSonasForm);
  
// // //   setLoading(true);
// // //   setError(null);

// // //   try {
// // //     // Générer le numéro de dossier
// // //     const now = new Date();
// // //     const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    
// // //     const { data: lastSinistre } = await supabase
// // //       .from('sinistres')
// // //       .select('numero_dossier')
// // //       .like('numero_dossier', `${prefix}%`)
// // //       .order('numero_dossier', { ascending: false })
// // //       .limit(1);

// // //     let sequence = 1;
// // //     if (lastSinistre && lastSinistre.length > 0) {
// // //       const parts = lastSinistre[0].numero_dossier.split('-');
// // //       sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
// // //     }
    
// // //     const numeroDossier = `${prefix}-${String(sequence).padStart(4, '0')}`;
// // //     console.log('📋 Numéro dossier:', numeroDossier);

// // //     // Données pour sinistres
// // //     const sinistreData: any = {
// // //       assure_id: formData.assure_id,
// // //       souscription_id: formData.souscription_id,
// // //       numero_dossier: numeroDossier,
// // //       type_sinistre: formData.type_sinistre || 'accident_auto',
// // //       description: showSonasForm ? 'Déclaration accident automobile - voir formulaire SONAS' : formData.description,
// // //       date_sinistre: formData.date_sinistre,
// // //       lieu: showSonasForm ? sonasForm.lieu_accident : formData.lieu,
// // //       montant_estime: showSonasForm ? (sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null) : (formData.montant_estime ? parseFloat(formData.montant_estime) : null),
// // //       statut: 'en_attente',
// // //       created_by: user?.id,
// // //     };

// // //     console.log('💾 Insertion sinistre:', sinistreData);

// // //     const { data: sinistre, error: sinistreError } = await supabase
// // //       .from('sinistres')
// // //       .insert(sinistreData)
// // //       .select()
// // //       .single();

// // //     if (sinistreError) {
// // //       console.error('❌ Erreur insertion sinistre:', sinistreError);
// // //       throw sinistreError;
// // //     }

// // //     console.log('✅ Sinistre créé:', sinistre);

// // //     // Si formulaire SONAS, sauvegarder les détails
// // //     if (showSonasForm) {
// // //       const sonasData = {
// // //         sinistre_id: sinistre.id,
// // //         agence: 'SONAS Lubumbashi',
// // //         police: sonasForm.police || null,
// // //         valable_du: sonasForm.valable_du || null,
// // //         valable_au: sonasForm.valable_au || null,
// // //         claim_no: numeroDossier, // Utiliser le numéro de dossier
// // //         garantie: sonasForm.garantie || null,
// // //         telephone: sonasForm.telephone || null,
// // //         date_heure_accident: sonasForm.date_heure_accident || new Date().toISOString(),
// // //         lieu_accident: sonasForm.lieu_accident || formData.lieu,
// // //         preneur_nom: sonasForm.preneur_nom || null,
// // //         preneur_prenoms: sonasForm.preneur_prenoms || null,
// // //         preneur_adresse: sonasForm.preneur_adresse || null,
// // //         conducteur_nom_prenom: sonasForm.conducteur_nom_prenom || null,
// // //         conducteur_age: sonasForm.conducteur_age ? parseInt(sonasForm.conducteur_age) : null,
// // //         conducteur_a_service: sonasForm.conducteur_a_service,
// // //         conducteur_titre_conduite: sonasForm.conducteur_titre_conduite || null,
// // //         permis_no: sonasForm.permis_no || null,
// // //         permis_delivre_a: sonasForm.permis_delivre_a || null,
// // //         permis_date: sonasForm.permis_date || null,
// // //         vehicule_marque_type: sonasForm.vehicule_marque_type || null,
// // //         vehicule_plaque: sonasForm.vehicule_plaque || null,
// // //         vehicule_chassis: sonasForm.vehicule_chassis || null,
// // //         vehicule_moteur: sonasForm.vehicule_moteur || null,
// // //         vehicule_puissance: sonasForm.vehicule_puissance || null,
// // //         vehicule_annee: sonasForm.vehicule_annee ? parseInt(sonasForm.vehicule_annee) : null,
// // //         vehicule_kilometrage: sonasForm.vehicule_kilometrage ? parseInt(sonasForm.vehicule_kilometrage) : null,
// // //         vehicule_valeur: sonasForm.vehicule_valeur ? parseFloat(sonasForm.vehicule_valeur) : null,
// // //         garantie_rc: sonasForm.garantie_rc,
// // //         garantie_dm: sonasForm.garantie_dm,
// // //         garantie_inc: sonasForm.garantie_inc,
// // //         garantie_vol: sonasForm.garantie_vol,
// // //         description_accident: sonasForm.description_accident || 'Aucune description fournie',
// // //         degats_description: sonasForm.degats_description || null,
// // //         degats_montant_evalue: sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null,
// // //         vehicule_immobilise: sonasForm.vehicule_immobilise,
// // //         lieu_garde_expertise: sonasForm.lieu_garde_expertise || null,
// // //         adversaire_nom: sonasForm.adversaire_nom || null,
// // //         adversaire_post_nom: sonasForm.adversaire_post_nom || null,
// // //         adversaire_prenom: sonasForm.adversaire_prenom || null,
// // //         adversaire_adresse: sonasForm.adversaire_adresse || null,
// // //         adversaire_vehicule: sonasForm.adversaire_vehicule || null,
// // //         adversaire_plaque: sonasForm.adversaire_plaque || null,
// // //         adversaire_assurance: sonasForm.adversaire_assurance || null,
// // //         adversaire_telephone: sonasForm.adversaire_telephone || null,
// // //         degats_materiels_description: sonasForm.degats_materiels_description || null,
// // //         degats_materiels_evalues: sonasForm.degats_materiels_evalues ? parseFloat(sonasForm.degats_materiels_evalues) : null,
// // //         blesses_ou_morts: sonasForm.blesses_ou_morts || false,
// // //         victimes_infos: sonasForm.victimes_infos || null,
// // //         victimes_soins_lieu: sonasForm.victimes_soins_lieu || null,
// // //         hopital_nom_adresse: sonasForm.hopital_nom_adresse || null,
// // //         medecin_nom: sonasForm.medecin_nom || null,
// // //         medecin_telephone: sonasForm.medecin_telephone || null,
// // //         tiers_transportes: sonasForm.tiers_transportes || null,
// // //         temoins: sonasForm.temoins || null,
// // //         pv_par: sonasForm.pv_par || null,
// // //         localite: sonasForm.localite || null,
// // //         gendarmerie: sonasForm.gendarmerie || null,
// // //         officier_gendarme: sonasForm.officier_gendarme || null,
// // //         prime_payee: sonasForm.prime_payee,
// // //         prime_date: sonasForm.prime_date || null,
// // //         fait_a: sonasForm.fait_a || null,
// // //         date_signature: sonasForm.date_signature || null,
// // //       };

// // //       console.log('💾 Insertion SONAS:', sonasData);

// // //       const { error: sonasError } = await supabase
// // //         .from('sonas_declarations_accident')
// // //         .insert(sonasData);

// // //       if (sonasError) {
// // //         console.error('❌ Erreur insertion SONAS:', sonasError);
// // //         throw sonasError;
// // //       }

// // //       console.log('✅ Déclaration SONAS créée');
// // //     }

// // //     setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
    
// // //     // Rediriger après 2 secondes
// // //     setTimeout(() => {
// // //       router.push('/assure/sinistres');
// // //     }, 2000);

// // //   } catch (err: any) {
// // //     console.error('❌ Erreur complète:', err);
// // //     setError(err.message || 'Erreur lors de la déclaration');
// // //   } finally {
// // //     setLoading(false);
// // //   }
// // // };
// // //   return (
// // //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //       <div className="mb-8">
// // //         <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
// // //           <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
// // //         </Link>
// // //         <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
// // //           <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
// // //           Déclaration de Sinistre
// // //         </h1>
// // //       </div>

// // //       {/* DEBUG */}
// // //       <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
// // //         <div className="grid grid-cols-2 gap-2 text-sm">
// // //           <div><span className="font-semibold">showSonasForm:</span> <span className={showSonasForm ? 'text-green-600 font-bold' : 'text-red-600'}>{showSonasForm ? '✅ OUI' : '❌ NON'}</span></div>
// // //           <div><span className="font-semibold">souscription_id:</span> {formData.souscription_id || 'Non sélectionné'}</div>
// // //           <div><span className="font-semibold">type_sinistre:</span> {formData.type_sinistre || 'Non sélectionné'}</div>
// // //           <div><span className="font-semibold">Nb souscriptions:</span> {souscriptions.length}</div>
// // //         </div>
// // //         {souscriptions.length > 0 && (
// // //           <div className="mt-3 space-y-1">
// // //             {souscriptions.map(s => (
// // //               <div key={s.id} className={`text-xs p-2 rounded flex justify-between ${s.id === formData.souscription_id ? 'bg-green-100 border border-green-400 font-bold' : 'bg-white border'}`}>
// // //                 <span>ID: {s.id}</span>
// // //                 <span>Code: <strong>{s.type_assurance_code}</strong></span>
// // //                 <span>Nom: {s.type_assurance_nom}</span>
// // //                 {s.id === formData.souscription_id && <span>👈</span>}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaTimesCircle className="h-5 w-5 text-red-400" /><p className="ml-3 text-sm text-red-700">{error}</p></div>}
// // //       {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400" /><p className="ml-3 text-sm text-green-700">{success}</p></div>}

// // //       <form onSubmit={handleSubmit} className="space-y-6">
// // //         {/* Formulaire de base */}
// // //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// // //           <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
          
// // //           {user?.role !== 'assure' && (
// // //             <div className="mb-4">
// // //               <label className="block text-sm font-medium mb-2">Assuré *</label>
// // //               {selectedAssure ? (
// // //                 <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
// // //                   <div className="flex items-center gap-3">
// // //                     <UserAvatar user={selectedAssure} />
// // //                     <div><p className="font-medium">{selectedAssure.nom}</p><p className="text-xs text-gray-500">{selectedAssure.email}</p></div>
// // //                   </div>
// // //                   <button type="button" onClick={() => { setSelectedAssure(null); setFormData(prev => ({ ...prev, assure_id: '', souscription_id: '' })); setSouscriptions([]); setShowSonasForm(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
// // //                 </div>
// // //               ) : (
// // //                 <div ref={searchRef} className="relative">
// // //                   <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
// // //                   <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Rechercher un assuré..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
// // //                   {showDropdown && filteredAssures.length > 0 && (
// // //                     <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
// // //                       {filteredAssures.map(a => (
// // //                         <button key={a.id} type="button" onClick={() => handleSelectAssure(a)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
// // //                           <UserAvatar user={a} size="sm" /><span>{a.nom}</span>
// // //                         </button>
// // //                       ))}
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {selectedAssure && (
// // //             <div className="mb-4">
// // //               <label className="block text-sm font-medium mb-2">Contrat *</label>
// // //               {souscriptionsLoading ? (
// // //                 <div className="flex items-center gap-2 text-gray-500"><FaSpinner className="animate-spin" /> Chargement...</div>
// // //               ) : (
// // //                 <select name="souscription_id" value={formData.souscription_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
// // //                   <option value="">-- Sélectionnez un contrat --</option>
// // //                   {souscriptions.map(s => (
// // //                     <option key={s.id} value={s.id}>{s.type_assurance_nom} - {s.numero_assure}</option>
// // //                   ))}
// // //                 </select>
// // //               )}
// // //             </div>
// // //           )}

// // //           {formData.souscription_id && (
// // //             <div className="mb-4">
// // //               <label className="block text-sm font-medium mb-2">Type de sinistre *</label>
// // //               <div className="grid grid-cols-4 gap-2">
// // //                 {TYPES_SINISTRE.map(type => (
// // //                   <button key={type.value} type="button" onClick={() => setFormData(prev => ({ ...prev, type_sinistre: type.value }))}
// // //                     className={`p-2 text-sm rounded-md border ${formData.type_sinistre === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
// // //                     <span className="text-xl block mb-1">{type.icon}</span><span className="text-xs">{type.label}</span>
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           )}

// // //           <div className="grid grid-cols-2 gap-4 mb-4">
// // //             <div><label className="block text-xs font-medium text-gray-700 mb-1">Date du sinistre *</label><input type="date" name="date_sinistre" value={formData.date_sinistre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //             <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu *</label><input type="text" name="lieu" value={formData.lieu} onChange={handleChange} required placeholder="Adresse du sinistre" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //           </div>
// // //           <div className="mb-4"><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //           <div><label className="block text-xs font-medium text-gray-700 mb-1">Montant estimé (optionnel)</label><input type="number" name="montant_estime" value={formData.montant_estime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //         </div>

// // //         {/* FORMULAIRE SONAS */}
// // //         {showSonasForm && (
// // //           <div className="bg-white rounded-lg shadow-sm border-2 border-blue-300 overflow-hidden">
// // //             <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
// // //               <FaCar className="h-6 w-6" />
// // //               <div><h2 className="text-lg font-bold">🚗 DÉCLARATION D'ACCIDENT AUTOMOBILE - SONAS</h2><p className="text-blue-100 text-sm">Formulaire détaillé pour assurance automobile</p></div>
// // //             </div>
            
// // //             <div className="p-6 space-y-4">
// // //               {/* Infos générales */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaBuilding className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Informations générales</h3></div>
// // //                 <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Agence</label><input type="text" defaultValue="SONAS Lubumbashi" className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50" disabled /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Police</label><input type="text" name="police" value={sonasForm.police} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Claim n°</label><input type="text" name="claim_no" value={sonasForm.claim_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Valable du</label><input type="date" name="valable_du" value={sonasForm.valable_du} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Au</label><input type="date" name="valable_au" value={sonasForm.valable_au} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Garantie</label><select name="garantie" value={sonasForm.garantie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm"><option value="">Sélectionner</option><option value="RC">RC</option><option value="DM">DM</option><option value="INC">Inc.</option><option value="VOL">Vol</option></select></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="telephone" value={sonasForm.telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 1. Date et heure */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaCalendarAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">1. Date et heure de l'accident</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Date et heure *</label><input type="datetime-local" name="date_heure_accident" value={sonasForm.date_heure_accident} onChange={handleSonasChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Lieu *</label><input type="text" name="lieu_accident" value={sonasForm.lieu_accident} onChange={handleSonasChange} required placeholder="Adresse complète" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 2. Preneur d'assurance */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">2. Preneur d'assurance</h3></div>
// // //                 <div className="p-4 grid grid-cols-3 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="preneur_nom" value={sonasForm.preneur_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Prénoms</label><input type="text" name="preneur_prenoms" value={sonasForm.preneur_prenoms} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="preneur_adresse" value={sonasForm.preneur_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 3. Conducteur */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaIdCard className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">3. Conducteur</h3></div>
// // //                 <div className="p-4 grid grid-cols-3 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Nom et prénom</label><input type="text" name="conducteur_nom_prenom" value={sonasForm.conducteur_nom_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Âge</label><input type="number" name="conducteur_age" value={sonasForm.conducteur_age} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div>
// // //                     <label className="block text-xs font-medium mb-2">À votre service ?</label>
// // //                     <div className="flex gap-4">
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === true} onChange={() => handleSonasRadio('conducteur_a_service', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === false} onChange={() => handleSonasRadio('conducteur_a_service', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// // //                     </div>
// // //                   </div>
// // //                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Titre de conduite</label><input type="text" name="conducteur_titre_conduite" value={sonasForm.conducteur_titre_conduite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Permis n°</label><input type="text" name="permis_no" value={sonasForm.permis_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Délivré à</label><input type="text" name="permis_delivre_a" value={sonasForm.permis_delivre_a} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Date</label><input type="date" name="permis_date" value={sonasForm.permis_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 4. Véhicule */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaCar className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">4. Véhicule</h3></div>
// // //                 <div className="p-4 grid grid-cols-3 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Marque et type</label><input type="text" name="vehicule_marque_type" value={sonasForm.vehicule_marque_type} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">N° plaque</label><input type="text" name="vehicule_plaque" value={sonasForm.vehicule_plaque} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">N° châssis</label><input type="text" name="vehicule_chassis" value={sonasForm.vehicule_chassis} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">N° moteur</label><input type="text" name="vehicule_moteur" value={sonasForm.vehicule_moteur} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Puissance</label><input type="text" name="vehicule_puissance" value={sonasForm.vehicule_puissance} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Année</label><input type="number" name="vehicule_annee" value={sonasForm.vehicule_annee} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Kilométrage</label><input type="number" name="vehicule_kilometrage" value={sonasForm.vehicule_kilometrage} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Valeur</label><input type="number" name="vehicule_valeur" value={sonasForm.vehicule_valeur} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //                 <div className="px-4 pb-4">
// // //                   <label className="block text-xs font-medium mb-2">Garanties :</label>
// // //                   <div className="flex flex-wrap gap-6">
// // //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_rc} onChange={(e) => handleSonasCheckbox('garantie_rc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">R.C.</span></label>
// // //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_dm} onChange={(e) => handleSonasCheckbox('garantie_dm', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">D.M.</span></label>
// // //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_inc} onChange={(e) => handleSonasCheckbox('garantie_inc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Inc.</span></label>
// // //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_vol} onChange={(e) => handleSonasCheckbox('garantie_vol', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Vol</span></label>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* 5. Description accident */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaClipboardList className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">5. Description de l'accident</h3></div>
// // //                 <div className="p-4 space-y-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="description_accident" value={sonasForm.description_accident} onChange={handleSonasChange} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Plan des lieux</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 h-48 flex items-center justify-center"><span className="text-gray-400 text-sm">Zone de dessin</span></div></div>
// // //                 </div>
// // //               </div>

// // //               {/* 6. Dégâts véhicule */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">6. Dégâts de votre véhicule</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_description" value={sonasForm.degats_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Montant évalué</label><input type="number" name="degats_montant_evalue" value={sonasForm.degats_montant_evalue} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 7. Garage */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">7. Garage</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div>
// // //                     <label className="block text-xs font-medium mb-2">Véhicule immobilisé ?</label>
// // //                     <div className="flex gap-4">
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === true} onChange={() => handleSonasRadio('vehicule_immobilise', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === false} onChange={() => handleSonasRadio('vehicule_immobilise', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// // //                     </div>
// // //                   </div>
// // //                   <div><label className="block text-xs font-medium mb-1">Lieu de garde</label><input type="text" name="lieu_garde_expertise" value={sonasForm.lieu_garde_expertise} onChange={handleSonasChange} placeholder="Adresse du garage" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 8. Adversaire */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">8. Adversaire</h3></div>
// // //                 <div className="p-4 grid grid-cols-3 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="adversaire_nom" value={sonasForm.adversaire_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Post-nom</label><input type="text" name="adversaire_post_nom" value={sonasForm.adversaire_post_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Prénom</label><input type="text" name="adversaire_prenom" value={sonasForm.adversaire_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="adversaire_adresse" value={sonasForm.adversaire_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Véhicule</label><input type="text" name="adversaire_vehicule" value={sonasForm.adversaire_vehicule} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Plaque</label><input type="text" name="adversaire_plaque" value={sonasForm.adversaire_plaque} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Assurance</label><input type="text" name="adversaire_assurance" value={sonasForm.adversaire_assurance} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="adversaire_telephone" value={sonasForm.adversaire_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 9. Dégâts matériels tiers */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">9. Dégâts matériels (tiers)</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_materiels_description" value={sonasForm.degats_materiels_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Dégâts évalués à</label><input type="number" name="degats_materiels_evalues" value={sonasForm.degats_materiels_evalues} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 10. Blessés ou morts */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUserInjured className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">10. Blessés ou morts</h3></div>
// // //                 <div className="p-4 space-y-4">
// // //                   <div>
// // //                     <label className="block text-xs font-medium mb-2">Y a-t-il des blessés/morts ?</label>
// // //                     <div className="flex gap-4">
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === true} onChange={() => handleSonasRadio('blesses_ou_morts', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === false} onChange={() => handleSonasRadio('blesses_ou_morts', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// // //                     </div>
// // //                   </div>
// // //                   <div><label className="block text-xs font-medium mb-1">Victimes (nom, prénom, adresse)</label><textarea name="victimes_infos" value={sonasForm.victimes_infos} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Où se trouvent les victimes ?</label><input type="text" name="victimes_soins_lieu" value={sonasForm.victimes_soins_lieu} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div className="grid grid-cols-2 gap-4">
// // //                     <div><label className="block text-xs font-medium mb-1">Hôpital</label><input type="text" name="hopital_nom_adresse" value={sonasForm.hopital_nom_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                     <div><label className="block text-xs font-medium mb-1">Médecin</label><input type="text" name="medecin_nom" value={sonasForm.medecin_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   </div>
// // //                   <div><label className="block text-xs font-medium mb-1">Tél médecin</label><input type="tel" name="medecin_telephone" value={sonasForm.medecin_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 11. Tiers transportés */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">11. Tiers transportés</h3></div>
// // //                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="tiers_transportes" value={sonasForm.tiers_transportes} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //               </div>

// // //               {/* 12. Témoins */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">12. Témoins</h3></div>
// // //                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="temoins" value={sonasForm.temoins} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //               </div>

// // //               {/* 13. Autorités */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaShieldAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">13. Autorités</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">PV par</label><input type="text" name="pv_par" value={sonasForm.pv_par} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Localité</label><input type="text" name="localite" value={sonasForm.localite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Gendarmerie</label><input type="text" name="gendarmerie" value={sonasForm.gendarmerie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Officier</label><input type="text" name="officier_gendarme" value={sonasForm.officier_gendarme} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* 14. Prime */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">14. Prime d'assurance</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div>
// // //                     <label className="block text-xs font-medium mb-2">Dernière prime payée ?</label>
// // //                     <div className="flex gap-4">
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === true} onChange={() => handleSonasRadio('prime_payee', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// // //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === false} onChange={() => handleSonasRadio('prime_payee', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// // //                     </div>
// // //                   </div>
// // //                   <div><label className="block text-xs font-medium mb-1">Si oui, date</label><input type="date" name="prime_date" value={sonasForm.prime_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //               </div>

// // //               {/* Signature */}
// // //               <div className="border rounded-lg overflow-hidden">
// // //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileSignature className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Signature</h3></div>
// // //                 <div className="p-4 grid grid-cols-2 gap-4">
// // //                   <div><label className="block text-xs font-medium mb-1">Fait à</label><input type="text" name="fait_a" value={sonasForm.fait_a} onChange={handleSonasChange} placeholder="Lieu" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                   <div><label className="block text-xs font-medium mb-1">Le</label><input type="date" name="date_signature" value={sonasForm.date_signature} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// // //                 </div>
// // //                 <div className="px-4 pb-4"><label className="block text-xs font-medium mb-1">Signature</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 h-32 flex items-center justify-center"><span className="text-gray-400 text-sm">Espace signature</span></div></div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Boutons */}
// // //         <div className="flex gap-4">
// // //           <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
// // //             {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
// // //             {loading ? 'Enregistrement...' : 'Déclarer le sinistre'}
// // //           </button>
// // //           <Link href="/assure/sinistres" className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 text-center">Annuler</Link>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // app/assure/declaration/page.tsx
// // 'use client';

// // import { useState, useEffect, useRef } from 'react';
// // import { useAuth } from '@/context/AuthContext';
// // import { supabase } from '@/lib/supabase';
// // import { useRouter } from 'next/navigation';
// // import { 
// //   FaFileAlt, FaArrowLeft, FaSave, FaTimes,
// //   FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
// //   FaCalendarAlt, FaExclamationTriangle,
// //   FaSearch, FaTrash, FaCar,
// //   FaBuilding, FaClipboardList, FaIdCard, FaTools,
// //   FaUsers, FaUserInjured, FaFileSignature, FaShieldAlt
// // } from 'react-icons/fa';
// // import Link from 'next/link';

// // // Types
// // type User = {
// //   id: string;
// //   email: string;
// //   nom: string;
// //   role: string;
// //   telephone?: string;
// //   photo_profil?: string;
// // };

// // type Souscription = {
// //   id: string;
// //   numero_assure: string;
// //   police_numero?: string;
// //   type_assurance_code: string;
// //   type_assurance_nom: string;
// //   type_assurance_id: string;
// //   date_expiration: string;
// //   statut: string;
// // };

// // type VehiculeInfo = {
// //   marque_type: string;
// //   plaque_immatriculation: string;
// //   numero_chassis?: string;
// //   numero_moteur?: string;
// //   puissance?: string;
// //   annee?: number;
// //   kilometrage?: number;
// //   valeur?: number;
// // };

// // type TypeSinistreInfo = {
// //   value: string;
// //   label: string;
// //   icon: string;
// //   codes_assurance: string[];
// // };

// // const TYPES_SINISTRE: TypeSinistreInfo[] = [
// //   { value: 'accident_auto', label: 'Accident auto', icon: '🚗', codes_assurance: ['automobile'] },
// //   { value: 'vol', label: 'Vol', icon: '🔫', codes_assurance: ['automobile', 'incendie', 'rc'] },
// //   { value: 'incendie', label: 'Incendie', icon: '🔥', codes_assurance: ['incendie', 'rc'] },
// //   { value: 'degats_eau', label: 'Dégâts des eaux', icon: '💧', codes_assurance: ['incendie', 'rc'] },
// //   { value: 'catastrophe_naturelle', label: 'Catastrophe naturelle', icon: '🌪️', codes_assurance: ['automobile', 'incendie', 'transport'] },
// //   { value: 'bris_glace', label: 'Bris de glace', icon: '🪟', codes_assurance: ['automobile'] },
// //   { value: 'responsabilite_civile', label: 'Responsabilité civile', icon: '⚖️', codes_assurance: ['rc'] },
// //   { value: 'autre', label: 'Autre', icon: '📋', codes_assurance: [] },
// // ];

// // function UserAvatar({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' | 'lg' }) {
// //   const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-sm', lg: 'h-16 w-16 text-lg' };
// //   const getInitials = (nom: string) => nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
// //   return (
// //     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
// //       {user.photo_profil ? (
// //         <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover" />
// //       ) : (
// //         <div className="w-full h-full bg-orange-600 flex items-center justify-center">
// //           <span className="text-white font-medium">{getInitials(user.nom)}</span>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default function DeclarationSinistrePage() {
// //   const { user } = useAuth();
// //   const router = useRouter();
  
// //   const [assures, setAssures] = useState<User[]>([]);
// //   const [filteredAssures, setFilteredAssures] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState<string | null>(null);
// //   const [showSonasForm, setShowSonasForm] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
// //   const searchRef = useRef<HTMLDivElement>(null);
// //   const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
// //   const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);
// //   const [vehiculeLoading, setVehiculeLoading] = useState(false);

// //   const [formData, setFormData] = useState({
// //     assure_id: '',
// //     souscription_id: '',
// //     type_sinistre: '',
// //     description: '',
// //     date_sinistre: new Date().toISOString().split('T')[0],
// //     lieu: '',
// //     montant_estime: '',
// //   });

// //   // État du formulaire SONAS
// //   const [sonasForm, setSonasForm] = useState({
// //     police: '',
// //     valable_du: '',
// //     valable_au: '',
// //     claim_no: '',
// //     garantie: '',
// //     telephone: '',
// //     date_heure_accident: '',
// //     lieu_accident: '',
// //     preneur_nom: '',
// //     preneur_prenoms: '',
// //     preneur_adresse: '',
// //     conducteur_nom_prenom: '',
// //     conducteur_age: '',
// //     conducteur_a_service: null as boolean | null,
// //     conducteur_titre_conduite: '',
// //     permis_no: '',
// //     permis_delivre_a: '',
// //     permis_date: '',
// //     vehicule_marque_type: '',
// //     vehicule_plaque: '',
// //     vehicule_chassis: '',
// //     vehicule_moteur: '',
// //     vehicule_puissance: '',
// //     vehicule_annee: '',
// //     vehicule_kilometrage: '',
// //     vehicule_valeur: '',
// //     garantie_rc: false,
// //     garantie_dm: false,
// //     garantie_inc: false,
// //     garantie_vol: false,
// //     description_accident: '',
// //     degats_description: '',
// //     degats_montant_evalue: '',
// //     vehicule_immobilise: null as boolean | null,
// //     lieu_garde_expertise: '',
// //     adversaire_nom: '',
// //     adversaire_post_nom: '',
// //     adversaire_prenom: '',
// //     adversaire_adresse: '',
// //     adversaire_vehicule: '',
// //     adversaire_plaque: '',
// //     adversaire_assurance: '',
// //     adversaire_telephone: '',
// //     degats_materiels_description: '',
// //     degats_materiels_evalues: '',
// //     blesses_ou_morts: null as boolean | null,
// //     victimes_infos: '',
// //     victimes_soins_lieu: '',
// //     hopital_nom_adresse: '',
// //     medecin_nom: '',
// //     medecin_telephone: '',
// //     tiers_transportes: '',
// //     temoins: '',
// //     pv_par: '',
// //     localite: '',
// //     gendarmerie: '',
// //     officier_gendarme: '',
// //     prime_payee: null as boolean | null,
// //     prime_date: '',
// //     fait_a: '',
// //     date_signature: '',
// //   });

// //   // Handlers SONAS
// //   const handleSonasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setSonasForm(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSonasRadio = (name: string, value: boolean) => {
// //     setSonasForm(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSonasCheckbox = (name: string, checked: boolean) => {
// //     setSonasForm(prev => ({ ...prev, [name]: checked }));
// //   };

// //   // INITIALISATION
// //   useEffect(() => {
// //     if (user?.role === 'assure' && user.id) {
// //       setFormData(prev => ({ ...prev, assure_id: user.id }));
// //       setSelectedAssure({
// //         id: user.id, email: user.email || '', nom: user.nom || '',
// //         role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
// //       });
// //       chargerSouscriptions(user.id);
// //     } else if (user?.role !== 'assure') {
// //       chargerAssures();
// //     }
// //   }, [user]);

// //   // DÉTECTION AUTOMOBILE ET PRÉ-REMPLISSAGE
// //   useEffect(() => {
// //     if (!formData.souscription_id) {
// //       setShowSonasForm(false);
// //       return;
// //     }
    
// //     const selected = souscriptions.find(s => String(s.id) === String(formData.souscription_id));
    
// //     if (selected && selected.type_assurance_code === 'automobile') {
// //       setShowSonasForm(true);
      
// //       // Pré-remplir les infos de base
// //       setSonasForm(prev => ({
// //         ...prev,
// //         police: selected.police_numero || '',
// //         telephone: selectedAssure?.telephone || user?.telephone || '',
// //         preneur_nom: selectedAssure?.nom || user?.nom || '',
// //         date_heure_accident: formData.date_sinistre + 'T00:00',
// //         lieu_accident: formData.lieu,
// //         description_accident: formData.description,
// //         degats_montant_evalue: formData.montant_estime,
// //       }));
      
// //       // Charger les infos du véhicule depuis vehicules_assures
// //       chargerInfosVehicule(formData.souscription_id);
// //     } else {
// //       setShowSonasForm(false);
// //     }
// //   }, [formData.souscription_id, souscriptions]);

// //   // Fonction pour charger les infos du véhicule
// //   const chargerInfosVehicule = async (souscriptionId: string) => {
// //     setVehiculeLoading(true);
    
// //     try {
// //       const { data: vehicule, error } = await supabase
// //         .from('vehicules_assures')
// //         .select('*')
// //         .eq('souscription_id', souscriptionId)
// //         .single();
      
// //       if (error) {
// //         console.log('Aucune info véhicule trouvée:', error.message);
// //         return;
// //       }
      
// //       if (vehicule) {
// //         console.log('✅ Infos véhicule trouvées:', vehicule);
        
// //         // Pré-remplir les champs du véhicule dans le formulaire SONAS
// //         setSonasForm(prev => ({
// //           ...prev,
// //           vehicule_marque_type: vehicule.marque_type || '',
// //           vehicule_plaque: vehicule.plaque_immatriculation || '',
// //           vehicule_chassis: vehicule.numero_chassis || '',
// //           vehicule_moteur: vehicule.numero_moteur || '',
// //           vehicule_puissance: vehicule.puissance || '',
// //           vehicule_annee: vehicule.annee ? String(vehicule.annee) : '',
// //           vehicule_kilometrage: vehicule.kilometrage ? String(vehicule.kilometrage) : '',
// //           vehicule_valeur: vehicule.valeur ? String(vehicule.valeur) : '',
// //         }));
// //       }
// //     } catch (err: any) {
// //       console.error('Erreur chargement véhicule:', err.message);
// //     } finally {
// //       setVehiculeLoading(false);
// //     }
// //   };

// //   const chargerAssures = async () => {
// //     const { data } = await supabase.from('users').select('id, email, nom, role, telephone, photo_profil').eq('role', 'assure').order('nom');
// //     if (data) { setAssures(data); setFilteredAssures(data); }
// //   };

// //   const chargerSouscriptions = async (assureId: string) => {
// //     setSouscriptionsLoading(true);
// //     setSouscriptions([]);
// //     setFormData(prev => ({ ...prev, souscription_id: '', type_sinistre: '' }));
// //     setShowSonasForm(false);

// //     try {
// //       const { data, error } = await supabase
// //         .from('souscriptions')
// //         .select(`
// //           id, numero_assure, police_numero, type_assurance_id, date_expiration, statut,
// //           type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(id, code, nom)
// //         `)
// //         .eq('assure_id', assureId)
// //         .eq('statut', 'active');

// //       if (error) throw error;

// //       if (data) {
// //         const formatted = data.map((s: any) => ({
// //           id: String(s.id),
// //           numero_assure: s.numero_assure || 'N/A',
// //           police_numero: s.police_numero,
// //           type_assurance_id: s.type_assurance_id,
// //           type_assurance_code: s.type_assurance?.code || 'inconnu',
// //           type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
// //           date_expiration: s.date_expiration,
// //           statut: s.statut,
// //         }));
// //         setSouscriptions(formatted);
// //       }
// //     } catch (err: any) {
// //       setError('Erreur chargement contrats: ' + err.message);
// //     } finally {
// //       setSouscriptionsLoading(false);
// //     }
// //   };

// //   const handleSelectAssure = (assure: User) => {
// //     setSelectedAssure(assure);
// //     setFormData(prev => ({ ...prev, assure_id: assure.id, souscription_id: '', type_sinistre: '' }));
// //     setSearchTerm('');
// //     setShowDropdown(false);
// //     setShowSonasForm(false);
// //     chargerSouscriptions(assure.id);
// //   };

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       // Générer le numéro de dossier
// //       const now = new Date();
// //       const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      
// //       const { data: lastSinistre } = await supabase
// //         .from('sinistres')
// //         .select('numero_dossier')
// //         .like('numero_dossier', `${prefix}%`)
// //         .order('numero_dossier', { ascending: false })
// //         .limit(1);

// //       let sequence = 1;
// //       if (lastSinistre && lastSinistre.length > 0) {
// //         const parts = lastSinistre[0].numero_dossier.split('-');
// //         sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
// //       }
      
// //       const numeroDossier = `${prefix}-${String(sequence).padStart(4, '0')}`;

// //       // Données pour sinistres
// //       const sinistreData: any = {
// //         assure_id: formData.assure_id,
// //         souscription_id: formData.souscription_id,
// //         numero_dossier: numeroDossier,
// //         type_sinistre: formData.type_sinistre || 'accident_auto',
// //         description: showSonasForm ? 'Déclaration accident automobile - voir formulaire SONAS' : formData.description,
// //         date_sinistre: formData.date_sinistre,
// //         lieu: showSonasForm ? sonasForm.lieu_accident : formData.lieu,
// //         montant_estime: showSonasForm ? (sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null) : (formData.montant_estime ? parseFloat(formData.montant_estime) : null),
// //         statut: 'en_attente',
// //         created_by: user?.id,
// //       };

// //       const { data: sinistre, error: sinistreError } = await supabase
// //         .from('sinistres')
// //         .insert(sinistreData)
// //         .select()
// //         .single();

// //       if (sinistreError) {
// //         throw sinistreError;
// //       }

// //       // Si formulaire SONAS, sauvegarder les détails
// //       if (showSonasForm) {
// //         const sonasData = {
// //           sinistre_id: sinistre.id,
// //           agence: 'SONAS Lubumbashi',
// //           police: sonasForm.police || null,
// //           valable_du: sonasForm.valable_du || null,
// //           valable_au: sonasForm.valable_au || null,
// //           claim_no: numeroDossier,
// //           garantie: sonasForm.garantie || null,
// //           telephone: sonasForm.telephone || null,
// //           date_heure_accident: sonasForm.date_heure_accident || new Date().toISOString(),
// //           lieu_accident: sonasForm.lieu_accident || formData.lieu,
// //           preneur_nom: sonasForm.preneur_nom || null,
// //           preneur_prenoms: sonasForm.preneur_prenoms || null,
// //           preneur_adresse: sonasForm.preneur_adresse || null,
// //           conducteur_nom_prenom: sonasForm.conducteur_nom_prenom || null,
// //           conducteur_age: sonasForm.conducteur_age ? parseInt(sonasForm.conducteur_age) : null,
// //           conducteur_a_service: sonasForm.conducteur_a_service,
// //           conducteur_titre_conduite: sonasForm.conducteur_titre_conduite || null,
// //           permis_no: sonasForm.permis_no || null,
// //           permis_delivre_a: sonasForm.permis_delivre_a || null,
// //           permis_date: sonasForm.permis_date || null,
// //           vehicule_marque_type: sonasForm.vehicule_marque_type || null,
// //           vehicule_plaque: sonasForm.vehicule_plaque || null,
// //           vehicule_chassis: sonasForm.vehicule_chassis || null,
// //           vehicule_moteur: sonasForm.vehicule_moteur || null,
// //           vehicule_puissance: sonasForm.vehicule_puissance || null,
// //           vehicule_annee: sonasForm.vehicule_annee ? parseInt(sonasForm.vehicule_annee) : null,
// //           vehicule_kilometrage: sonasForm.vehicule_kilometrage ? parseInt(sonasForm.vehicule_kilometrage) : null,
// //           vehicule_valeur: sonasForm.vehicule_valeur ? parseFloat(sonasForm.vehicule_valeur) : null,
// //           garantie_rc: sonasForm.garantie_rc,
// //           garantie_dm: sonasForm.garantie_dm,
// //           garantie_inc: sonasForm.garantie_inc,
// //           garantie_vol: sonasForm.garantie_vol,
// //           description_accident: sonasForm.description_accident || 'Aucune description fournie',
// //           degats_description: sonasForm.degats_description || null,
// //           degats_montant_evalue: sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null,
// //           vehicule_immobilise: sonasForm.vehicule_immobilise,
// //           lieu_garde_expertise: sonasForm.lieu_garde_expertise || null,
// //           adversaire_nom: sonasForm.adversaire_nom || null,
// //           adversaire_post_nom: sonasForm.adversaire_post_nom || null,
// //           adversaire_prenom: sonasForm.adversaire_prenom || null,
// //           adversaire_adresse: sonasForm.adversaire_adresse || null,
// //           adversaire_vehicule: sonasForm.adversaire_vehicule || null,
// //           adversaire_plaque: sonasForm.adversaire_plaque || null,
// //           adversaire_assurance: sonasForm.adversaire_assurance || null,
// //           adversaire_telephone: sonasForm.adversaire_telephone || null,
// //           degats_materiels_description: sonasForm.degats_materiels_description || null,
// //           degats_materiels_evalues: sonasForm.degats_materiels_evalues ? parseFloat(sonasForm.degats_materiels_evalues) : null,
// //           blesses_ou_morts: sonasForm.blesses_ou_morts || false,
// //           victimes_infos: sonasForm.victimes_infos || null,
// //           victimes_soins_lieu: sonasForm.victimes_soins_lieu || null,
// //           hopital_nom_adresse: sonasForm.hopital_nom_adresse || null,
// //           medecin_nom: sonasForm.medecin_nom || null,
// //           medecin_telephone: sonasForm.medecin_telephone || null,
// //           tiers_transportes: sonasForm.tiers_transportes || null,
// //           temoins: sonasForm.temoins || null,
// //           pv_par: sonasForm.pv_par || null,
// //           localite: sonasForm.localite || null,
// //           gendarmerie: sonasForm.gendarmerie || null,
// //           officier_gendarme: sonasForm.officier_gendarme || null,
// //           prime_payee: sonasForm.prime_payee,
// //           prime_date: sonasForm.prime_date || null,
// //           fait_a: sonasForm.fait_a || null,
// //           date_signature: sonasForm.date_signature || null,
// //         };

// //         const { error: sonasError } = await supabase
// //           .from('sonas_declarations_accident')
// //           .insert(sonasData);

// //         if (sonasError) {
// //           throw sonasError;
// //         }
// //       }

// //       setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
      
// //       setTimeout(() => {
// //         router.push('/assure/sinistres');
// //       }, 2000);

// //     } catch (err: any) {
// //       console.error('❌ Erreur:', err);
// //       setError(err.message || 'Erreur lors de la déclaration');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //       <div className="mb-8">
// //         <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
// //           <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
// //         </Link>
// //         <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
// //           <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
// //           Déclaration de Sinistre
// //         </h1>
// //       </div>

// //       {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaTimesCircle className="h-5 w-5 text-red-400" /><p className="ml-3 text-sm text-red-700">{error}</p></div>}
// //       {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400" /><p className="ml-3 text-sm text-green-700">{success}</p></div>}

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Formulaire de base */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
// //           <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
          
// //           {user?.role !== 'assure' && (
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium mb-2">Assuré *</label>
// //               {selectedAssure ? (
// //                 <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
// //                   <div className="flex items-center gap-3">
// //                     <UserAvatar user={selectedAssure} />
// //                     <div><p className="font-medium">{selectedAssure.nom}</p><p className="text-xs text-gray-500">{selectedAssure.email}</p></div>
// //                   </div>
// //                   <button type="button" onClick={() => { setSelectedAssure(null); setFormData(prev => ({ ...prev, assure_id: '', souscription_id: '' })); setSouscriptions([]); setShowSonasForm(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
// //                 </div>
// //               ) : (
// //                 <div ref={searchRef} className="relative">
// //                   <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
// //                   <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Rechercher un assuré..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
// //                   {showDropdown && filteredAssures.length > 0 && (
// //                     <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
// //                       {filteredAssures.map(a => (
// //                         <button key={a.id} type="button" onClick={() => handleSelectAssure(a)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
// //                           <UserAvatar user={a} size="sm" /><span>{a.nom}</span>
// //                         </button>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {selectedAssure && (
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium mb-2">Contrat *</label>
// //               {souscriptionsLoading ? (
// //                 <div className="flex items-center gap-2 text-gray-500"><FaSpinner className="animate-spin" /> Chargement...</div>
// //               ) : (
// //                 <select name="souscription_id" value={formData.souscription_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
// //                   <option value="">-- Sélectionnez un contrat --</option>
// //                   {souscriptions.map(s => (
// //                     <option key={s.id} value={s.id}>{s.type_assurance_nom} - {s.numero_assure}</option>
// //                   ))}
// //                 </select>
// //               )}
// //             </div>
// //           )}

// //           {formData.souscription_id && (
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium mb-2">Type de sinistre *</label>
// //               <div className="grid grid-cols-4 gap-2">
// //                 {TYPES_SINISTRE.map(type => (
// //                   <button key={type.value} type="button" onClick={() => setFormData(prev => ({ ...prev, type_sinistre: type.value }))}
// //                     className={`p-2 text-sm rounded-md border ${formData.type_sinistre === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
// //                     <span className="text-xl block mb-1">{type.icon}</span><span className="text-xs">{type.label}</span>
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           <div className="grid grid-cols-2 gap-4 mb-4">
// //             <div><label className="block text-xs font-medium text-gray-700 mb-1">Date du sinistre *</label><input type="date" name="date_sinistre" value={formData.date_sinistre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //             <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu *</label><input type="text" name="lieu" value={formData.lieu} onChange={handleChange} required placeholder="Adresse du sinistre" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //           </div>
// //           <div className="mb-4"><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //           <div><label className="block text-xs font-medium text-gray-700 mb-1">Montant estimé (optionnel)</label><input type="number" name="montant_estime" value={formData.montant_estime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //         </div>

// //         {/* Indicateur de chargement véhicule */}
// //         {vehiculeLoading && (
// //           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
// //             <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
// //             <p className="text-sm text-blue-700">Chargement des informations du véhicule...</p>
// //           </div>
// //         )}

// //         {/* FORMULAIRE SONAS */}
// //         {showSonasForm && (
// //           <div className="bg-white rounded-lg shadow-sm border-2 border-blue-300 overflow-hidden">
// //             <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
// //               <FaCar className="h-6 w-6" />
// //               <div>
// //                 <h2 className="text-lg font-bold">🚗 DÉCLARATION D'ACCIDENT AUTOMOBILE - SONAS</h2>
// //                 <p className="text-blue-100 text-sm">
// //                   Formulaire détaillé pour assurance automobile
// //                   {!vehiculeLoading && sonasForm.vehicule_plaque && (
// //                     <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
// //                       Véhicule pré-rempli ✓
// //                     </span>
// //                   )}
// //                 </p>
// //               </div>
// //             </div>
            
// //             <div className="p-6 space-y-4">
// //               {/* Infos générales */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaBuilding className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Informations générales</h3></div>
// //                 <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Agence</label><input type="text" defaultValue="SONAS Lubumbashi" className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50" disabled /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Police</label><input type="text" name="police" value={sonasForm.police} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Claim n°</label><input type="text" name="claim_no" value={sonasForm.claim_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Valable du</label><input type="date" name="valable_du" value={sonasForm.valable_du} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Au</label><input type="date" name="valable_au" value={sonasForm.valable_au} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Garantie</label><select name="garantie" value={sonasForm.garantie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm"><option value="">Sélectionner</option><option value="RC">RC</option><option value="DM">DM</option><option value="INC">Inc.</option><option value="VOL">Vol</option></select></div>
// //                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="telephone" value={sonasForm.telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 1. Date et heure */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaCalendarAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">1. Date et heure de l'accident</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Date et heure *</label><input type="datetime-local" name="date_heure_accident" value={sonasForm.date_heure_accident} onChange={handleSonasChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Lieu *</label><input type="text" name="lieu_accident" value={sonasForm.lieu_accident} onChange={handleSonasChange} required placeholder="Adresse complète" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 2. Preneur d'assurance */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">2. Preneur d'assurance</h3></div>
// //                 <div className="p-4 grid grid-cols-3 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="preneur_nom" value={sonasForm.preneur_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Prénoms</label><input type="text" name="preneur_prenoms" value={sonasForm.preneur_prenoms} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="preneur_adresse" value={sonasForm.preneur_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 3. Conducteur */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaIdCard className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">3. Conducteur</h3></div>
// //                 <div className="p-4 grid grid-cols-3 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Nom et prénom</label><input type="text" name="conducteur_nom_prenom" value={sonasForm.conducteur_nom_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Âge</label><input type="number" name="conducteur_age" value={sonasForm.conducteur_age} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div>
// //                     <label className="block text-xs font-medium mb-2">À votre service ?</label>
// //                     <div className="flex gap-4">
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === true} onChange={() => handleSonasRadio('conducteur_a_service', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === false} onChange={() => handleSonasRadio('conducteur_a_service', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// //                     </div>
// //                   </div>
// //                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Titre de conduite</label><input type="text" name="conducteur_titre_conduite" value={sonasForm.conducteur_titre_conduite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Permis n°</label><input type="text" name="permis_no" value={sonasForm.permis_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Délivré à</label><input type="text" name="permis_delivre_a" value={sonasForm.permis_delivre_a} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Date</label><input type="date" name="permis_date" value={sonasForm.permis_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 4. Véhicule - PRÉ-REMPLI */}
// //               <div className="border rounded-lg overflow-hidden border-green-300">
// //                 <div className="bg-green-50 px-4 py-3 border-b flex items-center gap-2">
// //                   <FaCar className="text-green-600 h-4 w-4" />
// //                   <h3 className="font-semibold text-sm">4. Véhicule {!vehiculeLoading && sonasForm.vehicule_plaque && <span className="text-xs text-green-600 ml-2">(Pré-rempli depuis votre contrat)</span>}</h3>
// //                 </div>
// //                 <div className="p-4 grid grid-cols-3 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Marque et type</label><input type="text" name="vehicule_marque_type" value={sonasForm.vehicule_marque_type} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_marque_type ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">N° plaque</label><input type="text" name="vehicule_plaque" value={sonasForm.vehicule_plaque} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_plaque ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">N° châssis</label><input type="text" name="vehicule_chassis" value={sonasForm.vehicule_chassis} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_chassis ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">N° moteur</label><input type="text" name="vehicule_moteur" value={sonasForm.vehicule_moteur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_moteur ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Puissance</label><input type="text" name="vehicule_puissance" value={sonasForm.vehicule_puissance} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_puissance ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Année</label><input type="number" name="vehicule_annee" value={sonasForm.vehicule_annee} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_annee ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Kilométrage</label><input type="number" name="vehicule_kilometrage" value={sonasForm.vehicule_kilometrage} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_kilometrage ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Valeur</label><input type="number" name="vehicule_valeur" value={sonasForm.vehicule_valeur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_valeur ? 'bg-green-50 border-green-300' : ''}`} /></div>
// //                 </div>
// //                 <div className="px-4 pb-4">
// //                   <label className="block text-xs font-medium mb-2">Garanties :</label>
// //                   <div className="flex flex-wrap gap-6">
// //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_rc} onChange={(e) => handleSonasCheckbox('garantie_rc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">R.C.</span></label>
// //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_dm} onChange={(e) => handleSonasCheckbox('garantie_dm', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">D.M.</span></label>
// //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_inc} onChange={(e) => handleSonasCheckbox('garantie_inc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Inc.</span></label>
// //                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_vol} onChange={(e) => handleSonasCheckbox('garantie_vol', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Vol</span></label>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* 5. Description accident */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaClipboardList className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">5. Description de l'accident</h3></div>
// //                 <div className="p-4 space-y-4">
// //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="description_accident" value={sonasForm.description_accident} onChange={handleSonasChange} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Plan des lieux</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 h-48 flex items-center justify-center"><span className="text-gray-400 text-sm">Zone de dessin</span></div></div>
// //                 </div>
// //               </div>

// //               {/* 6. Dégâts véhicule */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">6. Dégâts de votre véhicule</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_description" value={sonasForm.degats_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Montant évalué</label><input type="number" name="degats_montant_evalue" value={sonasForm.degats_montant_evalue} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 7. Garage */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">7. Garage</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-medium mb-2">Véhicule immobilisé ?</label>
// //                     <div className="flex gap-4">
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === true} onChange={() => handleSonasRadio('vehicule_immobilise', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === false} onChange={() => handleSonasRadio('vehicule_immobilise', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// //                     </div>
// //                   </div>
// //                   <div><label className="block text-xs font-medium mb-1">Lieu de garde</label><input type="text" name="lieu_garde_expertise" value={sonasForm.lieu_garde_expertise} onChange={handleSonasChange} placeholder="Adresse du garage" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 8. Adversaire */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">8. Adversaire</h3></div>
// //                 <div className="p-4 grid grid-cols-3 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="adversaire_nom" value={sonasForm.adversaire_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Post-nom</label><input type="text" name="adversaire_post_nom" value={sonasForm.adversaire_post_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Prénom</label><input type="text" name="adversaire_prenom" value={sonasForm.adversaire_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="adversaire_adresse" value={sonasForm.adversaire_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Véhicule</label><input type="text" name="adversaire_vehicule" value={sonasForm.adversaire_vehicule} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Plaque</label><input type="text" name="adversaire_plaque" value={sonasForm.adversaire_plaque} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Assurance</label><input type="text" name="adversaire_assurance" value={sonasForm.adversaire_assurance} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="adversaire_telephone" value={sonasForm.adversaire_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 9. Dégâts matériels tiers */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">9. Dégâts matériels (tiers)</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_materiels_description" value={sonasForm.degats_materiels_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Dégâts évalués à</label><input type="number" name="degats_materiels_evalues" value={sonasForm.degats_materiels_evalues} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 10. Blessés ou morts */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUserInjured className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">10. Blessés ou morts</h3></div>
// //                 <div className="p-4 space-y-4">
// //                   <div>
// //                     <label className="block text-xs font-medium mb-2">Y a-t-il des blessés/morts ?</label>
// //                     <div className="flex gap-4">
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === true} onChange={() => handleSonasRadio('blesses_ou_morts', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === false} onChange={() => handleSonasRadio('blesses_ou_morts', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// //                     </div>
// //                   </div>
// //                   <div><label className="block text-xs font-medium mb-1">Victimes (nom, prénom, adresse)</label><textarea name="victimes_infos" value={sonasForm.victimes_infos} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Où se trouvent les victimes ?</label><input type="text" name="victimes_soins_lieu" value={sonasForm.victimes_soins_lieu} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div className="grid grid-cols-2 gap-4">
// //                     <div><label className="block text-xs font-medium mb-1">Hôpital</label><input type="text" name="hopital_nom_adresse" value={sonasForm.hopital_nom_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                     <div><label className="block text-xs font-medium mb-1">Médecin</label><input type="text" name="medecin_nom" value={sonasForm.medecin_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   </div>
// //                   <div><label className="block text-xs font-medium mb-1">Tél médecin</label><input type="tel" name="medecin_telephone" value={sonasForm.medecin_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 11. Tiers transportés */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">11. Tiers transportés</h3></div>
// //                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="tiers_transportes" value={sonasForm.tiers_transportes} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //               </div>

// //               {/* 12. Témoins */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">12. Témoins</h3></div>
// //                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="temoins" value={sonasForm.temoins} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //               </div>

// //               {/* 13. Autorités */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaShieldAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">13. Autorités</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">PV par</label><input type="text" name="pv_par" value={sonasForm.pv_par} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Localité</label><input type="text" name="localite" value={sonasForm.localite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Gendarmerie</label><input type="text" name="gendarmerie" value={sonasForm.gendarmerie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Officier</label><input type="text" name="officier_gendarme" value={sonasForm.officier_gendarme} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* 14. Prime */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">14. Prime d'assurance</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-xs font-medium mb-2">Dernière prime payée ?</label>
// //                     <div className="flex gap-4">
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === true} onChange={() => handleSonasRadio('prime_payee', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
// //                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === false} onChange={() => handleSonasRadio('prime_payee', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
// //                     </div>
// //                   </div>
// //                   <div><label className="block text-xs font-medium mb-1">Si oui, date</label><input type="date" name="prime_date" value={sonasForm.prime_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //               </div>

// //               {/* Signature */}
// //               <div className="border rounded-lg overflow-hidden">
// //                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileSignature className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Signature</h3></div>
// //                 <div className="p-4 grid grid-cols-2 gap-4">
// //                   <div><label className="block text-xs font-medium mb-1">Fait à</label><input type="text" name="fait_a" value={sonasForm.fait_a} onChange={handleSonasChange} placeholder="Lieu" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                   <div><label className="block text-xs font-medium mb-1">Le</label><input type="date" name="date_signature" value={sonasForm.date_signature} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
// //                 </div>
// //                 <div className="px-4 pb-4"><label className="block text-xs font-medium mb-1">Signature</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 h-32 flex items-center justify-center"><span className="text-gray-400 text-sm">Espace signature</span></div></div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Boutons */}
// //         <div className="flex gap-4">
// //           <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
// //             {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
// //             {loading ? 'Enregistrement...' : 'Déclarer le sinistre'}
// //           </button>
// //           <Link href="/assure/sinistres" className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 text-center">Annuler</Link>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // app/assure/declaration/page.tsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { 
//   FaFileAlt, FaArrowLeft, FaSave, FaTimes,
//   FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
//   FaCalendarAlt, FaExclamationTriangle,
//   FaSearch, FaTrash, FaCar, FaUpload, FaImage,
//   FaBuilding, FaClipboardList, FaIdCard, FaTools,
//   FaUsers, FaUserInjured, FaFileSignature, FaShieldAlt,
//   FaPen
// } from 'react-icons/fa';
// import Link from 'next/link';

// // Types
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
//   police_numero?: string;
//   type_assurance_code: string;
//   type_assurance_nom: string;
//   type_assurance_id: string;
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
//   const getInitials = (nom: string) => nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
//   return (
//     <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
//       {user.photo_profil ? (
//         <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover" />
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
//   const [showSonasForm, setShowSonasForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
//   const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);
//   const [vehiculeLoading, setVehiculeLoading] = useState(false);

//   // Fichiers uploadés
//   const [planLieuxFile, setPlanLieuxFile] = useState<File | null>(null);
//   const [planLieuxPreview, setPlanLieuxPreview] = useState<string | null>(null);
//   const [signatureFile, setSignatureFile] = useState<File | null>(null);
//   const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

//   const [formData, setFormData] = useState({
//     assure_id: '',
//     souscription_id: '',
//     type_sinistre: '',
//     description: '',
//     date_sinistre: new Date().toISOString().split('T')[0],
//     lieu: '',
//     montant_estime: '',
//   });

//   // État du formulaire SONAS
//   const [sonasForm, setSonasForm] = useState({
//     police: '',
//     valable_du: '',
//     valable_au: '',
//     claim_no: '',
//     garantie: '',
//     telephone: '',
//     date_heure_accident: '',
//     lieu_accident: '',
//     preneur_nom: '',
//     preneur_prenoms: '',
//     preneur_adresse: '',
//     conducteur_nom_prenom: '',
//     conducteur_age: '',
//     conducteur_a_service: null as boolean | null,
//     conducteur_titre_conduite: '',
//     permis_no: '',
//     permis_delivre_a: '',
//     permis_date: '',
//     vehicule_marque_type: '',
//     vehicule_plaque: '',
//     vehicule_chassis: '',
//     vehicule_moteur: '',
//     vehicule_puissance: '',
//     vehicule_annee: '',
//     vehicule_kilometrage: '',
//     vehicule_valeur: '',
//     garantie_rc: false,
//     garantie_dm: false,
//     garantie_inc: false,
//     garantie_vol: false,
//     description_accident: '',
//     degats_description: '',
//     degats_montant_evalue: '',
//     vehicule_immobilise: null as boolean | null,
//     lieu_garde_expertise: '',
//     adversaire_nom: '',
//     adversaire_post_nom: '',
//     adversaire_prenom: '',
//     adversaire_adresse: '',
//     adversaire_vehicule: '',
//     adversaire_plaque: '',
//     adversaire_assurance: '',
//     adversaire_telephone: '',
//     degats_materiels_description: '',
//     degats_materiels_evalues: '',
//     blesses_ou_morts: null as boolean | null,
//     victimes_infos: '',
//     victimes_soins_lieu: '',
//     hopital_nom_adresse: '',
//     medecin_nom: '',
//     medecin_telephone: '',
//     tiers_transportes: '',
//     temoins: '',
//     pv_par: '',
//     localite: '',
//     gendarmerie: '',
//     officier_gendarme: '',
//     prime_payee: null as boolean | null,
//     prime_date: '',
//     fait_a: '',
//     date_signature: '',
//   });

//   // Gestionnaires de fichiers
//   const handlePlanLieuxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('Le plan des lieux doit être une image (JPG, PNG, etc.)');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError('L\'image ne doit pas dépasser 5MB');
//         return;
//       }
//       setPlanLieuxFile(file);
//       setPlanLieuxPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('La signature doit être une image (JPG, PNG, etc.)');
//         return;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         setError('L\'image ne doit pas dépasser 2MB');
//         return;
//       }
//       setSignatureFile(file);
//       setSignaturePreview(URL.createObjectURL(file));
//     }
//   };

//   const removePlanLieux = () => {
//     setPlanLieuxFile(null);
//     setPlanLieuxPreview(null);
//   };

//   const removeSignature = () => {
//     setSignatureFile(null);
//     setSignaturePreview(null);
//   };

//   // Fonction pour uploader un fichier
//   const uploadFile = async (file: File, sinistreId: string, type: string): Promise<string> => {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${sinistreId}/${type}-${Date.now()}.${fileExt}`;
    
//     const { error: uploadError } = await supabase.storage
//       .from('sinistres')
//       .upload(fileName, file, {
//         cacheControl: '3600',
//         upsert: false
//       });
    
//     if (uploadError) throw uploadError;
    
//     const { data: { publicUrl } } = supabase.storage
//       .from('sinistres')
//       .getPublicUrl(fileName);
    
//     return publicUrl;
//   };

//   // Handlers SONAS
//   const handleSonasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setSonasForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSonasRadio = (name: string, value: boolean) => {
//     setSonasForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSonasCheckbox = (name: string, checked: boolean) => {
//     setSonasForm(prev => ({ ...prev, [name]: checked }));
//   };

//   // INITIALISATION
//   useEffect(() => {
//     if (user?.role === 'assure' && user.id) {
//       setFormData(prev => ({ ...prev, assure_id: user.id }));
//       setSelectedAssure({
//         id: user.id, email: user.email || '', nom: user.nom || '',
//         role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
//       });
//       chargerSouscriptions(user.id);
//     } else if (user?.role !== 'assure') {
//       chargerAssures();
//     }
//   }, [user]);

//   // DÉTECTION AUTOMOBILE ET PRÉ-REMPLISSAGE
//   useEffect(() => {
//     if (!formData.souscription_id) {
//       setShowSonasForm(false);
//       return;
//     }
    
//     const selected = souscriptions.find(s => String(s.id) === String(formData.souscription_id));
    
//     if (selected && selected.type_assurance_code === 'automobile') {
//       setShowSonasForm(true);
      
//       setSonasForm(prev => ({
//         ...prev,
//         police: selected.police_numero || '',
//         telephone: selectedAssure?.telephone || user?.telephone || '',
//         preneur_nom: selectedAssure?.nom || user?.nom || '',
//         date_heure_accident: formData.date_sinistre + 'T00:00',
//         lieu_accident: formData.lieu,
//         description_accident: formData.description,
//         degats_montant_evalue: formData.montant_estime,
//       }));
      
//       chargerInfosVehicule(formData.souscription_id);
//     } else {
//       setShowSonasForm(false);
//     }
//   }, [formData.souscription_id, souscriptions]);

//   const chargerInfosVehicule = async (souscriptionId: string) => {
//     setVehiculeLoading(true);
    
//     try {
//       const { data: vehicule, error } = await supabase
//         .from('vehicules_assures')
//         .select('*')
//         .eq('souscription_id', souscriptionId)
//         .single();
      
//       if (error) {
//         console.log('Aucune info véhicule trouvée:', error.message);
//         return;
//       }
      
//       if (vehicule) {
//         setSonasForm(prev => ({
//           ...prev,
//           vehicule_marque_type: vehicule.marque_type || '',
//           vehicule_plaque: vehicule.plaque_immatriculation || '',
//           vehicule_chassis: vehicule.numero_chassis || '',
//           vehicule_moteur: vehicule.numero_moteur || '',
//           vehicule_puissance: vehicule.puissance || '',
//           vehicule_annee: vehicule.annee ? String(vehicule.annee) : '',
//           vehicule_kilometrage: vehicule.kilometrage ? String(vehicule.kilometrage) : '',
//           vehicule_valeur: vehicule.valeur ? String(vehicule.valeur) : '',
//         }));
//       }
//     } catch (err: any) {
//       console.error('Erreur chargement véhicule:', err.message);
//     } finally {
//       setVehiculeLoading(false);
//     }
//   };

//   const chargerAssures = async () => {
//     const { data } = await supabase.from('users').select('id, email, nom, role, telephone, photo_profil').eq('role', 'assure').order('nom');
//     if (data) { setAssures(data); setFilteredAssures(data); }
//   };

//   const chargerSouscriptions = async (assureId: string) => {
//     setSouscriptionsLoading(true);
//     setSouscriptions([]);
//     setFormData(prev => ({ ...prev, souscription_id: '', type_sinistre: '' }));
//     setShowSonasForm(false);

//     try {
//       const { data, error } = await supabase
//         .from('souscriptions')
//         .select(`
//           id, numero_assure, police_numero, type_assurance_id, date_expiration, statut,
//           type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(id, code, nom)
//         `)
//         .eq('assure_id', assureId)
//         .eq('statut', 'active');

//       if (error) throw error;

//       if (data) {
//         const formatted = data.map((s: any) => ({
//           id: String(s.id),
//           numero_assure: s.numero_assure || 'N/A',
//           police_numero: s.police_numero,
//           type_assurance_id: s.type_assurance_id,
//           type_assurance_code: s.type_assurance?.code || 'inconnu',
//           type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
//           date_expiration: s.date_expiration,
//           statut: s.statut,
//         }));
//         setSouscriptions(formatted);
//       }
//     } catch (err: any) {
//       setError('Erreur chargement contrats: ' + err.message);
//     } finally {
//       setSouscriptionsLoading(false);
//     }
//   };

//   const handleSelectAssure = (assure: User) => {
//     setSelectedAssure(assure);
//     setFormData(prev => ({ ...prev, assure_id: assure.id, souscription_id: '', type_sinistre: '' }));
//     setSearchTerm('');
//     setShowDropdown(false);
//     setShowSonasForm(false);
//     chargerSouscriptions(assure.id);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     setLoading(true);
//     setError(null);

//     try {
//       const now = new Date();
//       const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      
//       const { data: lastSinistre } = await supabase
//         .from('sinistres')
//         .select('numero_dossier')
//         .like('numero_dossier', `${prefix}%`)
//         .order('numero_dossier', { ascending: false })
//         .limit(1);

//       let sequence = 1;
//       if (lastSinistre && lastSinistre.length > 0) {
//         const parts = lastSinistre[0].numero_dossier.split('-');
//         sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
//       }
      
//       const numeroDossier = `${prefix}-${String(sequence).padStart(4, '0')}`;

//       const sinistreData: any = {
//         assure_id: formData.assure_id,
//         souscription_id: formData.souscription_id,
//         numero_dossier: numeroDossier,
//         type_sinistre: formData.type_sinistre || 'accident_auto',
//         description: showSonasForm ? 'Déclaration accident automobile - voir formulaire SONAS' : formData.description,
//         date_sinistre: formData.date_sinistre,
//         lieu: showSonasForm ? sonasForm.lieu_accident : formData.lieu,
//         montant_estime: showSonasForm ? (sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null) : (formData.montant_estime ? parseFloat(formData.montant_estime) : null),
//         statut: 'en_attente',
//         created_by: user?.id,
//       };

//       const { data: sinistre, error: sinistreError } = await supabase
//         .from('sinistres')
//         .insert(sinistreData)
//         .select()
//         .single();

//       if (sinistreError) throw sinistreError;

//       // Upload des fichiers
//       let planLieuxUrl = null;
//       let signatureUrl = null;

//       if (planLieuxFile) {
//         planLieuxUrl = await uploadFile(planLieuxFile, sinistre.id, 'plan_lieux');
//       }

//       if (signatureFile) {
//         signatureUrl = await uploadFile(signatureFile, sinistre.id, 'signature');
//       }

//       if (showSonasForm) {
//         const sonasData = {
//           sinistre_id: sinistre.id,
//           agence: 'SONAS Lubumbashi',
//           police: sonasForm.police || null,
//           valable_du: sonasForm.valable_du || null,
//           valable_au: sonasForm.valable_au || null,
//           claim_no: numeroDossier,
//           garantie: sonasForm.garantie || null,
//           telephone: sonasForm.telephone || null,
//           date_heure_accident: sonasForm.date_heure_accident || new Date().toISOString(),
//           lieu_accident: sonasForm.lieu_accident || formData.lieu,
//           preneur_nom: sonasForm.preneur_nom || null,
//           preneur_prenoms: sonasForm.preneur_prenoms || null,
//           preneur_adresse: sonasForm.preneur_adresse || null,
//           conducteur_nom_prenom: sonasForm.conducteur_nom_prenom || null,
//           conducteur_age: sonasForm.conducteur_age ? parseInt(sonasForm.conducteur_age) : null,
//           conducteur_a_service: sonasForm.conducteur_a_service,
//           conducteur_titre_conduite: sonasForm.conducteur_titre_conduite || null,
//           permis_no: sonasForm.permis_no || null,
//           permis_delivre_a: sonasForm.permis_delivre_a || null,
//           permis_date: sonasForm.permis_date || null,
//           vehicule_marque_type: sonasForm.vehicule_marque_type || null,
//           vehicule_plaque: sonasForm.vehicule_plaque || null,
//           vehicule_chassis: sonasForm.vehicule_chassis || null,
//           vehicule_moteur: sonasForm.vehicule_moteur || null,
//           vehicule_puissance: sonasForm.vehicule_puissance || null,
//           vehicule_annee: sonasForm.vehicule_annee ? parseInt(sonasForm.vehicule_annee) : null,
//           vehicule_kilometrage: sonasForm.vehicule_kilometrage ? parseInt(sonasForm.vehicule_kilometrage) : null,
//           vehicule_valeur: sonasForm.vehicule_valeur ? parseFloat(sonasForm.vehicule_valeur) : null,
//           garantie_rc: sonasForm.garantie_rc,
//           garantie_dm: sonasForm.garantie_dm,
//           garantie_inc: sonasForm.garantie_inc,
//           garantie_vol: sonasForm.garantie_vol,
//           description_accident: sonasForm.description_accident || 'Aucune description fournie',
//           plan_lieux_url: planLieuxUrl,
//           degats_description: sonasForm.degats_description || null,
//           degats_montant_evalue: sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null,
//           vehicule_immobilise: sonasForm.vehicule_immobilise,
//           lieu_garde_expertise: sonasForm.lieu_garde_expertise || null,
//           adversaire_nom: sonasForm.adversaire_nom || null,
//           adversaire_post_nom: sonasForm.adversaire_post_nom || null,
//           adversaire_prenom: sonasForm.adversaire_prenom || null,
//           adversaire_adresse: sonasForm.adversaire_adresse || null,
//           adversaire_vehicule: sonasForm.adversaire_vehicule || null,
//           adversaire_plaque: sonasForm.adversaire_plaque || null,
//           adversaire_assurance: sonasForm.adversaire_assurance || null,
//           adversaire_telephone: sonasForm.adversaire_telephone || null,
//           degats_materiels_description: sonasForm.degats_materiels_description || null,
//           degats_materiels_evalues: sonasForm.degats_materiels_evalues ? parseFloat(sonasForm.degats_materiels_evalues) : null,
//           blesses_ou_morts: sonasForm.blesses_ou_morts || false,
//           victimes_infos: sonasForm.victimes_infos || null,
//           victimes_soins_lieu: sonasForm.victimes_soins_lieu || null,
//           hopital_nom_adresse: sonasForm.hopital_nom_adresse || null,
//           medecin_nom: sonasForm.medecin_nom || null,
//           medecin_telephone: sonasForm.medecin_telephone || null,
//           tiers_transportes: sonasForm.tiers_transportes || null,
//           temoins: sonasForm.temoins || null,
//           pv_par: sonasForm.pv_par || null,
//           localite: sonasForm.localite || null,
//           gendarmerie: sonasForm.gendarmerie || null,
//           officier_gendarme: sonasForm.officier_gendarme || null,
//           prime_payee: sonasForm.prime_payee,
//           prime_date: sonasForm.prime_date || null,
//           fait_a: sonasForm.fait_a || null,
//           date_signature: sonasForm.date_signature || null,
//           signature_assure_url: signatureUrl,
//         };

//         const { error: sonasError } = await supabase
//           .from('sonas_declarations_accident')
//           .insert(sonasData);

//         if (sonasError) throw sonasError;
//       }

//       setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
      
//       setTimeout(() => {
//         router.push('/assure/sinistres');
//       }, 2000);

//     } catch (err: any) {
//       console.error('❌ Erreur:', err);
//       setError(err.message || 'Erreur lors de la déclaration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
//           <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
//         </Link>
//         <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
//           <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
//           Déclaration de Sinistre
//         </h1>
//       </div>

//       {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaTimesCircle className="h-5 w-5 text-red-400" /><p className="ml-3 text-sm text-red-700">{error}</p><button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button></div>}
//       {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400" /><p className="ml-3 text-sm text-green-700">{success}</p></div>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Formulaire de base */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
          
//           {user?.role !== 'assure' && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Assuré *</label>
//               {selectedAssure ? (
//                 <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <UserAvatar user={selectedAssure} />
//                     <div><p className="font-medium">{selectedAssure.nom}</p><p className="text-xs text-gray-500">{selectedAssure.email}</p></div>
//                   </div>
//                   <button type="button" onClick={() => { setSelectedAssure(null); setFormData(prev => ({ ...prev, assure_id: '', souscription_id: '' })); setSouscriptions([]); setShowSonasForm(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
//                 </div>
//               ) : (
//                 <div ref={searchRef} className="relative">
//                   <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//                   <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Rechercher un assuré..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
//                   {showDropdown && filteredAssures.length > 0 && (
//                     <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
//                       {filteredAssures.map(a => (
//                         <button key={a.id} type="button" onClick={() => handleSelectAssure(a)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
//                           <UserAvatar user={a} size="sm" /><span>{a.nom}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {selectedAssure && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Contrat *</label>
//               {souscriptionsLoading ? (
//                 <div className="flex items-center gap-2 text-gray-500"><FaSpinner className="animate-spin" /> Chargement...</div>
//               ) : (
//                 <select name="souscription_id" value={formData.souscription_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
//                   <option value="">-- Sélectionnez un contrat --</option>
//                   {souscriptions.map(s => (
//                     <option key={s.id} value={s.id}>{s.type_assurance_nom} - {s.numero_assure}</option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           )}

//           {formData.souscription_id && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">Type de sinistre *</label>
//               <div className="grid grid-cols-4 gap-2">
//                 {TYPES_SINISTRE.map(type => (
//                   <button key={type.value} type="button" onClick={() => setFormData(prev => ({ ...prev, type_sinistre: type.value }))}
//                     className={`p-2 text-sm rounded-md border ${formData.type_sinistre === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
//                     <span className="text-xl block mb-1">{type.icon}</span><span className="text-xs">{type.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div><label className="block text-xs font-medium text-gray-700 mb-1">Date du sinistre *</label><input type="date" name="date_sinistre" value={formData.date_sinistre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//             <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu *</label><input type="text" name="lieu" value={formData.lieu} onChange={handleChange} required placeholder="Adresse du sinistre" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//           </div>
//           <div className="mb-4"><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//           <div><label className="block text-xs font-medium text-gray-700 mb-1">Montant estimé (optionnel)</label><input type="number" name="montant_estime" value={formData.montant_estime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//         </div>

//         {vehiculeLoading && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
//             <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
//             <p className="text-sm text-blue-700">Chargement des informations du véhicule...</p>
//           </div>
//         )}

//         {/* FORMULAIRE SONAS */}
//         {showSonasForm && (
//           <div className="bg-white rounded-lg shadow-sm border-2 border-blue-300 overflow-hidden">
//             <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
//               <FaCar className="h-6 w-6" />
//               <div>
//                 <h2 className="text-lg font-bold">🚗 DÉCLARATION D'ACCIDENT AUTOMOBILE - SONAS</h2>
//                 <p className="text-blue-100 text-sm">
//                   Formulaire détaillé pour assurance automobile
//                   {!vehiculeLoading && sonasForm.vehicule_plaque && (
//                     <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
//                       Véhicule pré-rempli ✓
//                     </span>
//                   )}
//                 </p>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-4">
//               {/* Sections 1-4 identiques à l'original... */}
//               {/* Infos générales */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaBuilding className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Informations générales</h3></div>
//                 <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Agence</label><input type="text" defaultValue="SONAS Lubumbashi" className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50" disabled /></div>
//                   <div><label className="block text-xs font-medium mb-1">Police</label><input type="text" name="police" value={sonasForm.police} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Claim n°</label><input type="text" name="claim_no" value={sonasForm.claim_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Valable du</label><input type="date" name="valable_du" value={sonasForm.valable_du} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Au</label><input type="date" name="valable_au" value={sonasForm.valable_au} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Garantie</label><select name="garantie" value={sonasForm.garantie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm"><option value="">Sélectionner</option><option value="RC">RC</option><option value="DM">DM</option><option value="INC">Inc.</option><option value="VOL">Vol</option></select></div>
//                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="telephone" value={sonasForm.telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 1. Date et heure */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaCalendarAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">1. Date et heure de l'accident</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Date et heure *</label><input type="datetime-local" name="date_heure_accident" value={sonasForm.date_heure_accident} onChange={handleSonasChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Lieu *</label><input type="text" name="lieu_accident" value={sonasForm.lieu_accident} onChange={handleSonasChange} required placeholder="Adresse complète" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 2. Preneur d'assurance */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">2. Preneur d'assurance</h3></div>
//                 <div className="p-4 grid grid-cols-3 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="preneur_nom" value={sonasForm.preneur_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Prénoms</label><input type="text" name="preneur_prenoms" value={sonasForm.preneur_prenoms} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="preneur_adresse" value={sonasForm.preneur_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 3. Conducteur */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaIdCard className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">3. Conducteur</h3></div>
//                 <div className="p-4 grid grid-cols-3 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Nom et prénom</label><input type="text" name="conducteur_nom_prenom" value={sonasForm.conducteur_nom_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Âge</label><input type="number" name="conducteur_age" value={sonasForm.conducteur_age} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div>
//                     <label className="block text-xs font-medium mb-2">À votre service ?</label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === true} onChange={() => handleSonasRadio('conducteur_a_service', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === false} onChange={() => handleSonasRadio('conducteur_a_service', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
//                     </div>
//                   </div>
//                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Titre de conduite</label><input type="text" name="conducteur_titre_conduite" value={sonasForm.conducteur_titre_conduite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Permis n°</label><input type="text" name="permis_no" value={sonasForm.permis_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Délivré à</label><input type="text" name="permis_delivre_a" value={sonasForm.permis_delivre_a} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Date</label><input type="date" name="permis_date" value={sonasForm.permis_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 4. Véhicule */}
//               <div className="border rounded-lg overflow-hidden border-green-300">
//                 <div className="bg-green-50 px-4 py-3 border-b flex items-center gap-2">
//                   <FaCar className="text-green-600 h-4 w-4" />
//                   <h3 className="font-semibold text-sm">4. Véhicule {!vehiculeLoading && sonasForm.vehicule_plaque && <span className="text-xs text-green-600 ml-2">(Pré-rempli depuis votre contrat)</span>}</h3>
//                 </div>
//                 <div className="p-4 grid grid-cols-3 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Marque et type</label><input type="text" name="vehicule_marque_type" value={sonasForm.vehicule_marque_type} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_marque_type ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">N° plaque</label><input type="text" name="vehicule_plaque" value={sonasForm.vehicule_plaque} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_plaque ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">N° châssis</label><input type="text" name="vehicule_chassis" value={sonasForm.vehicule_chassis} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_chassis ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">N° moteur</label><input type="text" name="vehicule_moteur" value={sonasForm.vehicule_moteur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_moteur ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">Puissance</label><input type="text" name="vehicule_puissance" value={sonasForm.vehicule_puissance} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_puissance ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">Année</label><input type="number" name="vehicule_annee" value={sonasForm.vehicule_annee} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_annee ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div><label className="block text-xs font-medium mb-1">Kilométrage</label><input type="number" name="vehicule_kilometrage" value={sonasForm.vehicule_kilometrage} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_kilometrage ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                   <div className="col-span-2"><label className="block text-xs font-medium mb-1">Valeur</label><input type="number" name="vehicule_valeur" value={sonasForm.vehicule_valeur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_valeur ? 'bg-green-50 border-green-300' : ''}`} /></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <label className="block text-xs font-medium mb-2">Garanties :</label>
//                   <div className="flex flex-wrap gap-6">
//                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_rc} onChange={(e) => handleSonasCheckbox('garantie_rc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">R.C.</span></label>
//                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_dm} onChange={(e) => handleSonasCheckbox('garantie_dm', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">D.M.</span></label>
//                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_inc} onChange={(e) => handleSonasCheckbox('garantie_inc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Inc.</span></label>
//                     <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_vol} onChange={(e) => handleSonasCheckbox('garantie_vol', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Vol</span></label>
//                   </div>
//                 </div>
//               </div>

//               {/* 5. Description accident avec UPLOAD PLAN LIEUX */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaClipboardList className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">5. Description de l'accident</h3></div>
//                 <div className="p-4 space-y-4">
//                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="description_accident" value={sonasForm.description_accident} onChange={handleSonasChange} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div>
//                     <label className="block text-xs font-medium mb-2">Plan des lieux (image)</label>
//                     {planLieuxPreview ? (
//                       <div className="relative">
//                         <img src={planLieuxPreview} alt="Plan des lieux" className="w-full h-64 object-contain border rounded-lg" />
//                         <button type="button" onClick={removePlanLieux} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
//                           <FaTrash className="h-3 w-3" />
//                         </button>
//                       </div>
//                     ) : (
//                       <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
//                         <FaImage className="h-8 w-8 text-gray-400 mb-2" />
//                         <span className="text-sm text-gray-500 mb-1">Cliquez pour uploader le plan des lieux</span>
//                         <span className="text-xs text-gray-400">JPG, PNG (max 5MB)</span>
//                         <input type="file" accept="image/*" onChange={handlePlanLieuxUpload} className="sr-only" />
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Sections 6-14... */}
//               {/* 6. Dégâts véhicule */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">6. Dégâts de votre véhicule</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_description" value={sonasForm.degats_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Montant évalué</label><input type="number" name="degats_montant_evalue" value={sonasForm.degats_montant_evalue} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 7. Garage */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">7. Garage</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium mb-2">Véhicule immobilisé ?</label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === true} onChange={() => handleSonasRadio('vehicule_immobilise', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === false} onChange={() => handleSonasRadio('vehicule_immobilise', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
//                     </div>
//                   </div>
//                   <div><label className="block text-xs font-medium mb-1">Lieu de garde</label><input type="text" name="lieu_garde_expertise" value={sonasForm.lieu_garde_expertise} onChange={handleSonasChange} placeholder="Adresse du garage" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 8-13... (identiques) */}
//               {/* 8. Adversaire */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">8. Adversaire</h3></div>
//                 <div className="p-4 grid grid-cols-3 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="adversaire_nom" value={sonasForm.adversaire_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Post-nom</label><input type="text" name="adversaire_post_nom" value={sonasForm.adversaire_post_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Prénom</label><input type="text" name="adversaire_prenom" value={sonasForm.adversaire_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="adversaire_adresse" value={sonasForm.adversaire_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Véhicule</label><input type="text" name="adversaire_vehicule" value={sonasForm.adversaire_vehicule} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Plaque</label><input type="text" name="adversaire_plaque" value={sonasForm.adversaire_plaque} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Assurance</label><input type="text" name="adversaire_assurance" value={sonasForm.adversaire_assurance} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="adversaire_telephone" value={sonasForm.adversaire_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 9. Dégâts matériels tiers */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">9. Dégâts matériels (tiers)</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_materiels_description" value={sonasForm.degats_materiels_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Dégâts évalués à</label><input type="number" name="degats_materiels_evalues" value={sonasForm.degats_materiels_evalues} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 10. Blessés ou morts */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUserInjured className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">10. Blessés ou morts</h3></div>
//                 <div className="p-4 space-y-4">
//                   <div>
//                     <label className="block text-xs font-medium mb-2">Y a-t-il des blessés/morts ?</label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === true} onChange={() => handleSonasRadio('blesses_ou_morts', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === false} onChange={() => handleSonasRadio('blesses_ou_morts', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
//                     </div>
//                   </div>
//                   <div><label className="block text-xs font-medium mb-1">Victimes (nom, prénom, adresse)</label><textarea name="victimes_infos" value={sonasForm.victimes_infos} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Où se trouvent les victimes ?</label><input type="text" name="victimes_soins_lieu" value={sonasForm.victimes_soins_lieu} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div><label className="block text-xs font-medium mb-1">Hôpital</label><input type="text" name="hopital_nom_adresse" value={sonasForm.hopital_nom_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                     <div><label className="block text-xs font-medium mb-1">Médecin</label><input type="text" name="medecin_nom" value={sonasForm.medecin_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   </div>
//                   <div><label className="block text-xs font-medium mb-1">Tél médecin</label><input type="tel" name="medecin_telephone" value={sonasForm.medecin_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 11. Tiers transportés */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">11. Tiers transportés</h3></div>
//                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="tiers_transportes" value={sonasForm.tiers_transportes} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//               </div>

//               {/* 12. Témoins */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">12. Témoins</h3></div>
//                 <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="temoins" value={sonasForm.temoins} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//               </div>

//               {/* 13. Autorités */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaShieldAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">13. Autorités</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">PV par</label><input type="text" name="pv_par" value={sonasForm.pv_par} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Localité</label><input type="text" name="localite" value={sonasForm.localite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Gendarmerie</label><input type="text" name="gendarmerie" value={sonasForm.gendarmerie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Officier</label><input type="text" name="officier_gendarme" value={sonasForm.officier_gendarme} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* 14. Prime */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">14. Prime d'assurance</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-medium mb-2">Dernière prime payée ?</label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === true} onChange={() => handleSonasRadio('prime_payee', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
//                       <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === false} onChange={() => handleSonasRadio('prime_payee', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
//                     </div>
//                   </div>
//                   <div><label className="block text-xs font-medium mb-1">Si oui, date</label><input type="date" name="prime_date" value={sonasForm.prime_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//               </div>

//               {/* Signature avec UPLOAD */}
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileSignature className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Signature</h3></div>
//                 <div className="p-4 grid grid-cols-2 gap-4">
//                   <div><label className="block text-xs font-medium mb-1">Fait à</label><input type="text" name="fait_a" value={sonasForm.fait_a} onChange={handleSonasChange} placeholder="Lieu" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                   <div><label className="block text-xs font-medium mb-1">Le</label><input type="date" name="date_signature" value={sonasForm.date_signature} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
//                 </div>
//                 <div className="px-4 pb-4">
//                   <label className="block text-xs font-medium mb-2">Signature</label>
//                   {signaturePreview ? (
//                     <div className="relative">
//                       <img src={signaturePreview} alt="Signature" className="w-full h-32 object-contain border rounded-lg bg-white" />
//                       <button type="button" onClick={removeSignature} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
//                         <FaTrash className="h-3 w-3" />
//                       </button>
//                     </div>
//                   ) : (
//                     <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
//                       <FaPen className="h-8 w-8 text-gray-400 mb-2" />
//                       <span className="text-sm text-gray-500 mb-1">Cliquez pour uploader votre signature</span>
//                       <span className="text-xs text-gray-400">JPG, PNG (max 2MB)</span>
//                       <input type="file" accept="image/*" onChange={handleSignatureUpload} className="sr-only" />
//                     </label>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Boutons */}
//         <div className="flex gap-4">
//           <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
//             {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
//             {loading ? 'Enregistrement...' : 'Déclarer le sinistre'}
//           </button>
//           <Link href="/assure/sinistres" className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 text-center">Annuler</Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// app/assure/declaration/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  FaFileAlt, FaArrowLeft, FaSave, FaTimes,
  FaCheckCircle, FaTimesCircle, FaUser, FaSpinner,
  FaCalendarAlt, FaSearch, FaTrash, FaCar, FaUpload, FaImage,
  FaBuilding, FaClipboardList, FaIdCard, FaTools,
  FaUsers, FaUserInjured, FaFileSignature, FaShieldAlt,
  FaPen
} from 'react-icons/fa';
import Link from 'next/link';

// Types
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
  police_numero?: string;
  type_assurance_code: string;
  type_assurance_nom: string;
  type_assurance_id: string;
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
  const getInitials = (nom: string) => nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
      {user.photo_profil ? (
        <img src={user.photo_profil} alt={user.nom} className="w-full h-full object-cover" />
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
  const [showSonasForm, setShowSonasForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAssure, setSelectedAssure] = useState<User | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [souscriptions, setSouscriptions] = useState<Souscription[]>([]);
  const [souscriptionsLoading, setSouscriptionsLoading] = useState(false);
  const [vehiculeLoading, setVehiculeLoading] = useState(false);

  // Fichiers uploadés
  const [planLieuxFile, setPlanLieuxFile] = useState<File | null>(null);
  const [planLieuxPreview, setPlanLieuxPreview] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    assure_id: '',
    souscription_id: '',
    type_sinistre: '',
    description: '',
    date_sinistre: new Date().toISOString().split('T')[0],
    lieu: '',
    montant_estime: '',
  });

  // État du formulaire SONAS
  const [sonasForm, setSonasForm] = useState({
    police: '',
    valable_du: '',
    valable_au: '',
    claim_no: '',
    garantie: '',
    telephone: '',
    date_heure_accident: '',
    lieu_accident: '',
    preneur_nom: '',
    preneur_prenoms: '',
    preneur_adresse: '',
    conducteur_nom_prenom: '',
    conducteur_age: '',
    conducteur_a_service: null as boolean | null,
    conducteur_titre_conduite: '',
    permis_no: '',
    permis_delivre_a: '',
    permis_date: '',
    vehicule_marque_type: '',
    vehicule_plaque: '',
    vehicule_chassis: '',
    vehicule_moteur: '',
    vehicule_puissance: '',
    vehicule_annee: '',
    vehicule_kilometrage: '',
    vehicule_valeur: '',
    garantie_rc: false,
    garantie_dm: false,
    garantie_inc: false,
    garantie_vol: false,
    description_accident: '',
    degats_description: '',
    degats_montant_evalue: '',
    vehicule_immobilise: null as boolean | null,
    lieu_garde_expertise: '',
    adversaire_nom: '',
    adversaire_post_nom: '',
    adversaire_prenom: '',
    adversaire_adresse: '',
    adversaire_vehicule: '',
    adversaire_plaque: '',
    adversaire_assurance: '',
    adversaire_telephone: '',
    degats_materiels_description: '',
    degats_materiels_evalues: '',
    blesses_ou_morts: null as boolean | null,
    victimes_infos: '',
    victimes_soins_lieu: '',
    hopital_nom_adresse: '',
    medecin_nom: '',
    medecin_telephone: '',
    tiers_transportes: '',
    temoins: '',
    pv_par: '',
    localite: '',
    gendarmerie: '',
    officier_gendarme: '',
    prime_payee: null as boolean | null,
    prime_date: '',
    fait_a: '',
    date_signature: '',
  });

  // Gestionnaires de fichiers
  const handlePlanLieuxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Le plan des lieux doit être une image (JPG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      setPlanLieuxFile(file);
      setPlanLieuxPreview(URL.createObjectURL(file));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('La signature doit être une image (JPG, PNG, etc.)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 2MB');
        return;
      }
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const removePlanLieux = () => {
    setPlanLieuxFile(null);
    setPlanLieuxPreview(null);
  };

  const removeSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  // Fonction pour uploader un fichier
  const uploadFile = async (file: File, sinistreId: string, type: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${sinistreId}/${type}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('sinistres')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('sinistres')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  // Handlers SONAS
  const handleSonasChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSonasForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSonasRadio = (name: string, value: boolean) => {
    setSonasForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSonasCheckbox = (name: string, checked: boolean) => {
    setSonasForm(prev => ({ ...prev, [name]: checked }));
  };

  // INITIALISATION
  useEffect(() => {
    if (user?.role === 'assure' && user.id) {
      setFormData(prev => ({ ...prev, assure_id: user.id }));
      setSelectedAssure({
        id: user.id, email: user.email || '', nom: user.nom || '',
        role: 'assure', telephone: user.telephone, photo_profil: user.photo_profil,
      });
      chargerSouscriptions(user.id);
    } else if (user?.role !== 'assure') {
      chargerAssures();
    }
  }, [user]);

  // DÉTECTION AUTOMOBILE ET PRÉ-REMPLISSAGE
  useEffect(() => {
    if (!formData.souscription_id) {
      setShowSonasForm(false);
      return;
    }
    
    const selected = souscriptions.find(s => String(s.id) === String(formData.souscription_id));
    
    if (selected && selected.type_assurance_code === 'automobile') {
      setShowSonasForm(true);
      
      setSonasForm(prev => ({
        ...prev,
        police: selected.police_numero || '',
        telephone: selectedAssure?.telephone || user?.telephone || '',
        preneur_nom: selectedAssure?.nom || user?.nom || '',
        date_heure_accident: formData.date_sinistre + 'T00:00',
        lieu_accident: formData.lieu,
        description_accident: formData.description,
        degats_montant_evalue: formData.montant_estime,
      }));
      
      chargerInfosVehicule(formData.souscription_id);
    } else {
      setShowSonasForm(false);
    }
  }, [formData.souscription_id, souscriptions]);

  const chargerInfosVehicule = async (souscriptionId: string) => {
    setVehiculeLoading(true);
    
    try {
      const { data: vehicule, error } = await supabase
        .from('vehicules_assures')
        .select('*')
        .eq('souscription_id', souscriptionId)
        .single();
      
      if (error) {
        console.log('Aucune info véhicule trouvée:', error.message);
        return;
      }
      
      if (vehicule) {
        setSonasForm(prev => ({
          ...prev,
          vehicule_marque_type: vehicule.marque_type || '',
          vehicule_plaque: vehicule.plaque_immatriculation || '',
          vehicule_chassis: vehicule.numero_chassis || '',
          vehicule_moteur: vehicule.numero_moteur || '',
          vehicule_puissance: vehicule.puissance || '',
          vehicule_annee: vehicule.annee ? String(vehicule.annee) : '',
          vehicule_kilometrage: vehicule.kilometrage ? String(vehicule.kilometrage) : '',
          vehicule_valeur: vehicule.valeur ? String(vehicule.valeur) : '',
        }));
      }
    } catch (err: any) {
      console.error('Erreur chargement véhicule:', err.message);
    } finally {
      setVehiculeLoading(false);
    }
  };

  const chargerAssures = async () => {
    const { data } = await supabase.from('users').select('id, email, nom, role, telephone, photo_profil').eq('role', 'assure').order('nom');
    if (data) { setAssures(data); setFilteredAssures(data); }
  };

  const chargerSouscriptions = async (assureId: string) => {
    setSouscriptionsLoading(true);
    setSouscriptions([]);
    setFormData(prev => ({ ...prev, souscription_id: '', type_sinistre: '' }));
    setShowSonasForm(false);

    try {
      const { data, error } = await supabase
        .from('souscriptions')
        .select(`
          id, numero_assure, police_numero, type_assurance_id, date_expiration, statut,
          type_assurance:types_assurance!souscriptions_type_assurance_id_fkey(id, code, nom)
        `)
        .eq('assure_id', assureId)
        .eq('statut', 'active');

      if (error) throw error;

      if (data) {
        const formatted = data.map((s: any) => ({
          id: String(s.id),
          numero_assure: s.numero_assure || 'N/A',
          police_numero: s.police_numero,
          type_assurance_id: s.type_assurance_id,
          type_assurance_code: s.type_assurance?.code || 'inconnu',
          type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
          date_expiration: s.date_expiration,
          statut: s.statut,
        }));
        setSouscriptions(formatted);
      }
    } catch (err: any) {
      setError('Erreur chargement contrats: ' + err.message);
    } finally {
      setSouscriptionsLoading(false);
    }
  };

  const handleSelectAssure = (assure: User) => {
    setSelectedAssure(assure);
    setFormData(prev => ({ ...prev, assure_id: assure.id, souscription_id: '', type_sinistre: '' }));
    setSearchTerm('');
    setShowDropdown(false);
    setShowSonasForm(false);
    chargerSouscriptions(assure.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const prefix = `SIN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const { data: lastSinistre } = await supabase
        .from('sinistres')
        .select('numero_dossier')
        .like('numero_dossier', `${prefix}%`)
        .order('numero_dossier', { ascending: false })
        .limit(1);

      let sequence = 1;
      if (lastSinistre && lastSinistre.length > 0) {
        const parts = lastSinistre[0].numero_dossier.split('-');
        sequence = (parseInt(parts[parts.length - 1]) || 0) + 1;
      }
      
      const numeroDossier = `${prefix}-${String(sequence).padStart(4, '0')}`;

      const sinistreData: any = {
        assure_id: formData.assure_id,
        souscription_id: formData.souscription_id,
        numero_dossier: numeroDossier,
        type_sinistre: formData.type_sinistre || 'accident_auto',
        description: showSonasForm ? sonasForm.description_accident : formData.description,
        date_sinistre: formData.date_sinistre,
        lieu: showSonasForm ? sonasForm.lieu_accident : formData.lieu,
        montant_estime: showSonasForm ? (sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null) : (formData.montant_estime ? parseFloat(formData.montant_estime) : null),
        statut: 'en_attente',
        created_by: user?.id,
      };

      const { data: sinistre, error: sinistreError } = await supabase
        .from('sinistres')
        .insert(sinistreData)
        .select()
        .single();

      if (sinistreError) throw sinistreError;

      // Upload des fichiers
      let planLieuxUrl = null;
      let signatureUrl = null;

      if (planLieuxFile) {
        planLieuxUrl = await uploadFile(planLieuxFile, sinistre.id, 'plan_lieux');
      }

      if (signatureFile) {
        signatureUrl = await uploadFile(signatureFile, sinistre.id, 'signature');
      }

      if (showSonasForm) {
        const sonasData = {
          sinistre_id: sinistre.id,
          agence: 'SONAS Lubumbashi',
          police: sonasForm.police || null,
          valable_du: sonasForm.valable_du || null,
          valable_au: sonasForm.valable_au || null,
          claim_no: numeroDossier,
          garantie: sonasForm.garantie || null,
          telephone: sonasForm.telephone || null,
          date_heure_accident: sonasForm.date_heure_accident || new Date().toISOString(),
          lieu_accident: sonasForm.lieu_accident || formData.lieu,
          preneur_nom: sonasForm.preneur_nom || null,
          preneur_prenoms: sonasForm.preneur_prenoms || null,
          preneur_adresse: sonasForm.preneur_adresse || null,
          conducteur_nom_prenom: sonasForm.conducteur_nom_prenom || null,
          conducteur_age: sonasForm.conducteur_age ? parseInt(sonasForm.conducteur_age) : null,
          conducteur_a_service: sonasForm.conducteur_a_service,
          conducteur_titre_conduite: sonasForm.conducteur_titre_conduite || null,
          permis_no: sonasForm.permis_no || null,
          permis_delivre_a: sonasForm.permis_delivre_a || null,
          permis_date: sonasForm.permis_date || null,
          vehicule_marque_type: sonasForm.vehicule_marque_type || null,
          vehicule_plaque: sonasForm.vehicule_plaque || null,
          vehicule_chassis: sonasForm.vehicule_chassis || null,
          vehicule_moteur: sonasForm.vehicule_moteur || null,
          vehicule_puissance: sonasForm.vehicule_puissance || null,
          vehicule_annee: sonasForm.vehicule_annee ? parseInt(sonasForm.vehicule_annee) : null,
          vehicule_kilometrage: sonasForm.vehicule_kilometrage ? parseInt(sonasForm.vehicule_kilometrage) : null,
          vehicule_valeur: sonasForm.vehicule_valeur ? parseFloat(sonasForm.vehicule_valeur) : null,
          garantie_rc: sonasForm.garantie_rc,
          garantie_dm: sonasForm.garantie_dm,
          garantie_inc: sonasForm.garantie_inc,
          garantie_vol: sonasForm.garantie_vol,
          description_accident: sonasForm.description_accident || 'Aucune description fournie',
          plan_lieux_url: planLieuxUrl,
          degats_description: sonasForm.degats_description || null,
          degats_montant_evalue: sonasForm.degats_montant_evalue ? parseFloat(sonasForm.degats_montant_evalue) : null,
          vehicule_immobilise: sonasForm.vehicule_immobilise,
          lieu_garde_expertise: sonasForm.lieu_garde_expertise || null,
          adversaire_nom: sonasForm.adversaire_nom || null,
          adversaire_post_nom: sonasForm.adversaire_post_nom || null,
          adversaire_prenom: sonasForm.adversaire_prenom || null,
          adversaire_adresse: sonasForm.adversaire_adresse || null,
          adversaire_vehicule: sonasForm.adversaire_vehicule || null,
          adversaire_plaque: sonasForm.adversaire_plaque || null,
          adversaire_assurance: sonasForm.adversaire_assurance || null,
          adversaire_telephone: sonasForm.adversaire_telephone || null,
          degats_materiels_description: sonasForm.degats_materiels_description || null,
          degats_materiels_evalues: sonasForm.degats_materiels_evalues ? parseFloat(sonasForm.degats_materiels_evalues) : null,
          blesses_ou_morts: sonasForm.blesses_ou_morts || false,
          victimes_infos: sonasForm.victimes_infos || null,
          victimes_soins_lieu: sonasForm.victimes_soins_lieu || null,
          hopital_nom_adresse: sonasForm.hopital_nom_adresse || null,
          medecin_nom: sonasForm.medecin_nom || null,
          medecin_telephone: sonasForm.medecin_telephone || null,
          tiers_transportes: sonasForm.tiers_transportes || null,
          temoins: sonasForm.temoins || null,
          pv_par: sonasForm.pv_par || null,
          localite: sonasForm.localite || null,
          gendarmerie: sonasForm.gendarmerie || null,
          officier_gendarme: sonasForm.officier_gendarme || null,
          prime_payee: sonasForm.prime_payee,
          prime_date: sonasForm.prime_date || null,
          fait_a: sonasForm.fait_a || null,
          date_signature: sonasForm.date_signature || null,
          signature_assure_url: signatureUrl,
        };

        const { error: sonasError } = await supabase
          .from('sonas_declarations_accident')
          .insert(sonasData);

        if (sonasError) throw sonasError;
      }

      setSuccess(`Sinistre déclaré avec succès ! N° ${numeroDossier}`);
      
      setTimeout(() => {
        router.push('/assure/sinistres');
      }, 2000);

    } catch (err: any) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de la déclaration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/assure/sinistres" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <FaArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
          <FaFileAlt className="mr-3 h-6 w-6 text-blue-600" />
          Déclaration de Sinistre
        </h1>
      </div>

      {error && <div className="mb-6 rounded-md bg-red-50 p-4 flex"><FaTimesCircle className="h-5 w-5 text-red-400" /><p className="ml-3 text-sm text-red-700">{error}</p><button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-4 w-4 text-red-500" /></button></div>}
      {success && <div className="mb-6 rounded-md bg-green-50 p-4 flex"><FaCheckCircle className="h-5 w-5 text-green-400" /><p className="ml-3 text-sm text-green-700">{success}</p></div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Formulaire de base */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Informations du sinistre</h2>
          
          {user?.role !== 'assure' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Assuré *</label>
              {selectedAssure ? (
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={selectedAssure} />
                    <div><p className="font-medium">{selectedAssure.nom}</p><p className="text-xs text-gray-500">{selectedAssure.email}</p></div>
                  </div>
                  <button type="button" onClick={() => { setSelectedAssure(null); setFormData(prev => ({ ...prev, assure_id: '', souscription_id: '' })); setSouscriptions([]); setShowSonasForm(false); }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                </div>
              ) : (
                <div ref={searchRef} className="relative">
                  <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }} placeholder="Rechercher un assuré..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
                  {showDropdown && filteredAssures.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredAssures.map(a => (
                        <button key={a.id} type="button" onClick={() => handleSelectAssure(a)} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
                          <UserAvatar user={a} size="sm" /><span>{a.nom}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedAssure && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Contrat *</label>
              {souscriptionsLoading ? (
                <div className="flex items-center gap-2 text-gray-500"><FaSpinner className="animate-spin" /> Chargement...</div>
              ) : (
                <select name="souscription_id" value={formData.souscription_id} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" required>
                  <option value="">-- Sélectionnez un contrat --</option>
                  {souscriptions.map(s => (
                    <option key={s.id} value={s.id}>{s.type_assurance_nom} - {s.numero_assure}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {formData.souscription_id && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Type de sinistre *</label>
              <div className="grid grid-cols-4 gap-2">
                {TYPES_SINISTRE.map(type => (
                  <button key={type.value} type="button" onClick={() => setFormData(prev => ({ ...prev, type_sinistre: type.value }))}
                    className={`p-2 text-sm rounded-md border ${formData.type_sinistre === type.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-xl block mb-1">{type.icon}</span><span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Date du sinistre *</label><input type="date" name="date_sinistre" value={formData.date_sinistre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Lieu *</label><input type="text" name="lieu" value={formData.lieu} onChange={handleChange} required placeholder="Adresse du sinistre" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
          </div>
          <div className="mb-4"><label className="block text-xs font-medium text-gray-700 mb-1">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Montant estimé (optionnel)</label><input type="number" name="montant_estime" value={formData.montant_estime} onChange={handleChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
        </div>

        {vehiculeLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <FaSpinner className="animate-spin h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-700">Chargement des informations du véhicule...</p>
          </div>
        )}

        {/* FORMULAIRE SONAS - UNIQUE */}
        {showSonasForm && (
          <div className="bg-white rounded-lg shadow-sm border-2 border-blue-300 overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
              <FaCar className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-bold">🚗 DÉCLARATION D'ACCIDENT AUTOMOBILE - SONAS</h2>
                <p className="text-blue-100 text-sm">
                  Formulaire détaillé pour assurance automobile
                  {!vehiculeLoading && sonasForm.vehicule_plaque && (
                    <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      Véhicule pré-rempli ✓
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Infos générales */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaBuilding className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Informations générales</h3></div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Agence</label><input type="text" defaultValue="SONAS Lubumbashi" className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50" disabled /></div>
                  <div><label className="block text-xs font-medium mb-1">Police</label><input type="text" name="police" value={sonasForm.police} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Claim n°</label><input type="text" name="claim_no" value={sonasForm.claim_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Valable du</label><input type="date" name="valable_du" value={sonasForm.valable_du} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Au</label><input type="date" name="valable_au" value={sonasForm.valable_au} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Garantie</label><select name="garantie" value={sonasForm.garantie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm"><option value="">Sélectionner</option><option value="RC">RC</option><option value="DM">DM</option><option value="INC">Inc.</option><option value="VOL">Vol</option></select></div>
                  <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="telephone" value={sonasForm.telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 1. Date et heure */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaCalendarAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">1. Date et heure de l'accident</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Date et heure *</label><input type="datetime-local" name="date_heure_accident" value={sonasForm.date_heure_accident} onChange={handleSonasChange} required className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Lieu *</label><input type="text" name="lieu_accident" value={sonasForm.lieu_accident} onChange={handleSonasChange} required placeholder="Adresse complète" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 2. Preneur d'assurance */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">2. Preneur d'assurance</h3></div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="preneur_nom" value={sonasForm.preneur_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Prénoms</label><input type="text" name="preneur_prenoms" value={sonasForm.preneur_prenoms} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="preneur_adresse" value={sonasForm.preneur_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 3. Conducteur */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaIdCard className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">3. Conducteur</h3></div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Nom et prénom</label><input type="text" name="conducteur_nom_prenom" value={sonasForm.conducteur_nom_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Âge</label><input type="number" name="conducteur_age" value={sonasForm.conducteur_age} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div>
                    <label className="block text-xs font-medium mb-2">À votre service ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === true} onChange={() => handleSonasRadio('conducteur_a_service', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.conducteur_a_service === false} onChange={() => handleSonasRadio('conducteur_a_service', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
                    </div>
                  </div>
                  <div className="col-span-2"><label className="block text-xs font-medium mb-1">Titre de conduite</label><input type="text" name="conducteur_titre_conduite" value={sonasForm.conducteur_titre_conduite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Permis n°</label><input type="text" name="permis_no" value={sonasForm.permis_no} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Délivré à</label><input type="text" name="permis_delivre_a" value={sonasForm.permis_delivre_a} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Date</label><input type="date" name="permis_date" value={sonasForm.permis_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 4. Véhicule */}
              <div className="border rounded-lg overflow-hidden border-green-300">
                <div className="bg-green-50 px-4 py-3 border-b flex items-center gap-2">
                  <FaCar className="text-green-600 h-4 w-4" />
                  <h3 className="font-semibold text-sm">4. Véhicule {!vehiculeLoading && sonasForm.vehicule_plaque && <span className="text-xs text-green-600 ml-2">(Pré-rempli depuis votre contrat)</span>}</h3>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Marque et type</label><input type="text" name="vehicule_marque_type" value={sonasForm.vehicule_marque_type} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_marque_type ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">N° plaque</label><input type="text" name="vehicule_plaque" value={sonasForm.vehicule_plaque} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_plaque ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">N° châssis</label><input type="text" name="vehicule_chassis" value={sonasForm.vehicule_chassis} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_chassis ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">N° moteur</label><input type="text" name="vehicule_moteur" value={sonasForm.vehicule_moteur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_moteur ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">Puissance</label><input type="text" name="vehicule_puissance" value={sonasForm.vehicule_puissance} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_puissance ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">Année</label><input type="number" name="vehicule_annee" value={sonasForm.vehicule_annee} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_annee ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div><label className="block text-xs font-medium mb-1">Kilométrage</label><input type="number" name="vehicule_kilometrage" value={sonasForm.vehicule_kilometrage} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_kilometrage ? 'bg-green-50 border-green-300' : ''}`} /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium mb-1">Valeur</label><input type="number" name="vehicule_valeur" value={sonasForm.vehicule_valeur} onChange={handleSonasChange} className={`w-full px-3 py-2 border rounded-md text-sm ${sonasForm.vehicule_valeur ? 'bg-green-50 border-green-300' : ''}`} /></div>
                </div>
                <div className="px-4 pb-4">
                  <label className="block text-xs font-medium mb-2">Garanties :</label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_rc} onChange={(e) => handleSonasCheckbox('garantie_rc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">R.C.</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_dm} onChange={(e) => handleSonasCheckbox('garantie_dm', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">D.M.</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_inc} onChange={(e) => handleSonasCheckbox('garantie_inc', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Inc.</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sonasForm.garantie_vol} onChange={(e) => handleSonasCheckbox('garantie_vol', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">Vol</span></label>
                  </div>
                </div>
              </div>

              {/* 5. Description accident avec UPLOAD PLAN LIEUX */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaClipboardList className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">5. Description de l'accident</h3></div>
                <div className="p-4 space-y-4">
                  <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="description_accident" value={sonasForm.description_accident} onChange={handleSonasChange} rows={4} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div>
                    <label className="block text-xs font-medium mb-2">Plan des lieux (image)</label>
                    {planLieuxPreview ? (
                      <div className="relative">
                        <img src={planLieuxPreview} alt="Plan des lieux" className="w-full h-64 object-contain border rounded-lg" />
                        <button type="button" onClick={removePlanLieux} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <FaImage className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 mb-1">Cliquez pour uploader le plan des lieux</span>
                        <span className="text-xs text-gray-400">JPG, PNG (max 5MB)</span>
                        <input type="file" accept="image/*" onChange={handlePlanLieuxUpload} className="sr-only" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 6. Dégâts véhicule */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">6. Dégâts de votre véhicule</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_description" value={sonasForm.degats_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Montant évalué</label><input type="number" name="degats_montant_evalue" value={sonasForm.degats_montant_evalue} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 7. Garage */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">7. Garage</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2">Véhicule immobilisé ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === true} onChange={() => handleSonasRadio('vehicule_immobilise', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.vehicule_immobilise === false} onChange={() => handleSonasRadio('vehicule_immobilise', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
                    </div>
                  </div>
                  <div><label className="block text-xs font-medium mb-1">Lieu de garde</label><input type="text" name="lieu_garde_expertise" value={sonasForm.lieu_garde_expertise} onChange={handleSonasChange} placeholder="Adresse du garage" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 8. Adversaire */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUser className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">8. Adversaire</h3></div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Nom</label><input type="text" name="adversaire_nom" value={sonasForm.adversaire_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Post-nom</label><input type="text" name="adversaire_post_nom" value={sonasForm.adversaire_post_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Prénom</label><input type="text" name="adversaire_prenom" value={sonasForm.adversaire_prenom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div className="col-span-3"><label className="block text-xs font-medium mb-1">Adresse</label><input type="text" name="adversaire_adresse" value={sonasForm.adversaire_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Véhicule</label><input type="text" name="adversaire_vehicule" value={sonasForm.adversaire_vehicule} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Plaque</label><input type="text" name="adversaire_plaque" value={sonasForm.adversaire_plaque} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Assurance</label><input type="text" name="adversaire_assurance" value={sonasForm.adversaire_assurance} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Téléphone</label><input type="tel" name="adversaire_telephone" value={sonasForm.adversaire_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 9. Dégâts matériels tiers */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaTools className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">9. Dégâts matériels (tiers)</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Description</label><textarea name="degats_materiels_description" value={sonasForm.degats_materiels_description} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Dégâts évalués à</label><input type="number" name="degats_materiels_evalues" value={sonasForm.degats_materiels_evalues} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 10. Blessés ou morts */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUserInjured className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">10. Blessés ou morts</h3></div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-2">Y a-t-il des blessés/morts ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === true} onChange={() => handleSonasRadio('blesses_ou_morts', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.blesses_ou_morts === false} onChange={() => handleSonasRadio('blesses_ou_morts', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
                    </div>
                  </div>
                  <div><label className="block text-xs font-medium mb-1">Victimes (nom, prénom, adresse)</label><textarea name="victimes_infos" value={sonasForm.victimes_infos} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Où se trouvent les victimes ?</label><input type="text" name="victimes_soins_lieu" value={sonasForm.victimes_soins_lieu} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium mb-1">Hôpital</label><input type="text" name="hopital_nom_adresse" value={sonasForm.hopital_nom_adresse} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                    <div><label className="block text-xs font-medium mb-1">Médecin</label><input type="text" name="medecin_nom" value={sonasForm.medecin_nom} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  </div>
                  <div><label className="block text-xs font-medium mb-1">Tél médecin</label><input type="tel" name="medecin_telephone" value={sonasForm.medecin_telephone} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 11. Tiers transportés */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">11. Tiers transportés</h3></div>
                <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="tiers_transportes" value={sonasForm.tiers_transportes} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
              </div>

              {/* 12. Témoins */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaUsers className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">12. Témoins</h3></div>
                <div className="p-4"><label className="block text-xs font-medium mb-1">Noms, prénoms et adresses</label><textarea name="temoins" value={sonasForm.temoins} onChange={handleSonasChange} rows={3} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
              </div>

              {/* 13. Autorités */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaShieldAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">13. Autorités</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1">PV par</label><input type="text" name="pv_par" value={sonasForm.pv_par} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Localité</label><input type="text" name="localite" value={sonasForm.localite} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Gendarmerie</label><input type="text" name="gendarmerie" value={sonasForm.gendarmerie} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Officier</label><input type="text" name="officier_gendarme" value={sonasForm.officier_gendarme} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* 14. Prime */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileAlt className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">14. Prime d'assurance</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2">Dernière prime payée ?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === true} onChange={() => handleSonasRadio('prime_payee', true)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Oui</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={sonasForm.prime_payee === false} onChange={() => handleSonasRadio('prime_payee', false)} className="w-4 h-4 text-blue-600" /><span className="text-sm">Non</span></label>
                    </div>
                  </div>
                  <div><label className="block text-xs font-medium mb-1">Si oui, date</label><input type="date" name="prime_date" value={sonasForm.prime_date} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
              </div>

              {/* Signature avec UPLOAD */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-2"><FaFileSignature className="text-blue-600 h-4 w-4" /><h3 className="font-semibold text-sm">Signature</h3></div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div><label className="block text-xs font-medium mb-1">Fait à</label><input type="text" name="fait_a" value={sonasForm.fait_a} onChange={handleSonasChange} placeholder="Lieu" className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                  <div><label className="block text-xs font-medium mb-1">Le</label><input type="date" name="date_signature" value={sonasForm.date_signature} onChange={handleSonasChange} className="w-full px-3 py-2 border rounded-md text-sm" /></div>
                </div>
                <div className="px-4 pb-4">
                  <label className="block text-xs font-medium mb-2">Signature</label>
                  {signaturePreview ? (
                    <div className="relative">
                      <img src={signaturePreview} alt="Signature" className="w-full h-32 object-contain border rounded-lg bg-white" />
                      <button type="button" onClick={removeSignature} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <FaPen className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 mb-1">Cliquez pour uploader votre signature</span>
                      <span className="text-xs text-gray-400">JPG, PNG (max 2MB)</span>
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {loading ? 'Enregistrement...' : 'Déclarer le sinistre'}
          </button>
          <Link href="/assure/sinistres" className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 text-center">Annuler</Link>
        </div>
      </form>
    </div>
  );
}