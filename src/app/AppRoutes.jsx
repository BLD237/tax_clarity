import { Navigate, Route, Routes } from 'react-router-dom'
import { SessionSync } from './SessionSync.jsx'
import { AuthRoute } from './AuthRoute.jsx'
import { RequireAuth } from './RequireAuth.jsx'
import { RequireOnboardingComplete } from './RequireOnboardingComplete.jsx'
import { OnboardingGate } from './OnboardingGate.jsx'
import { PublicLayout } from '../layouts/PublicLayout.jsx'
import { AuthLayout } from '../layouts/AuthLayout.jsx'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { OnboardingLayout } from '../layouts/OnboardingLayout.jsx'
import { LandingPage } from '../pages/public/LandingPage.jsx'
import { PricingPage } from '../pages/public/PricingPage.jsx'
import { PrivacyPage } from '../pages/public/PrivacyPage.jsx'
import { TermsPage } from '../pages/public/TermsPage.jsx'
import { AuthPage } from '../pages/auth/AuthPage.jsx'
import { OnboardingIdentityPage } from '../pages/onboarding/OnboardingIdentityPage.jsx'
import { OnboardingStepsPage } from '../pages/onboarding/OnboardingStepsPage.jsx'
import { DashboardPage } from '../pages/app/DashboardPage.jsx'
import { EstimationPage } from '../pages/app/EstimationPage.jsx'
import { HistoryPage } from '../pages/app/HistoryPage.jsx'
import { SettingsPage } from '../pages/app/SettingsPage.jsx'

export function AppRoutes() {
  return (
    <>
      <SessionSync />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route element={<AuthRoute />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<OnboardingLayout />}>
            <Route element={<OnboardingGate />}>
              <Route path="/onboarding/identity" element={<OnboardingIdentityPage />} />
              <Route path="/onboarding" element={<OnboardingStepsPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<RequireOnboardingComplete />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/app/dashboard" element={<DashboardPage />} />
              <Route path="/app/estimation" element={<EstimationPage />} />
              <Route path="/app/history" element={<HistoryPage />} />
              <Route path="/app/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
