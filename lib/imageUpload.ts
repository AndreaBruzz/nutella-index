'use client';

import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const STORAGE_BUCKET = 'user-submission-images';
const SIGNED_URL_EXPIRY = 3600; // 1 hour in seconds

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an image file before upload.
 * Checks: MIME type, file size, file extension
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG, and WebP images are allowed.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be under 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`,
    };
  }

  // Check extension matches type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension. Use .jpg, .png, or .webp',
    };
  }

  return { valid: true };
}

/**
 * Uploads an image to Supabase Storage (private bucket).
 * Returns the storage path on success for later signed URL generation.
 */
export async function uploadImageToStorage(
  file: File,
  submissionId: string
): Promise<{ path?: string; error?: string }> {
  try {
    // Generate unique filename to avoid collisions
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${submissionId}-${timestamp}.${extension}`;
    const filepath = `submissions/${filename}`;

    // Upload to Supabase Storage (private bucket)
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { error: `Upload failed: ${error.message}` };
    }

    if (!data) {
      return { error: 'Upload succeeded but no path returned.' };
    }

    // Return storage path (not URL) - URL will be generated on-demand with expiry
    return { path: data.path };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during upload';
    return { error: `Upload error: ${message}` };
  }
}

/**
 * Generates a signed URL for accessing a private storage file.
 * Signed URLs expire after SIGNED_URL_EXPIRY seconds (1 hour).
 * Use this for moderator dashboard to view submitted images.
 */
export async function getSignedImageUrl(filepath: string): Promise<{ url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filepath, SIGNED_URL_EXPIRY);

    if (error) {
      return { error: `Failed to generate signed URL: ${error.message}` };
    }

    if (!data) {
      return { error: 'Signed URL generation succeeded but no URL returned.' };
    }

    return { url: data.signedUrl };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: `Signed URL generation error: ${message}` };
  }
}

/**
 * Generates a temporary preview URL for a selected file (before upload).
 * Use for showing a preview in the UI.
 */
export function generateImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Cleans up a temporary preview URL.
 * Call when the component unmounts or preview is no longer needed.
 */
export function revokeImagePreview(previewUrl: string): void {
  URL.revokeObjectURL(previewUrl);
}

/**
 * Generates a temporary preview URL for a selected file (before upload).
 * Use for showing a preview in the UI before the user submits.
 */
export function compressImage(file: File, targetWidth: number = 1200): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const aspectRatio = img.height / img.width;
        canvas.width = targetWidth;
        canvas.height = Math.round(targetWidth * aspectRatio);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
