// services/operatorApi.ts
// API service for Tour Operator dashboard

import { apiRequest } from './api';

// ==========================================
// DASHBOARD
// ==========================================

export async function getOperatorDashboard() {
    return apiRequest('/operator/dashboard');
}

// ==========================================
// TOURS
// ==========================================

export async function getOperatorTours(params?: {
    search?: string;
    status?: string;
    type?: string;
    sort?: string;
}) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    return apiRequest(`/operator/tours${qs ? `?${qs}` : ''}`);
}

export async function createTour(tourData: any) {
    return apiRequest('/tours', {
        method: 'POST',
        body: JSON.stringify(tourData),
    });
}

export async function updateTour(id: string, tourData: any) {
    return apiRequest(`/tours/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tourData),
    });
}

export async function deleteTour(id: string) {
    return apiRequest(`/tours/${id}`, { method: 'DELETE' });
}

export async function updateTourStatus(id: string, status: string) {
    return apiRequest(`/operator/tours/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

// ==========================================
// BOOKINGS
// ==========================================

export async function getOperatorBookings(params?: {
    status?: string;
    tourId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
}) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.tourId) query.set('tourId', params.tourId);
    if (params?.search) query.set('search', params.search);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    const qs = query.toString();
    return apiRequest(`/operator/bookings${qs ? `?${qs}` : ''}`);
}

export async function updateBookingStatus(id: string, status: string) {
    return apiRequest(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
}

// ==========================================
// REVIEWS
// ==========================================

export async function getOperatorReviews(params?: {
    rating?: number;
    tourId?: string;
}) {
    const query = new URLSearchParams();
    if (params?.rating) query.set('rating', String(params.rating));
    if (params?.tourId) query.set('tourId', params.tourId);
    const qs = query.toString();
    return apiRequest(`/operator/reviews${qs ? `?${qs}` : ''}`);
}

export async function replyToReview(reviewId: string, text: string) {
    return apiRequest(`/operator/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
}

// ==========================================
// FINANCIAL
// ==========================================

export async function getRevenueData() {
    return apiRequest('/operator/revenue');
}

// ==========================================
// ANALYTICS
// ==========================================

export async function getAnalytics() {
    return apiRequest('/operator/analytics');
}

// ==========================================
// PROFILE
// ==========================================

export async function updateOperatorProfile(profileData: any) {
    return apiRequest('/operator/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
}
