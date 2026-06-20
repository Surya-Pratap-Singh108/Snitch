import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js';
import { useEffect } from 'react';


function App() {
  const {handleGetMe}=useAuth();
  const loading = useSelector((state) => state.auth.loading);
  useEffect(() => {
    handleGetMe();
  }, []);
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-amber-500 text-2xl">Loading...</div>
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
