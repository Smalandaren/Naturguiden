'use client'
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('./Map.tsx'), {
    loading: () => <p>Loading...</p>,
    ssr: false,
  })

export default function NextJsMap() {
    return <DynamicMap />
}