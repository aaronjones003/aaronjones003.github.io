import { h } from 'preact';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-sm text-neutral-600">Loading...</p>
      </div>
    </div>
  );
}
