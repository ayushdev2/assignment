'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useTheme } from '../contexts/ThemeContext'
import PasswordGenerator from './PasswordGenerator'
import VaultList from './VaultList'
import VaultItemForm from './VaultItemForm'

interface User {
  id: string
  name?: string | null
  email?: string | null
}

interface VaultItem {
  _id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function Dashboard({ user }: { user: User }) {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    fetchVaultItems()
  }, [])

  const fetchVaultItems = async (search?: string) => {
    try {
      const url = search ? `/api/vault?search=${encodeURIComponent(search)}` : '/api/vault'
      const response = await fetch(url)
      
      if (response.ok) {
        const items = await response.json()
        setVaultItems(items)
      } else {
        console.error('Failed to fetch vault items')
      }
    } catch (error) {
      console.error('Error fetching vault items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchVaultItems(query)
  }

  const handleAddItem = async (itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        const newItem = await response.json()
        setVaultItems(prev => [newItem, ...prev])
        setShowAddForm(false)
      } else {
        console.error('Failed to add vault item')
      }
    } catch (error) {
      console.error('Error adding vault item:', error)
    }
  }

  const handleEditItem = async (itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/vault/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setVaultItems(prev => 
          prev.map(item => item._id === editingItem._id ? updatedItem : item)
        )
        setEditingItem(null)
      } else {
        console.error('Failed to update vault item')
      }
    } catch (error) {
      console.error('Error updating vault item:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVaultItems(prev => prev.filter(item => item._id !== id))
      } else {
        console.error('Failed to delete vault item')
      }
    } catch (error) {
      console.error('Error deleting vault item:', error)
    }
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItemId(itemId)
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        setCopiedItemId(null)
      }, 15000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                SecureVault
              </h1>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Welcome, {user.name || user.email}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Generator */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Password Generator
              </h2>
              <PasswordGenerator onGenerate={(password) => {
                // Auto-fill password in add form if it's open
                if (showAddForm) {
                  const event = new CustomEvent('autofillPassword', { detail: password })
                  window.dispatchEvent(event)
                }
              }} />
            </div>
          </div>

          {/* Vault */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Password Vault
                  </h2>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Item
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search vault items..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Vault Items */}
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Loading...</p>
                  </div>
                ) : (
                  <VaultList
                    items={vaultItems}
                    onEdit={setEditingItem}
                    onDelete={handleDeleteItem}
                    onCopy={copyToClipboard}
                    copiedItemId={copiedItemId}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingItem) && (
        <VaultItemForm
          item={editingItem}
          onSave={editingItem ? handleEditItem : handleAddItem}
          onCancel={() => {
            setShowAddForm(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}