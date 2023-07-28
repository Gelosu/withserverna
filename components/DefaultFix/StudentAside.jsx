"use client"
import Link from "next/link";
import { useState } from "react";

export default function StudentAside() {
  const [navs, setNavs] = useState(false);
  const animate = () => {
    setNavs(!navs)
  }
  return (
      <aside className={navs? "custom-con2 w-50 px-0 bg-danger":"custom-con1 col-1 col-sm-2 px-sm-2 px-0 bg-danger"}>
        <div className="d-flex flex-column align-items-center justify-content-between pt-2 text-white vh-100">
          <div className={navs ? "custom-hov2 flex-column text-center" : "custom-hov1 d-md-flex flex-column text-center"}>
            <div className="Circle2 align-self-center"></div>
            <p className="my-2">&#123;TUPC-**-****&#125;</p>
            <p className="my-2">&#123;NAME&#125;</p>
            <small>&#123;COURSE, YEAR, SECTION&#125;</small>
          </div>
          <input type="checkbox" className={navs ? "custom-c" : "custom-v"} onClick={animate}/>
          <div className={navs ? "custom-hov2 flex-column align-self-start px-2" : "custom-hov1 d-md-flex flex-column align-self-start px-2"}>
            <p className="my-2">SETTINGS</p>
            <p className="my-2">REPORT PROBLEM</p>
            <Link
              href="/login"
              className="text-decoration-none link-light"
            >
              <p className="fw-100 my-2">LOGOUT</p>
            </Link>
          </div>
        </div>
      </aside>
  );
}
