export default function BottomNav({ mobileView, setMobileView }) {
  const menus = [
    {
      key: "ujian",
      label: "Ujian",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 19.5V5a2 2 0 012-2h11a2 2 0 012 2v14.5M8 7h8M8 11h8M8 15h5"
          />
        </svg>
      ),
    },
    {
      key: "navigasi",
      label: "Navigasi",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 16h6v6H4v-6zm10 2h6v4h-6v-4z"
          />
        </svg>
      ),
    },
    {
      key: "bantuan",
      label: "Bantuan",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18h.01M12 14a4 4 0 100-8 4 4 0 000 8zm0 8a10 10 0 100-20 10 10 0 000 20z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around items-center py-2">
        {menus.map((menu) => {
          const active = mobileView === menu.key;

          return (
            <button
              key={menu.key}
              onClick={() => setMobileView(menu.key)}
              className="flex flex-col items-center justify-center w-full py-1"
            >
              <div className={active ? "text-blue-600" : "text-slate-400"}>
                {menu.icon}
              </div>

              <span
                className={`text-[11px] mt-1 ${
                  active ? "text-blue-600 font-semibold" : "text-slate-400"
                }`}
              >
                {menu.label}
              </span>

              {active && (
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
