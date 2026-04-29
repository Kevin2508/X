export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />
      </div>
    </div>
  );
}
