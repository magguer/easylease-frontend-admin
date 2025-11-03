import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MessageSquare, Calendar, User, FileText, Building } from "lucide-react";

interface ViewLeadPageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

async function getLead(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error loading lead:', error);
    return null;
  }
}

const statusColors = {
  new: 'bg-[var(--primary-100)] text-[var(--primary-800)]',
  contacted: 'bg-[var(--coral-100)] text-[var(--coral-800)]',
  converted: 'bg-[var(--success-100)] text-[var(--success-800)]',
  discarded: 'bg-[var(--red-100)] text-[var(--red-800)]',
};

const statusLabels = {
  new: 'Nuevo',
  contacted: 'Contactado',
  converted: 'Convertido',
  discarded: 'Descartado',
};

export default async function ViewLeadPage({ params }: ViewLeadPageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            href="/leads"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            title="Volver a leads"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Detalles del Lead</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Información completa del contacto</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Lead Header */}
        <div className="bg-[var(--coral)] px-4 sm:px-6 lg:px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold truncate">{lead.name}</h2>
                <p className="text-white/90 mt-1 text-sm sm:text-base truncate">{lead.email}</p>
              </div>
            </div>
            <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${statusColors[lead.status as keyof typeof statusColors]} bg-white self-start sm:self-auto whitespace-nowrap`}>
              {statusLabels[lead.status as keyof typeof statusLabels]}
            </span>
          </div>
        </div>

        {/* Lead Details */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[var(--coral-600)]" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </div>
                <div className="text-neutral-900 font-medium">
                  <a href={`mailto:${lead.email}`} className="hover:text-[var(--coral-600)] transition-colors">
                    {lead.email}
                  </a>
                </div>
              </div>
              {lead.phone && (
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-neutral-500 mb-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Teléfono
                  </div>
                  <div className="text-neutral-900 font-medium">
                    <a href={`tel:${lead.phone}`} className="hover:text-[var(--coral-600)] transition-colors">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[var(--coral-600)]" />
                Mensaje
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Listing Reference */}
          {lead.listing_id && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[var(--coral-600)]" />
                Listing de Interés
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                      {typeof lead.listing_id === 'object' && lead.listing_id.title 
                        ? lead.listing_id.title 
                        : 'Listing eliminado'}
                    </div>
                    {typeof lead.listing_id === 'object' && lead.listing_id.slug && (
                      <div className="text-gray-500 text-xs sm:text-sm mt-1 truncate">{lead.listing_id.slug}</div>
                    )}
                  </div>
                  {typeof lead.listing_id === 'object' && lead.listing_id._id && (
                    <Link
                      href={`/listings/${lead.listing_id._id}/view`}
                      className="text-[var(--coral-600)] hover:text-[var(--coral-700)] text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      Ver listing →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 flex items-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-[var(--coral-600)]" />
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Fecha de Creación
                </div>
                <div className="text-gray-900 font-medium">
                  {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Última Actualización
                </div>
                <div className="text-gray-900 font-medium">
                  {new Date(lead.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
          <Link
            href="/leads"
            className="px-4 py-2 text-center text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
          >
            ← Volver
          </Link>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <a
              href={`mailto:${lead.email}`}
              className="px-4 py-2 bg-[var(--coral)] text-white rounded-lg hover:bg-[var(--coral-600)] transition-colors inline-flex items-center justify-center text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Email
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-lg hover:bg-[var(--primary-600)] transition-colors inline-flex items-center justify-center text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamar
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
