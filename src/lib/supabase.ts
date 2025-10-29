import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket name
export const IMAGES_BUCKET = 'easylease-storage';

// Storage folder for listings
export const LISTINGS_FOLDER = 'listings';

// Helper function to upload image
export async function uploadListingImage(file: File, fileName: string) {
  const fullPath = `${LISTINGS_FOLDER}/${fileName}`;
  const { data, error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(fullPath, file, {
      upsert: false
    });

  if (error) throw error;
  return data;
}

// Helper function to get public URL
export function getListingImageUrl(fileName: string) {
  const fullPath = `${LISTINGS_FOLDER}/${fileName}`;
  const { data } = supabase.storage
    .from(IMAGES_BUCKET)
    .getPublicUrl(fullPath);

  return data.publicUrl;
}

// Helper function to delete image
export async function deleteListingImage(fileName: string) {
  const fullPath = `${LISTINGS_FOLDER}/${fileName}`;
  const { error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .remove([fullPath]);

  if (error) throw error;
}