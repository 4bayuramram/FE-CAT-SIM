import { useState } from "react";
import RegisterHero from "./components/register/RegisterHero";
import RegisterForm from "./components/register/RegisterForm";
import useRegisterLocation from "./hooks/useRegisterLocation";
import { registerUser } from "../../services/auth/registerUser";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const navigate = useNavigate();
  const [checkedTerms, setCheckedTerms] = useState(false);
  const {
    province,
    city,
    cityOptions,
    handleProvinceChange,
    handleCityChange,
  } = useRegisterLocation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleRegister = async (e) => {
   e.preventDefault();

   const nameRegex = /^[a-zA-Z\s]+$/;
   const badWords = ["anjing", "bangsat", "kontol", "memek", "bajingan", "otak", "cuki" , "pantek", "anak" , "kampang" , "fuck" , "gila" ];

   // 1. cek kosong
   if (
     !form.firstName ||
     !form.lastName ||
     !form.email ||
     !form.password ||
     !form.confirmPassword ||
     !province ||
     !city
   ) {
     alert("Semua field wajib diisi");
     return;
   }

   // 2. password match
   if (form.password !== form.confirmPassword) {
     alert("Password tidak sama");
     return;
   }

   // 3. validasi nama
   const fullName = `${form.firstName} ${form.lastName}`.toLowerCase();

   if (!nameRegex.test(form.firstName) || !nameRegex.test(form.lastName)) {
     alert("Nama hanya boleh huruf");
     return;
   }

   if (badWords.some((word) => fullName.includes(word))) {
     alert("Nama tidak valid");
     return;
   }

   setLoading(true);

   const { data, error } = await registerUser({
     email: form.email,
     password: form.password,
     firstName: form.firstName,
     lastName: form.lastName,
     province,
     city,
   });

   setLoading(false);

   if (error) {
     alert(error.message);
     return;
   }

  alert(
    `Pendaftaran berhasil kak ${form.firstName}! Cek email kak ${form.firstName} sekarang untuk verifikasi akun`
  );
   navigate("/cpn-z/login");
 };

   const handleGoogleLogin = async () => {
     await supabase.auth.signInWithOAuth({
       provider: "google",
       options: {
         redirectTo: `${window.location.origin}/home/simulasi`,
       },
     });
   };
    

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <RegisterHero />

      <section className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <RegisterForm
          province={province}
          city={city}
          cityOptions={cityOptions}
          onProvinceChange={handleProvinceChange}
          onCityChange={handleCityChange}
          form={form}
          onChange={handleChange}
          onSubmit={handleRegister}
          loading={loading}
          checkedTerms={checkedTerms}
          onCheckedTermsChange={setCheckedTerms}
          onGoogleLogin={handleGoogleLogin}
        />
      </section>
    </main>
  );
}
