

'use client';

import { LogOut, User as UserIcon, ClipboardList, Shield, FileText, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUsers, FaHome, FaFileContract, FaClipboardCheck, FaSearch, FaBell, FaDollarSign } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

// Définition des menus par rôle
const menuConfig = {
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: FaHome, tooltip: 'Tableau de bord' },
    { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: FaUsers, tooltip: 'Gérer les utilisateurs' },
    { href: '/admin/souscriptions', label: 'Sinistres', icon: ClipboardList, tooltip: 'Gérer les sinistres' },
  ],
  agent: [
    { href: '/agent/dashboard', label: 'Dashboard', icon: FaHome, tooltip: 'Tableau de bord' },
    { href: '/agent/sinistres', label: 'Sinistres', icon: ClipboardList, tooltip: 'Traiter les dossiers' },
    { href: '/agent/indemnisations', label: 'Indemnisations', icon: FaDollarSign, tooltip: 'Suivre les expertises' },
    // { href: '/agent/notifications', label: 'Notifications', icon: FaBell, tooltip: 'Voir les notifications' },
  ],
  expert: [
    { href: '/expert/dashboard', label: 'Dashboard', icon: FaHome, tooltip: 'Tableau de bord' },
    { href: '/expert/missions', label: 'Mes Expertises', icon: FaClipboardCheck, tooltip: 'Gérer mes expertises' },
  ],
  assure: [
    { href: '/assure/dashboard', label: 'Dashboard', icon: FaHome, tooltip: 'Tableau de bord' },
    { href: '/assure/declaration', label: 'Faire une declaration', icon: FaFileContract, tooltip: 'Voir mes contrats' },
    { href: '/assure/sinistres', label: 'Mes Sinistres', icon: ClipboardList, tooltip: 'Voir mes sinistres' },
    { href: '/assure/reclamations', label: 'Réclamations', icon: FaBell, tooltip: 'Faire une réclamation' },
  ],
};

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [pathname]);

  // Obtenir les items de navigation selon le rôle
  const getNavItems = () => {
    if (!user) return [];
    return menuConfig[user.role as keyof typeof menuConfig] || [];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    router.push('/login');
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      'admin': 'Administrateur',
      'agent': 'Agent assurance',
      'expert': 'Expert',
      'assure': 'Assuré'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-800',
      'agent': 'bg-green-100 text-green-800',
      'expert': 'bg-blue-100 text-blue-800',
      'assure': 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBgColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-600',
      'agent': 'bg-green-600',
      'expert': 'bg-blue-600',
      'assure': 'bg-orange-600'
    };
    return colors[role] || 'bg-gray-600';
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <nav className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href={`/${user.role}/dashboard`} className="flex items-center space-x-2">
                  <img src='/sonas.png' className='w-[70px] sm:w-[90px] h-auto mx-auto mb-0' alt="SONAS Logo" />
                </Link>
              </div>
              
              {/* Navigation desktop */}
              <div className="hidden sm:ml-6 lg:ml-10 sm:flex sm:space-x-4 lg:space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.tooltip || item.label}
                      className={`inline-flex items-center px-1  pt-2 border-b-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        isActive
                          ? 'border-blue-500  text-blue-700'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="mr-2 h-6 w-6 pb-1" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Partie droite : Utilisateur et menu hamburger */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={`Profil de ${user.nom}`}
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 ${getRoleBgColor(user.role)} rounded-full overflow-hidden`}>
                    {user.photo_profil ? (
                      <img 
                        src={user.photo_profil} 
                        alt={user.nom} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[100px] lg:max-w-[150px]">
                      {user.nom}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </button>

                {/* Menu déroulant utilisateur */}
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {/* En-tête du menu */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center justify-center w-10 h-10 ${getRoleBgColor(user.role)} rounded-full`}>
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.nom}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                            {user.telephone && (
                              <p className="text-xs text-gray-400">
                                {user.telephone}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`inline-block mt-3 px-2.5 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="py-1">
                        <Link
                          href={`/profil`}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                          Mon profil
                        </Link>
                        <button
                          onClick={handleLogout}
                          title="Se déconnecter"
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu mobile overlay */}
        {showMobileMenu && (
          <div className="sm:hidden fixed inset-0 z-30">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={() => setShowMobileMenu(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 overflow-y-auto">
              <div className="px-4 py-6">
                {/* En-tête du menu mobile */}
                <div className="flex items-center justify-between mb-6">
                  <img src='/sonas.png' className='w-[80px] h-auto' alt="SONAS Logo" />
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Liens de navigation mobile */}
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <span>{item.label}</span>
                        {item.tooltip && (
                          <span className="ml-auto text-xs text-gray-400">{item.tooltip}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Informations utilisateur en mobile */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`flex items-center justify-center w-10 h-10 ${getRoleBgColor(user.role)} rounded-full`}>
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/profil"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mb-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Mon profil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}