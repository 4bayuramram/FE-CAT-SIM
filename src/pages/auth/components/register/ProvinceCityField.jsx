import { Autocomplete, TextField } from "@mui/material";
import { provinces } from "../../constant/locationData";

export default function ProvinceCityField({
  province,
  city,
  cityOptions,
  onProvinceChange,
  onCityChange,
}) {
  return (
    <>
      <div>
        <label className="text-sm text-gray-600">Provinsi</label>

        <Autocomplete
          options={provinces}
          value={province}
          onChange={onProvinceChange}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Cari Provinsi"
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Kota / Kabupaten</label>

        <Autocomplete
          options={cityOptions}
          value={city}
          onChange={onCityChange}
          getOptionLabel={(option) => option.label}
          disabled={!province}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                province ? "Cari Kota atau Kabupaten" : "Pilih Provinsi dulu"
              }
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />
          )}
        />
      </div>
    </>
  );
}
