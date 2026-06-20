export default function SocialRegister() {
  return (
    <>
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200"></div>

        <span className="px-3 text-sm text-gray-400">atau</span>

        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />

        <span className="font-medium text-gray-700">Daftar Dengan Google</span>
      </button>
    </>
  );
}
