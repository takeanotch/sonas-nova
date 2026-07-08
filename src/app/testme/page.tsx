'use client'
import React, { useState } from 'react';

interface FormData {
  // Informations générales
  agence: string;
  police: string;
  valableDu: string;
  valableAu: string;
  claimNo: string;
  garantie: string;
  telephone: string;

  // 1. Date et heure de l'accident
  dateHeureAccident: string;
  lieuAccident: string;

  // 2. Preneur d'assurance
  preneurNom: string;
  preneurPrenoms: string;
  preneurAdresse: string;

  // 3. Conducteur
  conducteurNomPrenom: string;
  conducteurAge: string;
  conducteurAService: boolean | null;
  conducteurTitre: string;
  permisNo: string;
  permisDelivreA: string;
  permisDate: string;

  // 4. Véhicule
  vehiculeMarqueType: string;
  vehiculePlaque: string;
  vehiculeChassis: string;
  vehiculeMoteur: string;
  vehiculePuissance: string;
  vehiculeAnnee: string;
  vehiculeKilometrage: string;
  vehiculeValeur: string;
  garantieRC: boolean;
  garantieDM: boolean;
  garantieInc: boolean;
  garantieVol: boolean;

  // 5. Description de l'accident
  descriptionAccident: string;

  // 6. Dégâts de votre véhicule
  degatsDescription: string;
  degatsMontantEvalue: string;

  // 7. Garage
  vehiculeImmobilise: boolean | null;
  lieuGarde: string;

  // 8. Adversaire
  adversaireNom: string;
  adversairePostNom: string;
  adversairePrenom: string;
  adversaireAdresse: string;
  adversaireVehicule: string;
  adversairePlaque: string;
  adversaireAssurance: string;
  adversaireTelephone: string;

  // 9. Dégâts matériels
  degatsMaterielsDescription: string;
  degatsMaterielsEvalues: string;

  // 10. Blessés ou morts
  blessesOuMorts: boolean | null;
  victimesInfos: string;
  victimesSoins: string;
  hopitalNomAdresse: string;
  medecinNom: string;
  medecinTelephone: string;

  // 11. Tiers transportés
  tiersTransportes: string;

  // 12. Témoins
  temoins: string;

  // 13. Autorités
  pvPar: string;
  localite: string;
  gendarmerie: string;
  officierGendarme: string;

  // 14. Prime d'assurance
  primePayee: boolean | null;
  primeDate: string;

  // Signature
  faitA: string;
  dateSignature: string;
}

const initialFormData: FormData = {
  agence: '',
  police: '',
  valableDu: '',
  valableAu: '',
  claimNo: '',
  garantie: '',
  telephone: '',
  dateHeureAccident: '',
  lieuAccident: '',
  preneurNom: '',
  preneurPrenoms: '',
  preneurAdresse: '',
  conducteurNomPrenom: '',
  conducteurAge: '',
  conducteurAService: null,
  conducteurTitre: '',
  permisNo: '',
  permisDelivreA: '',
  permisDate: '',
  vehiculeMarqueType: '',
  vehiculePlaque: '',
  vehiculeChassis: '',
  vehiculeMoteur: '',
  vehiculePuissance: '',
  vehiculeAnnee: '',
  vehiculeKilometrage: '',
  vehiculeValeur: '',
  garantieRC: false,
  garantieDM: false,
  garantieInc: false,
  garantieVol: false,
  descriptionAccident: '',
  degatsDescription: '',
  degatsMontantEvalue: '',
  vehiculeImmobilise: null,
  lieuGarde: '',
  adversaireNom: '',
  adversairePostNom: '',
  adversairePrenom: '',
  adversaireAdresse: '',
  adversaireVehicule: '',
  adversairePlaque: '',
  adversaireAssurance: '',
  adversaireTelephone: '',
  degatsMaterielsDescription: '',
  degatsMaterielsEvalues: '',
  blessesOuMorts: null,
  victimesInfos: '',
  victimesSoins: '',
  hopitalNomAdresse: '',
  medecinNom: '',
  medecinTelephone: '',
  tiersTransportes: '',
  temoins: '',
  pvPar: '',
  localite: '',
  gendarmerie: '',
  officierGendarme: '',
  primePayee: null,
  primeDate: '',
  faitA: '',
  dateSignature: '',
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
    <div className="bg-blue-600 text-white px-4 py-2 font-semibold">
      {title}
    </div>
    <div className="p-4 bg-white">
      {children}
    </div>
  </div>
);

const Input: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}> = ({ label, name, value, onChange, type = 'text', required, placeholder, className }) => (
  <div className={className || ''}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
    />
  </div>
);

const Textarea: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}> = ({ label, name, value, onChange, required, rows = 3, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-vertical"
    />
  </div>
);

const RadioGroup: React.FC<{
  label: string;
  name: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
}> = ({ label, name, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === true}
          onChange={() => onChange(true)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Oui</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          checked={value === false}
          onChange={() => onChange(false)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Non</span>
      </label>
    </div>
  </div>
);

const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const AccidentDeclarationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis :', formData);
    // Ici, vous pouvez envoyer les données à votre API
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">DÉCLARATION D'ACCIDENT</h1>
          <p className="text-center text-blue-100 mt-1">SONAS - Société Nationale d'Assurances</p>
        </div>

        <div className="bg-white border-x border-b border-gray-300 rounded-b-lg p-6 space-y-6">
          {/* Informations générales */}
          <Section title="Informations générales">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Agence" name="agence" value={formData.agence} onChange={handleChange} required />
              <Input label="Police" name="police" value={formData.police} onChange={handleChange} required />
              <Input label="Claim n°" name="claimNo" value={formData.claimNo} onChange={handleChange} />
              <Input label="Valable du" name="valableDu" value={formData.valableDu} onChange={handleChange} type="date" />
              <Input label="Au" name="valableAu" value={formData.valableAu} onChange={handleChange} type="date" />
              <Input label="Garantie" name="garantie" value={formData.garantie} onChange={handleChange} />
              <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} type="tel" className="md:col-span-1" />
            </div>
          </Section>

          {/* 1. Date et heure de l'accident */}
          <Section title="1. Date et heure de l'accident">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date et heure de l'accident"
                name="dateHeureAccident"
                value={formData.dateHeureAccident}
                onChange={handleChange}
                type="datetime-local"
                required
              />
              <Input
                label="Lieu de l'accident"
                name="lieuAccident"
                value={formData.lieuAccident}
                onChange={handleChange}
                required
                placeholder="Adresse complète"
              />
            </div>
          </Section>

          {/* 2. Preneur d'assurance */}
          <Section title="2. Preneur d'assurance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nom ou raison sociale" name="preneurNom" value={formData.preneurNom} onChange={handleChange} required />
              <Input label="Prénoms" name="preneurPrenoms" value={formData.preneurPrenoms} onChange={handleChange} required />
              <Input label="Adresse" name="preneurAdresse" value={formData.preneurAdresse} onChange={handleChange} required className="md:col-span-3" />
            </div>
          </Section>

          {/* 3. Conducteur */}
          <Section title="3. Conducteur">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nom et prénom" name="conducteurNomPrenom" value={formData.conducteurNomPrenom} onChange={handleChange} required />
              <Input label="Âge" name="conducteurAge" value={formData.conducteurAge} onChange={handleChange} type="number" />
              <div className="md:col-span-1">
                <RadioGroup
                  label="Était-il à votre service ?"
                  name="conducteurAService"
                  value={formData.conducteurAService}
                  onChange={(val) => handleRadioChange('conducteurAService', val)}
                />
              </div>
              <Input
                label="Sinon, à quel titre conduisait-il ?"
                name="conducteurTitre"
                value={formData.conducteurTitre}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input label="Permis de conduire n°" name="permisNo" value={formData.permisNo} onChange={handleChange} />
              <Input label="Délivré à" name="permisDelivreA" value={formData.permisDelivreA} onChange={handleChange} />
              <Input label="Date" name="permisDate" value={formData.permisDate} onChange={handleChange} type="date" />
            </div>
          </Section>

          {/* 4. Véhicule */}
          <Section title="4. Véhicule">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Marque et type" name="vehiculeMarqueType" value={formData.vehiculeMarqueType} onChange={handleChange} required />
              <Input label="N° de la plaque" name="vehiculePlaque" value={formData.vehiculePlaque} onChange={handleChange} required />
              <Input label="N° du châssis" name="vehiculeChassis" value={formData.vehiculeChassis} onChange={handleChange} />
              <Input label="N° du moteur" name="vehiculeMoteur" value={formData.vehiculeMoteur} onChange={handleChange} />
              <Input label="Puissance" name="vehiculePuissance" value={formData.vehiculePuissance} onChange={handleChange} />
              <Input label="Année" name="vehiculeAnnee" value={formData.vehiculeAnnee} onChange={handleChange} type="number" />
              <Input label="Kilométrage" name="vehiculeKilometrage" value={formData.vehiculeKilometrage} onChange={handleChange} type="number" />
              <Input label="Valeur" name="vehiculeValeur" value={formData.vehiculeValeur} onChange={handleChange} type="number" className="md:col-span-2" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Garanties couvertes :</label>
              <div className="flex flex-wrap gap-6">
                <Checkbox label="R.C." checked={formData.garantieRC} onChange={(val) => handleCheckboxChange('garantieRC', val)} />
                <Checkbox label="D.M." checked={formData.garantieDM} onChange={(val) => handleCheckboxChange('garantieDM', val)} />
                <Checkbox label="Inc." checked={formData.garantieInc} onChange={(val) => handleCheckboxChange('garantieInc', val)} />
                <Checkbox label="Vol" checked={formData.garantieVol} onChange={(val) => handleCheckboxChange('garantieVol', val)} />
              </div>
            </div>
          </Section>

          {/* 5. Description de l'accident */}
          <Section title="5. Description de l'accident">
            <Textarea
              label="Description de l'accident"
              name="descriptionAccident"
              value={formData.descriptionAccident}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Décrivez les circonstances de l'accident..."
            />
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Plan des lieux (schéma)</p>
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-400">Zone de dessin - À implémenter</p>
              </div>
            </div>
          </Section>

          {/* 6. Dégâts de votre véhicule */}
          <Section title="6. Dégâts de votre véhicule">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Description"
                name="degatsDescription"
                value={formData.degatsDescription}
                onChange={handleChange}
                placeholder="Description des dégâts"
              />
              <Input
                label="Montant évalué"
                name="degatsMontantEvalue"
                value={formData.degatsMontantEvalue}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
              />
            </div>
          </Section>

          {/* 7. Garage */}
          <Section title="7. Garage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioGroup
                label="Le véhicule est-il immobilisé ?"
                name="vehiculeImmobilise"
                value={formData.vehiculeImmobilise}
                onChange={(val) => handleRadioChange('vehiculeImmobilise', val)}
              />
              <Input
                label="Où est-il gardé pour expertise éventuelle ?"
                name="lieuGarde"
                value={formData.lieuGarde}
                onChange={handleChange}
                placeholder="Adresse du garage"
              />
            </div>
          </Section>

          {/* 8. Adversaire */}
          <Section title="8. Adversaire">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Nom" name="adversaireNom" value={formData.adversaireNom} onChange={handleChange} />
              <Input label="Post-nom" name="adversairePostNom" value={formData.adversairePostNom} onChange={handleChange} />
              <Input label="Prénom" name="adversairePrenom" value={formData.adversairePrenom} onChange={handleChange} />
              <Input label="Adresse" name="adversaireAdresse" value={formData.adversaireAdresse} onChange={handleChange} className="md:col-span-3" />
              <Input label="Véhicule (marque)" name="adversaireVehicule" value={formData.adversaireVehicule} onChange={handleChange} />
              <Input label="Plaque" name="adversairePlaque" value={formData.adversairePlaque} onChange={handleChange} />
              <Input label="Assurance" name="adversaireAssurance" value={formData.adversaireAssurance} onChange={handleChange} />
              <Input label="Téléphone" name="adversaireTelephone" value={formData.adversaireTelephone} onChange={handleChange} type="tel" className="md:col-span-2" />
            </div>
          </Section>

          {/* 9. Dégâts matériels */}
          <Section title="9. Dégâts matériels (subis par les tiers)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Description"
                name="degatsMaterielsDescription"
                value={formData.degatsMaterielsDescription}
                onChange={handleChange}
              />
              <Input
                label="Dégâts évalués à"
                name="degatsMaterielsEvalues"
                value={formData.degatsMaterielsEvalues}
                onChange={handleChange}
                type="number"
                placeholder="0.00"
              />
            </div>
          </Section>

          {/* 10. Blessés ou morts */}
          <Section title="10. Blessés ou morts">
            <div className="grid grid-cols-1 gap-4">
              <RadioGroup
                label="Y a-t-il des blessés et/ou des morts ?"
                name="blessesOuMorts"
                value={formData.blessesOuMorts}
                onChange={(val) => handleRadioChange('blessesOuMorts', val)}
              />
              <Textarea
                label="Nom, prénom et adresse des victimes"
                name="victimesInfos"
                value={formData.victimesInfos}
                onChange={handleChange}
              />
              <Input
                label="Où se trouvent les victimes pour les soins ?"
                name="victimesSoins"
                value={formData.victimesSoins}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nom et adresse de l'hôpital" name="hopitalNomAdresse" value={formData.hopitalNomAdresse} onChange={handleChange} />
                <Input label="Nom du médecin" name="medecinNom" value={formData.medecinNom} onChange={handleChange} />
              </div>
              <Input label="N° de téléphone" name="medecinTelephone" value={formData.medecinTelephone} onChange={handleChange} type="tel" />
            </div>
          </Section>

          {/* 11. Tiers transportés */}
          <Section title="11. Tiers transportés">
            <Textarea
              label="Noms, prénoms et adresses"
              name="tiersTransportes"
              value={formData.tiersTransportes}
              onChange={handleChange}
              rows={3}
            />
          </Section>

          {/* 12. Témoins */}
          <Section title="12. Témoins">
            <Textarea
              label="Noms, prénoms et adresses"
              name="temoins"
              value={formData.temoins}
              onChange={handleChange}
              rows={3}
            />
          </Section>

          {/* 13. Autorités */}
          <Section title="13. Autorités">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Procès-verbal par" name="pvPar" value={formData.pvPar} onChange={handleChange} />
              <Input label="Localité" name="localite" value={formData.localite} onChange={handleChange} />
              <Input label="Gendarmerie" name="gendarmerie" value={formData.gendarmerie} onChange={handleChange} />
              <Input label="Officier gendarme" name="officierGendarme" value={formData.officierGendarme} onChange={handleChange} />
            </div>
          </Section>

          {/* 14. Prime d'assurance */}
          <Section title="14. Prime d'assurance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioGroup
                label="La dernière prime d'assurance a-t-elle été payée ?"
                name="primePayee"
                value={formData.primePayee}
                onChange={(val) => handleRadioChange('primePayee', val)}
              />
              <Input
                label="Si oui, date"
                name="primeDate"
                value={formData.primeDate}
                onChange={handleChange}
                type="date"
              />
            </div>
          </Section>

          {/* Signature */}
          <Section title="Signature">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Fait à" name="faitA" value={formData.faitA} onChange={handleChange} placeholder="Lieu" />
              <Input label="Le (date)" name="dateSignature" value={formData.dateSignature} onChange={handleChange} type="date" />
            </div>
            <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 h-32 flex items-center justify-center">
              <p className="text-gray-400">Signature de l'assuré</p>
            </div>
          </Section>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Soumettre la déclaration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccidentDeclarationForm;