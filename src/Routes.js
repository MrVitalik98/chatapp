import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PlanetLoader from './components/loaders/PlanetLoader'
const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PageNotFound = lazy(() => import('./components/PageNotFound'))

 
const AppRoutes = () => {
  const { token } = useSelector(state => state.user)

  const routes = token 
                  ? <Route path="/dashboard/*" element={<Dashboard />} />
                  : <Route path="/auth/*" element={<Auth />} />
  

  return (
    <Suspense fallback={<PlanetLoader />}>
      <Routes>
        {
          token 
            ? <Route path='/auth/login' element={<Navigate to='/dashboard/profile' /> } />
            : <Route path='/' element={<Navigate to='/auth/login' /> } />  
        }

        <Route path="*" element={<PageNotFound pathname={token ? '/dashboard/profile' : '/auth/login'} />} />

        {routes}
      </Routes>
    </Suspense>
  )
}


export default AppRoutes