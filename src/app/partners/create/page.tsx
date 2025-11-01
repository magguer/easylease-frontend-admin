import { PartnerForm } from "@/components/partners/PartnerForm";

export default function CreatePartnerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Nuevo Partner</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Agrega un nuevo socio o propietario al sistema
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <PartnerForm />
      </div>
    </div>
  );
}
