import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

interface Params {
  params: {
    phraseId: string;
  };
}

// Update the public status of a phrase
export async function PATCH(request: Request, { params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phraseId } = params;
  if (!phraseId) {
    return NextResponse.json({ error: 'Phrase ID is required' }, { status: 400 });
  }

  let isPublic: boolean;
  try {
    const body = await request.json();
    if (typeof body.isPublic !== 'boolean') {
      return NextResponse.json({ error: 'Invalid value for isPublic. Must be boolean.' }, { status: 400 });
    }
    isPublic = body.isPublic;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    // Verify the phrase exists and belongs to the user
    const phrase = await prisma.phrase.findUnique({
      where: {
        id: phraseId,
      },
      select: { // Only select necessary fields
        userId: true,
      },
    });

    if (!phrase) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    if (phrase.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the phrase's public status
    const updatedPhrase = await prisma.phrase.update({
      where: {
        id: phraseId,
        // Optional: Add userId here as well for extra security,
        // although we already checked ownership above.
        // userId: userId
      },
      data: {
        isPublic: isPublic,
      },
    });

    return NextResponse.json(updatedPhrase);
  } catch (error) {
    console.error('Error updating phrase public status:', error);
    // Consider more specific error handling based on potential Prisma errors
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
