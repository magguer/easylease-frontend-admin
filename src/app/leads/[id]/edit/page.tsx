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
      <div className="mb-6 sm:mb-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-[var(--coral)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Editar Lead</h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Actualiza la información del contacto
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 sm:p-6 lg:p-8">
        <LeadForm lead={lead} />
      </div>
    </div>
  );
}
