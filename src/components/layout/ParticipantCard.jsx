// components/layout/ParticipantCard.jsx

export default function ParticipantCard() {
  const peserta = {
    nama: "Nissa Anggraeni",
  };

  return (
    
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-4">
      
      {/* HEADER MERAH (BENDERA INDONESIA STYLE) */}
      <div className="bg-[#12345b] h-20 relative">
        {/* AVATAR */}
        <div className="absolute left-1/2 -bottom-10 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-white shadow-md p-1">
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-3xl">
              👤
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-14 pb-8 px-4">
        {/* USER INFO */}
        <div className="text-center">
          <h2 className="text-base font-semibold text-gray-800">
            {peserta.nama}
          </h2>

          <p className="text-sm text-[#12345b] font-medium mt-1">
            Peserta Ujian CAT
          </p>
        </div>
      </div>
    </div>
  );
}
