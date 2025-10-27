import Link from "next/link";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { apiClient, Partner } from "@/lib/api";

export default async function PartnersPage() {
  let partners: Partner[] = [];
  let error = null;

  try {
    const response = await apiClient.getPartners();
    partners = response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load partners';
    console.error('Failed to fetch partners:', err);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🤝</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Partners</h1>
            <p className="text-lg text-gray-600 mt-1">
              Gestiona todos los socios y propietarios
            </p>
          </div>
        </div>
        <Link
          href="/partners/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Partner
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <span className="text-xl">📊</span>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-gray-900">{partners.length}</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <span className="text-xl">✅</span>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-green-600">
                {partners.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Activos</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <span className="text-xl">⏳</span>
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-yellow-600">
                {partners.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pendientes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error al cargar los partners
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-red-600 text-sm">
            Asegúrate de que la API esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <PartnersTable partners={partners} />
        </div>
      )}
    </div>
  );
}