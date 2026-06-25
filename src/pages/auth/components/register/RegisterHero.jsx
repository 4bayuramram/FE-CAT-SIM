export default function RegisterHero() {
  return (
    <section className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[#12345b] via-[#0b2a4a] to-[#fcd401] text-white p-14 flex-col justify-between">
      <img
        src="/hero.png"
        alt="Education Background"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />

      <div className="relative z-10">
        <img
          src="/cpnz.png"
          alt="CPN-Z"
          className="h-32 w-auto object-contain"
        />
      </div>

      <div className="relative z-10 max-w-xl">
        <h2 className="text-4xl font-bold mb-6 leading-tight">
          Start Your <br /> Exam Journey
        </h2>

        <p className="text-white/80 text-lg leading-8">
          Join thousands of high-achieving candidates across the globe. Our
          adaptive CBT platform provides secure, scalable, and modern assessment
          experiences for institutions and learners.
        </p>

        <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#fcd401] flex items-center justify-center text-[#12345b] text-2xl font-bold">
            ✓
          </div>

          <div>
            <p className="text-[#fcd401] text-sm font-medium">
              Certified Institution
            </p>

            <h3 className="text-xl font-semibold">ISO 27001 Accredited</h3>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-12">
        <div>
          <h3 className="text-4xl font-bold">1.2M+</h3>
          <p className="text-white/70 text-sm mt-1">Tests Taken</p>
        </div>

        <div>
          <h3 className="text-4xl font-bold">99.9%</h3>
          <p className="text-white/70 text-sm mt-1">Uptime Rate</p>
        </div>
      </div>
    </section>
  );
}
