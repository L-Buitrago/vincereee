import { Outlet } from "react-router-dom";
import PlatformSidebar from "./PlatformSidebar";

export default function PlatformLayout() {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white font-body">
      <PlatformSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
