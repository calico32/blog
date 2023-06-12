import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'

function calculateOtpTimer() {
  return Math.round(Date.now() / 1000) % 30
}
export default function OTPTimer(): JSX.Element {
  const [otpTimer, setOtpTimer] = useState(calculateOtpTimer())

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const scheduleNextUpdate = () => {
      setOtpTimer(calculateOtpTimer())
      const msToNextSecond = 1000 - (Date.now() % 1000)
      timeout = setTimeout(scheduleNextUpdate, msToNextSecond)
    }
    scheduleNextUpdate()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <span className="flex items-center gap-1 text-base font-normal text-gray-500">
      <Timer size={16} />
      {30 - otpTimer}
    </span>
  )
}
