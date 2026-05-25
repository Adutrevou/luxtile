import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'
const TO_EMAIL = 'sales@luxtile.co.za'
const FROM_EMAIL = 'Luxtile Website <enquiries@send.luxtile.co.za>'

function escapeHtml(s: string) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function normalizePayload(body: Record<string, unknown>) {
  const nestedFields = body && typeof body.fields === 'object' && body.fields !== null
    ? body.fields as Record<string, unknown>
    : {}

  return {
    ...nestedFields,
    ...body,
    formName: body.formName ?? nestedFields.formName,
    pageUrl: body.pageUrl ?? nestedFields.pageUrl,
  } as Record<string, unknown>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.error('Missing email credentials')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json().catch(() => ({}))
    const payload = normalizePayload(body ?? {})
    const { name, email, phone, message, deliveryLocation, pageUrl, formName, website } = payload

    // Honeypot
    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const errors: string[] = []
    if (!name || typeof name !== 'string' || name.trim().length === 0) errors.push('name required')
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('valid email required')

    const normalizedMessage = typeof message === 'string' && message.trim().length > 0
      ? message
      : typeof payload.products === 'string' && payload.products.trim().length > 0
        ? `Products:\n${payload.products}`
        : 'Website enquiry'

    if (errors.length) {
      return new Response(JSON.stringify({ success: false, error: errors.join(', ') }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const submittedAt = new Date().toISOString()
    const subject = 'New website enquiry from Luxtile'

    const rows: Array<[string, string]> = [
      ['Name', String(name)],
      ['Email', String(email)],
      ['Phone', String(phone || '(not provided)')],
      ['Message', String(normalizedMessage)],
    ]
    if (deliveryLocation) rows.push(['Delivery Location', String(deliveryLocation)])

    for (const [key, value] of Object.entries(payload)) {
      if (['name', 'email', 'phone', 'message', 'deliveryLocation', 'pageUrl', 'formName', 'website', 'fields'].includes(key)) continue
      if (value === undefined || value === null || value === '') continue
      rows.push([key, typeof value === 'string' ? value : JSON.stringify(value)])
    }

    if (formName) rows.push(['Form', String(formName)])
    rows.push(['Page URL', String(pageUrl || '(unknown)')])
    rows.push(['Submitted', submittedAt])

    const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
    const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0F0F0F">
      <h2 style="margin:0 0 16px">New website enquiry</h2>
      <table style="border-collapse:collapse">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;color:#666;vertical-align:top"><strong>${escapeHtml(k)}</strong></td>
            <td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td>
          </tr>`).join('')}
      </table>
    </div>`

    const resp = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        html,
        text,
      }),
    })

    const data = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      console.error('Resend send failed', resp.status, data)
      return new Response(JSON.stringify({ error: 'Failed to send enquiry' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-enquiry error', err)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
