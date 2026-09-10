import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import TpoLayout from '@/layouts/TpoLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('@/pages/CompanyDetailPage'));
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'));
const ExperiencesPage = lazy(() => import('@/pages/ExperiencesPage'));
const SubmitExperiencePage = lazy(() => import('@/pages/SubmitExperiencePage'));
const AptitudePage = lazy(() => import('@/pages/AptitudePage'));
const TopicQuestionsPage = lazy(() => import('@/pages/TopicQuestionsPage'));
const TechnicalHubPage = lazy(() => import('@/pages/TechnicalHubPage'));
const InterviewPrepPage = lazy(() => import('@/pages/InterviewPrepPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const StudentExamsPage = lazy(() => import('@/pages/StudentExamsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminCollegesPage = lazy(() => import('@/pages/AdminCollegesPage'));
const AdminBulkImportPage = lazy(() => import('@/pages/AdminBulkImportPage'));
const AdminTechnicalPage = lazy(() => import('@/pages/AdminTechnicalPage'));
const AdminInterviewPage = lazy(() => import('@/pages/AdminInterviewPage'));

// Dedicated TPO Portal Pages
const TpoOverviewPage = lazy(() => import('@/pages/tpo/TpoOverviewPage'));
const TpoStudentsPage = lazy(() => import('@/pages/tpo/TpoStudentsPage'));
const TpoExamsPage = lazy(() => import('@/pages/tpo/TpoExamsPage'));
const TpoExamDetailPage = lazy(() => import('@/pages/tpo/TpoExamDetailPage'));
const TpoAnalyticsPage = lazy(() => import('@/pages/tpo/TpoAnalyticsPage'));
const TpoSettingsPage = lazy(() => import('@/pages/tpo/TpoSettingsPage'));

const MockExamTestPage = lazy(() => import('@/pages/MockExamTestPage'));

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));

import LoadingScreen from '@/components/LoadingScreen';

const PageLoader = () => (
  <LoadingScreen fullScreen={false} size="md" />
);

const withSuspense = (Component: React.ComponentType<any>, props?: any) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: withSuspense(AboutPage),
      },
      {
        path: '/contact',
        element: withSuspense(ContactPage),
      },
      {
        path: '/pricing',
        element: withSuspense(PricingPage),
      },
      {
        path: '/privacy-policy',
        element: withSuspense(PolicyPage, { type: 'privacy' }),
      },
      {
        path: '/terms-and-conditions',
        element: withSuspense(PolicyPage, { type: 'terms' }),
      },
      {
        path: '/refund-policy',
        element: withSuspense(PolicyPage, { type: 'refund' }),
      },
      {
        path: '/login',
        element: withSuspense(LoginPage),
      },
      {
        path: '/companies',
        element: withSuspense(CompaniesPage),
      },
      {
        path: '/companies/:slug',
        element: withSuspense(CompanyDetailPage),
      },
      {
        path: '/companies/:slug/oldpapers',
        element: withSuspense(CompanyDetailPage, { isOldPapersRoute: true }),
      },
      {
        path: '/questions',
        element: withSuspense(QuestionsPage),
      },
      {
        path: '/experiences',
        element: withSuspense(ExperiencesPage),
      },
      {
        path: '/experiences/submit',
        element: (
          <ProtectedRoute>
            {withSuspense(SubmitExperiencePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/aptitude/:categorySlug',
        element: withSuspense(AptitudePage),
      },
      {
        path: '/aptitude/:categorySlug/topic/:topicId',
        element: withSuspense(TopicQuestionsPage),
      },
      {
        path: '/technical',
        element: withSuspense(TechnicalHubPage),
      },
      {
        path: '/interview-prep',
        element: withSuspense(InterviewPrepPage),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            {withSuspense(DashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/student/exams',
        element: (
          <ProtectedRoute>
            {withSuspense(StudentExamsPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            {withSuspense(ProfilePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminDashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/colleges',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminCollegesPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/bulk-import',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminBulkImportPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/technical',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminTechnicalPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin/interview',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminInterviewPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // 2. Dedicated Enterprise TPO Placement Portal (Isolated from Consumer Student Layout)
  {
    path: '/tpo',
    element: (
      <ProtectedRoute requireTpo>
        <TpoLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(TpoOverviewPage),
      },
      {
        path: 'students',
        element: withSuspense(TpoStudentsPage),
      },
      {
        path: 'exams',
        element: withSuspense(TpoExamsPage),
      },
      {
        path: 'exams/:examId',
        element: withSuspense(TpoExamDetailPage),
      },
      {
        path: 'analytics',
        element: withSuspense(TpoAnalyticsPage),
      },
      {
        path: 'settings',
        element: withSuspense(TpoSettingsPage),
      },
    ],
  },
  // 3. Isolated Distraction-Free Standardized Examination Engine (Zero Dashboard/Menus/Chrome)
  {
    path: '/exam/:examId',
    element: (
      <ProtectedRoute>
        {withSuspense(MockExamTestPage)}
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
