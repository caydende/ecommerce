import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'details/:id',  // Handle dynamic product routes using SSR
    renderMode: RenderMode.Server
  },
  {
    path: '**',  // Keep all other routes prerendered
    renderMode: RenderMode.Prerender
  }
];