import nodemailer from 'nodemailer'

const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || ''
      }
    })
  : null

export const sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.info('[mail:dev]', { to, subject, text })
    return { skipped: true, reason: 'SMTP is not configured' }
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  })
}
