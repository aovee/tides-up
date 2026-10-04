import { Resend } from 'resend'

interface Mail {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendMail(mail: Mail) {
  const config = useRuntimeConfig()

  if (!config.resendApiKey) {
    console.info(
      `\n[mail] (pas de NUXT_RESEND_API_KEY, affichage seulement)\nÀ : ${mail.to}\nObjet : ${mail.subject}\n\n${mail.text}\n`
    )
    return
  }

  const resend = new Resend(config.resendApiKey)
  const { error } = await resend.emails.send({ from: config.mailFrom, ...mail })
  if (error)
    throw createError({
      statusCode: 502,
      statusMessage: `Envoi du mail impossible : ${error.message}`
    })
}

export function siteUrl(event?: Parameters<typeof getRequestURL>[0]) {
  const configured = useRuntimeConfig().public.siteUrl
  if (configured) return configured.replace(/\/$/, '')
  return event ? getRequestURL(event).origin : 'http://localhost:3000'
}

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!
  )
}
