
export const ValidationLoading = () => {
  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <h2 className="text-2xl font-bold">Validating Reset Link</h2>
      <p className="text-gray-600">Please wait while we validate your password reset link...</p>
      <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
    </div>
  );
};
