import { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'

export const metadata: Metadata = {
  title: 'Website Creator',
  description: 'Create websites with AI-generated steps',
}

export default function Home() {
  return <LandingPage />
}

