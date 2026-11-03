// Roboto (fonte oficial do ATLab), servida pelo próprio site: subconjunto latino.
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-400-italic.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
// Estilos globais primeiro: os CSS Modules dos componentes vêm depois na cascata.
import './styles/global.css';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';
import {ROTAS} from './rotas';

const router = createBrowserRouter(ROTAS, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
