import ReserveStyles from '@/styles/ReservePage.module.css'
import HomeNavbar from '@/components/layout/HomeNavbar/HomeNavbar';
import BookingStepper from '@/components/Stepper/Stepper'
import DateSelector from '@/components/DateSelector/DateSelector';
import LabSlotSelector from '@/components/LabSlotSelector/LabSlotSelector';
import SuccessView from "@/components/SuccessView/SuccessView"
import { useState, useEffect } from 'react';
import SeatSelector from '@/components/SeatSelector/SeatSelector';
import { useRouter } from 'next/router';

export default function ReservePage(){

    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedLabSlot, setSelectedLabSlot] = useState(null);
    const [reserveAnonymously, setReserveAnonymously] = useState(false);
    const [user, setUser] = useState(null);
    const totalSteps = 3;
    const { autoSelect } = router.query;

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

    // For success page
    useEffect(() => {
    if (isSubmitted && countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    } else if (isSubmitted && countdown === 0) {
        router.push('/home'); // Redirect to home
    }
    }, [isSubmitted, countdown]);


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

    // for getting user credentials
    useEffect(() => {
        const fetchUser = async () => {
            try {
               
                const response = await fetch('http://localhost:3001/api/auth/me', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // If not logged in, redirect to login page
                    router.push('/auth/login');
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, [router]);

    useEffect(() => {
        const autoPickNextSeat = async () => {
            if (!router.isReady || autoSelect !== 'true' || selectedLabSlot) return;

            try {
                const overviewResponse = await fetch(`http://localhost:3001/api/slots/overview`);
                const countsMap = await overviewResponse.json();

                const upcomingDays = getNextSevenDays().map(day => day.isoDate);
                const targetDayObject = countsMap.find(item => item.count > 0 && upcomingDays.includes(item.date));

                const targetDate = targetDayObject ? targetDayObject.date : selectedDate

                setSelectedDate(targetDate);

                const slotsResponse = await fetch(`http://localhost:3001/api/slots?date=${targetDate}`)
                const slotsData = await slotsResponse.json();

                const firstOpenSlot = slotsData.find(slot => slot.isAvailable !== false) || slotsData[0];

                if (firstOpenSlot) {
                    setSelectedLabSlot(firstOpenSlot);
                    setCurrentStep(2);
                } else{
                    alert("No available slots found in the next 7 days.");
                }

                router.replace('/reserve', undefined, { shallow: true });
            } catch (error) {
                console.error("Auto-selection failed:", error);
            }
        };

        autoPickNextSeat();
    }, [router.isReady, autoSelect, router]);
    
    return(
        <>
        
            <div style={{position: "relative", backgroundColor: "#070B20", display: "flex", flexDirection: "column"}}>
                        <HomeNavbar/>

                        <BookingStepper currentStep={currentStep} />

                        
                        <div className={`${ReserveStyles['main-panel']}`}>
                            {!isSubmitted ? (
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
                                        <SeatSelector 
                                        onSelect={setSelectedSeats} 
                                        selectedSlotId={selectedLabSlot?._id}
                                        labData={selectedLabSlot?.lab}
                                        />
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
                                            router.push('/home');
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
                                              
                                                reservedBy: user?._id, 
                                                reservedFor: user?._id, 
                                                isAnonymous: reserveAnonymously,

                                                // Map selectedSeats array to the schema's slots format
                                                slots: selectedSeats.map(seatId => ({
                                                slot: selectedLabSlot._id, 
                                                seat: seatId
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

                                                    // Reservation success
                                                    setIsSubmitted(true);
                                                 
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
                            ) : (
                                <SuccessView 
                                    labName={selectedLabSlot?.lab?.name} 
                                    date={selectedDate} 
                                    seats={selectedSeats}
                                    countdown={countdown}
                                />
                            )}
                        </div>
            </div>
        
        </>
    )
}