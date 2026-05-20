export default function Hero() {
  return (
    <section
      className="
        w-full
        min-h-[40vh] md:min-h-[70vh]
        rounded-2xl md:rounded-[10%]
        flex items-center justify-center
        p-4 md:p-8
        bg-cover bg-center
        relative
        text-white
        shadow-[0_0_40px_15px_rgba(255,255,255,0.5)]
      "
      style={{
        backgroundImage: "url('/hero.png')",
      }}
    />
  );
}
