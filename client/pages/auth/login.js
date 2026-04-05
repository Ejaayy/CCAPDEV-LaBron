import { useState } from "react";
import { useRouter } from "next/router";
import loginStyles from "./login.module.css";
import { login, register, forgotPassword } from "@/lib/auth";

export default function Login() {

  // controls whether the register modal is visible or hidden
  const [isModalOpen, setIsModalOpen] = useState(false);

  // allows redirecting user to another page after login
  const router = useRouter();


  // stores the user's login email input
  const [loginEmail, setLoginEmail] = useState("");

  // stores the user's login password input
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");

  const toggleForgotModal = () => {
    setIsForgotModalOpen((prev) => !prev);
    setForgotMessage("");
    setForgotStatus("");
  };

  // stores ALL registration form data in one object
  // easier than making separate states for each input
  const [regData, setRegData] = useState({
    fname: "",
    lname: "",
    email: "",
    idNum: "",
    pass1: "",
    pass2: "",
    role: "student", // default role
  });

  const [rememberMe, setRememberMe] = useState(false);


  // toggles the register modal open/close
  const toggleModal = () => setIsModalOpen((prev) => !prev);


  // updates whichever input field the user types in
  // uses the "name" attribute to know which property to update
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setRegData((prev) => ({
      ...prev,        // keeps previous values
      [name]: value,  // updates only the changed field
    }));
  };


  // handles register form submission
  async function handleRegister(e) {

    // prevents page refresh when form is submitted
    e.preventDefault();


    // simple validation: passwords must match
    if (regData.pass1 !== regData.pass2) {
      alert("Passwords do not match!");
      return;
    }

    try {

      // send registration data to backend
      await register({
        email: regData.email,
        password: regData.pass1,
        firstName: regData.fname,
        lastName: regData.lname,
        idNumber: regData.idNum,
        role: regData.role,
      });

      // notify user of success
      alert("Registration successful! You can now log in.");

      // close the register modal
      toggleModal();

    } catch (error) {

      // prints error in browser console
      console.error("Registration error:", error);

      // shows error message to user
      alert(error.message || "Registration failed.");
    }
  }


  // handles login form submission
  async function handleLogin(e) {

    // prevents page refresh
    e.preventDefault();
    setLoginError("");

    try {

      // send login credentials to backend
      const data = await login({
        email: loginEmail,
        password: loginPassword,
        rememberMe: rememberMe
      });

      // redirect depending on user role
      // technician goes to tech dashboard
      if (data.role === "technician") {
        router.push("/home-tech");

      // normal users go to regular home page
      } else {
        router.push("/home");
      }

    } catch (error) {
      if (error.status !== 401) {
        console.error("Login error:", error);
      }
      setLoginError(error.message || "Invalid credentials.");
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotMessage("Sending...");
    setForgotStatus("loading");

    try {
      const response = await forgotPassword(forgotEmail);
      setForgotMessage(response.message || "Reset link sent!");
      setForgotStatus("success");
    } catch (error) {
      setForgotMessage(error.message || "Failed to send reset link.");
      setForgotStatus("error");
    }
  }

  return (
    <div style={{ position: "relative", backgroundColor: "#070B20", display: "flex" }}>
      {isModalOpen && (
        <div className={loginStyles.signUpModal}>
          <div className={loginStyles.backButtonContainer}>
            <span onClick={toggleModal} className={loginStyles.backButton}>
              &lt;
            </span>
          </div>

          <h1>Register Account</h1>
          <h6>Join LabKoTo now!</h6>

          <form onSubmit={handleRegister}>
            <div className={loginStyles.formLayout}>
              <div className={loginStyles.inputLayout}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div className={loginStyles.formBreak}>
                    <label className={loginStyles.formLabels} htmlFor="fname">
                      First Name
                    </label>
                    <br />
                    <input
                      className={loginStyles.inputboxes}
                      type="text"
                      name="fname"
                      value={regData.fname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={loginStyles.formBreak}>
                    <label className={loginStyles.formLabels} htmlFor="lname">
                      Last Name
                    </label>
                    <br />
                    <input
                      className={loginStyles.inputboxes}
                      type="text"
                      name="lname"
                      value={regData.lname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={loginStyles.formBreak}>
                  <label className={loginStyles.formLabels} htmlFor="email">
                    DLSU Email Address
                  </label>
                  <br />
                  <input
                    className={loginStyles.inputboxes}
                    style={{ width: "100%" }}
                    type="email"
                    name="email"
                    value={regData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <br />
                </div>

                <div className={loginStyles.formBreak}>
                  <label className={loginStyles.formLabels} htmlFor="idNum">
                    ID Number
                  </label>
                  <br />
                  <input
                    className={loginStyles.inputboxes}
                    style={{ width: "100%" }}
                    type="text"
                    name="idNum"
                    value={regData.idNum}
                    onChange={handleInputChange}
                    required
                  />
                  <br />
                </div>

                <div className={loginStyles.formBreak}>
                  <label className={loginStyles.formLabels} htmlFor="pass1">
                    Password
                  </label>
                  <br />
                  <input
                    className={loginStyles.inputboxes}
                    style={{ width: "100%" }}
                    type="password"
                    name="pass1"
                    value={regData.pass1}
                    onChange={handleInputChange}
                    required
                  />
                  <br />
                </div>

                <div className={loginStyles.formBreak}>
                  <label className={loginStyles.formLabels} htmlFor="pass2">
                    Re-enter Password
                  </label>
                  <br />
                  <input
                    className={loginStyles.inputboxes}
                    style={{ width: "100%" }}
                    type="password"
                    name="pass2"
                    value={regData.pass2}
                    onChange={handleInputChange}
                    required
                  />
                  <br />
                </div>
              </div>

              <div>
                <button type="submit" className={loginStyles.confirmButton}>
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {isForgotModalOpen && (
          <div className={loginStyles.signUpModal} style={{ height: "auto", paddingBottom: "40px" }}>
            <div className={loginStyles.backButtonContainer}>
            <span onClick={toggleForgotModal} className={loginStyles.backButton}>
              &lt;
            </span>
            </div>

            <h1>Reset Password</h1>
            <h6>Enter your DLSU email to receive a reset link.</h6>

            <form onSubmit={handleForgotPassword}>
              <div className={loginStyles.formLayout}>
                <div className={loginStyles.inputLayout}>
                  <div className={loginStyles.formBreak}>
                    <label className={loginStyles.formLabels}>DLSU Email Address</label>
                    <br />
                    <input
                        className={loginStyles.inputboxes}
                        style={{ width: "100%" }}
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                    />
                  </div>
                </div>

                {forgotMessage && (
                    <p
                        style={{
                          color: forgotStatus === "loading" ? "black" :
                              forgotStatus === "success" ? "#4CAF50" :
                                  "red",
                          marginTop: "10px",
                          fontWeight: "bold"
                        }}
                    >
                      {forgotMessage}
                    </p>
                )}

                <div style={{ marginTop: "20px" }}>
                  <button type="submit" className={loginStyles.confirmButton}>
                    Send Link
                  </button>
                </div>
              </div>
            </form>
          </div>
      )}

      <div style={{ position: "relative" }}>
        <img src="../../../curves.png" style={{ height: "100vh", width: "100vh" }} alt="curves" />
        <h1
          className="brand-text"
          style={{ position: "absolute", top: "45%", left: "30%", fontSize: "80px" }}
        >
          LabKoTo
        </h1>
      </div>

      <div style={{ position: "relative", width: "100%", backgroundColor: "#FFFFFF" }}>
        <img src="../../../laboratoryPhoto.png" style={{ height: "100%", width: "100%" }} alt="lab" />

        <div className={loginStyles["form-container"]}>
          <h1>Login</h1>
          <h3>Welcome back! Please login to your account</h3>

          <form className={loginStyles.labelSpacing} onSubmit={handleLogin}>
            <label className={loginStyles.textLabels}>Email Address</label>
            <br />
            <input
              className={loginStyles.inputBox}
              type="text"
              value={loginEmail}
              onChange={(e) => {
                setLoginEmail(e.target.value);
                if (loginError) setLoginError("");
              }}
              required
            />
            <br />

            <label className={`${loginStyles.textLabels} ${loginStyles.labelSpacing}`}>
              Password
            </label>
            <br />
            <input
              className={loginStyles.inputBox}
              type="password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                if (loginError) setLoginError("");
              }}
              required
            />
            <br />

            {loginError && <p className={loginStyles.errorMessage}>{loginError}</p>}

            <div className={loginStyles.rememberMeRow}>
              <label className={loginStyles.rememberMeLabel}>
                <input
                    type="checkbox"
                    className={loginStyles.rememberMeCheckbox}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <label
                  className={loginStyles.forgotPassword}
                  onClick={toggleForgotModal}
                  style={{ cursor: "pointer" }}
              >
                Forgot Password?
              </label>
            </div>

            <div className={loginStyles.subModule}>
              <input className={loginStyles.confirmButton} type="submit" value="Log In" />
              <br />
              <label className={`${loginStyles.textLabels} ${loginStyles.newUser}`}>
                New User?
                <span
                  onClick={toggleModal}
                  className={loginStyles.userSignUp}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  Sign Up
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
