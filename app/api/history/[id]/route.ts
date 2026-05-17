import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Explicit user_id constraint in addition to RLS — defense in depth, and
  // turns a silent "0 rows affected" into a deterministic delete.
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[api/history DELETE]', error.message);
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
