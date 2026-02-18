'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { X } from "lucide-react"
import { useAuthModal } from "@/context/auth-modal-context"
import { signIn } from "next-auth/react"
export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState<0 | 1 | 2>(0) // 0: Login, 1: Register, 2: OTP
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const { closeModal } = useAuthModal()

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login phone:", phone)
    // Call API to send OTP
    setStep(1) // go to OTP step
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register data:", { phone, name, email })
    // Call API to register user
    setStep(2) // go to OTP step
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Entered OTP:", otp)
    // Verify OTP API call
    alert("Logged in successfully!")
    closeModal()
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 0 && "Login to your account"}
            {step === 1 && "Create an account"}
            {step === 2 && "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === 0 && "Enter your phone number to login"}
            {step === 1 && "Fill your details to register"}
            {step === 2 && `Enter the OTP sent to ${phone || "your number"}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 0 && (
            <form onSubmit={handleLoginSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit">Login with OTP</Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => signIn('google')}
                  >
                    Login with Google
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleRegisterSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Roshan Thapa Magar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit">Register</Button>
                  <Button type="button" variant="outline" onClick={() => setStep(0)}>
                    Back to Login
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <FieldGroup>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Field>
                  <Button type="submit">Verify OTP</Button>
                  <FieldDescription className="text-center">
                    60 s until resend
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
