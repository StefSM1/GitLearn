import { NextResponse } from 'next/server'
import cron from 'node-cron'

let isCronRunning = false

export async function GET() {
  if (!isCronRunning) {
    cron.schedule('0 0 * * *', () => {
      console.log('Running daily scraping job...')
      // Scraping logic will go here
    })
    isCronRunning = true
    return NextResponse.json({ status: 'cron scheduled' })
  }

  return NextResponse.json({ status: 'cron already running' })
}
