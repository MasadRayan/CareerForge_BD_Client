import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-base-200 shadow-lg rounded-2xl px-8 py-6 flex flex-col items-center gap-4 border border-base-300">
        <div className="p-3 rounded-full bg-primary/10">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <p className="text-base-content/70 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;