import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy-loaded routes for 3G fast load & bundle code-splitting
const CompaniesPage = lazy(() => import('@/pages/CompaniesPage'));
const CompanyDetailPage = lazy(() => import('@/pages/CompanyDetailPage'));
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'));
const ExperiencesPage = lazy(() => import('@/pages/ExperiencesPage'));
const SubmitExperiencePage = lazy(() => import('@/pages/SubmitExperiencePage'));
const AptitudePage = lazy(() => import('@/pages/AptitudePage'));
const TopicQuestionsPage = lazy(() => import('@/pages/TopicQuestionsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const AdminBulkImportPage = lazy(() => import('@/pages/AdminBulkImportPage'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 animate-fadeIn">
    <div className="w-10 h-10 border-4 border-[#006c49]/20 border-t-[#006c49] rounded-full animate-spin"></div>
    <span className="text-xs font-bold text-[#747878] uppercase tracking-wider">Loading PrepUnite...</span>
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
        element: withSuspense(SubmitExperiencePage),
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
        path: '/profile',
        element: withSuspense(ProfilePage),
      },
      {
        path: '/admin',
        element: withSuspense(AdminDashboardPage),
      },
      {
        path: '/admin/bulk-import',
        element: withSuspense(AdminBulkImportPage),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
