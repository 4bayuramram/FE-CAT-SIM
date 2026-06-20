import RegisterHero from "./components/register/RegisterHero";
import RegisterForm from "./components/register/RegisterForm";
import useRegisterLocation from "./hooks/useRegisterLocation";

export default function RegisterPage() {
  const {
    province,
    city,
    cityOptions,
    handleProvinceChange,
    handleCityChange,
  } = useRegisterLocation();

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      <RegisterHero />

      <section className="w-full lg:w-1/2 min-h-screen bg-white flex items-center justify-center px-6 py-12 overflow-y-auto">
        <RegisterForm
          province={province}
          city={city}
          cityOptions={cityOptions}
          onProvinceChange={handleProvinceChange}
          onCityChange={handleCityChange}
        />
      </section>
    </main>
  );
}
