import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SmoothScroll } from '../components/SmoothScroll'
import { CustomCursor } from '../components/CustomCursor'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Outlet />
    </SmoothScroll>
  )
}
