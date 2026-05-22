import QRCode from 'qrcode'
import { writeFileSync } from 'fs'
import { join } from 'path'

function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

function buildPixPayload(key: string, merchantName: string, merchantCity: string): string {
  const gui = tlv('00', 'br.gov.bcb.pix')
  const pixKey = tlv('01', key)
  const merchantAccountInfo = tlv('26', gui + pixKey)

  const payload =
    tlv('00', '01') +
    merchantAccountInfo +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('58', 'BR') +
    tlv('59', merchantName.slice(0, 25)) +
    tlv('60', merchantCity.slice(0, 15)) +
    tlv('62', tlv('05', '***')) +
    '6304'

  return payload + crc16(payload)
}

const pixKey = '+5598989301580'
const payload = buildPixPayload(pixKey, 'Santuario SJR', 'Sao Jose Ribamar')

const outPath = join(process.cwd(), 'public', 'img', 'pix-qr.png')

QRCode.toFile(
  outPath,
  payload,
  {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
    color: { dark: '#4a0f0f', light: '#faf6ef' },
  },
  (err) => {
    if (err) {
      console.error('Erro ao gerar QR code:', err)
      process.exit(1)
    }
    console.log(`QR code PIX gerado em: ${outPath}`)
    console.log(`Chave PIX: ${pixKey}`)
  },
)
