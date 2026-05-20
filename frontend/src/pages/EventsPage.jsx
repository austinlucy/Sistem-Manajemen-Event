import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ArrowRight, X } from 'lucide-react'
import { eventService, categoryService } from '../services'
import { RetroEventCard, VintageCard, VintageButton } from '../components/Vintage'
import HeroGridBackground from '../components/HeroGridBackground'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [eventsRes, categoriesRes] = await Promise.all([
        eventService.getAllEvents(),
        categoryService.getAllCategories()
      ])

      const eventsData = eventsRes.data?.data ?? eventsRes.data
      setEvents(Array.isArray(eventsData) ? eventsData : [])
      const cats = categoriesRes.data?.data ?? categoriesRes.data
      setCategories(Array.isArray(cats) ? cats : [])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const title = (event.title || '').toLowerCase()
    const desc = (event.description || '').toLowerCase()
    const term = searchTerm.toLowerCase()
    const matchesSearch = title.includes(term) || desc.includes(term)
    const matchesCategory = !selectedCategory || event.category_id == selectedCategory
    return matchesSearch && matchesCategory
  })

  const SkeletonCard = () => (
    <VintageCard className="h-96 !p-0" animate={false}>
      <div className="h-full skeleton" />
    </VintageCard>
  )

  return (
    <div className="relative">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden pt-24">
        <HeroGridBackground />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[1]" />

        <div className="container-editorial relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#737373] border border-[#333333] px-5 py-2.5 mb-6">
              Directory
            </span>
            <h1 className="hero-title mb-6">
              SEMUA
              <br />
              <span className="text-[#525252]">EVENT.</span>
            </h1>
            <p className="hero-subtitle">
              Temukan event kampus menarik dan bergabung dengan komunitas
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SEARCH & FILTER ===== */}
      <section className="section-sm relative z-10">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <VintageCard className="!p-0" hover={false}>
              <div className="card-pad grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
                  <input
                    type="text"
                    placeholder="Cari event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-mono pl-11"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252] pointer-events-none" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-mono pl-11 appearance-none cursor-pointer"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </VintageCard>
          </motion.div>
        </div>
      </section>

      {/* ===== RESULTS ===== */}
      <section className="section-sm pb-20">
        <div className="container-editorial">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <VintageCard>
                <p className="text-white border-l-2 border-white pl-4 text-sm">
                  {error}
                </p>
              </VintageCard>
            </motion.div>
          )}

          {/* Results count */}
          {!loading && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#525252] font-bold">
                {filteredEvents.length} Event ditemukan
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('')
                  }}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#737373] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                  Reset Filter
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
              >
                {filteredEvents.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="cursor-pointer"
                  >
                    <RetroEventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <VintageCard className="max-w-md mx-auto">
                  <div className="card-pad text-center">
                    <p className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight mb-3">
                      Tidak Ada Event
                    </p>
                    <p className="text-[#737373] text-sm mb-8">
                      Coba ubah kata kunci atau filter kategori
                    </p>
                    <VintageButton
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('')
                      }}
                    >
                      Reset Filter
                    </VintageButton>
                  </div>
                </VintageCard>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
