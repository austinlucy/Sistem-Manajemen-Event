/**
 * Event Image Mapper
 * Sistem otomatis untuk menentukan dan menyinkronkan gambar event
 * berdasarkan judul, kategori, dan deskripsi event.
 *
 * Fitur utama:
 * - Keyword detection dari title, category_name, dan description
 * - Deterministic hash → gambar yang sama untuk event yang sama (card ↔ detail sinkron)
 * - Diverse image pool per kategori (semua URL unik, high-quality Unsplash)
 * - Fallback chain: database image → auto-generated → category fallback → default
 */

// ─── Keyword Definitions ──────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  workshop: [
    'workshop', 'pelatihan', 'training', 'kelas', 'kursus',
    'coding', 'programming', 'development', 'code', 'web',
    'react', 'vue', 'angular', 'node', 'javascript', 'python',
    'java', 'c++', 'php', 'sql', 'database',
    'html', 'css', 'backend', 'frontend', 'fullstack',
    'hands-on', 'practical', 'lab'
  ],
  seminar: [
    'seminar', 'conference', 'talk', 'sharing', 'diskusi',
    'industry', 'entrepreneurship', 'startup',
    'career', 'job', 'networking', 'expo', 'forum',
    'panel', 'keynote', 'speaker', 'lecture', 'webinar'
  ],
  bootcamp: [
    'bootcamp', 'intensive', 'immersive', 'program',
    'ui/ux', 'ux', 'ui', 'design', 'graphics',
    'figma', 'adobe', 'design thinking', 'prototyping',
    'wireframe', 'mockup', 'user experience', 'interaction'
  ],
  competition: [
    'kompetisi', 'competition', 'hackathon', 'challenge',
    'lomba', 'tournament', 'race', 'contest', 'coding challenge',
    'olympiad', 'battle', 'showdown', 'championship'
  ],
  music: [
    'musik', 'music', 'festival', 'konser', 'concert',
    'live band', 'dj', 'performance', 'entertainment',
    'sound', 'rhythm', 'harmony', 'jazz', 'rock', 'pop',
    'orchestra', 'choir', 'acoustic', 'karaoke'
  ],
  technology: [
    'teknologi', 'technology', 'tech', 'ai', 'machine learning',
    'blockchain', 'crypto', 'iot', 'cloud', 'devops',
    'kubernetes', 'docker', 'webassembly', 'web3',
    'cybersecurity', 'data science', 'big data', 'robotics',
    'artificial intelligence', 'deep learning', 'neural'
  ],
  business: [
    'bisnis', 'business', 'ekonomi', 'economy', 'finance',
    'marketing', 'management', 'leadership', 'investing',
    'entrepreneurship', 'branding', 'consulting', 'startup',
    'pitch', 'venture', 'innovation'
  ],
  sports: [
    'olahraga', 'sports', 'football', 'basketball', 'soccer',
    'badminton', 'tennis', 'volleyball', 'futsal',
    'marathon', 'running', 'cycling', 'game', 'esports',
    'fitness', 'gym', 'yoga', 'swimming'
  ],
  art: [
    'seni', 'art', 'pameran', 'exhibition', 'gallery',
    'lukis', 'drawing', 'fotografi', 'photography',
    'sculpture', 'craft', 'creative', 'artist',
    'painting', 'illustration', 'mural', 'theater', 'teater'
  ],
  academic: [
    'akademik', 'academic', 'sekolah', 'universitas',
    'kuliah', 'lecture', 'seminar akademik', 'paper',
    'research', 'penelitian', 'thesis', 'pembelajaran',
    'journal', 'conference paper', 'symposium', 'riset'
  ],
  social: [
    'social', 'sosial', 'gathering', 'meet up', 'meetup',
    'party', 'pesta', 'volunteer', 'charity', 'bakti',
    'komunitas', 'community', 'club', 'reunion'
  ]
};

// ─── Image Pools (all unique, high-quality Unsplash photos) ────────────────────

const IMAGE_POOLS = {
  workshop: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',  // laptop coding close-up
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',  // team with laptops
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',  // workshop classroom
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',  // macbook coding
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop',  // group collaboration
  ],
  seminar: [
    'https://images.unsplash.com/photo-1540575467063-178a50d0a903?w=800&h=500&fit=crop',  // conference hall
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',  // speaker on stage
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=500&fit=crop',  // seminar audience
    'https://images.unsplash.com/photo-1505373877841-8d5e3a85eee3?w=800&h=500&fit=crop',  // business meeting
    'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&h=500&fit=crop',     // professional panel
  ],
  bootcamp: [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',  // UX wireframes
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop',  // UI design on screen
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',  // design prototyping
    'https://images.unsplash.com/photo-1581291518633-83b4eef1d2fa?w=800&h=500&fit=crop',  // sticky notes design
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop',  // team brainstorming
  ],
  competition: [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop',  // trophy / competition
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop',  // hackathon workspace
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',  // team challenge
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop',  // coding competition
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop',  // presentation contest
  ],
  music: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=500&fit=crop',  // DJ / music festival
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop',  // concert crowd lights
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop',  // live concert stage
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=500&fit=crop',  // music festival crowd
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=500&fit=crop',  // band performing
  ],
  technology: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',  // data dashboard
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop',  // robot AI
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',  // circuit board
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',  // cybersecurity
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop',  // tech workspace
  ],
  business: [
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop',  // business team
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=500&fit=crop',  // professional suit
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop',  // laptop analytics
    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=500&fit=crop',  // meeting room
    'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=800&h=500&fit=crop',  // strategy whiteboard
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop',  // track & field
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop',  // gym workout
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop',  // cycling race
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',  // soccer stadium
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=500&fit=crop',  // swimming
  ],
  art: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop',  // painting palette
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop',  // art gallery
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&h=500&fit=crop',  // abstract art
    'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=500&fit=crop',  // art studio
    'https://images.unsplash.com/photo-1561214078-f3247647fc5e?w=800&h=500&fit=crop',  // photography exhibit
  ],
  academic: [
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',  // graduation
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop',  // lecture hall
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop',  // study group
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop',  // library
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',  // studying notes
  ],
  social: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',  // friends gathering
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop',  // community fun
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&h=500&fit=crop',  // group dinner
    'https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&h=500&fit=crop',  // outdoor social
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=500&fit=crop',  // celebration event
  ],
  default: [
    'https://images.unsplash.com/photo-1540575467063-178a50d0a903?w=800&h=500&fit=crop',  // event hall
    'https://images.unsplash.com/photo-1505373877841-8d5e3a85eee3?w=800&h=500&fit=crop',  // professional event
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=500&fit=crop',  // community
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop',  // stage talk
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=500&fit=crop',  // celebration
  ]
};

// ─── Category Detection ────────────────────────────────────────────────────────

/**
 * Deteksi kategori berdasarkan title, category_name, dan description.
 * Menggunakan weighted scoring: title match bernilai lebih tinggi.
 * @param {string} title
 * @param {string} description
 * @param {string} categoryName - Nama kategori dari database (opsional)
 * @returns {string} - Kategori yang terdeteksi
 */
export const detectEventCategory = (title = '', description = '', categoryName = '') => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const catNameLower = categoryName.toLowerCase();

  // Coba match langsung dari category_name ke key CATEGORY_KEYWORDS
  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    if (catNameLower === category || catNameLower.includes(category)) {
      return category;
    }
  }

  // Weighted keyword scoring
  const scores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (titleLower.includes(keyword)) score += 3;       // title match = tinggi
      if (catNameLower.includes(keyword)) score += 2;     // category_name match = sedang
      if (descLower.includes(keyword)) score += 1;        // description match = rendah
    }
    if (score > 0) scores[category] = score;
  }

  // Return kategori dengan score tertinggi
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : 'default';
};

// ─── Deterministic Hash ────────────────────────────────────────────────────────

/**
 * Generate hash deterministik dari string.
 * Hasil hash selalu sama untuk input yang sama → konsistensi card ↔ detail.
 * @param {string} str
 * @returns {number}
 */
const generateHash = (str) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
};

// ─── Core Image Functions ──────────────────────────────────────────────────────

/**
 * Dapatkan image URL untuk event.
 * Menggunakan hash dari title (bukan random!) → gambar selalu konsisten.
 * @param {string} title
 * @param {string} description
 * @param {string} categoryName
 * @returns {string}
 */
export const getEventImageUrl = (title = '', description = '', categoryName = '') => {
  const category = detectEventCategory(title, description, categoryName);
  const imagePool = IMAGE_POOLS[category] || IMAGE_POOLS.default;

  // Hash dari title → deterministic index
  const hash = generateHash(title);
  const index = hash % imagePool.length;

  return imagePool[index];
};

/**
 * Get fallback image berdasarkan kategori
 * @param {string} category
 * @returns {string}
 */
export const getFallbackImageUrl = (category) => {
  const fallbacks = IMAGE_POOLS[category] || IMAGE_POOLS.default;
  return fallbacks[0];
};

// ─── Label & Color Utilities ───────────────────────────────────────────────────

/**
 * Dapatkan label user-friendly untuk kategori
 * @param {string} category
 * @returns {string}
 */
export const getCategoryLabel = (category) => {
  const labels = {
    workshop: 'Workshop',
    seminar: 'Seminar',
    bootcamp: 'Bootcamp',
    competition: 'Kompetisi',
    music: 'Musik',
    technology: 'Teknologi',
    business: 'Bisnis',
    sports: 'Olahraga',
    art: 'Seni',
    academic: 'Akademik',
    social: 'Sosial',
    default: 'Event'
  };

  return labels[category] || 'Event';
};

/**
 * Dapatkan warna accent untuk kategori
 * @param {string} category
 * @returns {string}
 */
export const getCategoryColor = (category) => {
  const colors = {
    workshop: '#D87A3D',     // warm orange
    seminar: '#C9A961',      // mustard gold
    bootcamp: '#6B7D6B',     // olive green
    competition: '#B85C4F',  // terracotta red
    music: '#7B5EA7',        // purple
    technology: '#3B82A0',   // teal
    business: '#8B6F47',     // brown
    sports: '#4A9D5B',       // green
    art: '#C85A3A',          // burnt orange
    academic: '#5C6B8A',     // slate blue
    social: '#D4A06F',       // sandy gold
    default: '#9B8B6B'       // dusty beige
  };

  return colors[category] || colors.default;
};

// ─── Image Validation ──────────────────────────────────────────────────────────

/**
 * Validasi image URL (lightweight HEAD request)
 * @param {string} imageUrl
 * @returns {Promise<boolean>}
 */
export const validateImageUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('Image validation error:', error);
    return false;
  }
};

// ─── Main Helper: getEventImageData ────────────────────────────────────────────

/**
 * Get complete image data untuk event.
 * Ini adalah satu-satunya function yang perlu dipanggil dari komponen.
 *
 * @param {Object} event - Event object { title, description, category_name, id, banner, image_url }
 * @returns {Object} - { url, fallback, category, categoryLabel, categoryColor, alt }
 */
export const getEventImageData = (event) => {
  const title = event.title || '';
  const description = event.description || '';
  const categoryName = event.category_name || '';

  const category = detectEventCategory(title, description, categoryName);
  const autoImageUrl = getEventImageUrl(title, description, categoryName);
  const categoryLabel = getCategoryLabel(category);
  const categoryColor = getCategoryColor(category);
  const fallback = getFallbackImageUrl(category);

  return {
    url: autoImageUrl,
    fallback,
    category,
    categoryLabel,
    categoryColor,
    alt: `${title} - ${categoryLabel}`,
    title
  };
};

/**
 * Resolve the final image URL for an event, considering database fields.
 * Prioritas: banner → image_url → auto-generated
 *
 * @param {Object} event
 * @param {string} baseUrl - Backend base URL (tanpa /api)
 * @returns {string}
 */
export const resolveEventImageUrl = (event, baseUrl = '') => {
  // Helper: cek apakah banner value valid (bukan "[object Object]" atau string aneh)
  const isValidBannerValue = (val) => {
    if (!val || typeof val !== 'string') return false;
    if (val === '[object Object]' || val.startsWith('[object')) return false;
    if (val.trim().length === 0) return false;
    return true;
  };

  // 1. Cek banner field (path absolute mulai dengan /uploads/...)
  if (isValidBannerValue(event.banner)) {
    if (event.banner.startsWith('http')) return event.banner;
    // Kalau path sudah mulai dengan /uploads/, prepend baseUrl jika ada (production)
    // Di dev, Vite proxy akan handle /uploads/ path secara otomatis
    if (event.banner.startsWith('/uploads/')) {
      return baseUrl ? `${baseUrl}${event.banner}` : event.banner;
    }
    if (event.banner.length > 0) return `${baseUrl}/uploads/${event.banner}`;
  }

  // 2. Cek image_url field
  if (isValidBannerValue(event.image_url)) {
    if (event.image_url.startsWith('http')) return event.image_url;
    if (event.image_url.startsWith('/uploads/')) {
      return baseUrl ? `${baseUrl}${event.image_url}` : event.image_url;
    }
    if (event.image_url.length > 0) return `${baseUrl}/uploads/${event.image_url}`;
  }

  // 3. Auto-generated dari mapper
  const imageData = getEventImageData(event);
  return imageData.url;
};

export default {
  detectEventCategory,
  getEventImageUrl,
  getCategoryLabel,
  getCategoryColor,
  validateImageUrl,
  getFallbackImageUrl,
  getEventImageData,
  resolveEventImageUrl
};
