import { ListingForm } from "@/components/listings/ListingForm";
import { Plus } from "lucide-react";

export default function NewListingPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-[var(--primary-500)] rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Nueva Listing</h1>
            <p className="text-lg text-neutral-600 mt-1">
              Crea una nueva habitación disponible para alquilar
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-[var(--primary-500)] rounded-full mt-4"></div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
        <ListingForm />
      </div>
    </div>
  );
}