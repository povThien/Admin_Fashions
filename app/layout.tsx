"use client";
import type React from "react"
import "./globals.css"
import { Poppins } from "next/font/google"
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppWrapper from "./AppWrapper";

// Initialize the Poppins font - đúng theo HTML
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={poppins.className}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body style={{ backgroundColor: "#f9fafb" }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppWrapper>
              {children}
            </AppWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}
