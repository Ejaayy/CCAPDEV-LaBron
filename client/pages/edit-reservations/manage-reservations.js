import { useState, useEffect, useCallback } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import TopBar from "@/components/edit-reservations/TopBar/TopBar";
import LabCard from "@/components/edit-reservations/LabCard/LabCard";
import RoomSlotsPanel from "@/components/edit-reservations/RoomSlotsPanel/RoomSlotsPanel";
import Panel from "@/components/edit-reservations/Panel/Panel";
import AddRoomModal from "@/components/edit-reservations/AddRoomModal/AddRoomModal";
import SelectStudent from "@/components/home/SelectStudents"; 
import SeatSelector from "@/components/SeatSelector/SeatSelector";
import styles from "./ManageReservations.module.css";
import { useRouter } from "next/router";

const API_BASE = "http://localhost:3001/api";

async function safeJson(res) {
  const text = await res.text();
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(
      `Expected JSON but got ${ct.split(";")[0] || "HTML"}. Is the API server running on port 3001?`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server");
  }
}

export default function ManageReservations() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [pendingStudent, setPendingStudent] = useState(null);
  const [pendingSeats, setPendingSeats] = useState([]);

  const router = useRouter();

  // Authentication check
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
        if (!res.ok) return router.push("/auth/login");
        
        const data = await res.json();
        if (data.role !== "technician") return router.push("/home");
        
        setUser(data);
      } catch (err) {
        console.error(err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [router]);

  useEffect(() => {
    if (router.isReady && router.query.building) {
      setSearch(router.query.building);
    }
  }, [router.isReady, router.query.building]);

  const fetchLabs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/labs`, { credentials: "include" });
      const data = await safeJson(res);
      setLabs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch labs:", err);
      setLabs([]);
    }
  }, []);

  const fetchSlots = useCallback(async () => {
    if (!date) return setSlots([]);
    try {
      const res = await fetch(`${API_BASE}/slots?date=${date}&all=true`, { credentials: "include" });
      const data = await safeJson(res);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setSlots([]);
    }
  }, [date]);

  useEffect(() => {
    if (!user) return;
    fetchLabs();
    fetchSlots();
  }, [fetchLabs, fetchSlots, user]);

  if (loading || !user) return null;

  const filteredLabs = labs.filter((lab) => {
    const q = search.toLowerCase();
    return (lab.name || "").toLowerCase().includes(q) || (lab.location || "").toLowerCase().includes(q);
  });

  const slotsForSelectedLab = selectedLab && slots.filter((s) => s.lab?._id === selectedLab._id);

  const handleLabClick = (lab) => {
    setSelectedLab(lab);
    setSelectedSlot(null);
  };

  const handleSlotClick = async (slot) => {
    const lab = slot.lab || selectedLab;
    if (!lab) return;

    try {
      const res = await fetch(`${API_BASE}/slots/${slot._id}/occupancy?details=true`, { credentials: "include" });
      const data = await safeJson(res);
      const students = data.reservations || [];
      setSelectedSlot({
        room: lab,
        slot: {
          ...slot,
          time: `${slot.startTime || ""} - ${slot.endTime || ""}`.trim(),
          students,
          isBlocked: !slot.isAvailable,
          status: !slot.isAvailable ? "blocked" : undefined,
        }
      });
    } catch (err) {
      console.error("Failed to fetch slot details:", err);
    }
  };

  // FIX: No optimistic update — wait for DB to confirm before refreshing UI
  // This ensures SeatSelector always sees accurate committed data when it remounts
  const submitReservation = async () => {
    if (!pendingStudent || pendingSeats.length === 0 || !selectedSlot) return;

    const targetSeat = pendingSeats[0];

    const newStudent = { 
      _id: pendingStudent._id, 
      name: `${pendingStudent.firstName} ${pendingStudent.lastName}`, 
      seat: targetSeat
    };

    // Close modal immediately so UX feels responsive
    setIsStudentSelectorOpen(false);
    setPendingStudent(null);
    setPendingSeats([]);

    try {
      const res = await fetch(`${API_BASE}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          reservedFor: newStudent._id,
          reservedBy: user._id,
          slots: [{ slot: selectedSlot.slot._id, seat: targetSeat }],
          status: "active",
          isAnonymous: false
        }),
      });  
      
      if (!res.ok) {
        const errorData = await res.text(); 
        console.error("BACKEND REJECTION REASON:", errorData);
        throw new Error(`Backend rejected: ${res.status} - ${errorData}`);
      }

      //  Only refresh AFTER DB confirms — SeatSelector remounts with fresh data
      await handleSlotClick(selectedSlot.slot);

    } catch (err) {
      console.error("Error saving student to slot:", err.message);
      alert(`Failed to add student: ${err.message}`);
    }
  };

  const removeStudent = async (studentId, reservationId) => {
 
    if (!selectedSlot) return;

    const previousStudents = [...(selectedSlot.slot.students || [])];

    // Optimistic UI Update
    setSelectedSlot((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: prev.slot.students.filter(
          s => s._id !== studentId || s.reservationId !== reservationId
        ),
      },
    }));

    try {
      const res = await fetch(`${API_BASE}/reservations/${reservationId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove student from DB");

    } catch (err) {
      console.error("Failed to remove student:", err);
      alert("Failed to remove student. Reverting changes.");
      setSelectedSlot((prev) => ({
        ...prev,
        slot: { ...prev.slot, students: previousStudents }
      }));
    }
  };

  const handleBackToSlots = () => setSelectedSlot(null);

  const renderRightPanel = () => {
    console.log("USER ROLE:", user?.role);
    if (selectedSlot) {
      return (
        <Panel
          selectedSlot={selectedSlot}
          onOpenStudentSelector={() => setIsStudentSelectorOpen(true)}
          removeStudent={removeStudent}
          onBack={handleBackToSlots}
          
        />
      );
    }
    if (selectedLab) {
      return (
        <RoomSlotsPanel
          lab={selectedLab}
          slots={slotsForSelectedLab || []}
          selectedSlot={selectedSlot}
          date={date}
          onSlotClick={handleSlotClick}
        />
      );
    }
    return <div className={styles.panelPlaceholder}>Select a room</div>;
  };

  return (
    <div style={{ backgroundColor: "#242738", position: "relative", minHeight: "100vh" }}>
      <HomeNavbar style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }} />

      <img src="../../laboratoryPhoto.png" style={{ height: "100vh", width: "100%", objectFit: "cover" }} alt="Laboratory" />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", marginTop: "100px" }}>
        <TopBar date={date} setDate={setDate} search={search} setSearch={setSearch} />

        <div className={styles.container}>
          <div className={styles.schedule}>
            {filteredLabs.map((lab) => (
                <LabCard key={lab._id} lab={lab} isSelected={selectedLab?._id === lab._id} onClick={() => handleLabClick(lab)} />
            ))}
          </div>
          {renderRightPanel()}
        </div>
      </div>

      {isStudentSelectorOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#242738", padding: "20px", borderRadius: "12px", position: "relative",
            maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", minWidth: "500px"
          }}>
            <button 
              onClick={() => {
                setIsStudentSelectorOpen(false);
                setPendingStudent(null);
                setPendingSeats([]);
              }}
              style={{ position: "absolute", top: "15px", right: "15px", background: "transparent", border: "none", color: "white", fontSize: "20px", cursor: "pointer", zIndex: 10 }}
            >✕</button>

            {/* STEP 1: PICK STUDENT */}
            {!pendingStudent ? (
              <SelectStudent 
                currentUserId={user._id} 
                onSelectStudent={(student) => setPendingStudent(student)} 
              />
            ) : (
              /* STEP 2: PICK SEAT */
              <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
                <h3 style={{ marginBottom: "20px" }}>
                  Select Seat for {pendingStudent.firstName} {pendingStudent.lastName}
                </h3>
                
                {/* FIX: key prop forces SeatSelector to remount and re-fetch
                    fresh occupancy data from the DB after every reservation */}
                <SeatSelector
                  key={selectedSlot.slot.students.length}
                  selectedSlotId={selectedSlot.slot._id} 
                  labData={selectedLab} 
                  onSelect={(seats) => setPendingSeats(seats)} 
                />

                <button 
                  onClick={submitReservation}
                  disabled={pendingSeats.length === 0}
                  style={{
                    marginTop: "20px", padding: "12px 24px", backgroundColor: pendingSeats.length === 0 ? "#555" : "#4CAF50",
                    color: "white", border: "none", borderRadius: "6px", cursor: pendingSeats.length === 0 ? "not-allowed" : "pointer",
                    fontSize: "16px", fontWeight: "bold", width: "100%"
                  }}
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}