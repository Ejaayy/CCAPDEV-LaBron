import ReserveStyles from '@/styles/ReservePage.module.css'
import HomeNavbar from '@/components/layout/HomeNavbar/HomeNavbar';
import BookingStepper from '@/components/Stepper/Stepper'
import DateSelector from '@/components/DateSelector/DateSelector';
import LabSlotSelector from '@/components/LabSlotSelector/LabSlotSelector';
import { useState, useEffect } from 'react';
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

    const [queryDates, setQueryDates] = useState(getNextSevenDays()); 
    const [selectedDate, setSelectedDate] = useState(queryDates[0].isoDate);

    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);


    useEffect(() => {
        const updateDateCounts = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/slots/overview');
                const countsMap = await response.json(); // Array of {date, count}

                const updatedDates = queryDates.map(dateObj => {
                    const match = countsMap.find(item => item.date === dateObj.isoDate);
                    return {
                        ...dateObj,
                        labs: match ? match.count : 0, 
                        isAvailable: match ? match.count > 0 : false
                    };
                });

                setQueryDates(updatedDates);
            } catch (error) {
                console.error("Failed to load weekly overview:", error);
            }
        };

        updateDateCounts();
    }, []); 


    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/slots?date=${selectedDate}`);
                const data = await response.json();
                setAvailableSlots(data);
            } catch (error) {
                console.error("Failed to fetch slots:", error);
            }
        };

        if (selectedDate) {
            fetchSlots();
        }
    }, [selectedDate]); // dependent on date selection
    

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
                                <DateSelector 
                                    dates={queryDates}
                                    selectedDate={selectedDate} 
                                    onDateSelect={(newDate)=> {
                                        setSelectedDate(newDate)
                                        setSelectedLabSlot(null)
                                    }}
                                />
                                <LabSlotSelector 
                                    slots={availableSlots} 
                                    onSelect={setSelectedLabSlot} 
                                    selectedSlotId={selectedLabSlot?._id} 
                                />
                                </div>
                                )}

                                {currentStep == 2 &&(
                                    <div>
                                        <SeatSelector onSelect={setSelectedSeats} selectedLabId={selectedLabSlot?.lab?.name}/>
                                    </div>
                                )}

                                {currentStep == 3 &&(
                                    <div className={ReserveStyles.summaryContainer}>
                                        <h1>Reservation Summary</h1>
                                        
                                        <div className={ReserveStyles.summaryCard}>
                                            <div className={ReserveStyles.summaryRow}>
                                                <span className={ReserveStyles.summaryLabel}>Laboratory:</span>
                                                <span className={ReserveStyles.summaryValue}>{selectedLabSlot?.lab?.name || 'Not Selected'}</span>
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
                                     onClick={async () => {
                                        if (currentStep === 1 && !selectedLabSlot) {
                                            alert("Please select a laboratory first");
                                        } else if (currentStep < totalSteps) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            // creating reservation
                                            const reservationData = {
                                              
                                                reservedBy: "65f123abc456def789012345", // placeholders
                                                reservedFor: "65f123abc456def789012345", // placeholders
                                                isAnonymous: reserveAnonymously,

                                                // Map selectedSeats array to the schema's slots format
                                                slots: selectedSeats.map(seatId => ({
                                                    // placeholders
                                                    lab: "65f4567890abcdef12345678", 
                                                    seat: seatId,
                                                    startTime: new Date(`${selectedDate}T09:00:00`),
                                                    endTime: new Date(`${selectedDate}T11:00:00`)
                                                }))
                                            };

                                            try {
                                                const response = await fetch('http://localhost:3001/api/reservations', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(reservationData)
                                                });

                                                if (response.ok) {
                                                    const result = await response.json();
                                                    alert("Reservation successfully created in the database!");
                                                } else {
                                                    const error = await response.json();
                                                    alert(`Error: ${error.message}`);
                                                }
                                            } catch (err) {
                                                console.error("Connection failed:", err);
                                                alert("Could not connect to the server.");
                                            }
                                        }
                                    }}
                                     
                                     >
                                        Continue
                                    </div>
                                </div>
                            </div>

                        </div>
            </div>
        
        </>
    )
}