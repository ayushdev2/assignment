'use client'

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

interface VaultListProps {
  items: VaultItem[]
  onEdit: (item: VaultItem) => void
  onDelete: (id: string) => void
  onCopy: (text: string, itemId: string) => void
  copiedItemId: string | null
}

export default function VaultList({ items, onEdit, onDelete, onCopy, copiedItemId }: VaultListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const maskPassword = (password: string) => {
    return '•'.repeat(Math.min(password.length, 12))
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔒</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No vault items yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create your first password vault item to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {item.title}
                </h3>
                {item.url && (
                  <a
                    href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm"
                    title="Open URL"
                  >
                    🔗
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Username:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-900 dark:text-white font-mono">
                      {item.username}
                    </span>
                    <button
                      onClick={() => onCopy(item.username, `${item._id}-username`)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copy username"
                    >
                      {copiedItemId === `${item._id}-username` ? '✓' : '📋'}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">Password:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-900 dark:text-white font-mono">
                      {maskPassword(item.password)}
                    </span>
                    <button
                      onClick={() => onCopy(item.password, `${item._id}-password`)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copy password"
                    >
                      {copiedItemId === `${item._id}-password` ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              </div>

              {item.notes && (
                <div className="mt-3">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Notes:</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                    {item.notes}
                  </p>
                </div>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Created: {formatDate(item.createdAt)}
                {item.updatedAt !== item.createdAt && (
                  <span> • Updated: {formatDate(item.updatedAt)}</span>
                )}
              </div>
            </div>

            <div className="ml-4 flex items-start space-x-2">
              <button
                onClick={() => onEdit(item)}
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Edit item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}