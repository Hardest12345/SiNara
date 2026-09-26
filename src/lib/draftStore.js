import { supabase } from './supabase';

// Ambil draft "aktif" terbaru milik user (yang masih Draft)
export async function getActiveDraft(userId) {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('student_id', userId)
    .eq('status', 'Draft')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getActiveDraft error:', error);
    return null;
  }
  return data;
}

// Simpan / update draft aktif (dipakai ZoneRedaksi & ZoneStudio)
export async function saveActiveDraft(userId, payload) {
  const active = await getActiveDraft(userId);

  if (active) {
    const { data, error } = await supabase
      .from('drafts')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', active.id)
      .select()
      .single();

    if (error) {
      console.error('update draft error:', error);
      throw error;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('drafts')
    .insert({
      student_id: userId,
      title: payload.title || 'Tanpa Judul',
      category: payload.category || 'Lainnya',
      group_name: payload.group_name || null,
      interviews_data: payload.interviews_data || {},
      outline_data: payload.outline_data || {},
      content: payload.content || '',
      image_url: payload.image_url || null,
      status: 'Draft',
    })
    .select()
    .single();

  if (error) {
    console.error('insert draft error:', error);
    throw error;
  }
  return data;
}