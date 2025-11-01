import { LeadForm } from "@/components/leads/LeadForm";
import { notFound } from "next/navigation";

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

async function getLead(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error loading lead:', error);
    return null;
  }
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Lead</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Actualiza la información del contacto
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <LeadForm lead={lead} />
      </div>
    </div>
  );
}
