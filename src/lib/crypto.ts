import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encryptData(data: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decrypted) {
      throw new Error('Failed to decrypt data - invalid key or corrupted data')
    }
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

export function generateSecurePassword(
  length: number = 16,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true,
  excludeSimilar: boolean = true
): string {
  let charset = ''
  
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  // Characters that look similar and might be confused
  const similar = 'il1Lo0O'
  
  if (includeUppercase) {
    charset += excludeSimilar ? uppercase.replace(/[IL]/g, '') : uppercase
  }
  if (includeLowercase) {
    charset += excludeSimilar ? lowercase.replace(/[lo]/g, '') : lowercase
  }
  if (includeNumbers) {
    charset += excludeSimilar ? numbers.replace(/[10]/g, '') : numbers
  }
  if (includeSymbols) {
    charset += symbols
  }
  
  if (!charset) {
    throw new Error('At least one character type must be selected')
  }
  
  let password = ''
  
  // Ensure at least one character from each selected type
  const requiredChars = []
  if (includeUppercase) requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)])
  if (includeLowercase) requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)])
  if (includeNumbers) requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)])
  if (includeSymbols) requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)])
  
  // Fill remaining length with random characters
  for (let i = requiredChars.length; i < length; i++) {
    requiredChars.push(charset[Math.floor(Math.random() * charset.length)])
  }
  
  // Shuffle the array to randomize positions
  for (let i = requiredChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]]
  }
  
  return requiredChars.join('')
}

export function getPasswordStrength(password: string): {
  score: number
  feedback: string[]
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
} {
  const feedback: string[] = []
  let score = 0
  
  // Length check
  if (password.length >= 12) {
    score += 2
  } else if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Use at least 8 characters')
  }
  
  // Character diversity
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')
  
  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers')
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters')
  
  // Bonus points
  if (password.length >= 16) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1
  
  // Penalties
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeating characters')
  }
  
  // Determine strength
  let strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong'
  if (score <= 2) strength = 'Very Weak'
  else if (score <= 4) strength = 'Weak'
  else if (score <= 6) strength = 'Fair'
  else if (score <= 7) strength = 'Good'
  else strength = 'Strong'
  
  return { score, feedback, strength }
}