import axios from 'axios';
import { useRouter } from "next/navigation"; // Updated import
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Login() {
  const [TUPCID, setTUPCID] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");
  const [error, setError] = useState(""); // Added error state
  const router = useRouter();
  const tupcRegExp = /TUPC-\d{2}-\d{4}$/;
  const schema = yup.object().shape({
    TUPCID: yup.string().matches(tupcRegExp, "Invalid TUPC-ID!").required("TUPC-ID Required!"),
    PASSWORD: yup.string().required("Password Required!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    console.log(data);
    axios.post("http://localhost:3001/login", data)
      .then((response) => {
        const accountType = response.data.accountType;
        if (accountType === "admin") {
          router.push("/adminpage");
        } else if (accountType === "student") {
          router.push("/Classroom/S");
        } else if (accountType === "faculty") {
          router.push("/Classroom/F");
        } else {
          setError("Account does not exist");
        }
      })
      .catch((error) => {
        setError("Password is incorrect");
      });
  };

  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form
          className="d-flex justify-content-center align-items-center flex-column col-12"
          onSubmit={handleSubmit(submitForm)}
        >
          <p className="mb-0 mt-3">TUPC ID</p>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            placeholder="TUPC-**-****"
            onChange={(e) => setTUPCID(e.target.value)}
            {...register("TUPCID")}
          />
          <small className="mb-2 text-danger">{errors.TUPCID?.message}</small>
          <p className="mb-0">PASSWORD</p>
          <input
            type="password"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            onClick={(e) => setPASSWORD(e.target.value)}
            {...register("PASSWORD")}
          />
          <small className="mb-2 text-danger">{errors.PASSWORD?.message}</small>
          {error && <small className="mb-2 text-danger">{error}</small>} {/* Display error message */}
          <button type="submit" className="px-3 mb-3 btn btn-outline-dark">
            LOGIN
          </button>
        </form>
        <a
          className="link-primary mb-3 text-decoration-none"
          href="/"
        >
          Forgot Password?
        </a>
        <p className="text-center px-lg-2 px-4">
          Don't have an account yet?
          <a className="primary-link text-decoration-none" href="/login/Register">
            Register Now
          </a>
        </p>
      </section>
    </main>
  );
}
