export default function PositionOPT({SClick, FClick}) {
    return (
      <main className="d-flex justify-content-center align-items-center">
          <div className="d-flex flex-column align-self-center justify-content-center">
          <p className="text-center fs-2 fw-bold">CHOOSE POSITION</p>
          <section className="d-sm-flex gap-5 justify-content-center container-lg">
              <button className="btn btn-outline-dark p-5 col-sm-6 col-12 mb-sm-0 mb-3" onClick={SClick}>STUDENT PROFILE</button>
              <button className="btn btn-outline-dark p-5 col-sm-6 col-12" onClick={FClick}>FACULTY PROFILE</button>
          </section>
      </div>
      </main>
   );
  }