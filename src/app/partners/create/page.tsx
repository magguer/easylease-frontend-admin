import { PartnerForm } from "@/components/partners/PartnerForm";

export default function CreatePartnerPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Partner</h1>
        <p className="text-gray-600 mt-2">
          Agrega un nuevo socio o propietario al sistema
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <PartnerForm />
      </div>
    </div>
  );
}
