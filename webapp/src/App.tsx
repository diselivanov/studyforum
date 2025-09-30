import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { NotAuthRouteTracker } from './components/NotAuthRouteTracker'
import { AppContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllTopicsPage } from './pages/topics/AllTopicsPage'
import { EditTopicPage } from './pages/topics/EditTopicPage'
import { NewTopicPage } from './pages/topics/NewTopicPage'
import { ViewTopicPage } from './pages/topics/ViewTopicPage'
import { EditProfilePage } from './pages/auth/EditProfilePage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignOutPage } from './pages/auth/SignOutPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { NotFoundPage } from './pages/other/NotFoundPage'
import { ProfilePage } from './pages/auth/ProfilePage'
import './styles/global.scss'
import { ViewUserPage } from './pages/auth/ViewUserPage'

export const App = () => {
  return (
    <HelmetProvider>
      <TrpcProvider>
        <AppContextProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotAuthRouteTracker />
            <Routes>
              <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
              <Route element={<Layout />}>
                <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
                <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
                <Route path={routes.getProfileRoute.definition} element={<ProfilePage />} />
                <Route path={routes.getEditProfileRoute.definition} element={<EditProfilePage />} />
                <Route path={routes.getAllTopicsRoute.definition} element={<AllTopicsPage />} />
                <Route path={routes.getViewTopicRoute.definition} element={<ViewTopicPage />} />
                <Route path={routes.getViewUserRoute.definition} element={<ViewUserPage />} />
                <Route path={routes.getEditTopicRoute.definition} element={<EditTopicPage />} />
                <Route path={routes.getNewTopicRoute.definition} element={<NewTopicPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppContextProvider>
      </TrpcProvider>
    </HelmetProvider>
  )
}
