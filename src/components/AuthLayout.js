export default function AuthLayout({ children }) {
  return (
    <div className="bg-[#f5f5f5] py-6 px-4 sm:px-6 lg:px-8">
      <div className="mt-6 bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full mx-auto">
        {children}
      </div>
    </div>
  );
}
