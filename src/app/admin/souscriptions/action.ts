
// // // app/admin/souscriptions/actions.ts
// // 'use server';

// // import { createClient } from '@/lib/supabase/server';
// // import { revalidatePath } from 'next/cache';



// // // Uploader un document de souscription
// // export async function uploadSouscriptionDocument(
// //   souscriptionId: string,
// //   typeDocument: string,
// //   file: File,
// //   estObligatoire: boolean = false
// // ) {
// //   const supabase = await createClient();
  
// //   const fileExt = file.name.split('.').pop();
// //   const fileName = `${souscriptionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
// //   const { error: uploadError } = await supabase.storage
// //     .from('souscriptions')
// //     .upload(fileName, file);
  
// //   if (uploadError) throw uploadError;
  
// //   const { data: { publicUrl } } = supabase.storage
// //     .from('souscriptions')
// //     .getPublicUrl(fileName);
  
// //   const { data, error } = await supabase
// //     .from('souscription_documents')
// //     .insert({
// //       souscription_id: souscriptionId,
// //       type_document: typeDocument,
// //       nom_fichier: file.name,
// //       url_fichier: publicUrl,
// //       taille_fichier: file.size,
// //       type_mime: file.type,
// //       est_obligatoire: estObligatoire,
// //     })
// //     .select()
// //     .single();
  
// //   if (error) throw error;
// //   return data;
// // }






// // // Types
// // export type TypeAssurance = {
// //   id: string;
// //   code: string;
// //   nom: string;
// //   description: string;
// // };

// // export type AssureInfo = {
// //   id: string;
// //   email: string;
// //   nom: string;
// //   telephone?: string;
// //   date_naissance?: string;
// //   sexe?: string;
// //   profession?: string;
// //   adresse?: string;
// //   nombre_assurances: number;
// //   souscriptions: Souscription[];
// // };

// // export type Souscription = {
// //   id: string;
// //   numero_assure: string;
// //   assure_id: string;
// //   type_assurance_id: string;
// //   type_assurance_nom?: string;
// //   type_assurance_code?: string;
// //   date_souscription: string;
// //   date_expiration: string;
// //   statut: string;
// //   prime: number;
// //   mode_paiement: string;
// //   documents_count?: number;
// //   created_at: string;
// // };

// // // Récupérer tous les types d'assurance
// // export async function getTypesAssurance() {
// //   const supabase = await createClient();
// //   const { data, error } = await supabase
// //     .from('types_assurance')
// //     .select('*')
// //     .order('nom');
  
// //   if (error) throw error;
// //   return data;
// // }

// // // Récupérer tous les assurés avec leurs souscriptions
// // // export async function getAssures() {
// // //   const supabase = await createClient();
  
// // //   const { data: users, error: usersError } = await supabase
// // //     .from('users')
// // //     .select(`
// // //       id, email, nom, telephone, date_naissance, sexe, profession, adresse,
// // //       souscriptions:souscriptions(
// // //         id, numero_assure, type_assurance_id, date_souscription, date_expiration,
// // //         statut, prime, mode_paiement, created_at,
// // //         type_assurance:types_assurance(id, code, nom),
// // //         documents:souscription_documents(count)
// // //       )
// // //     `)
// // //     .eq('role', 'assure')
// // //     .order('nom');
  
// // //   if (usersError) throw usersError;
  
// // //   return users?.map(u => ({
// // //     id: u.id,
// // //     email: u.email,
// // //     nom: u.nom,
// // //     telephone: u.telephone,
// // //     date_naissance: u.date_naissance,
// // //     sexe: u.sexe,
// // //     profession: u.profession,
// // //     adresse: u.adresse,
// // //     nombre_assurances: u.souscriptions?.filter(s => s.statut !== 'resiliee').length || 0,
// // //     souscriptions: u.souscriptions?.map(s => ({
// // //       ...s,
// // //       type_assurance_nom: s.type_assurance?.nom,
// // //       type_assurance_code: s.type_assurance?.code,
// // //       documents_count: s.documents?.[0]?.count || 0,
// // //     })) || [],
// // //   })) || [];
// // // }


// // // app/admin/souscriptions/actions.ts

// // // Ajouter ce type pour la relation
// // type TypeAssuranceRelation = {
// //   id: string;
// //   code: string;
// //   nom: string;
// // };

// // // Récupérer tous les assurés avec leurs souscriptions
// // export async function getAssures() {
// //   const supabase = await createClient();
  
// //   const { data: users, error: usersError } = await supabase
// //     .from('users')
// //     .select(`
// //       id, email, nom, telephone, date_naissance, sexe, profession, adresse,
// //       souscriptions:souscriptions(
// //         id, numero_assure, type_assurance_id, date_souscription, date_expiration,
// //         statut, prime, mode_paiement, created_at,
// //         type_assurance:types_assurance(id, code, nom),
// //         documents:souscription_documents(count)
// //       )
// //     `)
// //     .eq('role', 'assure')
// //     .order('nom');
  
// //   if (usersError) throw usersError;
  
// //   return users?.map((u: any) => ({
// //     id: u.id,
// //     email: u.email,
// //     nom: u.nom,
// //     telephone: u.telephone,
// //     date_naissance: u.date_naissance,
// //     sexe: u.sexe,
// //     profession: u.profession,
// //     adresse: u.adresse,
// //     nombre_assurances: (u.souscriptions || []).filter((s: any) => s.statut !== 'resiliee').length,
// //     souscriptions: (u.souscriptions || []).map((s: any) => ({
// //       ...s,
// //       // Type assertion pour accéder aux propriétés
// //       type_assurance_nom: (s.type_assurance as TypeAssuranceRelation)?.nom || 'Inconnu',
// //       type_assurance_code: (s.type_assurance as TypeAssuranceRelation)?.code || 'inconnu',
// //       documents_count: s.documents?.[0]?.count || 0,
// //     })),
// //   })) || [];
// // }

// // // Récupérer toutes les souscriptions (version simple si besoin)
// // export async function getSouscriptions() {
// //   const supabase = await createClient();
// //   const { data, error } = await supabase
// //     .from('souscriptions')
// //     .select(`
// //       *,
// //       assure:users!souscriptions_assure_id_fkey(
// //         id, email, nom, telephone, photo_profil,
// //         date_naissance, sexe, profession, adresse
// //       ),
// //       type_assurance:types_assurance(
// //         id, code, nom
// //       ),
// //       documents:souscription_documents(count)
// //     `)
// //     .order('created_at', { ascending: false });
  
// //   if (error) throw error;
  
// //   return data?.map((s: any) => ({
// //     ...s,
// //     assure_nom: s.assure?.nom,
// //     assure_email: s.assure?.email,
// //     assure_telephone: s.assure?.telephone,
// //     assure_date_naissance: s.assure?.date_naissance,
// //     assure_sexe: s.assure?.sexe,
// //     assure_profession: s.assure?.profession,
// //     assure_adresse: s.assure?.adresse,
// //     // Corriger l'accès à type_assurance
// //     type_assurance_nom: (s.type_assurance as TypeAssuranceRelation)?.nom || 'Inconnu',
// //     type_assurance_code: (s.type_assurance as TypeAssuranceRelation)?.code || 'inconnu',
// //     documents_count: s.documents?.[0]?.count || 0,
// //   })) || [];
// // }






// // // app/admin/souscriptions/actions.ts

// // // Type pour les données d'entrée
// // type CreateSouscriptionInput = {
// //   assure_id?: string;
// //   email: string;
// //   nom: string;
// //   telephone?: string;
// //   mot_de_passe?: string;
// //   date_naissance?: string;
// //   sexe?: string;
// //   profession?: string;
// //   adresse?: string;
// //   type_assurance_id: string;
// //   prime: number;
// //   mode_paiement: string;
// // };

// // // Créer une souscription (nouvelle ou additionnelle)
// // export async function createSouscription(data: CreateSouscriptionInput) {
// //   const supabase = await createClient();
  
// //   let userId: string;
// //   let isNewUser = false;
  
// //   // 1. Vérifier si l'assuré existe déjà (par ID ou par email)
// //   if (data.assure_id) {
// //     userId = data.assure_id;
// //   } else {
// //     const { data: existingUser } = await supabase
// //       .from('users')
// //       .select('id')
// //       .eq('email', data.email.toLowerCase().trim())
// //       .single();
    
// //     if (existingUser) {
// //       userId = existingUser.id;
// //     } else {
// //       // Créer un nouveau compte assuré
// //       const { data: newUser, error: userError } = await supabase
// //         .from('users')
// //         .insert({
// //           email: data.email.toLowerCase().trim(),
// //           nom: data.nom,
// //           telephone: data.telephone || null,
// //           mot_de_passe: data.mot_de_passe || '123456',
// //           role: 'assure',
// //           first_login: true,
// //           date_naissance: data.date_naissance || null,
// //           sexe: data.sexe || null,
// //           profession: data.profession || null,
// //           adresse: data.adresse || null,
// //         })
// //         .select()
// //         .single();
      
// //       if (userError) throw new Error(`Erreur création utilisateur: ${userError.message}`);
// //       userId = newUser.id;
// //       isNewUser = true;
// //     }
// //   }
  
// //   // 2. Vérifier si l'assuré a déjà ce type d'assurance actif
// //   const { data: existingSouscription } = await supabase
// //     .from('souscriptions')
// //     .select('id, statut')
// //     .eq('assure_id', userId)
// //     .eq('type_assurance_id', data.type_assurance_id)
// //     .neq('statut', 'resiliee')
// //     .single();
  
// //   if (existingSouscription) {
// //     throw new Error(
// //       `L'assuré a déjà une souscription ${existingSouscription.statut} pour ce type d'assurance`
// //     );
// //   }
  
// //   // 3. Générer le numéro d'assuré
// //   const { data: numeroAssure, error: numeroError } = await supabase
// //     .rpc('generer_numero_assure', {
// //       p_assure_id: userId,
// //       p_type_assurance_id: data.type_assurance_id
// //     });
  
// //   if (numeroError) throw new Error(`Erreur génération numéro assuré: ${numeroError.message}`);
  
// //   // 4. Générer le numéro de police
// //   const { data: policeNumero, error: policeError } = await supabase
// //     .rpc('generer_police_numero', {
// //       p_type_assurance_id: data.type_assurance_id
// //     });
  
// //   if (policeError) throw new Error(`Erreur génération numéro police: ${policeError.message}`);
  
// //   // 5. Calculer la date d'expiration (1 an par défaut)
// //   const dateDebut = new Date().toISOString().split('T')[0];
// //   const dateExpiration = new Date();
// //   dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
// //   const dateExpirationStr = dateExpiration.toISOString().split('T')[0];
  
// //   // 6. Créer la souscription
// //   const { data: souscription, error: souscriptionError } = await supabase
// //     .from('souscriptions')
// //     .insert({
// //       police_numero: policeNumero,
// //       numero_assure: numeroAssure,
// //       assure_id: userId,
// //       type_assurance_id: data.type_assurance_id,
// //       date_souscription: dateDebut,
// //       date_debut: dateDebut,
// //       date_expiration: dateExpirationStr,
// //       statut: 'active',
// //       prime: data.prime,
// //       montant_prime: data.prime, // Pour compatibilité
// //       mode_paiement: data.mode_paiement,
// //       created_by: userId,
// //     })
// //     .select(`
// //       *,
// //       assure:assure_id(id, email, nom, telephone),
// //       type_assurance:type_assurance_id(id, code, nom)
// //     `)
// //     .single();
  
// //   if (souscriptionError) {
// //     throw new Error(`Erreur création souscription: ${souscriptionError.message}`);
// //   }
  
// //   // 7. Revalider le cache de la page
// //   revalidatePath('/admin/souscriptions');
  
// //   // 8. Retourner le résultat
// //   return {
// //     success: true,
// //     souscription: {
// //       ...souscription,
// //       assure_nom: (souscription as any).assure?.nom,
// //       assure_email: (souscription as any).assure?.email,
// //       type_assurance_nom: (souscription as any).type_assurance?.nom,
// //       type_assurance_code: (souscription as any).type_assurance?.code,
// //     },
// //     isNewUser,
// //     userId,
// //   };
// // }


// // // Supprimer une souscription
// // export async function deleteSouscription(id: string) {
// //   const supabase = await createClient();
  
// //   // Récupérer l'assuré avant suppression pour vérifier
// //   const { data: souscription } = await supabase
// //     .from('souscriptions')
// //     .select('assure_id')
// //     .eq('id', id)
// //     .single();
  
// //   const { error } = await supabase
// //     .from('souscriptions')
// //     .delete()
// //     .eq('id', id);
  
// //   if (error) throw error;
  
// //   // Vérifier si c'était la dernière assurance et remettre en '10' si nécessaire
// //   if (souscription) {
// //     await remettreNumeroSimple(souscription.assure_id);
// //   }
  
// //   revalidatePath('/admin/souscriptions');
// // }

// // // Remettre les numéros en '10' si l'assuré n'a plus qu'une assurance
// // async function remettreNumeroSimple(assureId: string) {
// //   const supabase = await createClient();
  
// //   const { data: souscriptions } = await supabase
// //     .from('souscriptions')
// //     .select('id, numero_assure')
// //     .eq('assure_id', assureId)
// //     .neq('statut', 'resiliee');
  
// //   if (souscriptions && souscriptions.length === 1) {
// //     // Une seule assurance, remettre en '10'
// //     await supabase
// //       .from('souscriptions')
// //       .update({ 
// //         numero_assure: '10' + souscriptions[0].numero_assure.substring(2),
// //         updated_at: new Date().toISOString()
// //       })
// //       .eq('id', souscriptions[0].id);
// //   }
// // }

// // // Mettre à jour le statut
// // export async function updateSouscriptionStatus(id: string, statut: string) {
// //   const supabase = await createClient();
  
// //   const { error } = await supabase
// //     .from('souscriptions')
// //     .update({ statut, updated_at: new Date().toISOString() })
// //     .eq('id', id);
  
// //   if (error) throw error;
// //   revalidatePath('/admin/souscriptions');
// // }



// // app/admin/souscriptions/actions.ts
// 'use server';

// import { createClient } from '@/lib/supabase/server';
// import { revalidatePath } from 'next/cache';

// // ==================== TYPES ====================

// type TypeAssuranceRelation = {
//   id: string;
//   code: string;
//   nom: string;
// };

// export type TypeAssurance = {
//   id: string;
//   code: string;
//   nom: string;
//   description: string;
// };

// export type AssureInfo = {
//   id: string;
//   email: string;
//   nom: string;
//   telephone?: string;
//   date_naissance?: string;
//   sexe?: string;
//   profession?: string;
//   adresse?: string;
//   nombre_assurances: number;
//   souscriptions: Souscription[];
// };

// export type Souscription = {
//   id: string;
//   numero_assure: string;
//   assure_id: string;
//   type_assurance_id: string;
//   type_assurance_nom?: string;
//   type_assurance_code?: string;
//   date_souscription: string;
//   date_expiration: string;
//   statut: string;
//   prime: number;
//   mode_paiement: string;
//   documents_count?: number;
//   created_at: string;
// };

// type CreateSouscriptionInput = {
//   assure_id?: string;
//   email: string;
//   nom: string;
//   telephone?: string;
//   mot_de_passe?: string;
//   date_naissance?: string;
//   sexe?: string;
//   profession?: string;
//   adresse?: string;
//   type_assurance_id: string;
//   prime: number;
//   mode_paiement: string;
// };

// // ==================== FONCTIONS UTILITAIRES ====================

// function generatePoliceNumero(): string {
//   const year = new Date().getFullYear();
//   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//   return `POL-${year}-${random}`;
// }

// // ==================== UPLOAD DOCUMENT ====================

// export async function uploadSouscriptionDocument(
//   souscriptionId: string,
//   typeDocument: string,
//   file: File,
//   estObligatoire: boolean = false
// ) {
//   const supabase = await createClient();
  
//   const fileExt = file.name.split('.').pop();
//   const fileName = `${souscriptionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
//   const { error: uploadError } = await supabase.storage
//     .from('souscriptions')
//     .upload(fileName, file);
  
//   if (uploadError) throw uploadError;
  
//   const { data: { publicUrl } } = supabase.storage
//     .from('souscriptions')
//     .getPublicUrl(fileName);
  
//   const { data, error } = await supabase
//     .from('souscription_documents')
//     .insert({
//       souscription_id: souscriptionId,
//       type_document: typeDocument,
//       nom_fichier: file.name,
//       url_fichier: publicUrl,
//       taille_fichier: file.size,
//       type_mime: file.type,
//       est_obligatoire: estObligatoire,
//     })
//     .select()
//     .single();
  
//   if (error) throw error;
//   return data;
// }

// // ==================== GETTERS ====================

// export async function getTypesAssurance() {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from('types_assurance')
//     .select('*')
//     .order('nom');
  
//   if (error) throw error;
//   return data;
// }

// export async function getAssures() {
//   const supabase = await createClient();
  
//   const { data: users, error: usersError } = await supabase
//     .from('users')
//     .select(`
//       id, email, nom, telephone, date_naissance, sexe, profession, adresse,
//       souscriptions:souscriptions(
//         id, numero_assure, type_assurance_id, date_souscription, date_expiration,
//         statut, prime, mode_paiement, created_at,
//         type_assurance:types_assurance(id, code, nom),
//         documents:souscription_documents(count)
//       )
//     `)
//     .eq('role', 'assure')
//     .order('nom');
  
//   if (usersError) throw usersError;
  
//   return users?.map((u: any) => ({
//     id: u.id,
//     email: u.email,
//     nom: u.nom,
//     telephone: u.telephone,
//     date_naissance: u.date_naissance,
//     sexe: u.sexe,
//     profession: u.profession,
//     adresse: u.adresse,
//     nombre_assurances: (u.souscriptions || []).filter((s: any) => s.statut !== 'resiliee').length,
//     souscriptions: (u.souscriptions || []).map((s: any) => ({
//       ...s,
//       type_assurance_nom: (s.type_assurance as TypeAssuranceRelation)?.nom || 'Inconnu',
//       type_assurance_code: (s.type_assurance as TypeAssuranceRelation)?.code || 'inconnu',
//       documents_count: s.documents?.[0]?.count || 0,
//     })),
//   })) || [];
// }

// export async function getSouscriptions() {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from('souscriptions')
//     .select(`
//       *,
//       assure:assure_id(id, email, nom, telephone, photo_profil, date_naissance, sexe, profession, adresse),
//       type_assurance:type_assurance_id(id, code, nom),
//       documents:souscription_documents(count)
//     `)
//     .order('created_at', { ascending: false });
  
//   if (error) throw error;
  
//   return data?.map((s: any) => ({
//     ...s,
//     assure_nom: s.assure?.nom,
//     assure_email: s.assure?.email,
//     assure_telephone: s.assure?.telephone,
//     assure_date_naissance: s.assure?.date_naissance,
//     assure_sexe: s.assure?.sexe,
//     assure_profession: s.assure?.profession,
//     assure_adresse: s.assure?.adresse,
//     type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
//     type_assurance_code: s.type_assurance?.code || 'inconnu',
//     documents_count: s.documents?.[0]?.count || 0,
//   })) || [];
// }

// // ==================== CREATE SOUSCRIPTION (VERSION FINALE) ====================

// export async function createSouscription(data: CreateSouscriptionInput) {
//   const supabase = await createClient();
  
//   let userId: string;
//   let isNewUser = false;
  
//   // 1. Trouver ou créer l'utilisateur
//   if (data.assure_id) {
//     userId = data.assure_id;
//   } else {
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .eq('email', data.email.toLowerCase().trim())
//       .single();
    
//     if (existingUser) {
//       userId = existingUser.id;
//     } else {
//       const { data: newUser, error: userError } = await supabase
//         .from('users')
//         .insert({
//           email: data.email.toLowerCase().trim(),
//           nom: data.nom,
//           telephone: data.telephone || null,
//           mot_de_passe: data.mot_de_passe || '123456',
//           role: 'assure',
//           first_login: true,
//           date_naissance: data.date_naissance || null,
//           sexe: data.sexe || null,
//           profession: data.profession || null,
//           adresse: data.adresse || null,
//         })
//         .select()
//         .single();
      
//       if (userError) throw new Error(`Erreur création utilisateur: ${userError.message}`);
//       userId = newUser.id;
//       isNewUser = true;
//     }
//   }
  
//   // 2. Vérifier doublon
//   const { data: existingSouscription } = await supabase
//     .from('souscriptions')
//     .select('id, statut')
//     .eq('assure_id', userId)
//     .eq('type_assurance_id', data.type_assurance_id)
//     .neq('statut', 'resiliee')
//     .single();
  
//   if (existingSouscription) {
//     throw new Error(`L'assuré a déjà une souscription ${existingSouscription.statut} pour ce type d'assurance`);
//   }
  
//   // 3. Générer les numéros (sans RPC pour éviter les erreurs)
//   const policeNumero = generatePoliceNumero();
  
//   const { data: typeAssurance } = await supabase
//     .from('types_assurance')
//     .select('code')
//     .eq('id', data.type_assurance_id)
//     .single();
  
//   const code = typeAssurance?.code || 'UNK';
//   const { count } = await supabase
//     .from('souscriptions')
//     .select('*', { count: 'exact', head: true })
//     .eq('assure_id', userId)
//     .neq('statut', 'resiliee');
  
//   const numeroAssure = `${String((count || 0) + 1).padStart(2, '0')}-${code}-${new Date().getFullYear()}`;
  
//   // 4. Dates
//   const dateDebut = new Date().toISOString().split('T')[0];
//   const dateExpiration = new Date();
//   dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
  
//   // 5. Insérer
//   const { data: souscription, error: souscriptionError } = await supabase
//     .from('souscriptions')
//     .insert({
//       police_numero: policeNumero,
//       numero_assure: numeroAssure,
//       assure_id: userId,
//       type_assurance_id: data.type_assurance_id,
//       date_souscription: dateDebut,
//       date_debut: dateDebut,
//       date_expiration: dateExpiration.toISOString().split('T')[0],
//       statut: 'active',
//       prime: data.prime,
//       montant_prime: data.prime,
//       mode_paiement: data.mode_paiement,
//       created_by: userId,
//     })
//     .select(`
//       *,
//       assure:assure_id(id, email, nom, telephone),
//       type_assurance:type_assurance_id(id, code, nom)
//     `)
//     .single();
  
//   if (souscriptionError) {
//     throw new Error(`Erreur création souscription: ${souscriptionError.message}`);
//   }
  
//   revalidatePath('/admin/souscriptions');
  
//   return {
//     success: true,
//     souscription: {
//       ...souscription,
//       assure_nom: (souscription as any).assure?.nom,
//       assure_email: (souscription as any).assure?.email,
//       type_assurance_nom: (souscription as any).type_assurance?.nom,
//       type_assurance_code: (souscription as any).type_assurance?.code,
//     },
//     isNewUser,
//     userId,
//   };
// }

// // ==================== DELETE ====================

// export async function deleteSouscription(id: string) {
//   const supabase = await createClient();
  
//   const { data: souscription } = await supabase
//     .from('souscriptions')
//     .select('assure_id')
//     .eq('id', id)
//     .single();
  
//   const { error } = await supabase
//     .from('souscriptions')
//     .delete()
//     .eq('id', id);
  
//   if (error) throw error;
  
//   if (souscription) {
//     await remettreNumeroSimple(souscription.assure_id);
//   }
  
//   revalidatePath('/admin/souscriptions');
// }

// async function remettreNumeroSimple(assureId: string) {
//   const supabase = await createClient();
  
//   const { data: souscriptions } = await supabase
//     .from('souscriptions')
//     .select('id, numero_assure')
//     .eq('assure_id', assureId)
//     .neq('statut', 'resiliee');
  
//   if (souscriptions && souscriptions.length === 1) {
//     await supabase
//       .from('souscriptions')
//       .update({ 
//         numero_assure: '10' + souscriptions[0].numero_assure.substring(2),
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', souscriptions[0].id);
//   }
// }

// // ==================== UPDATE STATUS ====================

// export async function updateSouscriptionStatus(id: string, statut: string) {
//   const supabase = await createClient();
  
//   const { error } = await supabase
//     .from('souscriptions')
//     .update({ statut, updated_at: new Date().toISOString() })
//     .eq('id', id);
  
//   if (error) throw error;
//   revalidatePath('/admin/souscriptions');
// }

// app/admin/souscriptions/action.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==================== TYPES ====================

type TypeAssuranceRelation = {
  id: string;
  code: string;
  nom: string;
};

export type TypeAssurance = {
  id: string;
  code: string;
  nom: string;
  description: string;
};

export type AssureInfo = {
  id: string;
  email: string;
  nom: string;
  telephone?: string;
  date_naissance?: string;
  sexe?: string;
  profession?: string;
  adresse?: string;
  nombre_assurances: number;
  souscriptions: Souscription[];
};

export type Souscription = {
  id: string;
  numero_assure: string;
  assure_id: string;
  type_assurance_id: string;
  type_assurance_nom?: string;
  type_assurance_code?: string;
  date_souscription: string;
  date_expiration: string;
  statut: string;
  prime: number;
  mode_paiement: string;
  documents_count?: number;
  created_at: string;
};

type CreateSouscriptionInput = {
  assure_id?: string;
  email: string;
  nom: string;
  telephone?: string;
  mot_de_passe?: string;
  date_naissance?: string;
  sexe?: string;
  profession?: string;
  adresse?: string;
  type_assurance_id: string;
  prime: number;
  mode_paiement: string;
};

// ==================== FONCTIONS UTILITAIRES ====================

function generatePoliceNumero(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `POL-${year}-${random}`;
}

// ==================== UPLOAD DOCUMENT ====================

export async function uploadSouscriptionDocument(
  souscriptionId: string,
  typeDocument: string,
  file: File,
  estObligatoire: boolean = false
) {
  const supabase = await createClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${souscriptionId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('souscriptions')
    .upload(fileName, file);
  
  if (uploadError) throw uploadError;
  
  const { data: { publicUrl } } = supabase.storage
    .from('souscriptions')
    .getPublicUrl(fileName);
  
  const { data, error } = await supabase
    .from('souscription_documents')
    .insert({
      souscription_id: souscriptionId,
      type_document: typeDocument,
      nom_fichier: file.name,
      url_fichier: publicUrl,
      taille_fichier: file.size,
      type_mime: file.type,
      est_obligatoire: estObligatoire,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ==================== GETTERS ====================

export async function getTypesAssurance() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('types_assurance')
    .select('*')
    .order('nom');
  
  if (error) throw error;
  return data as TypeAssurance[];
}

export async function getAssures() {
  const supabase = await createClient();
  
  // ✅ Correction : utiliser la relation explicite
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select(`
      id, email, nom, telephone, date_naissance, sexe, profession, adresse,
      souscriptions:souscriptions!souscriptions_assure_id_fkey(
        id, numero_assure, type_assurance_id, date_souscription, date_expiration,
        statut, prime, mode_paiement, created_at,
        type_assurance:types_assurance(id, code, nom),
        documents:souscription_documents(count)
      )
    `)
    .eq('role', 'assure')
    .order('nom');
  
  if (usersError) throw usersError;
  
  return (users || []).map((u: any) => ({
    id: u.id,
    email: u.email,
    nom: u.nom,
    telephone: u.telephone,
    date_naissance: u.date_naissance,
    sexe: u.sexe,
    profession: u.profession,
    adresse: u.adresse,
    nombre_assurances: (u.souscriptions || []).filter((s: any) => s.statut !== 'resiliee').length,
    souscriptions: (u.souscriptions || []).map((s: any) => ({
      ...s,
      type_assurance_nom: (s.type_assurance as TypeAssuranceRelation)?.nom || 'Inconnu',
      type_assurance_code: (s.type_assurance as TypeAssuranceRelation)?.code || 'inconnu',
      documents_count: s.documents?.[0]?.count || 0,
    })),
  })) as AssureInfo[];
}

export async function getSouscriptions() {
  const supabase = await createClient();
  
  // ✅ Correction : utiliser les relations explicites
  const { data, error } = await supabase
    .from('souscriptions')
    .select(`
      *,
      assure:users!souscriptions_assure_id_fkey(id, email, nom, telephone, photo_profil, date_naissance, sexe, profession, adresse),
      type_assurance:types_assurance(id, code, nom),
      documents:souscription_documents(count)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map((s: any) => ({
    ...s,
    assure_nom: s.assure?.nom,
    assure_email: s.assure?.email,
    assure_telephone: s.assure?.telephone,
    assure_date_naissance: s.assure?.date_naissance,
    assure_sexe: s.assure?.sexe,
    assure_profession: s.assure?.profession,
    assure_adresse: s.assure?.adresse,
    type_assurance_nom: s.type_assurance?.nom || 'Inconnu',
    type_assurance_code: s.type_assurance?.code || 'inconnu',
    documents_count: s.documents?.[0]?.count || 0,
  }));
}

// ==================== CREATE SOUSCRIPTION ====================

export async function createSouscription(data: CreateSouscriptionInput) {
  const supabase = await createClient();
  
  let userId: string;
  let isNewUser = false;
  
  if (data.assure_id) {
    userId = data.assure_id;
  } else {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email.toLowerCase().trim())
      .single();
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: data.email.toLowerCase().trim(),
          nom: data.nom,
          telephone: data.telephone || null,
          mot_de_passe: data.mot_de_passe || '123456',
          role: 'assure',
          first_login: true,
          date_naissance: data.date_naissance || null,
          sexe: data.sexe || null,
          profession: data.profession || null,
          adresse: data.adresse || null,
        })
        .select()
        .single();
      
      if (userError) throw new Error(`Erreur création utilisateur: ${userError.message}`);
      userId = newUser.id;
      isNewUser = true;
    }
  }
  
  const { data: existingSouscription } = await supabase
    .from('souscriptions')
    .select('id, statut')
    .eq('assure_id', userId)
    .eq('type_assurance_id', data.type_assurance_id)
    .neq('statut', 'resiliee')
    .single();
  
  if (existingSouscription) {
    throw new Error(`L'assuré a déjà une souscription ${existingSouscription.statut} pour ce type d'assurance`);
  }
  
  const policeNumero = generatePoliceNumero();
  
  const { data: typeAssurance } = await supabase
    .from('types_assurance')
    .select('code')
    .eq('id', data.type_assurance_id)
    .single();
  
  const code = typeAssurance?.code || 'UNK';
  const { count } = await supabase
    .from('souscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('assure_id', userId)
    .neq('statut', 'resiliee');
  
  const numeroAssure = `${String((count || 0) + 1).padStart(2, '0')}-${code}-${new Date().getFullYear()}`;
  
  const dateDebut = new Date().toISOString().split('T')[0];
  const dateExpiration = new Date();
  dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
  
  const { data: souscription, error: souscriptionError } = await supabase
    .from('souscriptions')
    .insert({
      police_numero: policeNumero,
      numero_assure: numeroAssure,
      assure_id: userId,
      type_assurance_id: data.type_assurance_id,
      date_souscription: dateDebut,
      date_debut: dateDebut,
      date_expiration: dateExpiration.toISOString().split('T')[0],
      statut: 'active',
      prime: data.prime,
      montant_prime: data.prime,
      mode_paiement: data.mode_paiement,
      created_by: userId,
    })
    .select()
    .single();
  
  if (souscriptionError) {
    throw new Error(`Erreur création souscription: ${souscriptionError.message}`);
  }
  
  revalidatePath('/admin/souscriptions');
  
  return {
    success: true,
    souscription,
    isNewUser,
    userId,
  };
}

// ==================== DELETE ====================

export async function deleteSouscription(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('souscriptions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  
  revalidatePath('/admin/souscriptions');
}

// ==================== UPDATE STATUS ====================

export async function updateSouscriptionStatus(id: string, statut: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('souscriptions')
    .update({ statut, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath('/admin/souscriptions');
}