"use client";
import { Axios } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Login() {
  const [tupcId, setTupcId] = useState("");
  const [passWord, setPassWord] = useState("");
  const router = useRouter();
  const tupcRegExp = /TUPC-\d{2}-\d{4}$/;
  const schema = yup.object().shape({
    TupcId: yup.string().matches(tupcRegExp, "Invalid TUPC-ID!"),
    pass: yup.string().required("Password Required!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const submitForm = (data) => {
    console.log(data);
    Axios.post("", {
      tupcId: tupcId,
      pass: passWord,
    }).then(() => {
      router.push("/Classroom/S");
    });
  };
  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark h-50 rounded-3">
        <form 
        className="d-flex justify-content-center align-items-center flex-column col-12"
        onClick={handleSubmit(submitForm)}>
          <p className="mb-0 mt-3">TUPC ID</p>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            placeholder="TUPC-**-****"
            onChange={(e) => setTupcId(e.target.value)}
            {...register("TupcId")}
          />
          <small className="mb-2 text-danger">{errors.TupcId?.message}</small>
          <p className="mb-0">PASSWORD</p>
          <input
            type="password"
            className="py-1 px-3 w-75 rounded border border-dark mb-1 text-center"
            onClick={(e) => setPassWord(e.target.value)}
            {...register("pass")}
          />
          <small className="mb-2 text-danger">{errors.pass?.message}</small>
          <button
            type="submit"
            href="/Dashboard"
            className="px-3 mb-3 btn btn-outline-dark"
          >
            LOGIN
          </button>
        </form>
        <a
          className="link-primary mb-3 text-decoration-none"
          href="/login/ForgetPassword/ForgetPassword"
        >
          Forgot Password?
        </a>
        <p className="text-center px-lg-2 px-4">
          Don't have an account yet?
          <a
            className="primary-link text-decoration-none"
            href="/login/Register"
          >
            Register Now
          </a>
        </p>
      </section>
    </main>
  );
}
