import mongoose, { Document, Schema } from 'mongoose'

export interface IVaultItem extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  username: string
  encryptedPassword: string
  url?: string
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const vaultItemSchema = new Schema<IVaultItem>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
})

// Index for efficient queries
vaultItemSchema.index({ userId: 1, createdAt: -1 })
vaultItemSchema.index({ userId: 1, title: 'text', username: 'text' })

export const VaultItem = mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', vaultItemSchema)