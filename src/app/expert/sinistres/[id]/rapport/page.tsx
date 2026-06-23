// app/expert/sinistres/[id]/rapport/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaSave, FaUpload, FaDownload, FaFileAlt,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaClipboardList,
  FaCalendarAlt, FaMapMarkerAlt, FaUser, FaPhone,
  FaTimes, FaExclamationTriangle, FaTrash, FaPlus,
  FaFileContract
} from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==================== TYPES ====================

type SinistreInfo = {
  id: string;
  numero_dossier: string;
  type_sinistre: string;
  description: string;
  date_sinistre: string;
  lieu: string;
  montant_estime: number;
  assure_nom: string;
  assure_email: string;
  assure_telephone: string;
};

type Expertise = {
  id: string;
  statut: string;
  date_designation: string;
  date_expertise: string | null;
  rapport: string | null;
  conclusion: string | null;
  montant_evalue: number | null;
};

type ExistingDoc = {
  id: string;
  nom_fichier: string;
  url_fichier: string;
  created_at: string;
};

type FichierUpload = {
  file: File;
  preview?: string;
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

// ==================== PAGE ====================

type Props = { params: Promise<{ id: string }> };

export default function ExpertRapportPage({ params }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  const [sinistre, setSinistre] = useState<SinistreInfo | null>(null);
  const [expertise, setExpertise] = useState<Expertise | null>(null);
  const [existingDocs, setExistingDocs] = useState<ExistingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulaire
  const [form, setForm] = useState({
    rapport: '',
    conclusion: '',
    montant_evalue: 0,
  });
  const [fichiers, setFichiers] = useState<FichierUpload[]>([]);
  const [fichiersSupprimes, setFichiersSupprimes] = useState<string[]>([]);

  useEffect(() => {
    if (user && id) chargerDonnees();
  }, [user, id]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);

      // Charger tout en parallèle
      const [
        { data: sinistreData },
        { data: expertiseData },
        { data: docs },
      ] = await Promise.all([
        supabase.from('sinistres').select('*').eq('id', id).single(),
        supabase.from('expertises').select('*').eq('sinistre_id', id).eq('expert_id', user?.id).single(),
        supabase.from('expertise_documents').select('*').eq('expertise_id', 
          (await supabase.from('expertises').select('id').eq('sinistre_id', id).eq('expert_id', user?.id).single()).data?.id
        ),
      ]);

      if (!sinistreData) {
        setError('Sinistre non trouvé');
        setLoading(false);
        return;
      }

      if (!expertiseData) {
        setError('Aucune expertise assignée pour ce dossier');
        setLoading(false);
        return;
      }

      // Charger l'assuré
      const { data: assureData } = await supabase
        .from('users')
        .select('nom, email, telephone')
        .eq('id', sinistreData.assure_id)
        .single();

      setSinistre({
        id: sinistreData.id,
        numero_dossier: sinistreData.numero_dossier,
        type_sinistre: sinistreData.type_sinistre,
        description: sinistreData.description,
        date_sinistre: sinistreData.date_sinistre,
        lieu: sinistreData.lieu,
        montant_estime: sinistreData.montant_estime || 0,
        assure_nom: assureData?.nom || 'Inconnu',
        assure_email: assureData?.email || '',
        assure_telephone: assureData?.telephone || '',
      });

      setExpertise(expertiseData);
      
      // Pré-remplir le formulaire
      setForm({
        rapport: expertiseData.rapport || '',
        conclusion: expertiseData.conclusion || '',
        montant_evalue: expertiseData.montant_evalue || sinistreData.montant_estime || 0,
      });

      // Docs existants
      if (docs) {
        const expertiseId = expertiseData.id;
        const { data: existingDocuments } = await supabase
          .from('expertise_documents')
          .select('*')
          .eq('expertise_id', expertiseId);
        setExistingDocs(existingDocuments || []);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => {
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
        return { file, preview };
      });
      setFichiers(prev => [...prev, ...newFiles]);
    }
  };

  const removeFichier = (index: number) => {
    setFichiers(prev => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
  };

  const removeExistingDoc = (docId: string) => {
    setFichiersSupprimes(prev => [...prev, docId]);
    setExistingDocs(prev => prev.filter(d => d.id !== docId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.rapport.trim()) {
      setError('Le rapport est obligatoire');
      return;
    }
    if (!form.montant_evalue || form.montant_evalue <= 0) {
      setError('Le montant évalué est obligatoire');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 1. Mettre à jour l'expertise
      const { error: updateError } = await supabase
        .from('expertises')
        .update({
          rapport: form.rapport,
          conclusion: form.conclusion,
          montant_evalue: form.montant_evalue,
          statut: 'terminee',
          date_expertise: new Date().toISOString(),
        })
        .eq('id', expertise?.id);

      if (updateError) throw updateError;

      // 2. Supprimer les documents marqués
      if (fichiersSupprimes.length > 0) {
        await Promise.all(
          fichiersSupprimes.map(docId =>
            supabase.from('expertise_documents').delete().eq('id', docId)
          )
        );
      }

      // 3. Uploader les nouveaux fichiers
      if (fichiers.length > 0) {
        await Promise.all(
          fichiers.map(async ({ file }) => {
            const fileName = `expertises/${id}/${Date.now()}-${file.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('expertises')
              .upload(fileName, file);
            
            if (uploadError) {
              console.error('Erreur upload:', uploadError);
              return;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('expertises')
              .getPublicUrl(fileName);

            await supabase.from('expertise_documents').insert({
              expertise_id: expertise?.id,
              nom_fichier: file.name,
              url_fichier: publicUrl,
              type_document: 'rapport',
              taille_fichier: file.size,
              type_mime: file.type,
            });
          })
        );
      }

      // 4. Ajouter une communication
      await supabase.from('sinistre_communications').insert({
        sinistre_id: id,
        type: 'notification',
        contenu: `Rapport d'expertise déposé. Montant évalué : ${form.montant_evalue.toLocaleString()} CDF`,
        expediteur_id: user?.id,
      });

      setSuccess('Rapport soumis avec succès ! Redirection...');
      
      setTimeout(() => {
        router.push('/expert/missions');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('expertises')
        .update({
          rapport: form.rapport,
          conclusion: form.conclusion,
          montant_evalue: form.montant_evalue || null,
        })
        .eq('id', expertise?.id);

      if (error) throw error;

      setSuccess('Brouillon sauvegardé');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatMontant = (m: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CDF', maximumFractionDigits: 0 }).format(m);
  };

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'dd/MM/yyyy', { locale: fr }); }
    catch { return d; }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="h-10 w-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!sinistre || !expertise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-10 w-10 text-yellow-500" />
          <p className="mt-3 text-gray-600">{error || 'Non trouvé'}</p>
          <Link href="/expert/missions" className="mt-3 inline-block text-blue-600">Retour aux missions</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Link href={`/expert/sinistres/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-1">
                <FaArrowLeft className="mr-1 h-3 w-3" /> Retour au dossier
              </Link>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <FaClipboardList className="text-purple-600" />
                Rapport d'expertise
                <span className="text-sm font-normal text-gray-500">- {sinistre.numero_dossier}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <FaSave className="inline mr-1" /> Brouillon
              </button>
              <button
                type="submit"
                form="rapport-form"
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin inline mr-1" /> : <FaCheckCircle className="inline mr-1" />}
                Soumettre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-sm text-red-700">
            <FaExclamationTriangle className="mr-2 h-4 w-4" />{error}
            <button onClick={() => setError(null)} className="ml-auto"><FaTimes className="h-3 w-3" /></button>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-sm text-green-700">
            <FaCheckCircle className="mr-2 h-4 w-4" />{success}
          </div>
        )}

        <form id="rapport-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale - Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rapport détaillé */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-500" />
                  Rapport détaillé <span className="text-red-500 ml-1">*</span>
                </h2>
                <textarea
                  value={form.rapport}
                  onChange={e => setForm(p => ({ ...p, rapport: e.target.value }))}
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Décrivez en détail les dommages constatés, les circonstances de l'expertise, les observations techniques..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Soyez précis et factuel. Ce rapport servira de base pour l'indemnisation.
                </p>
              </div>

              {/* Conclusion */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Conclusion
                </h2>
                <textarea
                  value={form.conclusion}
                  onChange={e => setForm(p => ({ ...p, conclusion: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Votre conclusion sur la nature du sinistre, la couverture, la responsabilité..."
                />
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FaUpload className="mr-2 text-orange-500" />
                  Documents et photos
                </h2>

                {/* Documents existants */}
                {existingDocs.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documents déjà uploadés</p>
                    <div className="space-y-2">
                      {existingDocs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center min-w-0">
                            <FaFileAlt className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">{doc.nom_fichier}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <a href={doc.url_fichier} target="_blank" rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800">
                              <FaDownload className="h-4 w-4" />
                            </a>
                            <button type="button" onClick={() => removeExistingDoc(doc.id)}
                              className="text-red-500 hover:text-red-700">
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload nouveaux fichiers */}
                <div>
                  <label className="flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                    <div className="text-center">
                      <FaUpload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-medium text-purple-600">Cliquez pour ajouter</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Photos, PDF, documents (max 10MB)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    />
                  </label>

                  {/* Prévisualisation */}
                  {fichiers.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {fichiers.map((f, index) => (
                        <div key={index} className="relative border rounded-lg p-2 bg-gray-50">
                          {f.preview ? (
                            <img src={f.preview} alt={f.file.name} className="h-32 w-full object-cover rounded" />
                          ) : (
                            <div className="h-32 flex items-center justify-center bg-gray-100 rounded">
                              <FaFileAlt className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs truncate flex-1">{f.file.name}</span>
                            <button type="button" onClick={() => removeFichier(index)}
                              className="text-red-500 hover:text-red-700 ml-2">
                              <FaTrash className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Infos sinistre */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaFileContract className="mr-2 text-blue-500" />
                  Dossier
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">N° Dossier</p>
                    <p className="font-medium">{sinistre.numero_dossier}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Type</p>
                    <p>{TYPES_SINISTRE[sinistre.type_sinistre] || sinistre.type_sinistre}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Date sinistre</p>
                    <p><FaCalendarAlt className="inline mr-1 h-3 w-3 text-gray-400" />{formatDate(sinistre.date_sinistre)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Lieu</p>
                    <p><FaMapMarkerAlt className="inline mr-1 h-3 w-3 text-gray-400" />{sinistre.lieu}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Montant déclaré</p>
                    <p className="font-medium">{formatMontant(sinistre.montant_estime)}</p>
                  </div>
                </div>
              </div>

              {/* Assuré */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  Assuré
                </h3>
                <p className="text-sm font-medium">{sinistre.assure_nom}</p>
                <p className="text-xs text-gray-500">{sinistre.assure_email}</p>
                {sinistre.assure_telephone && (
                  <p className="text-xs text-gray-500 mt-1">
                    <FaPhone className="inline mr-1 h-3 w-3" />{sinistre.assure_telephone}
                  </p>
                )}
              </div>

              {/* Montant évalué */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3 flex items-center">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Montant évalué <span className="text-red-500 ml-1">*</span>
                </h3>
                <div className="relative">
                  <input
                    type="number"
                    value={form.montant_evalue}
                    onChange={e => setForm(p => ({ ...p, montant_evalue: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    min="0"
                    step="1000"
                    placeholder="0"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">CDF</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Montant total des dommages évalués lors de l'expertise
                </p>
              </div>

              {/* Statut expertise */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold mb-3">Statut de l'expertise</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  expertise.statut === 'terminee' ? 'bg-green-100 text-green-800' :
                  expertise.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {expertise.statut === 'terminee' ? '✓ Terminée' :
                   expertise.statut === 'en_cours' ? '⟳ En cours' : '⏳ Planifiée'}
                </span>
                {expertise.date_expertise && (
                  <p className="text-xs text-gray-500 mt-2">
                    Date expertise : {formatDate(expertise.date_expertise)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Boutons bas */}
        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={`/expert/sinistres/${id}`}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaSave className="inline mr-1" /> Sauvegarder le brouillon
          </button>
          <button
            type="submit"
            form="rapport-form"
            disabled={saving}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin inline mr-1" /> : <FaCheckCircle className="inline mr-1" />}
            Soumettre le rapport final
          </button>
        </div>
      </div>
    </div>
  );
}