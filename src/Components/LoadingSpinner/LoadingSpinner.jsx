import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
