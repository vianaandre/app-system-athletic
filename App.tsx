import { Routes } from './src/routes';
import { AuthProvider } from './src/hook/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
