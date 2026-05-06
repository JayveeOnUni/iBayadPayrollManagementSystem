import nodemailer from 'nodemailer'

interface ActivationEmailInput {
  to: string
  name: string
  activationLink: string
  expiresHours: number
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass || pass === 'your_smtp_password_here') {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM.')
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user,
    pass,
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] ?? char))
}

export async function sendActivationEmail(input: ActivationEmailInput): Promise<void> {
  const config = getSmtpConfig()

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })

  const escapedName = escapeHtml(input.name)
  const escapedLink = escapeHtml(input.activationLink)

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: input.to,
    subject: 'Activate your iBayad Payroll account',
    text: [
      `Hello ${input.name},`,
      '',
      'An iBayad Payroll employee account was created for you.',
      `Activate your account and set your password within ${input.expiresHours} hours:`,
      input.activationLink,
      '',
      'If you were not expecting this email, contact your payroll administrator.',
    ].join('\n'),
    html: `
      <p>Hello ${escapedName},</p>
      <p>An iBayad Payroll employee account was created for you.</p>
      <p>
        <a href="${escapedLink}">Activate your account and set your password</a>
        within ${input.expiresHours} hours.
      </p>
      <p>If you were not expecting this email, contact your payroll administrator.</p>
    `,
  })
}
