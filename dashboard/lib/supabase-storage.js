const { createClient } = require('@supabase/supabase-js');

let client;

function getSupabase() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return client;
}

function parseDataUrl(dataUrl) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return null;
  return { contentType: match[1], buffer: Buffer.from(match[2], 'base64') };
}

async function uploadDataUrl(dataUrl, itemId) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return dataUrl;

  const extension = parsed.contentType.split('/')[1]?.replace(/[^a-z0-9]/gi, '') || 'bin';
  const safeId = String(itemId || 'issue').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `testing/${safeId}-${Date.now()}.${extension}`;
  const bucket = 'testing-screenshots';
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, parsed.buffer, {
      contentType: parsed.contentType,
      upsert: false,
      cacheControl: '31536000'
    });

  if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

async function prepareForStorage(data) {
  const testing = [];
  for (const item of data.testing || []) {
    if (typeof item.image === 'string' && item.image.startsWith('data:')) {
      const image = await uploadDataUrl(item.image, item.id || 'issue');
      testing.push({ ...item, image });
    } else {
      testing.push(item);
    }
  }
  return { ...data, testing };
}

module.exports = { uploadDataUrl, prepareForStorage };
