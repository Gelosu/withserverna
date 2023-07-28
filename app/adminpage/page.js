"use client";
import Footer from "@/components/DefaultFix/Footer";
import ADMINPAGE from "@/components/Admin/adminpage";
import Link from "next/link";
export default function adminpage() {
  return (
    <main className="vh-100 d-flex justify-content-between flex-column">
      <main className="z-index-3">
        <nav className="navbar w-100 navbar-lg px-3 bg-danger text-dark">
          <Link href="/">
            <img
              src="/TUPC.svg"
              alt="TUPC"
              width={80}
              height={80}
              priority={true}
            />
          </Link>
          <a href="/login" className="text-decoration-none link-dark">Logout</a>
        </nav>
      </main>
      <div>
        <ADMINPAGE />
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );
}
