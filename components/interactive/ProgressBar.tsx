'use client'

// @bprogress/next/app exports ProgressProvider (the App Router variant).
// The root @bprogress/next re-exports it as AppProgressProvider — both paths
// resolve to the same component. The spec referenced "AppProgressBar" which
// does not exist in this package; AppProgressProvider is the correct API.
import { ProgressProvider as AppProgressProvider } from '@bprogress/next/app'

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
