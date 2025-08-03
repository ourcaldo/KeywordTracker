/**
 * API Client Utilities
 * 
 * Centralized API client for making HTTP requests to Next.js API routes.
 * Provides consistent error handling and response formatting.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

/**
 * API client with common HTTP methods
 */
export const apiClient = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<T>(response)
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return this.handleResponse<T>(response)
  },

  /**
   * Handle API response and errors
   */
  async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      
      if (isJson) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage
        }
      }

      throw new ApiError(errorMessage, response.status)
    }

    if (isJson) {
      const data = await response.json()
      
      // Handle API response format
      if (data.success === false) {
        throw new ApiError(data.error || 'Unknown error', response.status)
      }
      
      return data.data !== undefined ? data.data : data
    }

    return response.text() as any
  }
}