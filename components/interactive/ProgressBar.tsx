'use client'

import { AppProgressProvider } from '@bprogress/next'

export default function ProgressBar() {
  return (
    <AppProgressProvider
      height="3px"
      color="#b8860b"
      options={{ showSpinner: false }}
      shallowRouting={false}
    />
  )
}
