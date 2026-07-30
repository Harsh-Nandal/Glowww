'use client'

import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import { isFirebaseConfigured } from '@/lib/firebaseConfig'
import { getFirebaseAuth } from '@/lib/firebase'
import { setPhoneVerified } from '@/store/slices/authSlice'

const CARD_STYLE = {
  background: 'var(--white)',
  border: '1px solid var(--grey-mid)',
  padding: '2rem',
}

const INPUT = {
  height: '48px',
  padding: '0 1rem',
  background: 'var(--ivory)',
  border: '1.5px solid var(--grey-mid)',
  color: 'var(--charcoal)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
}

const ERROR_MESSAGES = {
  'auth/invalid-phone-number': 'That phone number looks invalid.',
  'auth/too-many-requests': 'Too many attempts. Please try again in a bit.',
  'auth/invalid-verification-code': 'Incorrect code. Please check and try again.',
}

export default function PhoneVerifyStep({ onVerified }) {
  const dispatch = useDispatch()
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const recaptchaRef = useRef(null)

  // Dev/local bypass: if Firebase isn't configured yet, don't block checkout.
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn('[firebase] NEXT_PUBLIC_FIREBASE_API_KEY not set — phone OTP gate disabled')
      onVerified('')
    }
  }, [onVerified])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  if (!isFirebaseConfigured) return null

  const getRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container', { size: 'invisible' })
    }
    return recaptchaRef.current
  }

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return }

    setSending(true)
    try {
      const result = await signInWithPhoneNumber(getFirebaseAuth(), `+91${digits}`, getRecaptcha())
      setConfirmation(result)
      setStep('otp')
      setCooldown(30)
      toast.success('OTP sent')
    } catch (err) {
      toast.error(ERROR_MESSAGES[err.code] || 'Could not send OTP. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const verifyOtp = async () => {
    if (code.length !== 6) { toast.error('Enter the 6-digit code'); return }

    setVerifying(true)
    try {
      const result = await confirmation.confirm(code)
      const idToken = await result.user.getIdToken()
      const { data } = await axios.post('/api/auth/verify-phone', { idToken })
      dispatch(setPhoneVerified({ phone: data.phone }))
      toast.success('Mobile number verified')
      onVerified(data.phone)
    } catch (err) {
      toast.error(ERROR_MESSAGES[err.code] || err.response?.data?.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div style={CARD_STYLE}>
      <div className="checkout-step-label">
        <span className="checkout-step-num">0</span>
        Verify Mobile Number
      </div>

      {step === 'phone' ? (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Mobile Number *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={INPUT}
              placeholder="98765 43210"
              maxLength={10}
            />
          </div>
          <button
            onClick={sendOtp}
            disabled={sending}
            style={{ height: '48px', padding: '0 1.5rem', background: 'var(--charcoal)', color: 'var(--white)', border: 'none', cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            {sending ? 'Sending…' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '160px' }}>
            <label className="form-label">Enter OTP sent to +91 {phone} *</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              style={INPUT}
              placeholder="6-digit code"
              maxLength={6}
            />
          </div>
          <button
            onClick={verifyOtp}
            disabled={verifying}
            style={{ height: '48px', padding: '0 1.5rem', background: 'var(--charcoal)', color: 'var(--white)', border: 'none', cursor: verifying ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            {verifying ? 'Verifying…' : 'Verify'}
          </button>
          <button
            onClick={sendOtp}
            disabled={cooldown > 0 || sending}
            style={{ height: '48px', padding: '0 1rem', background: 'transparent', color: cooldown > 0 ? 'var(--grey-text)' : 'var(--gold)', border: 'none', cursor: cooldown > 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
          </button>
        </div>
      )}

      <div id="recaptcha-container" />
    </div>
  )
}
