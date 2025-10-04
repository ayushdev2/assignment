import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { connectDB } from '../../../../lib/mongodb'
import { VaultItem } from '../../../../models/VaultItem'
import { encryptData, decryptData } from '../../../../lib/crypto'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  
) {
  const params = await context.params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { title, username, password, url, notes, tags } = await request.json()

    if (!title || !username || !password) {
      return NextResponse.json(
        { message: 'Title, username, and password are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Encrypt the password before storing
    const encryptedPassword = encryptData(password)

    const vaultItem = await VaultItem.findOneAndUpdate(
      { 
        _id: params.id, 
        userId: session.user.id 
      },
      {
        title: title.trim(),
        username: username.trim(),
        encryptedPassword,
        url: url?.trim() || '',
        notes: notes?.trim() || '',
        tags: tags || [],
      },
      { new: true }
    )

    if (!vaultItem) {
      return NextResponse.json(
        { message: 'Vault item not found' },
        { status: 404 }
      )
    }

    const response = {
      ...vaultItem.toObject(),
      _id: vaultItem._id.toString(),
      userId: vaultItem.userId.toString(),
      password: password, // Return decrypted password to client
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Update vault item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const vaultItem = await VaultItem.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    })

    if (!vaultItem) {
      return NextResponse.json(
        { message: 'Vault item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Vault item deleted successfully' })
  } catch (error) {
    console.error('Delete vault item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}