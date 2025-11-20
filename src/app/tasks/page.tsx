import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Tasks() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                Tasks
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Manage your tasks here
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8">
            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              No tasks yet. Create your first task to get started!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
