import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text-sage mb-2">Finance Learning Platform</h1>
          <p className="text-earth-600">Master your financial future</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
