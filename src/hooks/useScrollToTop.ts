import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * A custom hook that scrolls the window to the top when the route changes
 * and handles browser back/forward navigation appropriately
 */
export function useScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  
  // Keep track of paths we've visited
  const pathsVisitedRef = useRef<string[]>([]);
  
  useEffect(() => {
    // Always scroll to top on new navigation (not back/forward)
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
      
      // Add this path to our history if it's not already the most recent
      if (pathsVisitedRef.current[pathsVisitedRef.current.length - 1] !== pathname) {
        pathsVisitedRef.current.push(pathname);
      }
    } else {
      // This is a POP navigation (browser back/forward)
      // Force a refresh to ensure content is up-to-date
      const currentIndex = pathsVisitedRef.current.indexOf(pathname);
      if (currentIndex !== -1) {
        // We've seen this path before, update our position in history
        pathsVisitedRef.current = pathsVisitedRef.current.slice(0, currentIndex + 1);
      } else {
        // This is a new path via back/forward, add it to our history
        pathsVisitedRef.current.push(pathname);
      }
      
      // Scroll to top with a slight delay to ensure DOM is updated
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [pathname, navigationType]);
}
