'use client'

import { ProgressProvider as AppProgressProvider } from '@bprogress/next/app'

export default function ProgressBar() {
  return (
    <AppProgressProvider
      height="3px"
      color="#b8860b"
      options={{ showSpinner: false }}
    />
  )
}
