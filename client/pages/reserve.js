import ReserveStyles from '@/styles/ReservePage.module.css'
import HomeNavbar from '@/components/layout/HomeNavbar/HomeNavbar';
import BookingStepper from '@/components/Stepper/Stepper'
import DateSelector from '@/components/DateSelector/DateSelector';
import LabSlotSelector from '@/components/SlotSelector/SlotSelector';
import { useState } from 'react';
import SeatSelector from '@/components/SeatSelector/SeatSelector';

export default function ReservePage(){


    const [currentStep, setCurrentStep] = useState(1);
    const [reserveAnonymously, setReserveAnonymously] = useState(false);
    const totalSteps = 3;

    return(
        <>
        
            <div style={{position: "relative", backgroundColor: "#070B20", display: "flex", flexDirection: "column"}}>
                        <HomeNavbar/>

                        <BookingStepper currentStep={currentStep} />

                        
                        <div className={`${ReserveStyles['main-panel']}`}>
                            
                            <div className={`${ReserveStyles['selection-panel']}`}>

                                {currentStep == 1 && (
                                
                                <div>
                                <h1>Select your Laboratory booking date</h1>
                                <DateSelector/>
                                <LabSlotSelector/>
                                </div>
                                )}

                                {currentStep == 2 &&(
                                    <div>
                                        <SeatSelector/>
                                    </div>
                                )}

                                {currentStep == 3 &&(
                                    <div className={ReserveStyles.summaryContainer}>
                                        <h1>Reservation Summary</h1>
                                        
                                        <div className={ReserveStyles.summaryCard}>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Laboratory:</span>
                                                <span className={ReserveStyles.summaryValue}>Gokongwei Computer Lab G403</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Date:</span>
                                                <span className={ReserveStyles.summaryValue}>February 15, 2026</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Time Slot:</span>
                                                <span className={ReserveStyles.summaryValue}>09:00 AM - 11:00 AM</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Seat Number:</span>
                                                <span className={ReserveStyles.summaryValue}>A-12</span>
                                            </div>
                                        </div>

                                        <div className={ReserveStyles.anonymousCheckbox}>
                                            <label className={ReserveStyles.checkboxLabel}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={reserveAnonymously}
                                                    onChange={(e) => setReserveAnonymously(e.target.checked)}
                                                    className={ReserveStyles.checkbox}
                                                />
                                                <span className={ReserveStyles.checkmark}></span>
                                                Reserve Anonymously
                                            </label>
                                            <p className={ReserveStyles.anonymousHint}>
                                                Your name will not be visible to other students in this reservation.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <hr className={`${ReserveStyles['divider']}`} />
                                <div className={`${ReserveStyles['footer-button-panel']}`}>
                                    <div className={`${ReserveStyles['back-button']}`}
                                    onClick={() => {
                                        if (currentStep > 0) {
                                            setCurrentStep(currentStep - 1);
                                        } else {
                                            alert("Cancelled booking");
                                        }
                                    }}>
                                        Back
                                    </div>

                                    <div className={`${ReserveStyles['continue-button']}`}
                                     onClick={() => {
                                        if (currentStep < totalSteps) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            alert("Booking Confirmed!");
                                        }
                                    }}>
                                        Continue
                                    </div>
                                </div>
                            </div>

                        </div>
            </div>
        
        </>
    )
}