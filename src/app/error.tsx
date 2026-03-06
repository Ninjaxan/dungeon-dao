'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-[#12121a] border border-[#2a2a3e] rounded-xl p-8 max-w-md text-center space-y-4">
        <div className="text-4xl">&#9888;</div>
        <h2 className="text-xl font-bold text-[#e8e6f0]">Something went wrong</h2>
        <p className="text-sm text-[#9d99ae]">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-[#8b5cf6] text-white text-sm font-medium hover:bg-[#8b5cf6]/80 transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/dao"
            className="px-4 py-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-[#e8e6f0] text-sm hover:border-[#8b5cf6] transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
