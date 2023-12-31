import Footer from "@/components/DefaultFix/Footer";
import NavBar from "@/components/DefaultFix/NavBar";
import UpdatePassword from "@/components/ForgetPassword/UPassword";

export default function UpdatePasswordPage() {
  return (
    <main className="d-flex justify-content-between flex-column vh-100">
      <div>
        <NavBar />
      </div>
      <section>
        <UpdatePassword />
      </section>

      <div>
        <Footer />
      </div>
    </main>
  );
}
