import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, useMediaQuery } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import TimerIcon from "@mui/icons-material/Timer";
import AnalyticsIcon from "@mui/icons-material/Analytics";

export default function SimulationIntro() {
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useMediaQuery("(max-width:768px)");

  const steps = [
    { label: "Pilih Paket", icon: <InfoIcon /> },
    { label: "Kerjakan Try-Out", icon: <TimerIcon /> },
    { label: "Lihat Hasil", icon: <AnalyticsIcon /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getAvatarSize = (isActive) => {
    if (isMobile) return isActive ? 40 : 32;
    return isActive ? 56 : 40;
  };

  const getFontSize = () => {
    return isMobile ? "0.7rem" : "0.875rem";
  };

  // Ukuran outer box step tetap
  const getStepHeight = () => (isMobile ? 80 : 120);

  return (
    <section className="bg-white font-merriweather font-extrabold pt-8 pb-2">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-left mb-12 md:mb-16 space-y-3">
          <h2
            className="text-2xl md:text-4xl font-extrabold"
            style={{ color: "#00467f" }}
          >
            Pilih Paket Try-Out
          </h2>
          <p
            className="max-w-2xl text-sm md:text-base font-medium"
            style={{ color: "#000" }}
          >
            Persiapkan diri kamu menghadapi Seleksi Kompetensi Dasar (SKD)
            dengan Try-out yang dirancang menyerupai sistem CAT BKN. Tingkatkan
            kecepatan dan akurasi menjawab kamu melalui latihan intensif.
          </p>
        </div>

        {/* Animated Stepper */}
        <Box className="mb-8">
          <Box className="flex items-center justify-between py-6 w-full">
            {steps.map((step, index) => {
              const isActive = index === activeStep;

              return (
                <React.Fragment key={index}>
                  {/* Outer Step Container (fixed height) */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      height: getStepHeight(),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    {/* Inner Box untuk scaling */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: isActive ? "scale(1.2)" : "scale(0.8)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: isActive ? "#00467f" : "#e0e0e0",
                          color: isActive ? "#fff" : "#757575",
                          width: getAvatarSize(isActive),
                          height: getAvatarSize(isActive),
                          transition: "all 0.3s ease",
                        }}
                      >
                        {step.icon}
                      </Avatar>
                      <Typography
                        sx={{
                          mt: 1,
                          color: isActive ? "#00467f" : "#757575",
                          fontWeight: isActive ? "bold" : "medium",
                          fontSize: getFontSize(),
                          textAlign: "center",
                          whiteSpace: "normal",
                          lineHeight: 1.2,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {step.label}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Line between steps */}
                  {index < steps.length - 1 && (
                    <Box
                      className="h-[2px] bg-gray-300"
                      sx={{
                        flex: 1,
                        alignSelf: "center",
                        mx: isMobile ? 1 : 2,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </div>
    </section>
  );
}
