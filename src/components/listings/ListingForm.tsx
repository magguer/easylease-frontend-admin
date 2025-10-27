'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/lib/api';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ListingFormProps {
  listing?: Listing;
  isEditing?: boolean;
}

export function ListingForm({ listing, isEditing = false }: ListingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [formData, setFormData] = useState({
    title: listing?.title || '',
    price_per_week: listing?.price_per_week || 0,
    bond: listing?.bond || 0,
    bills_included: listing?.bills_included || false,
    address: listing?.address || '',
    suburb: listing?.suburb || '',
    room_type: listing?.room_type || 'single' as const,
    available_from: listing?.available_from ? listing.available_from.split('T')[0] : '',
    min_term_weeks: listing?.min_term_weeks || 1,
    preferred_tenants: listing?.preferred_tenants || [],
    house_features: listing?.house_features || [],
    rules: listing?.rules || [],
    status: listing?.status || 'draft' as const,
    locale: listing?.locale || 'es' as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        images,
        slug: formData.title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      };

      const url = isEditing 
        ? `${API_BASE_URL}/listings/${listing?._id}`
        : `${API_BASE_URL}/listings`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push('/listings');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Error al guardar la listing'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <Link
          href="/listings"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a listings
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Listing')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información básica</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Habitación doble en el centro de Madrid"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price_per_week" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio por semana (€) *
                  </label>
                  <input
                    type="number"
                    id="price_per_week"
                    name="price_per_week"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price_per_week}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="bond" className="block text-sm font-medium text-gray-700 mb-2">
                    Fianza (€) *
                  </label>
                  <input
                    type="number"
                    id="bond"
                    name="bond"
                    required
                    min="0"
                    step="0.01"
                    value={formData.bond}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bills_included"
                  name="bills_included"
                  checked={formData.bills_included}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="bills_included" className="ml-2 block text-sm text-gray-900">
                  Gastos incluidos
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Calle Mayor 123"
                />
              </div>

              <div>
                <label htmlFor="suburb" className="block text-sm font-medium text-gray-700 mb-2">
                  Barrio/Zona
                </label>
                <input
                  type="text"
                  id="suburb"
                  name="suburb"
                  value={formData.suburb}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Malasaña, Centro, etc."
                />
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la habitación</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="room_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de habitación *
                </label>
                <select
                  id="room_type"
                  name="room_type"
                  required
                  value={formData.room_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="single">Individual</option>
                  <option value="double">Doble</option>
                  <option value="master">Principal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="available_from" className="block text-sm font-medium text-gray-700 mb-2">
                    Disponible desde
                  </label>
                  <input
                    type="date"
                    id="available_from"
                    name="available_from"
                    value={formData.available_from}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="min_term_weeks" className="block text-sm font-medium text-gray-700 mb-2">
                    Estancia mínima (semanas) *
                  </label>
                  <input
                    type="number"
                    id="min_term_weeks"
                    name="min_term_weeks"
                    required
                    min="1"
                    value={formData.min_term_weeks}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Imágenes</h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL de la imagen"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias y características</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="preferred_tenants" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquilinos preferidos (separados por comas)
                </label>
                <input
                  type="text"
                  id="preferred_tenants"
                  value={formData.preferred_tenants.join(', ')}
                  onChange={(e) => handleArrayChange('preferred_tenants', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: Estudiantes, Profesionales, No fumadores"
                />
              </div>

              <div>
                <label htmlFor="house_features" className="block text-sm font-medium text-gray-700 mb-2">
                  Características de la casa (separadas por comas)
                </label>
                <input
                  type="text"
                  id="house_features"
                  value={formData.house_features.join(', ')}
                  onChange={(e) => handleArrayChange('house_features', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: WiFi, Lavadora, Cocina equipada, Terraza"
                />
              </div>

              <div>
                <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-2">
                  Normas de la casa (separadas por comas)
                </label>
                <input
                  type="text"
                  id="rules"
                  value={formData.rules.join(', ')}
                  onChange={(e) => handleArrayChange('rules', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Ej: No fumar, No mascotas, Silencio después de las 22h"
                />
              </div>
            </div>
          </div>

          {/* Status & Language */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado y configuración</h3>
            
            <div className="space-y-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="reserved">Reservado</option>
                  <option value="rented">Alquilado</option>
                </select>
              </div>

              <div>
                <label htmlFor="locale" className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma *
                </label>
                <select
                  id="locale"
                  name="locale"
                  required
                  value={formData.locale}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}