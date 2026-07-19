import { defineEventHandler, getQuery } from 'h3'

const IP234_URL = 'https://ip234.in/search_ip'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const ip = query.ip as string
    if (!ip) {
      throw createError({
        statusCode: 400,
        message: 'query ip is required',
      })
    }
    const res = await fetch(`${IP234_URL}?ip=${encodeURIComponent(ip)}`)
    const data = await res.json()
    return data
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('[whoer/ip234] proxy error', error)
    throw createError({
      statusCode: 502,
      message: 'ip234 proxy failed',
    })
  }
})
