"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  folder: string;
}

interface SortableImageProps {
  imageUrl: string;
  index: number;
  onDelete: (imageUrl: string) => void;
  isDeleting: boolean;
}

function SortableImage({ imageUrl, index, onDelete, isDeleting }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: imageUrl });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg border-2 transition-all duration-200 ${
        isDragging
          ? 'opacity-50 border-blue-500 shadow-lg scale-105'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={`Imagen ${index + 1}`}
          width={200}
          height={128}
          className="w-full h-32 object-cover rounded-lg"
        />

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded p-1 cursor-grab active:cursor-grabbing transition-colors"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => onDelete(imageUrl)}
          disabled={isDeleting}
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-red-700"
          title="Eliminar imagen"
        >
          {isDeleting ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <X className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}

export function ImageUpload({
  images,
  onImagesChange,
  folder
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();

      // Add files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      // Add folder
      formData.append('folder', folder);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/upload-images`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Add new URLs to existing images
        onImagesChange([...images, ...result.data.uploadedUrls]);
      } else {
        alert('Error uploading images: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return;

    setDeleting(imageUrl);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();

      if (result.success) {
        // Remove image from state
        onImagesChange(images.filter(img => img !== imageUrl));
      } else {
        alert('Error deleting image: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting image');
    } finally {
      setDeleting(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);

      const newImages = arrayMove(images, oldIndex, newIndex);
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del listing
        </label>

        {/* Upload Button */}
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Subiendo...' : 'Seleccionar imágenes'}
          </button>
          <span className="text-sm text-gray-500">
            Máximo 5MB por imagen, hasta 10 imágenes
          </span>
        </div>
      </div>

      {/* Current Images Grid with Drag and Drop */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              Arrastra las imágenes para cambiar el orden
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {images.length} imagen{images.length !== 1 ? 'es' : ''}
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={images} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((imageUrl, index) => (
                  <SortableImage
                    key={imageUrl}
                    imageUrl={imageUrl}
                    index={index}
                    onDelete={handleDeleteImage}
                    isDeleting={deleting === imageUrl}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No hay imágenes subidas aún</p>
        </div>
      )}
    </div>
  );
}