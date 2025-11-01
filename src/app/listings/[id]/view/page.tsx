import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, ArrowLeft, Eye, MapPin, Calendar, Users, Home, Euro, FileText } from "lucide-react";
import Image from "next/image";

interface ViewListingPageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getListing(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/admin/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error loading listing:', error);
    return null;
  }
}

export default async function ViewListingPage({ params }: ViewListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rented':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publicado';
      case 'draft':
        return 'Borrador';
      case 'reserved':
        return 'Reservado';
      case 'rented':
        return 'Alquilado';
      default:
        return status;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{listing.title}</h1>
            <p className="text-lg text-gray-600 mt-1 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {listing.address} {listing.suburb && `• ${listing.suburb}`}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/listings"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a listings
          </Link>
          <Link
            href={`/listings/${listing._id}/edit`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Edit className="w-5 h-5 mr-2" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Imágenes</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${listing.title} - Imagen ${index + 1}`}
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Detalles de la habitación</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Euro className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio por semana</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(listing.price_per_week)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Euro className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fianza</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(listing.bond)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de habitación</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {listing.room_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estancia mínima</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.min_term_weeks} semana{listing.min_term_weeks !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {listing.available_from && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disponible desde</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(listing.available_from)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gastos</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.bills_included ? 'Incluidos' : 'No incluidos'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Preferences */}
          {(listing.house_features?.length > 0 || listing.preferred_tenants?.length > 0 || listing.rules?.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Características y preferencias</h2>
              </div>
              <div className="p-6 space-y-6">
                {listing.house_features?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Características de la casa</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.house_features.map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {listing.preferred_tenants?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Inquilinos preferidos</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.preferred_tenants.map((tenant: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {tenant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {listing.rules?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Normas de la casa</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.rules.map((rule: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
            </div>
            <div className="p-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(listing.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  listing.status === 'published' ? 'bg-green-500' :
                  listing.status === 'draft' ? 'bg-yellow-500' :
                  listing.status === 'reserved' ? 'bg-blue-500' :
                  listing.status === 'rented' ? 'bg-purple-500' : 'bg-gray-500'
                }`}></div>
                {getStatusText(listing.status)}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Información del sistema</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                  {listing._id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Slug</p>
                <p className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">
                  {listing.slug}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idioma</p>
                <p className="text-sm text-gray-900">
                  {listing.locale === 'es' ? 'Español' : 'English'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Creado</p>
                <p className="text-sm text-gray-900">
                  {formatDate(listing.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Actualizado</p>
                <p className="text-sm text-gray-900">
                  {formatDate(listing.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Acciones rápidas</h3>
            </div>
            <div className="p-6 space-y-3">
              <a
                href={`${process.env.NEXT_PUBLIC_PUBLIC_URL || "http://localhost:3000"}/listings/${listing.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver en sitio público
              </a>
              <Link
                href={`/listings/${listing._id}/edit`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}