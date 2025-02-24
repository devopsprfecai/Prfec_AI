import React from 'react'
import CompetitorAnalysisAi from '@components/competitor-analysis-ai/CompetitorAnalysisAi'
import { CompetitorPromptProvider } from '@context/CompetitorPromptCount'
const page = () => {
  return (
    <CompetitorPromptProvider>
      <CompetitorAnalysisAi/>
    </CompetitorPromptProvider>

  )
}
export default page;