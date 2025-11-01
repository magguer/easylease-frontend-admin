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
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  converted: 'bg-green-100 text-green-800',
  discarded: 'bg-red-100 text-red-800',
};

const statusLabels = {
  new: '🆕 Nuevo',
  contacted: '📞 Contactado',
  converted: '✅ Convertido',
  discarded: '❌ Descartado',
};

export default async function ViewLeadPage({ params }: ViewLeadPageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/leads"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a leads"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalles del Lead</h1>
            <p className="text-gray-600 mt-1">Información completa del contacto</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Lead Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{lead.name}</h2>
                <p className="text-green-100 mt-1">{lead.email}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[lead.status as keyof typeof statusColors]} bg-white`}>
              {statusLabels[lead.status as keyof typeof statusLabels]}
            </span>
          </div>
        </div>

        {/* Lead Details */}
        <div className="p-8 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </div>
                <div className="text-gray-900 font-medium">
                  <a href={`mailto:${lead.email}`} className="hover:text-green-600 transition-colors">
                    {lead.email}
                  </a>
                </div>
              </div>
              {lead.phone && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Teléfono
                  </div>
                  <div className="text-gray-900 font-medium">
                    <a href={`tel:${lead.phone}`} className="hover:text-green-600 transition-colors">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                Mensaje
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Listing Reference */}
          {lead.listing_id && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-green-600" />
                Listing de Interés
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900 font-semibold">
                      {typeof lead.listing_id === 'object' && lead.listing_id.title 
                        ? lead.listing_id.title 
                        : 'Listing eliminado'}
                    </div>
                    {typeof lead.listing_id === 'object' && lead.listing_id.slug && (
                      <div className="text-gray-500 text-sm mt-1">{lead.listing_id.slug}</div>
                    )}
                  </div>
                  {typeof lead.listing_id === 'object' && lead.listing_id._id && (
                    <Link
                      href={`/listings/${lead.listing_id._id}/view`}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between">
          <Link
            href="/leads"
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Volver
          </Link>
          <div className="flex space-x-3">
            <a
              href={`mailto:${lead.email}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Email
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
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
