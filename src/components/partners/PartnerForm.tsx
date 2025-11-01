'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Partner } from '@/lib/api';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

interface PartnerFormProps {
  partner?: Partner;
}

export function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!partner;

  const [formData, setFormData] = useState({
    name: partner?.name || '',
    email: partner?.email || '',
    phone: partner?.phone || '',
    company_name: partner?.company_name || '',
    status: partner?.status || 'pending' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditing 
        ? `${API_BASE_URL}/partners/${partner?._id}`
        : `${API_BASE_URL}/partners`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/partners');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Error al guardar el partner'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 border-b border-gray-200 pb-4 sm:pb-6">
        <Link
          href="/partners"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a partners
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Partner')}
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Información Personal</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="juan@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Información Empresarial</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la empresa
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Ej: Propiedades SL"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                id="status"
                name="status"
                required
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm sm:text-base"
              >
                <option value="pending">⏳ Pendiente</option>
                <option value="active">✅ Activo</option>
                <option value="inactive">❌ Inactivo</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Pendiente:</strong> Esperando aprobación • 
                <strong> Activo:</strong> Puede gestionar listings • 
                <strong> Inactivo:</strong> Suspendido temporalmente
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-blue-800">Sobre los Partners</h3>
              <div className="mt-2 text-xs sm:text-sm text-blue-700">
                <p>Los partners son los propietarios o socios que gestionan las propiedades. Pueden tener múltiples listings asociados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
