'use client';

import { useState } from 'react';
import { Listing } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, Home, Plus } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ListingsTableProps {
  listings: Listing[];
}

export function ListingsTable({ listings }: ListingsTableProps) {
  const [listingsData, setListingsData] = useState(listings);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      return;
    }

    setIsDeleting(id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setListingsData(prev => prev.filter(listing => listing._id !== id));
      } else {
        alert('Error al eliminar la propiedad');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la propiedad');
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListingsData(prev => 
          prev.map(listing => 
            listing._id === id 
              ? { ...listing, status: updatedListing.data.status }
              : listing
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Precio/semana
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tipo habitación
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listingsData.map((listing) => (
              <tr key={listing._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-5 whitespace-nowrap">
                  {listing.images && listing.images.length > 0 ? (
                    <Image 
                      src={listing.images[0]} 
                      alt={listing.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-xl object-cover border border-neutral-200 shadow-sm"
                    />
                  ) : (
                    <div className="h-14 w-14 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center border border-neutral-200">
                      <Home className="w-6 h-6 text-neutral-500" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-semibold text-neutral-900 max-w-xs truncate">
                    {listing.title}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-neutral-900">{listing.address}</div>
                  <div className="text-sm text-neutral-600">{listing.suburb}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-neutral-900">
                    {formatCurrency(listing.price_per_week)}
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">/semana</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {listing.room_type}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(listing._id, listing.status)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border ${
                      listing.status === 'published'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      listing.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    {listing.status === 'published' ? 'Publicado' : 'Borrador'}
                  </button>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-neutral-600 font-medium">
                  {formatDate(listing.createdAt)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/listings/${listing._id}/view`}
                      className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/listings/${listing._id}/edit`}
                      className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      disabled={isDeleting === listing._id}
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
      
      {listingsData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No hay propiedades registradas</h3>
          <p className="text-neutral-600 mb-6">Comienza creando tu primera propiedad</p>
          <Link
            href="/listings/create"
            className="inline-flex items-center px-6 py-3 bg-[var(--primary-500)] text-white rounded-xl font-semibold hover:bg-[var(--primary-600)] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear primera propiedad
          </Link>
        </div>
      )}
    </div>
  );
}