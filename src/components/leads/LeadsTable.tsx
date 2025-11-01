'use client';

import { useState } from 'react';
import { Lead } from '@/lib/api';
import Link from 'next/link';
import { Edit, Trash2, Eye, Mail, Phone, Users, Home } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [leadsData, setLeadsData] = useState(leads);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este lead?')) {
      return;
    }

    setIsDeleting(id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeadsData(prev => prev.filter(lead => lead._id !== id));
      } else {
        alert('Error al eliminar el lead');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el lead');
    } finally {
      setIsDeleting(null);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedLead = await response.json();
        setLeadsData(prev => 
          prev.map(lead => 
            lead._id === id 
              ? { ...lead, status: updatedLead.data.status }
              : lead
          )
        );
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'contacted':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'converted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discarded':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };



  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Email & Teléfono
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Mensaje
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {leadsData.map((lead) => (
              <tr key={lead._id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center border border-neutral-200">
                        <span className="text-primary-600 text-lg">👤</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-neutral-900">
                        {lead.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-neutral-900">
                      <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                      <a href={`mailto:${lead.email}`} className="hover:text-primary-600">
                        {lead.email}
                      </a>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone className="h-4 w-4 mr-2 text-neutral-400" />
                        <a href={`tel:${lead.phone}`} className="hover:text-primary-600">
                          {lead.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-neutral-900 max-w-xs">
                    {lead.message ? (
                      <div className="truncate" title={lead.message}>
                        {lead.message}
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Sin mensaje</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead._id, e.target.value)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border cursor-pointer ${getStatusColor(lead.status)}`}
                  >
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="converted">Convertido</option>
                    <option value="discarded">Descartado</option>
                  </select>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-neutral-600 font-medium">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/leads/${lead._id}/view`}
                      className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/leads/${lead._id}/edit`}
                      className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      disabled={isDeleting === lead._id}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {leadsData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No hay leads registrados</h3>
          <p className="text-neutral-600 mb-6">Los contactos aparecerán aquí cuando los usuarios se interesen en las propiedades</p>
          <Link
            href="/listings"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Ver Listings
          </Link>
        </div>
      )}
    </div>
  );
}