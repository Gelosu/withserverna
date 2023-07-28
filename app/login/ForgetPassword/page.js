import Footer from "@/components/DefaultFix/Footer";
import NavBar from "@/components/DefaultFix/NavBar";
import ForgotPassword from "@/components/ForgetPassword/FPassword";

export default function ForgetPasswordPage() {
  return (
    <main className="d-flex justify-content-between flex-column vh-100">
      <div>
        <NavBar />
      </div>
      <section>
        <ForgotPassword />
      </section>
      <div>
        <Footer />
      </div>
    </main>
  );
}
