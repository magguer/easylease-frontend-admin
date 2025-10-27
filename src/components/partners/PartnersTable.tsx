'use client';

import { useState } from 'react';
import { Partner } from '@/lib/api';
import Link from 'next/link';
import { Edit, Trash2, Eye, Mail, Phone, Building } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface PartnersTableProps {
  partners: Partner[];
}

export function PartnersTable({ partners }: PartnersTableProps) {
  const [partnersData, setPartnersData] = useState(partners);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este partner?')) {
      return;
    }

    setIsDeleting(id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPartnersData(prev => prev.filter(partner => partner._id !== id));
      } else {
        alert('Error al eliminar el partner');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el partner');
    } finally {
      setIsDeleting(null);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedPartner = await response.json();
        setPartnersData(prev => 
          prev.map(partner => 
            partner._id === id 
              ? { ...partner, status: updatedPartner.data.status }
              : partner
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
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {partnersData.map((partner) => (
              <tr key={partner._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center border border-gray-200">
                        <span className="text-purple-600 text-lg">🤝</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {partner.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${partner.email}`} className="hover:text-blue-600">
                        {partner.email}
                      </a>
                    </div>
                    {partner.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <a href={`tel:${partner.phone}`} className="hover:text-blue-600">
                          {partner.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {partner.company_name ? (
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      {partner.company_name}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-sm">Sin empresa</span>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <select
                    value={partner.status}
                    onChange={(e) => updateStatus(partner._id, e.target.value)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border cursor-pointer ${getStatusColor(partner.status)}`}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {formatDate(partner.createdAt)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/partners/${partner._id}/view`}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/partners/${partner._id}/edit`}
                      className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(partner._id)}
                      disabled={isDeleting === partner._id}
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
      
      {partnersData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🤝</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay partners registrados</h3>
          <p className="text-gray-600 mb-6">Empieza agregando propietarios y socios a la plataforma</p>
          <Link
            href="/partners/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear primer partner
          </Link>
        </div>
      )}
    </div>
  );
}