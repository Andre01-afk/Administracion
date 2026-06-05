import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/v1';

/**
 * Make authenticated API requests
 */
export const apiCall = async (endpoint, options = {}) => {
    try {
        const token = await AsyncStorage.getItem('token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};

/**
 * Donation Services
 */
export const donationService = {
    // Get all donations (with optional filters)
    getDonations: async (filters = {}) => {
        const query = new URLSearchParams();
        if (filters.area) query.append('area', filters.area);
        if (filters.status) query.append('status', filters.status);
        if (filters.sort) query.append('sort', filters.sort);
        if (filters.page) query.append('page', filters.page);
        if (filters.limit) query.append('limit', filters.limit);
        if (filters.donorId) query.append('donorId', filters.donorId);
        if (filters.myTasks) query.append('myTasks', filters.myTasks);

        const queryString = query.toString() ? `?${query.toString()}` : '';
        return apiCall(`/donations${queryString}`);
    },

    // Create new donation
    createDonation: async (donationData) => {
        return apiCall('/donations', {
            method: 'POST',
            body: JSON.stringify(donationData),
        });
    },

    // Accept a donation (volunteer)
    acceptDonation: async (donationId) => {
        return apiCall(`/donations/${donationId}/accept`, {
            method: 'POST',
        });
    },

    cancelDonation: async(donationId) =>{
        return apiCall(`/donations/${donationId}/cancel`, {
            method: 'PUT',
        });
    },

    // Complete a donation (volunteer)
    completeDonation: async (donationId) => {
        return apiCall(`/donations/${donationId}/complete`, {
            method: 'POST',
        });
    },
};

/**
 * Volunteer Services
 */
export const volunteerService = {
    // Get volunteer profile
    getProfile: async () => {
        return apiCall('/volunteers/profile');
    },

    // Get volunteer dashboard
    getDashboard: async () => {
        return apiCall('/volunteers/dashboard');
    },
};

/**
 * Donor Services
 */
export const donorService = {
    // Get donor profile
    getProfile: async () => {
        return apiCall('/donors/profile');
    },
    createRating: async (ratingData) => {
        return apiCall('/donors/ratings', {
            method: 'POST',
            body: JSON.stringify(ratingData),
        });
    },
};

/**
 * Upload Services
 */
export const uploadService = {
    // Upload multiple images
    uploadImages: async (files) => {
        try {
            const token = await AsyncStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            if (!Array.isArray(files) || files.length === 0) {
                throw new Error('No files provided');
            }

            console.log('=== uploadService.uploadImages START ===');
            console.log('Files to upload:', files.length);

            // Crear FormData
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log(`\n[File ${i}] Processing:`, file);

                if (!file.uri) {
                    console.warn(`[File ${i}] No URI found, skipping`);
                    continue;
                }

                try {
                    console.log(`[File ${i}] Fetching blob from:`, file.uri);
                    const response = await fetch(file.uri);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file: ${response.status}`);
                    }

                    const blob = await response.blob();
                    console.log(`[File ${i}] Blob created:`, {
                        size: blob.size,
                        type: blob.type,
                        name: file.name
                    });

                    // Construcción segura del nombre de archivo
                    const fileName = file.name || `photo_${Date.now()}_${i}.jpg`;
                    console.log(`[File ${i}] Using filename:`, fileName);

                    // Agregar directamente el blob al FormData
                    // En React Native Web, esto es equivalente a agregar un File
                    formData.append('images', blob, fileName);
                    
                    console.log(`[File ${i}] ✓ Added to FormData`);

                } catch (fileError) {
                    console.error(`[File ${i}] Error processing:`, fileError);
                    throw new Error(`Error processing file ${i}: ${fileError.message}`);
                }
            }

            console.log('\n=== Sending FormData ===');
            console.log('API URL:', `${API_URL}/uploads`);
            console.log('Token prefix:', token.substring(0, 20) + '...');

            const uploadResponse = await fetch(`${API_URL}/uploads`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            console.log('Response status:', uploadResponse.status);

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Error response text:', errorText);
                
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { error: errorText };
                }
                
                throw new Error(errorData.error || `Upload Error: ${uploadResponse.status}`);
            }

            const result = await uploadResponse.json();
            console.log('=== Upload SUCCESS ===');
            console.log('Result:', result);
            return result;
        } catch (error) {
            console.error('=== Upload ERROR ===');
            console.error('Error:', error);
            throw error;
        }
    },

    // Delete an image by filename
    deleteImage: async (filename) => {
        return apiCall(`/uploads/${filename}`, {
            method: 'DELETE',
        });
    }
};

/**
 * User Services
 */
export const userService = {
    // Get current user profile
    getProfile: async () => {
        return apiCall('/users/profile');
    },

    // Update user profile
    updateProfile: async (profileData) => {
        return apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },
};

/**
 * Analytics Services
 */
export const analyticsService = {
    // Get metrics
    getMetrics: async () => {
        return apiCall('/analytics/metrics');
    },
};

/**
 * Matching Services
 */
export const matchingService = {
    // Get matched donations for volunteer
    getMatchedDonations: async (filters = {}) => {
        const query = new URLSearchParams();
        if (filters.area) query.append('area', filters.area);
        if (filters.maxDistance) query.append('maxDistance', filters.maxDistance);
        if (filters.volunteerId) query.append('volunteerId', filters.volunteerId);

        const queryString = query.toString() ? `?${query.toString()}` : '';
        return apiCall(`/matching/donations${queryString}`);
    },

    // Suggest a volunteer for a donation
    suggestVolunteer: async (donationId, volunteerId) => {
        return apiCall('/matching/suggest', {
            method: 'POST',
            body: JSON.stringify({ donationId, volunteerId }),
        });
    },
};
