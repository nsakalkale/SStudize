/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense } from 'react'
import ResultsContent from '@/components/student/TestResults'
import { Metadata } from 'next'

type Props = {
  params: { testId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Test Results - ${params.testId}`,
  }
}

export default function ResultsPage({ params }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent testId={params.testId} />
    </Suspense>
  )
} 