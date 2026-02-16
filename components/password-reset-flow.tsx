"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Step = "email" | "otp" | "password" | "success";

export default function PasswordResetFlow() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // State for real-time errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  // Countdown effect for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === "otp" && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendTimer]);

  // Validation functions
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Email address is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validateOtp = (value: string): boolean => {
    if (value.length !== 6) {
      setOtpError("OTP must be 6 characters.");
      return false;
    }
    setOtpError(null);
    return true;
  };

  const validateNewPassword = (value: string): boolean => {
    if (value.length < 8) {
      setNewPasswordError("Password must be at least 8 characters.");
      return false;
    }
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
      setNewPasswordError(
        "Password must contain uppercase, lowercase, and number."
      );
      return false;
    }
    setNewPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (
    newPass: string,
    confirmPass: string
  ): boolean => {
    if (newPass !== confirmPass) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  // Handlers for input changes with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    validateOtp(value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validateNewPassword(value);
    // Re-validate confirm password if new password changes
    if (confirmPassword) {
      // Only validate if confirmPassword has a value
      validateConfirmPassword(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(newPassword, value);
  };

  // Handlers for button clicks
  const handleSendCode = () => {
    const isValid = validateEmail(email);
    if (isValid) {
      setCurrentStep("otp");
      setResendTimer(60);
    }
  };

  const handleVerifyCode = () => {
    const isValid = validateOtp(otp);
    if (isValid) {
      setCurrentStep("password");
    }
  };

  const handleResetPassword = () => {
    const isNewPasswordValid = validateNewPassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(
      newPassword,
      confirmPassword
    );
    if (isNewPasswordValid && isConfirmPasswordValid) {
      setCurrentStep("success");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl border p-8 rounded-md flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
        {/* Left Side - Process Steps */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Account Recovery
          </h1>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
            Securely reset your password in three simple steps. We&apos;ll send
            you a one-time password to verify your email, then you can set a new
            password for your account.
          </p>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Badge
                variant={
                  currentStep === "email"
                    ? "default"
                    : ["otp", "password", "success"].includes(currentStep)
                    ? "secondary"
                    : "outline"
                }
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-0 flex-shrink-0"
              >
                {["otp", "password", "success"].includes(currentStep) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "1"
                )}
              </Badge>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                  Verify Email
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Enter your account email
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Badge
                variant={
                  currentStep === "otp"
                    ? "default"
                    : ["password", "success"].includes(currentStep)
                    ? "secondary"
                    : "outline"
                }
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-0 flex-shrink-0"
              >
                {["password", "success"].includes(currentStep) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "2"
                )}
              </Badge>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                  Enter OTP
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Badge
                variant={
                  currentStep === "password"
                    ? "default"
                    : currentStep === "success"
                    ? "secondary"
                    : "outline"
                }
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center p-0 flex-shrink-0"
              >
                {currentStep === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  "3"
                )}
              </Badge>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                  New Password
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Create a new secure password
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Form Card */}
        <div className="flex-1">
          <Card>
            <CardHeader className="flex justify-between items-center border-b">
              <div>
                <CardTitle className="text-xl sm:text-2xl">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Secure your account with a new password
                </CardDescription>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6">
              {/* Email Step */}
              {currentStep === "email" && (
                <>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 text-xs sm:text-sm">
                    Enter the email address associated with your account.
                    We&apos;ll send you a verification code.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        className={`pl-10 ${
                          emailError ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-red-500">{emailError}</p>
                    )}
                  </div>
                  <Button onClick={handleSendCode} className="w-full">
                    Send Verification Code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
              {/* OTP Step */}
              {currentStep === "otp" && (
                <>
                  <div className="text-start p-4 rounded-md border">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      We&apos;ve sent a 6-digit verification code to
                    </p>
                    <p className="font-medium text-sm sm:text-base">{email}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Please check your inbox and spam folder.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={handleOtpChange}
                      className={`text-center text-xl sm:text-2xl tracking-widest ${
                        otpError ? "border-red-500" : ""
                      }`}
                      maxLength={6}
                    />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enter the 6-digit code we sent to your email
                    </p>
                    {otpError && (
                      <p className="text-xs text-red-500">{otpError}</p>
                    )}
                  </div>
                  <Button onClick={handleVerifyCode} className="w-full">
                    Verify Code
                  </Button>
                  <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    {"Didn&apos;t receive the code? "}
                    {resendTimer > 0 ? (
                      <span>Resend in {resendTimer}s</span>
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleSendCode}
                        className="p-0 h-auto text-xs sm:text-sm"
                      >
                        Resend
                      </Button>
                    )}
                  </div>
                </>
              )}
              {/* Password Step */}
              {currentStep === "password" && (
                <>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Create a strong password with a mix of letters, numbers, and
                    symbols.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        className={`pr-10 ${
                          newPasswordError ? "border-red-500" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Must have at least 8 characters with uppercase, lowercase,
                      and number
                    </p>
                    {newPasswordError && (
                      <p className="text-xs text-red-500">{newPasswordError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={`pr-10 ${
                          confirmPasswordError ? "border-red-500" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {confirmPasswordError && (
                      <p className="text-xs text-red-500">
                        {confirmPasswordError}
                      </p>
                    )}
                  </div>
                  <Button onClick={handleResetPassword} className="w-full">
                    Reset Password
                  </Button>
                </>
              )}
              {/* Success Step */}
              {currentStep === "success" && (
                <div className="text-center space-y-5 sm:space-y-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Password Reset Successful
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Your password has been updated successfully. You can now
                      login with your new credentials.
                    </p>
                  </div>
                  <Button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full"
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}