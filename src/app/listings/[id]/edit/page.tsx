import { ListingForm } from "@/components/listings/ListingForm";
import { notFound } from "next/navigation";
import { Edit } from "lucide-react";

interface EditListingPageProps {
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

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[var(--primary-500)] rounded-xl flex items-center justify-center shadow-lg">
            <Edit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Editar Listing</h1>
            <p className="text-lg text-neutral-600 mt-1">
              Modifica los detalles de: {listing.title}
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-[var(--primary-500)] rounded-full mt-4"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
        <ListingForm listing={listing} isEditing={true} />
      </div>
    </div>
  );
}