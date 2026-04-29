import type { ReactNode } from 'react';

interface ComposeTweetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  userAvatar?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

export default function ComposeTweet({
  isOpen,
  onClose,
  onSubmit,
  userAvatar,
  isLoading = false,
  children,
}: ComposeTweetProps) {
  if (!isOpen) return null;

  // Props available for future implementation
  void onClose;
  void onSubmit;
  void userAvatar;
  void isLoading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
      <div className="bg-black border border-gray-700 rounded-2xl w-full md:max-w-2xl md:mx-auto">
        {children}
      </div>
    </div>
  );
}
