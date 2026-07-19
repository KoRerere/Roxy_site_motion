import { defineEventHandler } from 'h3'

const IP234_JSON_URL = 'https://ip234.in/ip.json'

export default defineEventHandler(async (event) => {
  try {
    const res = await fetch(IP234_JSON_URL)
    const data = await res.json()
    return data
  }
  catch (error: any) {
    console.error('[whoer/ip234-json] proxy error', error)
    throw createError({
      statusCode: 502,
      message: 'ip234-json proxy failed',
    })
  }
})
