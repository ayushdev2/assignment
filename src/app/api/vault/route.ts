import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { connectDB } from '../../../lib/mongodb'
import { VaultItem } from '../../../models/VaultItem'
import { encryptData, decryptData } from '../../../lib/crypto'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query: any = { userId: session.user.id }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const vaultItems = await VaultItem.find(query)
      .sort({ createdAt: -1 })
      .lean()

    // Decrypt passwords for client
    const decryptedItems = vaultItems.map(item => ({
      ...item,
      _id: item._id.toString(),
      userId: item.userId.toString(),
      password: decryptData(item.encryptedPassword),
    }))

    return NextResponse.json(decryptedItems)
  } catch (error) {
    console.error('Get vault items error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const vaultItem = await VaultItem.create({
      userId: session.user.id,
      title: title.trim(),
      username: username.trim(),
      encryptedPassword,
      url: url?.trim() || '',
      notes: notes?.trim() || '',
      tags: tags || [],
    })

    const response = {
      ...vaultItem.toObject(),
      _id: vaultItem._id.toString(),
      userId: vaultItem.userId.toString(),
      password: password, // Return decrypted password to client
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Create vault item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}