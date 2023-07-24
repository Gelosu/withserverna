import Footer from "@/components/DefaultFix/Footer";
import NavBar from "@/components/DefaultFix/NavBar";
import UpdatePassword from "@/components/ForgetPassword/UPassword";

export default function UpdatePasswordPage(){
    return(
        <main>
            <NavBar/>
            <section>
                <UpdatePassword/>
            </section>
            <Footer/>
        </main>
    )
}