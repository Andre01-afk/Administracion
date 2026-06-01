/**
 * Utility functions for handling image URLs and blob conversions
 */

/**
 * Valida que una URL de imagen sea válida
 * @param {string} url - La URL a validar
 * @returns {boolean} - True si es válida
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // Validar data URLs
  if (url.startsWith('data:')) {
    return url.includes('base64,') && url.length > 100;
  }
  
  // Validar blob URLs
  if (url.startsWith('blob:')) {
    return true;
  }
  
  // Validar HTTP/HTTPS URLs
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Obtiene la URL de imagen segura, asegurando que sea válida
 * Si viene como objeto, extrae la URL correctamente
 * @param {string|object} photoData - URL o objeto con url
 * @returns {string|null} - URL válida o null
 */
export const getPhotoUrl = (photoData) => {
  if (!photoData) return null;
  
  // Si es un objeto con propiedad url
  if (typeof photoData === 'object' && photoData.url) {
    return getPhotoUrl(photoData.url); // Recursivo en caso de nesting
  }
  
  // Si es string, validar y retornar
  if (typeof photoData === 'string') {
    return isValidImageUrl(photoData) ? photoData : null;
  }
  
  return null;
};

/**
 * Obtiene la primera foto válida de un array de fotos
 * @param {array} photos - Array de fotos
 * @returns {string|null} - URL válida de la primera foto o null
 */
export const getFirstValidPhoto = (photos) => {
  if (!Array.isArray(photos) || photos.length === 0) return null;
  
  for (const photo of photos) {
    const url = getPhotoUrl(photo);
    if (url) return url;
  }
  
  return null;
};

/**
 * Valida y repara URLs de imágenes que podrían estar dañadas
 * Intenta recuperar data URLs de blob URLs si es posible
 * @param {string} url - URL potencialmente dañada
 * @returns {Promise<string|null>} - URL válida o null
 */
export const validateAndRepairImageUrl = async (url) => {
  if (!url) return null;
  
  // Si es un data URL válido, retornar
  if (url.startsWith('data:') && isValidImageUrl(url)) {
    return url;
  }
  
  // Si es blob URL, ya no hay mucho que podamos hacer
  // (blob URLs son temporales y se destruyen después de cierto tiempo)
  if (url.startsWith('blob:')) {
    console.warn('Blob URL detected - these are temporary and may expire:', url);
    return null;
  }
  
  // Para HTTP URLs, podría validar pero eso requeriría request
  if (url.startsWith('http')) {
    return url;
  }
  
  return null;
};

/**
 * Hook para manejar errores de carga de imagen
 * Intenta con una imagen placeholder como fallback
 */
import React from 'react';

export const useImageErrorHandling = () => {
  const [imageErrors, setImageErrors] = React.useState({});
  
  const handleImageError = (id) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const isImageFailed = (id) => imageErrors[id] === true;
  
  return { handleImageError, isImageFailed, imageErrors };
};
