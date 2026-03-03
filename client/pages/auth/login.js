
import loginStyles from './login.module.css';
import {useState} from 'react';
import { useRouter } from 'next/router';

export default function Login(){

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false);
    const [isAdminSelectOpen, setIsAdminSelectOpen] = useState(false);
    const router = useRouter();
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleStudentRegister = (e) => {
        e.preventDefault();
        router.push('/home');
    };

    return(
        <>
            <div style={{position: "relative", backgroundColor: "#070B20", display: "flex"}}>


                {isModalOpen && (
                 
                        
                    <div className={loginStyles.signUpModal}>
                        <div className={loginStyles.backButtonContainer}>
                            <span onClick={toggleModal} className={loginStyles.backButton}>&lt;</span>
                        </div>
                        <h1>Register Account</h1>
                        <h6>Join LabKoTo now!</h6>

                        <form>
                            <div className={loginStyles.formLayout}>
                                    <div className={loginStyles.inputLayout}>
                                    <div style={{ display: 'flex', gap: '16px' }}>

                                        <div className={loginStyles.formBreak}>
                                            <label className={loginStyles.formLabels} htmlFor="fname">First Name</label><br/>
                                            <input className={loginStyles.inputboxes} type="text" id="fname" name="fname" required/>
                                        </div>

                                        <div className={loginStyles.formBreak}>
                                            <label className={loginStyles.formLabels} htmlFor="lname">Last Name</label><br/>
                                            <input className={loginStyles.inputboxes} type="text" id="lname" name="lname" required/>
                                        </div>
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="email">DLSU Email Address</label><br/>
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="text" id="email" name="email" required/><br/>
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="id">ID Number</label><br/>
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="text" id="id" name="id" required/><br/>
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="pass1">Password</label><br/>
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="text" id="pass1" name="pass1" required/><br/>
                                    </div>

                                    <div className={loginStyles.formBreak}>
                                        <label className={loginStyles.formLabels} htmlFor="pass2">Re-enter Password</label><br/>
                                        <input className={loginStyles.inputboxes} style={{ width: '100%' }} type="text" id="pass2" name="pass2" required/><br/>
                                    </div>
                                </div>

                                <div>
                                    <button onClick={handleStudentRegister} className={loginStyles.confirmButton} >  Register </button>
                                </div>
                            </div>
                        </form>
                    </div>
                
                )}
                
         
                <div style={{position: "relative"}}>
                     <img src="../../../curves.png" style={{height: "100vh", width: "100vh"}}/>
                    <h1 className='brand-text' style={{position: "absolute", top:"45%", left:"30%", fontSize: "80px"}}>LabKoTo</h1>
                </div>
               

              
                <div style={{position: "relative", width: "100%", backgroundColor: "#FFFFFF"}}>

                     <img src="../../../laboratoryPhoto.png" style={{height: "100%", width: "100%"}}/>

                    <div className={`${loginStyles['form-container']}`}>
                        <h1>Login</h1>  
                        <h3>Welcome back! Please login to your account</h3>

                        <form className={loginStyles.labelSpacing} action="/home">
                        <label className={loginStyles.textLabels} >Username</label>
                        <br/>
                        <input className={loginStyles.inputBox} type="text" id="username" />
                        <br/>
                        <label className={`${loginStyles.textLabels} ${loginStyles.labelSpacing}`}>Password</label>
                        <br/>
                        <input className={loginStyles.inputBox} type="password" id="password" />
                        <br/>
                        
                        <div className={loginStyles.rememberMeRow}>
                            <label className={loginStyles.rememberMeLabel}>
                                <input type="checkbox" className={loginStyles.rememberMeCheckbox} />
                                Remember Me
                            </label>
                            <label className={loginStyles.forgotPassword}>Forgot Password?</label>
                        </div>
                       
                        <div className={loginStyles.subModule}>
                            <input className={loginStyles.confirmButton} type="submit" value="Log In"></input>
                            <br/>
                            <label className={`${loginStyles.textLabels} ${loginStyles.newUser}`} >New User? 
                            <span onClick={toggleModal} className={loginStyles.userSignUp} style={{cursor: 'pointer'}}> Sign Up</span>
                            </label>
                        </div>
                        
                   </form>
                    </div>
               
                </div>


            </div>
        </>
    )
}