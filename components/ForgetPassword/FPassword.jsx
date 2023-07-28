"use client"

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the correct module for router
import axios from "axios"; // Import axios for API calls

export default function ForgotPassword() {
  const [TUPCID, setTUPCID] = useState("");
  const [GSFEACC, setGSFEACC] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform validation if needed

    try {
      // Make the API request to the backend
      const { data } = await axios.post("http://localhost:3001/forgotpassword", {
        TUPCID,
        GSFEACC,
      });

      if (data.message === "Code sent to GSFE Account") {
        // Success, show the success message when code is sent
        setResponseMessage("Code sent successfully. Please check your GSFE Account.");
      } else {
        // Show other successful response messages or error messages from the API
        setResponseMessage(data.message);
      }
    } catch (error) {
      // Error making the API request
      console.error("Error occurred while making the API request:", error);
      setResponseMessage("Failed to communicate with the server");
    }
  };

  return (
    <main className="container d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark rounded-3 py-5">
        <p className="mb-0 fw-bold fs-5">FORGOT PASSWORD</p>
        <p className="fw-light text-center px-3">
          Enter your GSFE account to reset your password
        </p>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center"
            placeholder="TUPC-**-****"
            value={TUPCID}
            onChange={(e) => setTUPCID(e.target.value)}
          />
          <input
            type="text"
            className="py-1 px-3 w-75 rounded border border-dark mb-3 text-center"
            placeholder="GSFE ACCOUNT"
            value={GSFEACC}
            onChange={(e) => setGSFEACC(e.target.value)}
          />
          <div></div>
          {responseMessage && <small className="mb-2 text-success">{responseMessage}</small>} {/* Display success or error message */}
          <button
            type="submit"
            className="px-3 mb-3 btn btn-outline-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>
    </main>
  );
}
