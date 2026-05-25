// services/api.ts
// Central API helper for backend communication

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    token?: string;
    user?: T;
    data?: T;
    error?: string;
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('authToken');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
}

// Auth-specific API calls

export async function loginUser(email: string, password: string) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

export async function registerUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
}) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

export async function googleAuthLogin(credential: string) {
    const data = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential }),
    });

    if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}
