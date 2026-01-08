import { useState, useEffect } from 'react';
import { useUI } from '../hooks/useApp';
import Logo from './Logo';

const SearchModal = ({ onClose, onNavigate }) => {
  const { searchQuery, searchResults, setSearchQuery, performSearch } = useUI();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchQuery(localQuery);
      performSearch(localQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localQuery, setSearchQuery, performSearch]);

  const handleResultClick = (result) => {
    onNavigate(result.view, result);
    onClose();
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'empleado': return '👤';
      case 'materia': return '📦';
      case 'producto': return <Logo size="xs" />;
      case 'usuario': return '👨‍💼';
      default: return '📄';
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'empleado': return 'bg-blue-100 text-blue-800';
      case 'materia': return 'bg-green-100 text-green-800';
      case 'producto': return 'bg-amber-100 text-amber-800';
      case 'usuario': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-600">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Buscar empleados, productos, materias primas..."
              className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {localQuery.trim() === '' ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium mb-2">Búsqueda Global</p>
              <p className="text-sm">Busca empleados, productos, materias primas y más...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">Sin resultados</p>
              <p className="text-sm">No se encontraron resultados para "{localQuery}"</p>
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getResultColor(result.type)}`}>
                      {typeof getResultIcon(result.type) === 'string' ? (
                        <span className="text-lg">{getResultIcon(result.type)}</span>
                      ) : (
                        getResultIcon(result.type)
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(result.type)}`}>
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-dark-600 border border-gray-300 dark:border-dark-500 rounded text-xs">↑</kbd>
                <kbd className="px-2 py-1 bg-white dark:bg-dark-600 border border-gray-300 dark:border-dark-500 rounded text-xs">↓</kbd>
                <span>navegar</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-2 py-1 bg-white dark:bg-dark-600 border border-gray-300 dark:border-dark-500 rounded text-xs">Enter</kbd>
                <span>seleccionar</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white dark:bg-dark-600 border border-gray-300 dark:border-dark-500 rounded text-xs">Esc</kbd>
              <span>cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;