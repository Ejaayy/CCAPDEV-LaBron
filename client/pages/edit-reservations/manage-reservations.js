import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import EditReservationModal from "@/components/reservations-management/EditReservationModal/EditReservationModal";
import TopBar from "@/components/reservations-management/TopBar/TopBar";
import LabCard from "@/components/reservations-management/LabCard/LabCard";
import RoomSlotsPanel from "@/components/reservations-management/RoomSlotsPanel/RoomSlotsPanel";
import Panel from "@/components/reservations-management/Panel/Panel";
import AddRoomModal from "@/components/reservations-management/AddRoomModal/AddRoomModal";
import SelectStudent from "@/components/dashboard/student/SelectStudents";
import SeatSelector from "@/components/reservation/SeatSelector/SeatSelector";
import styles from "./ManageReservations.module.css";

import useAuth from "@/hooks/useAuth";
import useLabs from "@/hooks/useLabs";
import { useSlotsByDate } from "@/hooks/useSlots";
import {
  cancelNoShowReservation,
  createReservation,
  updateReservationStatus,
  updateReservationSeats,
} from "@/lib/reservations";
import { createSlot, getSlotOccupancy } from "@/lib/slots";
import { createLab } from "@/lib/labs";

export default function ManageReservations() {
  const router = useRouter();
  const buildingQuery =
    router.isReady && typeof router.query.building === "string"
      ? router.query.building
      : "";

  const { user, loading: userLoading } = useAuth();
  const { labs, loading: labsLoading, setLabs } = useLabs();

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [searchInput, setSearchInput] = useState("");
  const [hasTouchedSearch, setHasTouchedSearch] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const [pendingStudent, setPendingStudent] = useState(null);
  const [pendingSeats, setPendingSeats] = useState([]);

  const {
    slots,
    loading: slotsLoading,
    setSlots,
  } = useSlotsByDate(date, { all: true });
  const search = hasTouchedSearch ? searchInput : buildingQuery;

  useEffect(() => {
    if (!userLoading && user && user.role !== "technician") {
      router.push("/home");
    }
  }, [userLoading, user, router]);

  const filteredLabs = useMemo(() => {
    const q = search.toLowerCase();

    return labs.filter((lab) => {
      return (
        (lab.name || "").toLowerCase().includes(q) ||
        (lab.location || "").toLowerCase().includes(q)
      );
    });
  }, [labs, search]);

  const slotsForSelectedLab = useMemo(() => {
    if (!selectedLab) return [];
    return slots.filter((slot) => slot.lab?._id === selectedLab._id);
  }, [slots, selectedLab]);

  const handleLabClick = (lab) => {
    setSelectedLab(lab);
    setSelectedSlot(null);
  };

  const handleSlotClick = useCallback(
    async (slot) => {
      const lab = slot.lab || selectedLab;
      if (!lab) return;

      try {
        const data = await getSlotOccupancy(slot._id, { details: true });
        const students = data?.reservations || [];

        setSelectedSlot({
          room: lab,
          slot: {
            ...slot,
            time: `${slot.startTime || ""} - ${slot.endTime || ""}`.trim(),
            students,
            isBlocked: !slot.isAvailable,
            status: !slot.isAvailable ? "blocked" : undefined,
            canCancelNoShow: Boolean(data?.canCancelNoShow),
            noShowEligibleAt: data?.noShowEligibleAt || null,
            noShowCutoffAt: data?.noShowCutoffAt || null,
          },
        });
      } catch (err) {
        console.error("Failed to fetch slot details:", err);
      }
    },
    [selectedLab]
  );

  const handleAddSlot = useCallback(
    async ({ startTime, endTime }) => {
      if (!selectedLab || !date) return;

      try {
        const createdSlot = await createSlot({
          lab: selectedLab._id,
          date,
          startTime,
          endTime,
        });

        setSlots((prev) =>
          [...prev, { ...createdSlot, lab: selectedLab }].sort((a, b) =>
            (a.startTime || "").localeCompare(b.startTime || "")
          )
        );
      } catch (err) {
        console.error("Failed to create slot:", err);
        throw err;
      }
    },
    [selectedLab, date, setSlots]
  );

  const handleAddRoom = async (roomData) => {
    try {
      const createdLab = await createLab(roomData);

      setLabs((prev) =>
        [...prev, createdLab].sort((a, b) => {
          const aLabel = `${a.location || ""} ${a.name || ""}`.trim();
          const bLabel = `${b.location || ""} ${b.name || ""}`.trim();
          return aLabel.localeCompare(bLabel);
        })
      );

      setSelectedLab(createdLab);
      setSelectedSlot(null);
    } catch (err) {
      console.error("Failed to create room:", err);
      throw err;
    }
  };

  const handleSubmitReservation = async () => {
    if (!pendingStudent || pendingSeats.length === 0 || !selectedSlot || !user) return;

    const targetSeat = pendingSeats[0];

    setIsStudentSelectorOpen(false);
    setPendingStudent(null);
    setPendingSeats([]);

    try {
      await createReservation({
        reservedFor: pendingStudent._id,
        reservedBy: user._id,
        slots: [{ slot: selectedSlot.slot._id, seat: targetSeat }],
        status: "active",
        isAnonymous: false,
      });

      await handleSlotClick(selectedSlot.slot);
    } catch (err) {
      console.error("Error saving student to slot:", err);
      alert(err.message || "Failed to add student.");
    }
  };

  const handleEditReservation = (reservation) => {
    if (!selectedSlot) return;

    setEditingReservation({
      ...reservation,
      slotId: selectedSlot.slot._id,
      laboratory: selectedSlot.room?.name || "Unknown Lab",
      reservationTime: selectedSlot.slot?.time || "N/A",
      rawDate: selectedSlot.slot?.date || null,
      availableSeats: selectedSlot.room?.seats || [],
    });
  };

  const handleEditReservationConfirm = async (newSeats) => {
    if (!editingReservation || !selectedSlot) return;

    try {
      await updateReservationSeats(editingReservation.reservationId, newSeats);
      setEditingReservation(null);
      await handleSlotClick(selectedSlot.slot);
    } catch (err) {
      console.error("Failed to update reservation:", err);
      alert(err.message || "Failed to update reservation.");
    }
  };

  const handleRemoveStudent = async (reservationId) => {
    if (!selectedSlot) return;

    const previousStudents = [...(selectedSlot.slot.students || [])];

    setSelectedSlot((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: prev.slot.students.filter((student) => student.reservationId !== reservationId),
      },
    }));

    try {
      await cancelNoShowReservation(reservationId);
    } catch (err) {
      console.error("Failed to remove student:", err);
      alert(err.message || "Failed to remove student. Reverting changes.");

      setSelectedSlot((prev) => ({
        ...prev,
        slot: {
          ...prev.slot,
          students: previousStudents,
        },
      }));
    }
  };

  const handleToggleCancelled = async (student) => {
    if (!selectedSlot) return;

    const previousStudents = [...(selectedSlot.slot.students || [])];
    const nextStatus = student.status === "cancelled" ? "active" : "cancelled";

    setSelectedSlot((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: prev.slot.students.map((item) =>
          item.reservationId === student.reservationId
            ? { ...item, status: nextStatus }
            : item
        ),
      },
    }));

    try {
      await updateReservationStatus(student.reservationId, nextStatus);
      await handleSlotClick(selectedSlot.slot);
    } catch (err) {
      console.error("Failed to update reservation status:", err);
      alert(err.message || "Failed to update reservation status.");

      setSelectedSlot((prev) => ({
        ...prev,
        slot: {
          ...prev.slot,
          students: previousStudents,
        },
      }));
    }
  };

  const handleBackToSlots = () => {
    setSelectedSlot(null);
  };

  const renderRightPanel = () => {
    if (selectedSlot) {
      return (
        <Panel
          selectedSlot={selectedSlot}
          onOpenStudentSelector={() => setIsStudentSelectorOpen(true)}
          onEditReservation={handleEditReservation}
          onToggleCancelled={handleToggleCancelled}
          removeStudent={handleRemoveStudent}
          onBack={handleBackToSlots}
          user={user}
        />
      );
    }

    if (selectedLab) {
      return (
        <RoomSlotsPanel
          lab={selectedLab}
          slots={slotsForSelectedLab}
          selectedSlot={selectedSlot}
          date={date}
          onSlotClick={handleSlotClick}
          onAddSlot={handleAddSlot}
        />
      );
    }

    if (slotsLoading) {
      return <div className={styles.panelPlaceholder}>Loading slots...</div>;
    }

    return <div className={styles.panelPlaceholder}>Select a room</div>;
  };

  if (userLoading || labsLoading) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#242738", position: "relative", minHeight: "100vh" }}>
      <HomeNavbar
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      />

      <img
        src="../../laboratoryPhoto.png"
        style={{ height: "100vh", width: "100%", objectFit: "cover" }}
        alt="Laboratory"
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          marginTop: "100px",
        }}
      >
        <TopBar
          date={date}
          setDate={setDate}
          search={search}
          setSearch={(value) => {
            setHasTouchedSearch(true);
            setSearchInput(value);
          }}
        />

        <div className={styles.container}>
          <div className={styles.schedule}>
            <button
              type="button"
              onClick={() => setIsAddRoomModalOpen(true)}
              style={{
                marginBottom: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              + Add Room
            </button>

            {filteredLabs.map((lab) => (
              <LabCard
                key={lab._id}
                lab={lab}
                isSelected={selectedLab?._id === lab._id}
                onClick={() => handleLabClick(lab)}
              />
            ))}
          </div>

          {renderRightPanel()}
        </div>
      </div>

      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onAddRoom={handleAddRoom}
      />

      {isStudentSelectorOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#242738",
              padding: "20px",
              borderRadius: "12px",
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
              minWidth: "500px",
            }}
          >
            <button
              onClick={() => {
                setIsStudentSelectorOpen(false);
                setPendingStudent(null);
                setPendingSeats([]);
              }}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              X
            </button>

            {!pendingStudent ? (
              <SelectStudent
                currentUserId={user?._id}
                onSelectStudent={(student) => setPendingStudent(student)}
              />
            ) : (
              <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
                <h3 style={{ marginBottom: "20px" }}>
                  Select Seat for {pendingStudent.firstName} {pendingStudent.lastName}
                </h3>

                <SeatSelector
                  key={selectedSlot?.slot?.students?.length || 0}
                  selectedSlotId={selectedSlot?.slot?._id}
                  labData={selectedLab}
                  onSelect={(seats) => setPendingSeats(seats)}
                />

                <button
                  onClick={handleSubmitReservation}
                  disabled={pendingSeats.length === 0}
                  style={{
                    marginTop: "20px",
                    padding: "12px 24px",
                    backgroundColor: pendingSeats.length === 0 ? "#555" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: pendingSeats.length === 0 ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    width: "100%",
                  }}
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          onClose={() => setEditingReservation(null)}
          onConfirm={handleEditReservationConfirm}
        />
      )}
    </div>
  );
}
