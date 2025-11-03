import Link from "next/link";
import { ListingsTable } from "@/components/listings/ListingsTable";
import { apiClient, Listing } from "@/lib/api";
import { Home, Plus, BarChart3, CheckCircle, FileText, Lock, AlertTriangle } from 'lucide-react';

export default async function ListingsPage() {
  let listings: Listing[] = [];
  let error = null;

  try {
    const response = await apiClient.getListings();
    listings = response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load listings';
    console.error('Failed to fetch listings:', err);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Listings</h1>
            <p className="text-lg text-neutral-600 mt-1">
              Gestiona todas las habitaciones disponibles
            </p>
          </div>
        </div>
        <Link
          href="/listings/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-neutral-100">
              <BarChart3 className="w-6 h-6 text-neutral-600" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-neutral-900">{listings.length}</div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--green-100)]">
              <CheckCircle className="w-6 h-6 text-[var(--green-600)]" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-[var(--green-600)]">
                {listings.filter(l => l.status === 'published').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Publicados</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--accent-100)]">
              <FileText className="w-6 h-6 text-[var(--accent-600)]" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-[var(--accent-600)]">
                {listings.filter(l => l.status === 'draft').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Borradores</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-[var(--primary-100)]">
              <Lock className="w-6 h-6 text-[var(--primary-600)]" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-[var(--primary-600)]">
                {listings.filter(l => l.status === 'reserved').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Reservados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error al cargar las listings
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-red-600 text-sm">
            Asegúrate de que la API esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
          <ListingsTable listings={listings} />
        </div>
      )}
    </div>
  );
}