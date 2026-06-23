// // app/change-password/page.tsx
// 'use client'

// import { useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { Shield, Lock, Eye, EyeOff, ArrowRight, Key, CheckCircle } from 'lucide-react'

// export default function ChangePasswordPage() {
//   const [currentPassword, setCurrentPassword] = useState('')
//   const [newPassword, setNewPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false)
//   const [showNewPassword, setShowNewPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [passwordStrength, setPasswordStrength] = useState(0)
//   const { user, updateUser, logout } = useAuth()
//   const router = useRouter()

//   // Vérifier si l'utilisateur doit changer son mot de passe
//   if (!user) {
//     router.push('/login')
//     return null
//   }

//   // Évaluer la force du mot de passe
//   const evaluatePasswordStrength = (password: string) => {
//     let strength = 0
    
//     if (password.length >= 8) strength++
//     if (password.length >= 12) strength++
//     if (/[A-Z]/.test(password)) strength++
//     if (/[a-z]/.test(password)) strength++
//     if (/[0-9]/.test(password)) strength++
//     if (/[^A-Za-z0-9]/.test(password)) strength++
    
//     return strength
//   }

//   const getStrengthColor = (strength: number) => {
//     if (strength <= 2) return 'bg-red-500'
//     if (strength <= 3) return 'bg-orange-500'
//     if (strength <= 4) return 'bg-yellow-500'
//     return 'bg-green-500'
//   }

//   const getStrengthText = (strength: number) => {
//     if (strength <= 2) return 'Faible'
//     if (strength <= 3) return 'Moyen'
//     if (strength <= 4) return 'Bon'
//     return 'Fort'
//   }

//   const handleNewPasswordChange = (value: string) => {
//     setNewPassword(value)
//     setPasswordStrength(evaluatePasswordStrength(value))
//     if (error) setError('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')
//     setLoading(true)

//     try {
//       // Validation du mot de passe actuel
//       if (!user.mot_de_passe) {
//         setError('Erreur: impossible de vérifier votre mot de passe actuel')
//         setLoading(false)
//         return
//       }

//       if (currentPassword !== user.mot_de_passe) {
//         setError('Le mot de passe actuel est incorrect')
//         setLoading(false)
//         return
//       }

//       // Validation du nouveau mot de passe
//       if (newPassword.length < 8) {
//         setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
//         setLoading(false)
//         return
//       }

//       if (!/[A-Z]/.test(newPassword)) {
//         setError('Le mot de passe doit contenir au moins une majuscule')
//         setLoading(false)
//         return
//       }

//       if (!/[a-z]/.test(newPassword)) {
//         setError('Le mot de passe doit contenir au moins une minuscule')
//         setLoading(false)
//         return
//       }

//       if (!/[0-9]/.test(newPassword)) {
//         setError('Le mot de passe doit contenir au moins un chiffre')
//         setLoading(false)
//         return
//       }

//       if (!/[^A-Za-z0-9]/.test(newPassword)) {
//         setError('Le mot de passe doit contenir au moins un caractère spécial')
//         setLoading(false)
//         return
//       }

//       if (newPassword === currentPassword) {
//         setError('Le nouveau mot de passe doit être différent de l\'ancien')
//         setLoading(false)
//         return
//       }

//       if (newPassword !== confirmPassword) {
//         setError('Les mots de passe ne correspondent pas')
//         setLoading(false)
//         return
//       }

//       // Mise à jour dans la base de données
//       const { error: updateError } = await supabase
//         .from('users')
//         .update({
//           mot_de_passe: newPassword,
//           first_login: false,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', user.id)

//       if (updateError) {
//         console.error('Error updating password:', updateError)
//         setError('Erreur lors de la mise à jour du mot de passe')
//         setLoading(false)
//         return
//       }

//       // Mettre à jour le contexte utilisateur
//       updateUser({
//         ...user,
//         mot_de_passe: newPassword,
//         first_login: false
//       })

//       setSuccess('Mot de passe modifié avec succès ! Redirection...')
      
//       // Rediriger vers le dashboard après 2 secondes
//       setTimeout(() => {
//         router.push('/dashboard')
//       }, 2000)

//     } catch (err) {
//       console.error('Change password error:', err)
//       setError('Une erreur est survenue lors du changement de mot de passe')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCancel = () => {
//     if (user.first_login) {
//       logout()
//       router.push('/login')
//     } else {
//       router.push('/dashboard')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full">
//         {/* En-tête */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Key className="h-12 w-12 text-blue-600" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {user.first_login ? 'Première connexion' : 'Changer le mot de passe'}
//           </h1>
//           <p className="mt-2 text-sm text-gray-600">
//             {user.first_login 
//               ? 'Pour des raisons de sécurité, vous devez changer votre mot de passe lors de votre première connexion.'
//               : 'Modifiez votre mot de passe pour sécuriser votre compte.'}
//           </p>
//         </div>

//         {/* Carte du formulaire */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Message de succès */}
//           {success && (
//             <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
//               <div className="flex">
//                 <CheckCircle className="h-5 w-5 text-green-400" />
//                 <p className="ml-3 text-sm text-green-700">{success}</p>
//               </div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {error && (
//             <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <p className="ml-3 text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Mot de passe actuel */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe actuel
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showCurrentPassword ? 'text' : 'password'}
//                   value={currentPassword}
//                   onChange={(e) => {
//                     setCurrentPassword(e.target.value)
//                     if (error) setError('')
//                   }}
//                   className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
//                   placeholder="Entrez votre mot de passe actuel"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showCurrentPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Nouveau mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Key className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showNewPassword ? 'text' : 'password'}
//                   value={newPassword}
//                   onChange={(e) => handleNewPasswordChange(e.target.value)}
//                   className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
//                   placeholder="Entrez votre nouveau mot de passe"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowNewPassword(!showNewPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showNewPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
              
//               {/* Indicateur de force du mot de passe */}
//               {newPassword && (
//                 <div className="mt-2">
//                   <div className="flex gap-1 mb-1">
//                     {[1, 2, 3, 4, 5, 6].map((level) => (
//                       <div
//                         key={level}
//                         className={`h-1 flex-1 rounded-full ${
//                           level <= passwordStrength
//                             ? getStrengthColor(passwordStrength)
//                             : 'bg-gray-200'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <p className={`text-xs ${
//                     passwordStrength <= 2 ? 'text-red-600' :
//                     passwordStrength <= 3 ? 'text-orange-600' :
//                     passwordStrength <= 4 ? 'text-yellow-600' :
//                     'text-green-600'
//                   }`}>
//                     Force : {getStrengthText(passwordStrength)}
//                   </p>
//                 </div>
//               )}

//               {/* Exigences du mot de passe */}
//               <div className="mt-3 space-y-1">
//                 <p className="text-xs text-gray-500 font-medium mb-2">Le mot de passe doit contenir :</p>
//                 {[
//                   { label: 'Au moins 8 caractères', valid: newPassword.length >= 8 },
//                   { label: 'Une majuscule', valid: /[A-Z]/.test(newPassword) },
//                   { label: 'Une minuscule', valid: /[a-z]/.test(newPassword) },
//                   { label: 'Un chiffre', valid: /[0-9]/.test(newPassword) },
//                   { label: 'Un caractère spécial', valid: /[^A-Za-z0-9]/.test(newPassword) }
//                 ].map((req, index) => (
//                   <div key={index} className="flex items-center text-xs">
//                     {req.valid ? (
//                       <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
//                     ) : (
//                       <div className="h-3 w-3 rounded-full border border-gray-300 mr-2" />
//                     )}
//                     <span className={req.valid ? 'text-green-600' : 'text-gray-500'}>
//                       {req.label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Confirmation du mot de passe */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={confirmPassword}
//                   onChange={(e) => {
//                     setConfirmPassword(e.target.value)
//                     if (error) setError('')
//                   }}
//                   className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
//                   placeholder="Confirmez votre nouveau mot de passe"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                   )}
//                 </button>
//               </div>
//               {confirmPassword && newPassword !== confirmPassword && (
//                 <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
//               )}
//             </div>

//             {/* Boutons */}
//             <div className="space-y-3">
//               <button
//                 type="submit"
//                 disabled={loading || success !== ''}
//                 className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Modification en cours...
//                   </>
//                 ) : (
//                   <>
//                     {user.first_login ? 'Définir le mot de passe' : 'Changer le mot de passe'}
//                     <ArrowRight className="ml-2 h-5 w-5" />
//                   </>
//                 )}
//               </button>

//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
//               >
//                 Annuler
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-xs text-gray-500">
//             © {new Date().getFullYear()} Sonas L'shi. Tous droits réservés.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// app/change-password/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Eye, EyeOff, ArrowRight, Key, CheckCircle } from 'lucide-react'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, updateUser, logout } = useAuth()
  const router = useRouter()

  // Vérifier si l'utilisateur doit changer son mot de passe
  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation du mot de passe actuel
      if (!user.mot_de_passe) {
        setError('Erreur: impossible de vérifier votre mot de passe actuel')
        setLoading(false)
        return
      }

      if (currentPassword !== user.mot_de_passe) {
        setError('Le mot de passe actuel est incorrect')
        setLoading(false)
        return
      }

      // Validation basique du nouveau mot de passe
      if (newPassword.length < 6) {
        setError('Le nouveau mot de passe doit contenir au moins 6 caractères')
        setLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        setLoading(false)
        return
      }

      if (newPassword === currentPassword) {
        setError('Le nouveau mot de passe doit être différent de l\'ancien')
        setLoading(false)
        return
      }

      // Mise à jour dans la base de données
      const { error: updateError } = await supabase
        .from('users')
        .update({
          mot_de_passe: newPassword,
          first_login: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating password:', updateError)
        setError('Erreur lors de la mise à jour du mot de passe')
        setLoading(false)
        return
      }

      // Mettre à jour le contexte utilisateur
      updateUser({
        ...user,
        mot_de_passe: newPassword,
        first_login: false
      })

      setSuccess('Mot de passe modifié avec succès ! Redirection...')
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (err) {
      console.error('Change password error:', err)
      setError('Une erreur est survenue lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user.first_login) {
      logout()
      router.push('/login')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Key className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.first_login ? 'Première connexion' : 'Changer le mot de passe'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {user.first_login 
              ? 'Pour des raisons de sécurité, vous devez changer votre mot de passe lors de votre première connexion.'
              : 'Modifiez votre mot de passe pour sécuriser votre compte.'}
          </p>
        </div>

        {/* Carte du formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Message de succès */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mot de passe actuel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (error) setError('')
                  }}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Entrez votre mot de passe actuel"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (error) setError('')
                  }}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (error) setError('')
                  }}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Boutons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || success !== ''}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Modification en cours...
                  </>
                ) : (
                  <>
                    {user.first_login ? 'Définir le mot de passe' : 'Changer le mot de passe'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sonas L'shi. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}