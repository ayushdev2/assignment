'use client'

import { useState, useEffect } from 'react'
import { generateSecurePassword, getPasswordStrength } from '../lib/crypto'

interface PasswordGeneratorProps {
  onGenerate?: (password: string) => void
}

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(true)
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    try {
      const newPassword = generateSecurePassword(
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar
      )
      setPassword(newPassword)
      onGenerate?.(newPassword)
    } catch (error) {
      console.error('Error generating password:', error)
    }
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  const strength = password ? getPasswordStrength(password) : null

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Very Weak':
        return 'text-red-600 dark:text-red-400'
      case 'Weak':
        return 'text-orange-600 dark:text-orange-400'
      case 'Fair':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'Good':
        return 'text-blue-600 dark:text-blue-400'
      case 'Strong':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStrengthBarWidth = (strength: string) => {
    switch (strength) {
      case 'Very Weak':
        return 'w-1/5'
      case 'Weak':
        return 'w-2/5'
      case 'Fair':
        return 'w-3/5'
      case 'Good':
        return 'w-4/5'
      case 'Strong':
        return 'w-full'
      default:
        return 'w-0'
    }
  }

  return (
    <div className="space-y-4">
      {/* Generated Password */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
        
        {/* Strength Indicator */}
        {strength && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Strength:</span>
              <span className={`font-medium ${getStrengthColor(strength.strength)}`}>
                {strength.strength}
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.strength === 'Very Weak' ? 'bg-red-500' :
                  strength.strength === 'Weak' ? 'bg-orange-500' :
                  strength.strength === 'Fair' ? 'bg-yellow-500' :
                  strength.strength === 'Good' ? 'bg-blue-500' :
                  'bg-green-500'
                } ${getStrengthBarWidth(strength.strength)}`}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Length Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="uppercase"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="uppercase" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Uppercase (A-Z)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowercase"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="lowercase" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Lowercase (a-z)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="numbers"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="numbers" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Numbers (0-9)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="symbols"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="symbols" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Symbols (!@#$%^&*)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="excludeSimilar"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="excludeSimilar" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Exclude Similar Characters (il1Lo0O)
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
      >
        Generate New Password
      </button>
    </div>
  )
}