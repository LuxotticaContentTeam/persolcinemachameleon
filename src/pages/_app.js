import 'styles/globals.css';
import 'styles/tailwind.css';
import { ToastProvider } from '@apideck/components';

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  );
}
