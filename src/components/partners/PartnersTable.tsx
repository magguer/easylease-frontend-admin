'use client';

import { useState } from 'react';
import { Partner } from '@/lib/api';
import Link from 'next/link';
import { Edit, Trash2, Eye, Mail, Phone, Building, Building2, Plus } from 'lucide-react';

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
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
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
                      <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border border-neutral-200">
                        <span className="text-green-600 text-lg">🤝</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-neutral-900">
                        {partner.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-neutral-900">
                      <Mail className="h-4 w-4 mr-2 text-neutral-400" />
                      <a href={`mailto:${partner.email}`} className="hover:text-primary-600">
                        {partner.email}
                      </a>
                    </div>
                    {partner.phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone className="h-4 w-4 mr-2 text-neutral-400" />
                        <a href={`tel:${partner.phone}`} className="hover:text-primary-600">
                          {partner.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {partner.company_name ? (
                    <div className="flex items-center text-sm text-neutral-900">
                      <Building className="h-4 w-4 mr-2 text-neutral-400" />
                      {partner.company_name}
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic text-sm">Sin empresa</span>
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
                <td className="px-6 py-5 whitespace-nowrap text-sm text-neutral-600 font-medium">
                  {formatDate(partner.createdAt)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/partners/${partner._id}/view`}
                      className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/partners/${partner._id}/edit`}
                      className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
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
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No hay partners registrados</h3>
          <p className="text-neutral-600 mb-6">Empieza agregando propietarios y socios a la plataforma</p>
          <Link
            href="/partners/create"
            className="inline-flex items-center px-6 py-3 bg-[var(--green-500)] text-white rounded-xl font-semibold hover:bg-[var(--green-600)] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear primer partner
          </Link>
        </div>
      )}
    </div>
  );
}