import Link from "next/link";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { apiClient, Lead } from "@/lib/api";
import { Users, Plus, BarChart3, Sparkles, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

export default async function LeadsPage() {
  let leads: Lead[] = [];
  let error = null;

  try {
    const response = await apiClient.getLeads();
    leads = response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load leads';
    console.error('Failed to fetch leads:', err);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Leads</h1>
            <p className="text-lg text-neutral-600 mt-1">
              Gestiona todos los contactos e intereses
            </p>
          </div>
        </div>
        <Link
          href="/leads/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Lead
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
              <div className="text-3xl font-bold text-neutral-900">{leads.length}</div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-primary-600">
                {leads.filter(l => l.status === 'new').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Nuevos</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Phone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-orange-600">
                {leads.filter(l => l.status === 'contacted').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Contactados</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-green-600">
                {leads.filter(l => l.status === 'converted').length}
              </div>
              <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Convertidos</div>
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
            Error al cargar los leads
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-red-600 text-sm">
            Asegúrate de que la API esté ejecutándose en {process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
          <LeadsTable leads={leads} />
        </div>
      )}
    </div>
  );
}