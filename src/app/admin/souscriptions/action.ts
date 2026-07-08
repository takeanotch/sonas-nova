
// // app/admin/souscriptions/action.ts
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
//   return data as TypeAssurance[];
// }

// export async function getAssures() {
//   const supabase = await createClient();
  
//   // ✅ Correction : utiliser la relation explicite
//   const { data: users, error: usersError } = await supabase
//     .from('users')
//     .select(`
//       id, email, nom, telephone, date_naissance, sexe, profession, adresse,
//       souscriptions:souscriptions!souscriptions_assure_id_fkey(
//         id, numero_assure, type_assurance_id, date_souscription, date_expiration,
//         statut, prime, mode_paiement, created_at,
//         type_assurance:types_assurance(id, code, nom),
//         documents:souscription_documents(count)
//       )
//     `)
//     .eq('role', 'assure')
//     .order('nom');
  
//   if (usersError) throw usersError;
  
//   return (users || []).map((u: any) => ({
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
//   })) as AssureInfo[];
// }

// export async function getSouscriptions() {
//   const supabase = await createClient();
  
//   // ✅ Correction : utiliser les relations explicites
//   const { data, error } = await supabase
//     .from('souscriptions')
//     .select(`
//       *,
//       assure:users!souscriptions_assure_id_fkey(id, email, nom, telephone, photo_profil, date_naissance, sexe, profession, adresse),
//       type_assurance:types_assurance(id, code, nom),
//       documents:souscription_documents(count)
//     `)
//     .order('created_at', { ascending: false });
  
//   if (error) throw error;
  
//   return (data || []).map((s: any) => ({
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
//   }));
// }

// // ==================== CREATE SOUSCRIPTION ====================

// export async function createSouscription(data: CreateSouscriptionInput) {
//   const supabase = await createClient();
  
//   let userId: string;
//   let isNewUser = false;
  
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
  
//   const dateDebut = new Date().toISOString().split('T')[0];
//   const dateExpiration = new Date();
//   dateExpiration.setFullYear(dateExpiration.getFullYear() + 1);
  
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
//     .select()
//     .single();
  
//   if (souscriptionError) {
//     throw new Error(`Erreur création souscription: ${souscriptionError.message}`);
//   }
  
//   revalidatePath('/admin/souscriptions');
  
//   return {
//     success: true,
//     souscription,
//     isNewUser,
//     userId,
//   };
// }

// // ==================== DELETE ====================

// export async function deleteSouscription(id: string) {
//   const supabase = await createClient();
  
//   const { error } = await supabase
//     .from('souscriptions')
//     .delete()
//     .eq('id', id);
  
//   if (error) throw error;
  
//   revalidatePath('/admin/souscriptions');
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
  sexe?: string;
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

type VehiculeInput = {
  marque_type: string;
  plaque_immatriculation: string;
  numero_chassis?: string;
  numero_moteur?: string;
  puissance?: string;
  annee?: number;
  kilometrage?: number;
  valeur?: number;
};

type CreateSouscriptionInput = {
  assure_id?: string;
  email: string;
  nom: string;
  telephone?: string;
  mot_de_passe?: string;
  sexe?: string;
  adresse?: string;
  type_assurance_id: string;
  prime: number;
  mode_paiement: string;
  vehicule?: VehiculeInput;
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
  
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select(`
      id, email, nom, telephone, sexe, adresse,
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
    sexe: u.sexe,
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
  
  const { data, error } = await supabase
    .from('souscriptions')
    .select(`
      *,
      assure:users!souscriptions_assure_id_fkey(id, email, nom, telephone, photo_profil, sexe, adresse),
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
    assure_sexe: s.assure?.sexe,
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
          sexe: data.sexe || null,
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
  
  // SAUVEGARDER LES INFOS VÉHICULE SI ASSURANCE AUTOMOBILE
  if (data.vehicule && typeAssurance?.code === 'automobile') {
    const { error: vehiculeError } = await supabase
      .from('vehicules_assures')
      .insert({
        souscription_id: souscription.id,
        assure_id: userId,
        marque_type: data.vehicule.marque_type,
        plaque_immatriculation: data.vehicule.plaque_immatriculation,
        numero_chassis: data.vehicule.numero_chassis || null,
        numero_moteur: data.vehicule.numero_moteur || null,
        puissance: data.vehicule.puissance || null,
        annee: data.vehicule.annee || null,
        kilometrage: data.vehicule.kilometrage || null,
        valeur: data.vehicule.valeur || null,
      });
    
    if (vehiculeError) {
      console.error('Erreur sauvegarde véhicule:', vehiculeError);
      // Ne pas bloquer la création de la souscription
    }
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