import { NextResponse } from 'next/server';
import { deleteGeneration } from '@/lib/db/generations';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteGeneration(params.id);
  if (!ok) return NextResponse.json({ success: false }, { status: 500 });
  return NextResponse.json({ success: true });
}
