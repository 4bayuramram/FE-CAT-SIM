import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export const DASHBOARD_TABS = [
  { key: "overview", label: "Ringkasan", icon: SpaceDashboardRoundedIcon },
  { key: "packages", label: "Paket Saya", icon: Inventory2RoundedIcon },
  { key: "latihan", label: "Latihan", icon: MenuBookRoundedIcon },
  { key: "scores", label: "Hasil", icon: BarChartRoundedIcon },
  { key: "performa", label: "Performa", icon: TimelineRoundedIcon },
  { key: "account", label: "Akun", icon: PersonRoundedIcon },
];
