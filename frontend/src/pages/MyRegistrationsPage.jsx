import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Download, CheckCircle, X, Ticket } from 'lucide-react'
import { registrationService } from '../services'
import useAlert from '../hooks/useAlert'
import { EditorialSection, VintageCard, RetroEventCard, VintageButton } from '../components/Vintage'

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelingId, setCancelingId] = useState(null)
  const { showAlert } = useAlert()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await registrationService.getMyRegistrations()
      setRegistrations(response.data || [])
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      setError('Failed to load your registrations')
      showAlert('Failed to load registrations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (registrationId, eventTitle) => {
    if (!window.confirm(`Apakah Anda yakin ingin membatalkan pendaftaran untuk "${eventTitle}"?`)) {
      return
    }

    try {
      setCancelingId(registrationId)
      await registrationService.cancelRegistration(registrationId)
      setRegistrations(prev => prev.filter(r => r.id !== registrationId))
      showAlert(`Pendaftaran untuk "${eventTitle}" telah dibatalkan`, 'success')
    } catch (err) {
      console.error('Failed to cancel registration:', err)
      const errorMsg = err.response?.data?.message || 'Failed to cancel registration'
      showAlert(errorMsg, 'error')
    } finally {
      setCancelingId(null)
    }
  }

  const handleDownloadTicket = (registration) => {
    const ticketContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Tiket - ${registration.event_title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #050505;
      color: #ffffff;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    
    /* Action Buttons */
    .actions {
      margin-bottom: 30px;
      display: flex;
      gap: 15px;
      z-index: 10;
    }
    .btn {
      background: transparent;
      color: #ffffff;
      border: 1px solid #333333;
      padding: 10px 20px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
    }
    .btn-print {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
    }
    .btn-print:hover {
      background: #eeeeee;
    }

    /* Ticket Container */
    .ticket {
      width: 100%;
      max-width: 650px;
      background: #0d0d0d;
      border: 1px solid #222222;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
    }

    /* Decorative Ticket Cuts */
    .ticket::before, .ticket::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 24px;
      background: #050505;
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
    }
    .ticket::before {
      left: -12px;
      border-right: 1px solid #222222;
    }
    .ticket::after {
      right: -12px;
      border-left: 1px solid #222222;
    }

    /* Ticket Header */
    .header {
      padding: 25px 30px;
      border-bottom: 2px dashed #222222;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.25em;
      text-transform: uppercase;
    }
    .status-badge {
      border: 1px solid #ffffff;
      padding: 5px 12px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      background: #ffffff;
      color: #000000;
    }
    .status-pending {
      border-color: #555555;
      background: transparent;
      color: #888888;
    }

    /* Ticket Body */
    .body {
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    
    .event-title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.15;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.02em;
    }
    
    .info-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 20px;
      margin-top: 10px;
    }
    
    .info-label {
      font-size: 9px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .info-val {
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
      line-height: 1.4;
    }

    /* Ticket Footer & Barcode */
    .footer {
      padding: 25px 30px;
      border-top: 1px dashed #222222;
      background: #0a0a0a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    .meta-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .meta-item {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: #555555;
    }
    .meta-val {
      color: #aaaaaa;
    }

    /* CSS Barcode Generator */
    .barcode {
      display: flex;
      align-items: center;
      height: 50px;
      background: #ffffff;
      padding: 8px 15px;
      border-radius: 2px;
    }
    .barcode-line {
      height: 100%;
      background: #000000;
      margin-right: 2px;
    }
    .barcode-line:nth-child(3n) { width: 3px; }
    .barcode-line:nth-child(3n+1) { width: 1px; }
    .barcode-line:nth-child(3n+2) { width: 2px; }
    .barcode-line:last-child { margin-right: 0; }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0;
      }
      .actions {
        display: none !important;
      }
      .ticket {
        border: 2px solid #000000 !important;
        background: #ffffff !important;
        box-shadow: none !important;
        color: #000000 !important;
      }
      .ticket::before, .ticket::after {
        background: #ffffff !important;
        border-color: #000000 !important;
      }
      .header, .footer {
        border-color: #000000 !important;
        background: #ffffff !important;
      }
      .info-val, .event-title {
        color: #000000 !important;
      }
      .status-badge {
        border-color: #000000 !important;
        background: #000000 !important;
        color: #ffffff !important;
      }
      .meta-item {
        color: #666666 !important;
      }
      .meta-val {
        color: #000000 !important;
      }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn btn-print" onclick="window.print()">Cetak Tiket</button>
    <button class="btn" onclick="window.close()">Tutup</button>
  </div>

  <div class="ticket">
    <div class="header">
      <div class="logo">EVENT HUB // ADMIT ONE</div>
      <div class="status-badge ${registration.status === 'approved' ? '' : 'status-pending'}">
        ${registration.status?.toUpperCase() || 'PENDING'}
      </div>
    </div>
    
    <div class="body">
      <div>
        <div class="info-label">Nama Event</div>
        <h2 class="event-title">${registration.event_title}</h2>
      </div>
      
      <div class="info-grid">
        <div>
          <div class="info-label">Tanggal & Waktu</div>
          <div class="info-val">
            ${new Date(registration.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <br>
            Pukul ${new Date(registration.event_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
          </div>
        </div>
        <div>
          <div class="info-label">Lokasi</div>
          <div class="info-val">${registration.event_location || 'Akan Diberitahukan (TBA)'}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="meta-details">
        <div class="meta-item">NO. REG: <span class="meta-val">#${String(registration.id).padStart(6, '0')}</span></div>
        <div class="meta-item">NAMA: <span class="meta-val">${registration.user_name || 'Guest'}</span></div>
        <div class="meta-item">DIKELUARKAN: <span class="meta-val">${new Date(registration.registered_at || registration.created_at).toLocaleDateString('id-ID')}</span></div>
      </div>
      
      <div class="barcode">
        <div class="barcode-line" style="width: 2px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 3px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 2px;"></div>
        <div class="barcode-line" style="width: 4px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 3px;"></div>
        <div class="barcode-line" style="width: 2px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 4px;"></div>
        <div class="barcode-line" style="width: 2px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 3px;"></div>
        <div class="barcode-line" style="width: 1px;"></div>
        <div class="barcode-line" style="width: 2px;"></div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([ticketContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tiket-${registration.event_title?.replace(/\s+/g, '-').toLowerCase() || 'event'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showAlert('Tiket berhasil diunduh!', 'success')
  }

  const now = new Date()
  const upcoming = registrations.filter(r => new Date(r.event_date) > now)
  const past = registrations.filter(r => new Date(r.event_date) <= now)

  const displayRegistrations = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className="min-h-screen py-8 md:py-12">
      <EditorialSection
        title="Jadwal Saya"
        subtitle="Kelola pendaftaran event dan unduh tiket"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'upcoming', label: 'Akan Datang', count: upcoming.length },
            { key: 'past', label: 'Selesai', count: past.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300
                ${activeTab === tab.key
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#666666] border border-[#222222] hover:border-white/30 hover:text-white'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 border-l-2 border-white bg-[#0a0a0a]"
          >
            <p className="text-white text-sm">{error}</p>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <VintageCard key={i} className="h-32">
                <div className="h-full skeleton-mono" />
              </VintageCard>
            ))}
          </div>
        ) : displayRegistrations.length > 0 ? (
          <div className="space-y-5">
            {displayRegistrations.map((reg, idx) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <VintageCard>
                  <div className="card-pad-sm md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-16 h-16 border border-white/10 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-[#666666] uppercase tracking-wider">
                          {new Date(reg.event_date).toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-white">
                          {new Date(reg.event_date).getDate()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white uppercase tracking-tight truncate">
                          {reg.event_title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#666666]">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(reg.event_date).toLocaleDateString('id-ID')}
                          </span>
                          {reg.event_location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {reg.event_location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`
                          px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]
                          ${reg.status === 'approved'
                            ? 'bg-white text-black'
                            : reg.status === 'pending'
                              ? 'bg-[#1a1a1a] text-[#888888] border border-[#333333]'
                              : 'bg-[#1a1a1a] text-[#666666] border border-[#333333]'
                          }
                        `}>
                          {reg.status || 'PENDING'}
                        </span>

                        {activeTab === 'upcoming' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownloadTicket(reg)}
                              className="p-2.5 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
                              title="Download Ticket"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCancelRegistration(reg.id, reg.event_title)}
                              disabled={cancelingId === reg.id}
                              className="p-2.5 border border-[#333333] text-[#666666] hover:text-white hover:border-white transition-colors disabled:opacity-40"
                              title="Cancel Registration"
                            >
                              {cancelingId === reg.id ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </VintageCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <VintageCard>
              <div className="card-pad text-center">
                <Ticket className="w-12 h-12 text-[#333333] mx-auto mb-4" />
                <p className="text-lg font-bold text-white uppercase tracking-tight mb-2">
                  {activeTab === 'upcoming' ? 'Belum Ada Pendaftaran' : 'Tidak Ada Riwayat'}
                </p>
                <p className="text-sm text-[#666666] mb-6">
                  {activeTab === 'upcoming'
                    ? 'Anda belum mendaftar ke event apapun'
                    : 'Anda belum memiliki event yang selesai'}
                </p>
              </div>
            </VintageCard>
          </motion.div>
        )}
      </EditorialSection>
    </div>
  )
}
