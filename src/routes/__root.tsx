import { createRootRoute, Outlet } from '@tanstack/react-router'
import { SmoothScroll } from '../components/SmoothScroll'
import { CustomCursor } from '../components/CustomCursor'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <SmoothScroll>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CustomCursor />
      <Outlet />
    </SmoothScroll>
  )
}
