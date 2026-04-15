"use client"

import { SignIn, SignUp } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left panel — auth container */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <Card className="flex h-full w-full max-w-md flex-col justify-center rounded-2xl border border-border-primary bg-bg-primary shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-full text-left">
              <h1 className="text-2xl font-semibold text-text-primary">Welcome to Archive</h1>
              <p className="mt-1 text-sm text-text-secondary">Sign in or create an account to continue.</p>
            </div>

            <Tabs defaultValue="sign-up" className="w-full">
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="sign-in" className="flex-1">
                  Login
                </TabsTrigger>
                <TabsTrigger value="sign-up" className="flex-1">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sign-in" className="flex justify-center">
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-none p-0 bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border-primary",
                      formButtonPrimary: "bg-primary-700 hover:bg-primary-800 text-text-inverse",
                      footerAction: "hidden",
                    },
                  }}
                />
              </TabsContent>

              <TabsContent value="sign-up" className="flex justify-center">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none border-none p-0 bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-border-primary",
                      formButtonPrimary: "bg-primary-700 hover:bg-primary-800 text-text-inverse",
                      footerAction: "hidden",
                    },
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right panel — blank */}
      <div className="hidden lg:block lg:w-1/2 bg-bg-tertiary" />
    </div>
  )
}
