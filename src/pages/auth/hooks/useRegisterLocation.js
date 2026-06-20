import { useState } from "react";
import { citiesByProvince } from "../constant/locationData";

export default function useRegisterLocation() {
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  const handleProvinceChange = (_, value) => {
    setProvince(value);
    setCity(null);
  };

  const handleCityChange = (_, value) => {
    setCity(value);
  };

  const cityOptions = province ? citiesByProvince[province.id] || [] : [];

  return {
    province,
    city,
    cityOptions,
    handleProvinceChange,
    handleCityChange,
  };
}
