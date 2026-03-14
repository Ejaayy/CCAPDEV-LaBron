import ReserveStyles from '@/styles/ReservePage.module.css'
import HomeNavbar from '@/components/layout/HomeNavbar/HomeNavbar';
import BookingStepper from '@/components/Stepper/Stepper'
import DateSelector from '@/components/DateSelector/DateSelector';
import LabSlotSelector from '@/components/LabSlotSelector/LabSlotSelector';
import { useState } from 'react';
import SeatSelector from '@/components/SeatSelector/SeatSelector';

export default function ReservePage(){


    const [currentStep, setCurrentStep] = useState(1);
    const [selectedLabSlot, setSelectedLabSlot] = useState(null);
    const [reserveAnonymously, setReserveAnonymously] = useState(false);
    const totalSteps = 3;

    // Helper function to calculate display for next 7 days
    const getNextSevenDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);

        days.push({
        displayDay: dayNames[d.getDay()],
        displayDate: `${d.getDate().toString().padStart(2, '0')} ${monthNames[d.getMonth()]}`,
        isoDate: d.toISOString().split('T')[0], // example format:  "2026-03-11"
        isAvailable: true,
        labs: 4
        });
    }
    return days;
    };

    const [queryDates] = useState(getNextSevenDays()); 
    const [selectedDate, setSelectedDate] = useState(queryDates[0].isoDate);
    const [selectedSeats, setSelectedSeats] = useState(null);

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
                                <DateSelector dates={queryDates} selectedDate={selectedDate} onDateSelect={(newDate)=>setSelectedDate(newDate)}/>
                                <LabSlotSelector onSelect={setSelectedLabSlot} selectedLabId={selectedLabSlot?.id} />
                                </div>
                                )}

                                {currentStep == 2 &&(
                                    <div>
                                        <SeatSelector onSelect={setSelectedSeats} selectedLabId={selectedLabSlot?.id}/>
                                    </div>
                                )}

                                {currentStep == 3 &&(
                                    <div className={ReserveStyles.summaryContainer}>
                                        <h1>Reservation Summary</h1>
                                        
                                        <div className={ReserveStyles.summaryCard}>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Laboratory:</span>
                                                <span className={ReserveStyles.summaryValue}>{selectedLabSlot.id}</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Date:</span>
                                                <span className={ReserveStyles.summaryValue}>{selectedDate}</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Time Slot:</span>
                                                <span className={ReserveStyles.summaryValue}>09:00 AM - 11:00 AM</span>
                                            </div>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Seat Number:</span>
                                                <span className={ReserveStyles.summaryValue}>{selectedSeats && selectedSeats.length > 0 
                                                ? selectedSeats.join(', ') 
                                                : 'None selected'}</span>
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
                                        if (currentStep > 1) {
                                            setCurrentStep(currentStep - 1);
                                        }else {
                                            alert("Cancelled booking"); 
                                        }
                                    }}>
                                        Back
                                    </div>

                                    <div className={`${ReserveStyles['continue-button']}`}
                                     onClick={() => {
                                        if (currentStep == 1 && !selectedLabSlot){
                                            alert("Please select a laboratory first");
                                        } else if (currentStep < totalSteps) {
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