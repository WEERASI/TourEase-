// services/adminApi.ts
// Admin API service — all admin-related API calls to /api/admin endpoints

import { apiRequest } from './api';

// ==========================================
// DASHBOARD
// ==========================================

export async function getDashboardStats() {
    return apiRequest('/admin/dashboard');
}

// ==========================================
// USERS
// ==========================================

export async function getUsers(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/users${query}`);
}

export async function updateUserRole(userId: string, role: string) {
    return apiRequest(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
    });
}

export async function updateUserStatus(userId: string, isActive: boolean) {
    return apiRequest(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive }),
    });
}

export async function deleteUser(userId: string) {
    return apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
}

// ==========================================
// OPERATORS
// ==========================================

export async function getOperators(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/operators${query}`);
}

export async function approveOperator(operatorId: string, action: 'approve' | 'reject', reason?: string) {
    return apiRequest(`/admin/operators/${operatorId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ action, reason }),
    });
}

// ==========================================
// TOURS
// ==========================================

export async function getTours(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/tours${query}`);
}

export async function updateTourStatus(tourId: string, status: string, reason?: string) {
    return apiRequest(`/admin/tours/${tourId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
    });
}

// ==========================================
// HOTELS
// ==========================================

export async function getHotels(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/hotels${query}`);
}

export async function approveHotel(hotelId: string, action: 'approve' | 'reject', reason?: string) {
    return apiRequest(`/admin/hotels/${hotelId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ action, reason }),
    });
}

// ==========================================
// DESTINATIONS (uses existing public routes)
// ==========================================

export async function getDestinations(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/destinations${query}`);
}

export async function createDestination(data: any) {
    return apiRequest('/destinations', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateDestination(id: string, data: any) {
    return apiRequest(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteDestination(id: string) {
    return apiRequest(`/destinations/${id}`, { method: 'DELETE' });
}

// ==========================================
// BOOKINGS
// ==========================================

export async function getBookings(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/bookings${query}`);
}

export async function updateBookingStatus(bookingId: string, status: string) {
    return apiRequest(`/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// ==========================================
// REVIEWS
// ==========================================

export async function getReviews(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiRequest(`/admin/reviews${query}`);
}

export async function deleteReview(reviewId: string) {
    return apiRequest(`/admin/reviews/${reviewId}`, { method: 'DELETE' });
}

// ==========================================
// ANALYTICS
// ==========================================

export async function getAnalytics() {
    return apiRequest('/admin/analytics');
}

// ==========================================
// SETTINGS
// ==========================================

export async function getSettings() {
    return apiRequest('/admin/settings');
}

export async function updateSettings(data: any) {
    return apiRequest('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
