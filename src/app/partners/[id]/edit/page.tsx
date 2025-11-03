import { PartnerForm } from "@/components/partners/PartnerForm";
import { notFound } from "next/navigation";
import { Edit } from "lucide-react";

interface EditPartnerPageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

async function getPartner(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/partners/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error loading partner:', error);
    return null;
  }
}

export default async function EditPartnerPage({ params }: EditPartnerPageProps) {
  const { id } = await params;
  const partner = await getPartner(id);

  if (!partner) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-[var(--green-500)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <Edit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Editar Partner</h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Actualiza la información del socio o propietario
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 sm:p-6 lg:p-8">
        <PartnerForm partner={partner} />
      </div>
    </div>
  );
}
