import { ListingForm } from "@/components/listings/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🏠</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Nueva Listing</h1>
            <p className="text-lg text-gray-600 mt-1">
              Crea una nueva habitación disponible para alquilar
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-4"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <ListingForm />
      </div>
    </div>
  );
}