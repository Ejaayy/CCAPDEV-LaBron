import SuccessStyles from "@/components/SuccessView/SuccessView.module.css"

export default function SuccessView({ labName, date, seats, countdown }){

    return(
        <div className={SuccessStyles.successContainer}>
        <div className={SuccessStyles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 9L10 17L6 13" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <h1 className={SuccessStyles.successTitle}>Reservation Confirmed!</h1>
        <p className={SuccessStyles.successSubtitle}>
            Your spot at <strong>{labName}</strong> has been secured.
        </p>
        
        <hr className={SuccessStyles.divider}/>

        <div className={SuccessStyles.miniSummary}>
            <p><span className={SuccessStyles.titles}>Date:</span> {date}</p>
            <p><span className={SuccessStyles.titles}>Seats:</span> {seats.join(', ')}</p>
        </div>

        <div className={SuccessStyles.redirectNotice}>
            Redirecting to home in <span>{countdown}s</span>...
        </div>
        
        <button className={SuccessStyles.homeButton} onClick={() => window.location.href='/home'}>
            Go Home Now
        </button>
    </div>
    )
}