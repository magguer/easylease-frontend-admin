import { PartnerForm } from "@/components/partners/PartnerForm";
import { notFound } from "next/navigation";

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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Partner</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Actualiza la información del socio o propietario
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <PartnerForm partner={partner} />
      </div>
    </div>
  );
}
