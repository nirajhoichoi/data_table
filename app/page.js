"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Table from "./Component/Table/page";

function Home() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className="w-[80%] mx-auto my-20">
        <Table />
      </main>
    </LocalizationProvider>
  );
}

export default Home;
