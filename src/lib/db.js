import { supabase } from './supabase';

// ═══════════════════════════════════════════════════════════════
// MATERIALS PROGRESS
// ═══════════════════════════════════════════════════════════════

export async function getMaterialsProgress(studentId) {
  const { data, error } = await supabase
    .from('materials_progress')
    .select('material_id, is_checked')
    .eq('student_id', studentId);

  if (error) {
    console.error('getMaterialsProgress error:', error);
    return {};
  }

  // Convert array → object map: { 'struktur-teks': true, ... }
  return data.reduce((acc, row) => {
    acc[row.material_id] = row.is_checked;
    return acc;
  }, {});
}

export async function toggleMaterialProgress(studentId, materialId, isChecked) {
  const { error } = await supabase
    .from('materials_progress')
    .upsert(
      {
        student_id: studentId,
        material_id: materialId,
        is_checked: isChecked,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,material_id' }
    );

  if (error) console.error('toggleMaterialProgress error:', error);
  return !error;
}

// ═══════════════════════════════════════════════════════════════
// QUIZ ATTEMPTS
// ═══════════════════════════════════════════════════════════════

export async function saveQuizAttempt(studentId, quizType, score, total, passed, answers) {
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      student_id: studentId,
      quiz_type: quizType,
      score,
      total,
      passed,
      answers,
    });

  if (error) console.error('saveQuizAttempt error:', error);
  return !error;
}

export async function getLatestQuizAttempt(studentId, quizType = 'fakta_opini') {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('student_id', studentId)
    .eq('quiz_type', quizType)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getLatestQuizAttempt error:', error);
    return null;
  }
  return data;
}

// ═══════════════════════════════════════════════════════════════
// DRAFTS / REPORTS
// ═══════════════════════════════════════════════════════════════

export async function getMyDrafts(studentId) {
  const { data, error } = await supabase
    .from('drafts')
    .select('*')
    .eq('student_id', studentId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getMyDrafts error:', error);
    return [];
  }
  return data;
}

export async function getAllDrafts() {
  const { data, error } = await supabase
    .from('drafts')
    .select(`
      *,
      profiles:student_id ( full_name, email )
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getAllDrafts error:', error);
    return [];
  }
  return data;
}

export async function getApprovedDrafts() {
  const { data, error } = await supabase
    .from('drafts')
    .select(`
      *,
      profiles:student_id ( full_name )
    `)
    .eq('status', 'Approved')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getApprovedDrafts error:', error);
    return [];
  }
  return data;
}

export async function getDraftById(id) {
  const { data, error } = await supabase
    .from('drafts')
    .select(`
      *,
      profiles:student_id ( full_name, email, role )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getDraftById error:', error);
    return null;
  }
  return data;
}

export async function createDraft(payload) {
  const { data, error } = await supabase
    .from('drafts')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('createDraft error:', error);
    throw error;
  }
  return data;
}

export async function updateDraft(id, payload) {
  const { data, error } = await supabase
    .from('drafts')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateDraft error:', error);
    throw error;
  }
  return data;
}

export async function updateDraftStatus(id, status) {
  const { error } = await supabase
    .from('drafts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) console.error('updateDraftStatus error:', error);
  return !error;
}

// ═══════════════════════════════════════════════════════════════
// PEER REVIEWS
// ═══════════════════════════════════════════════════════════════

export async function getReviewsForDraft(draftId) {
  const { data, error } = await supabase
    .from('peer_reviews')
    .select(`
      *,
      profiles:reviewer_id ( full_name )
    `)
    .eq('draft_id', draftId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getReviewsForDraft error:', error);
    return [];
  }
  return data;
}

export async function submitPeerReview({ draftId, reviewerId, stars, comment }) {
  const { data, error } = await supabase
    .from('peer_reviews')
    .insert({
      draft_id: draftId,
      reviewer_id: reviewerId,
      stars,
      comment,
    })
    .select()
    .single();

  if (error) {
    console.error('submitPeerReview error:', error);
    throw error;
  }
  return data;
}

// ═══════════════════════════════════════════════════════════════
// GALLERY COMMENTS
// ═══════════════════════════════════════════════════════════════

export async function getCommentsForArticle(articleId) {
  const { data, error } = await supabase
    .from('gallery_comments')
    .select(`
      *,
      profiles:user_id ( full_name, role )
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getCommentsForArticle error:', error);
    return [];
  }
  return data;
}

export async function submitGalleryComment({ articleId, userId, comment }) {
  const { data, error } = await supabase
    .from('gallery_comments')
    .insert({
      article_id: articleId,
      user_id: userId,
      comment,
    })
    .select()
    .single();

  if (error) {
    console.error('submitGalleryComment error:', error);
    throw error;
  }
  return data;
}

// ═══════════════════════════════════════════════════════════════
// STORAGE (upload foto liputan)
// ═══════════════════════════════════════════════════════════════

export async function uploadReportImage(file, userId) {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('report-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    console.error('uploadReportImage error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('report-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
// ═══════════════════════════════════════════════════════════════
// MATERIALS (E-Modul PDF)
// ═══════════════════════════════════════════════════════════════

export async function getMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('material_key');

  if (error) {
    console.error('getMaterials error:', error);
    return [];
  }
  return data;
}

export async function getMaterialByKey(materialKey) {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('material_key', materialKey)
    .maybeSingle();

  if (error) {
    console.error('getMaterialByKey error:', error);
    return null;
  }
  return data;
}

// Ganti fungsi upsertMaterial yang lama dengan ini
export async function upsertMaterial({
  materialKey,
  title,
  description,
  pdfUrl = null,
  externalUrl = null,
  resourceType = null, // 'pdf' | 'link' | null
  uploadedBy,
}) {
  const existing = await getMaterialByKey(materialKey);

  const payload = {
    title,
    description,
    pdf_url: pdfUrl,
    external_url: externalUrl,
    resource_type: resourceType,
    uploaded_by: uploadedBy,
    uploaded_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { data, error } = await supabase
      .from('materials')
      .update(payload)
      .eq('material_key', materialKey)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('materials')
    .insert({
      material_key: materialKey,
      ...payload,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Upload PDF ke Storage
export async function uploadMaterialPdf(file, materialKey) {
  const ext = file.name.split('.').pop();
  const fileName = `${materialKey}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('material-pdfs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf',
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('material-pdfs')
    .getPublicUrl(fileName);

  return data.publicUrl;
}