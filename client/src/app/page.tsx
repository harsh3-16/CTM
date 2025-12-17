import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">Collaborative Task Manager</h1>
        <p className="text-xl mb-8 text-indigo-100">Real-time task management with your team</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors border-2 border-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
