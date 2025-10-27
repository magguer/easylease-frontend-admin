import { apiClient } from "@/lib/api";
import Link from "next/link";

async function getStats() {
  try {
    const [listingsRes, leadsRes, partnersRes] = await Promise.all([
      apiClient.getListings(),
      apiClient.getLeads(),
      apiClient.getPartners(),
    ]);

    return {
      listings: listingsRes.data,
      leads: leadsRes.data,
      partners: partnersRes.data,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      listings: [],
      leads: [],
      partners: [],
    };
  }
}

export default async function Dashboard() {
  const { listings, leads, partners } = await getStats();

  const stats = [
    {
      name: 'Total Listings',
      value: listings.length,
      published: listings.filter(l => l.status === 'published').length,
      icon: '🏠',
      href: '/listings',
      color: 'bg-blue-500',
    },
    {
      name: 'Total Leads',
      value: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      icon: '👥',
      href: '/leads',
      color: 'bg-green-500',
    },
    {
      name: 'Total Partners',
      value: partners.length,
      active: partners.filter(p => p.status === 'active').length,
      icon: '🤝',
      href: '/partners',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-lg text-gray-600 mt-1">
              Resumen general de tu plataforma Rentalist
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`p-4 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <span className="text-2xl text-white">{stat.icon}</span>
                </div>
                <div className="ml-5 flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    {stat.published !== undefined && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {stat.published} publicados
                        </span>
                      </div>
                    )}
                    {stat.new !== undefined && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {stat.new} nuevos
                        </span>
                      </div>
                    )}
                    {stat.active !== undefined && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {stat.active} activos
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">🏠</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Listings Recientes
                </h2>
              </div>
              <Link
                href="/listings"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {listings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay listings creados aún
              </p>
            ) : (
              <div className="space-y-4">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {listing.images && listing.images.length > 0 ? (
                        <img 
                          src={listing.images[0]} 
                          alt={listing.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-lg">🏠</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {listing.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        €{listing.price_per_week}/semana • {listing.suburb || listing.address}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        listing.status === 'published' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : listing.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {listing.status === 'published' ? 'Publicado' : 
                         listing.status === 'draft' ? 'Borrador' : 
                         listing.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">👥</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Leads Recientes
                </h2>
              </div>
              <Link
                href="/leads"
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Ver todos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {leads.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay leads creados aún
              </p>
            ) : (
              <div className="space-y-4">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg">👤</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {lead.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {lead.email}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'new' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : lead.status === 'contacted'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : lead.status === 'converted'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {lead.status === 'new' ? 'Nuevo' :
                         lead.status === 'contacted' ? 'Contactado' :
                         lead.status === 'converted' ? 'Convertido' :
                         lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
