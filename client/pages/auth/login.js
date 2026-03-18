import loginStyles from './login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // State for Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // State for Registration
    const [regData, setRegData] = useState({
        fname: '',
        lname: '',
        email: '',
        idNum: '',
        pass1: '',
        pass2: '',
        role: 'student' // default role
    });

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegData(prev => ({ ...prev, [name]: value }));
    };

    // registration
    const handleRegister = async (e) => {
        e.preventDefault();

        if (regData.pass1 !== regData.pass2) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: regData.email,
                    password: regData.pass1, // Plain text as per MCO2 guidelines
                    firstName: regData.fname,
                    lastName: regData.lname,
                    role: regData.role
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Registration successful! You can now log in.");
                toggleModal();
            } else {
                alert(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    // login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                //differentiation sa login
                console.log(data)
                console.log(data.role)
                if (data.role === 'technician') {
                    router.push('/home-tech');
                } else {
                    router.push('/home');
                }
            } else {
                alert(data.message || "Invalid credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Server error. Please try again later.");
        }
    };

    return (
        <>
            <div style={{ position: "relative", backgroundColor: "#070B20", display: "flex" }}>
                {/* Registration Modal */}
                {isModalOpen && (
                    <div className={loginStyles.signUpModal}>
                        <div className={loginStyles.backButtonContainer}>
                            <span onClick={toggleModal} className={loginStyles.backButton}>&lt;</span>
                        </div>
                        <h1>Register Account</h1>
                        <h6>Join LabKoTo now!</h6>

                        <form onSubmit={handleRegister}>
                            <div className={loginStyles.formLayout}>
                                <div className={loginStyles.inputLayout}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div className={loginStyles.formBreak}>
                                            <label className={loginStyles.formLabels} htmlFor="fname">First Name</label><br />
                                            <input className={loginStyles.inputboxes} type="text" name="fname" value={regData.fname} onChange={handleInputChange} required />
                                        </div>
                                        <div className={loginStyles.formBreak}>
                                            <label className={loginStyles.formLabels} htmlFor="lname">Last Name</label><br />
                                            <input className={loginStyles.inputboxes} type="text" name="lname" value={regData.lname} onChange={handleInputChange} required />
                                        </div>
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="email">DLSU Email Address</label><br />
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="email" name="email" value={regData.email} onChange={handleInputChange} required /><br />
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="idNum">ID Number</label><br />
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="text" name="idNum" value={regData.idNum} onChange={handleInputChange} required /><br />
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="pass1">Password</label><br />
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="password" name="pass1" value={regData.pass1} onChange={handleInputChange} required /><br />
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="pass2">Re-enter Password</label><br />
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="password" name="pass2" value={regData.pass2} onChange={handleInputChange} required /><br />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className={loginStyles.confirmButton}>Register</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Left Side: Branding */}
                <div style={{ position: "relative" }}>
                    <img src="../../../curves.png" style={{ height: "100vh", width: "100vh" }} alt="curves" />
                    <h1 className='brand-text' style={{ position: "absolute", top: "45%", left: "30%", fontSize: "80px" }}>LabKoTo</h1>
                </div>

                {/* Right Side: Login Form */}
                <div style={{ position: "relative", width: "100%", backgroundColor: "#FFFFFF" }}>
                    <img src="../../../laboratoryPhoto.png" style={{ height: "100%", width: "100%" }} alt="lab" />
                    <div className={`${loginStyles['form-container']}`}>
                        <h1>Login</h1>
                        <h3>Welcome back! Please login to your account</h3>

                        <form className={loginStyles.labelSpacing} onSubmit={handleLogin}>
                            <label className={loginStyles.textLabels}>Email Address</label>
                            <br />
                            <input
                                className={loginStyles.inputBox}
                                type="text"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                            <br />
                            <label className={`${loginStyles.textLabels} ${loginStyles.labelSpacing}`}>Password</label>
                            <br />
                            <input
                                className={loginStyles.inputBox}
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                            <br />

                            <div className={loginStyles.rememberMeRow}>
                                <label className={loginStyles.rememberMeLabel}>
                                    <input type="checkbox" className={loginStyles.rememberMeCheckbox} />
                                    Remember Me
                                </label>
                                <label className={loginStyles.forgotPassword}>Forgot Password?</label>
                            </div>

                            <div className={loginStyles.subModule}>
                                <input className={loginStyles.confirmButton} type="submit" value="Log In" />
                                <br />
                                <label className={`${loginStyles.textLabels} ${loginStyles.newUser}`}>New User?
                                    <span onClick={toggleModal} className={loginStyles.userSignUp} style={{ cursor: 'pointer' }}> Sign Up</span>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}