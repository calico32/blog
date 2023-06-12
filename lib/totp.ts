'use server'

import assert from 'node:assert'
import crypto from 'node:crypto'

/** DO NOT call from client */
export async function generateTOTP(): Promise<string> {
  if (!process.env.TOTP_SECRET || !process.env.TOTP_URI) {
    throw new Error('TOTP_SECRET and TOTP_URI must be set')
  }
  const params = new URL(process.env.TOTP_URI).searchParams
  const period = parseInt(params.get('period') ?? '30', 10)
  const alg = params.get('algorithm')?.toLowerCase() ?? 'sha1'
  const digits = parseInt(params.get('digits') ?? '6', 10)

  const timeHex = Math.floor(Math.round(Date.now() / 1000) / period)
    .toString(16)
    .padStart(16, '0')
  const timeBytes = Buffer.from(timeHex, 'hex')
  const keyBytes = Buffer.from(process.env.TOTP_SECRET, 'utf-8')

  assert(keyBytes.length && timeBytes.length, 'Key and time must not be empty')

  const hash = new Uint8Array(crypto.createHmac(alg, keyBytes).update(timeBytes).digest().buffer)
  assert(hash.length, 'Hash length must be greater than 0')

  const offset = hash[hash.length - 1] & 0xf
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)

  const otp = (binary % Math.pow(10, digits)).toString().padStart(digits, '0')
  return otp
}

generateTOTP().then(console.log)
