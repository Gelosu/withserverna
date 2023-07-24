import Link from "next/link";

export default function ForgotPassword() {
    return (
      <main className="container vh-100 d-flex justify-content-center align-items-center">
        <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
          <p className="mb-0 fw-bold fs-5 ">FORGOT PASSWORD</p>
          <p className="fw-light text-center px-3">Enter your GSFE account to reset your password</p>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center"
            placeholder="TUPC-**-****"
          />
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center"
            placeholder="GSFE ACCOUNT"
          />
          <Link href="/login/ForgetPassword/UpdatePassword"><button className="px-3 mb-3 btn btn-outline-dark">Submit</button></Link>
        </section>
      </main>
    );
  }
  