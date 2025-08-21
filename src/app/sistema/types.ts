export interface LoginFormData {
  email: string
  password: string
}

export interface RecoverPasswordFormData {
  email: string
}

export interface NewPasswordFormData {
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
    role: string
    active: boolean
  }
}

export interface PasswordRecoveryResponse {
  success: boolean
  message: string
  token?: string
}

export interface AuthError {
  field?: string
  message: string
}

export interface AuthState {
  loading: boolean
  error: string | null
  user: AuthResponse['user'] | null
}

export interface PasswordRequirements {
  minLength: boolean
  hasLetters: boolean
  hasNumbers: boolean
  hasSpecialChars: boolean
}
