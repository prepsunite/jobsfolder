import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
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
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminBulkImportPage = lazy(() => import('@/pages/AdminBulkImportPage'));

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 animate-fadeIn">
    <div className="w-8 h-8 border-3 border-[#FD4A32]/20 border-t-[#FD4A32] dark:border-t-[#FD4A32] rounded-full animate-spin"></div>
    <span className="text-[11px] font-display font-bold uppercase tracking-wider text-[#868E96] dark:text-[#555555]">
      Loading...
    </span>
  </div>
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
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            {withSuspense(DashboardPage)}
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
        path: '/admin/bulk-import',
        element: (
          <ProtectedRoute requireAdmin>
            {withSuspense(AdminBulkImportPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
