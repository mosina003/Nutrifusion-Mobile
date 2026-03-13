import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Using WiFi connection - phone and laptop must be on same network
// If you prefer ADB reverse, run: adb reverse tcp:5000 tcp:5000 and change to localhost
const API_BASE_URL = 'http://192.168.0.102:5000/api';

// Storage Keys
const TOKEN_KEY = 'nutrifusion_token';
const USER_KEY = 'nutrifusion_user';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    console.log('📡 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data,
    });
    return response;
  },
  (error) => {
    const isNoDietPlan404 = error.response?.status === 404 && 
      error.config?.url?.includes('diet-plan');
    
    // Don't log 404 for diet plan as error - it's an expected state
    if (!isNoDietPlan404) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code,
        responseData: error.response?.data,
      });
    } else {
      console.log('ℹ️ No diet plan found (expected state)');
    }
    
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - clearing token');
      removeToken();
    }
    
    // Network error
    if (!error.response && error.message === 'Network Error') {
      console.error('🌐 Network Error - Check if backend is running at:', API_BASE_URL);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// Token Management
// ============================================

export const setToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async (): Promise<void> => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};

export const setUser = async (user: any): Promise<void> => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<any | null> => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// ============================================
// Type Definitions
// ============================================

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'practitioner';
}

interface AuthResponse {
  success: boolean;
  token: string;
  message?: string;
  data: {
    _id: string;
    name?: string;
    email: string;
    role: 'user' | 'practitioner';
    verified?: boolean;
    hasCompletedAssessment?: boolean;
    preferredMedicalFramework?: string;
  };
}

// ============================================
// Authentication APIs
// ============================================

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const endpoint = userData.role === 'practitioner' 
      ? '/auth/register/practitioner' 
      : '/auth/register/user';
    
    const response: AxiosResponse<AuthResponse> = await apiClient.post(endpoint, userData);
    
    if (response.data.success && response.data.token) {
      await setToken(response.data.token);
      await setUser(response.data.data);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', credentials);
    
    if (response.data.success && response.data.token) {
      await setToken(response.data.token);
      await setUser(response.data.data);
      console.log('💾 User data saved:', { email: response.data.data.email, name: response.data.data.name });
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code,
    });
    
    // Network error
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new Error('Connection timeout. Please check if the backend server is running.');
    }
    
    // Network unreachable
    if (error.message.includes('Network Error') || !error.response) {
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure:\n1. Your device is on WiFi (192.168.0.x network)\n2. Backend server is running\n3. IP address is correct`);
    }
    
    // Server returned an error
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = async (): Promise<void> => {
  await removeToken();
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/auth/me');
    if (response.data.success && response.data.data) {
      // Update local storage with fresh user data
      await setUser(response.data.data);
      return response.data.data;
    }
    throw new Error('Failed to get user data');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

// ============================================
// User Profile APIs
// ============================================

export const getMyProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};

export const getCompleteProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/users/profile/complete');
    return response.data.data || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get complete profile');
  }
};

export const updateMyProfile = async (profileData: any): Promise<any> => {
  try {
    const response = await apiClient.put('/users/me', profileData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const createHealthProfile = async (healthProfileData: any): Promise<any> => {
  try {
    const response = await apiClient.post('/health-profiles', healthProfileData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update health profile');
  }
};

// ============================================
// Dashboard APIs
// ============================================

export const getDashboardData = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/dashboard');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get dashboard data');
  }
};

// ============================================
// Assessment APIs
// ============================================

export const getAssessmentFrameworks = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/assessments/frameworks');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get frameworks');
  }
};

export const getAssessmentQuestions = async (framework: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/assessments/${framework}/questions`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get questions');
  }
};

export const submitAssessment = async (assessmentData: { framework: string; responses: any }): Promise<any> => {
  try {
    console.log('🌐 API: Submitting assessment...');
    console.log('   Framework:', assessmentData.framework);
    console.log('   Responses count:', Object.keys(assessmentData.responses).length);
    
    const response = await apiClient.post('/assessments/submit', {
      framework: assessmentData.framework,
      responses: assessmentData.responses
    });
    
    console.log('✅ API: Assessment submission successful');
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    
    // Update user data after successful assessment
    if (response.data.success && response.data.data) {
      console.log('🔄 API: Updating user data...');
      try {
        const updatedUser = await getCurrentUser();
        console.log('✅ API: User data updated');
      } catch (error) {
        console.error('⚠️ Failed to refresh user data after assessment:', error);
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ API: Assessment submission failed');
    console.error('   Error:', error.message);
    console.error('   Response:', error.response?.data);
    
    // Extract detailed error message
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to submit assessment';
    
    throw new Error(errorMessage);
  }
};

export const getAssessmentHistory = async (userId?: string): Promise<any> => {
  try {
    const endpoint = userId ? `/assessments/user/${userId}` : '/assessments/user';
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to get assessment history');
  }
};

// ============================================
// Diet Plan APIs
// ============================================

export const getDietPlans = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/diet-plans');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get diet plans');
  }
};

export const getCurrentDietPlan = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/diet-plans/current');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get current diet plan');
  }
};

// Get current diet plan with full details from assessment endpoint
export const getCurrentDietPlanFull = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/assessments/diet-plan/current');
    return response.data;
  } catch (error: any) {
    // Use 'error' property if available, fallback to 'message'
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to get diet plan';
    throw new Error(errorMessage);
  }
};

// Get meal completions
export const getMealCompletions = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/meal-completions');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get meal completions');
  }
};

// Toggle meal completion
export const toggleMealCompletion = async (data: {
  date: string;
  day: number;
  mealType: string;
  dietPlanId: string;
}): Promise<any> => {
  try {
    const response = await apiClient.post('/meal-completions/toggle', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to toggle meal completion');
  }
};

// Regenerate diet plan
export const regenerateDietPlan = async (): Promise<any> => {
  try {
    const response = await apiClient.post('/meal-completions/regenerate-plan');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to regenerate diet plan');
  }
};

// Replace a specific meal
export const replaceMeal = async (data: {
  day: number;
  mealType: string;
}): Promise<any> => {
  try {
    const response = await apiClient.post('/meal-completions/replace-meal', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to replace meal');
  }
};

// ============================================
// Recommendations APIs
// ============================================

export const getRecommendations = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/recommendations');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get recommendations');
  }
};

// ============================================
// User Account Management
// ============================================

export const deleteAccount = async (): Promise<void> => {
  try {
    await apiClient.delete('/users/me');
    await removeToken();
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
};

export default apiClient;
