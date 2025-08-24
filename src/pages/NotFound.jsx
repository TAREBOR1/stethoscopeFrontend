
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'


const NotFound = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the component mounts
  }, []);
  return (
   <div className="flex mt-10 flex-col items-center justify-center text-sm  py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
    <h1 className="text-8xl md:text-9xl font-bold text-[#49B9FF]/50">404</h1>
    <div className="h-1 w-16 rounded bg-[#49B9FF]/50 my-5 md:my-7"></div>
    <p className="text-2xl md:text-3xl font-bold text-gray-800">Page Not Found</p>
    <p className="text-sm md:text-base mt-4 text-gray-500 max-w-md text-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable..</p>
    <div className="flex items-center gap-4 mt-6">
        <Link to='/' class="bg-gray-800 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all">
            Return Home
        </Link>
        
    </div>
</div>
  )
}

export default NotFound
