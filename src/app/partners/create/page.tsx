import { PartnerForm } from "@/components/partners/PartnerForm";

import { Plus } from "lucide-react";

export default function CreatePartnerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-[var(--green-500)] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Crear Nuevo Partner</h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Agrega un nuevo socio o propietario al sistema
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 sm:p-6 lg:p-8">
        <PartnerForm />
      </div>
    </div>
  );
}
