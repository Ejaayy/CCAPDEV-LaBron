import { useState, useEffect, useCallback } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import TopBar from "@/components/edit-reservations/TopBar/TopBar";
import LabCard from "@/components/edit-reservations/LabCard/LabCard";
import RoomSlotsPanel from "@/components/edit-reservations/RoomSlotsPanel/RoomSlotsPanel";
import Panel from "@/components/edit-reservations/Panel/Panel";
import AddRoomModal from "@/components/edit-reservations/AddRoomModal/AddRoomModal";
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
  // useState hooks first
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // auth check effect
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/auth/login");
          return;
        }

        const data = await res.json();

        if (data.role !== "technician") {
          router.push("/home");
          return;
        }

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
    if (!date) {
      setSlots([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/slots?date=${date}&all=true`, {
        credentials: "include",
      });
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
  }, [fetchLabs, user]);

  useEffect(() => {
    if (!user) return;
    fetchSlots();
  }, [fetchSlots, user]);

  // ✅ Early returns AFTER all hooks
  if (loading) return null;
  if (!user) return null;

  // Derived values
  const filteredLabs = labs.filter((lab) => {
    const q = search.toLowerCase();
    return (
      (lab.name || "").toLowerCase().includes(q) ||
      (lab.location || "").toLowerCase().includes(q)
    );
  });

  const slotsForSelectedLab =
    selectedLab && slots.filter((s) => s.lab?._id === selectedLab._id);

  // Handlers
  const handleLabClick = (lab) => {
    setSelectedLab(lab);
    setSelectedSlot(null);
  };

  const handleSlotClick = async (slot) => {
    const lab = slot.lab || selectedLab;
    if (!lab) return;

    try {
      const res = await fetch(
        `${API_BASE}/slots/${slot._id}/occupancy?details=true`,
        { credentials: "include" }
      );
      const data = await safeJson(res);
      const students = data.reservations || [];
      const slotWithStudents = {
        ...slot,
        time: `${slot.startTime || ""} - ${slot.endTime || ""}`.trim(),
        students,
        isBlocked: !slot.isAvailable,
        status: !slot.isAvailable ? "blocked" : undefined,
      };
      setSelectedSlot({ room: lab, slot: slotWithStudents });
    } catch (err) {
      console.error("Failed to fetch slot details:", err);
      setSelectedSlot({
        room: lab,
        slot: {
          ...slot,
          time: `${slot.startTime || ""} - ${slot.endTime || ""}`.trim(),
          students: [],
          isBlocked: !slot.isAvailable,
          status: !slot.isAvailable ? "blocked" : undefined,
        },
      });
    }
  };

  const handleAddSlot = async (startTime, endTime) => {
    if (!selectedLab || !date) return;
    try {
      const res = await fetch(`${API_BASE}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          lab: selectedLab._id,
          date,
          startTime,
          endTime,
        }),
      });
      if (res.ok) {
        await fetchSlots();
      } else {
        const err = await safeJson(res);
        alert(err.message || "Failed to add slot");
      }
    } catch (err) {
      console.error("Failed to add slot:", err);
      alert("Failed to add slot");
    }
  };

  const handleAddRoom = async (labData) => {
    try {
      const res = await fetch(`${API_BASE}/labs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(labData),
      });
      if (res.ok) {
        await fetchLabs();
        setAddRoomModalOpen(false);
      } else {
        const err = await safeJson(res);
        alert(err.message || "Failed to add room");
      }
    } catch (err) {
      console.error("Failed to add room:", err);
      alert("Failed to add room");
    }
  };

  const toggleBlockSlot = async () => {
    if (!selectedSlot) return;
    const slot = selectedSlot.slot;
    const newAvailable = !!slot.isBlocked || slot.status === "blocked";
    try {
      const res = await fetch(`${API_BASE}/slots/${slot._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isAvailable: newAvailable }),
      });
      if (res.ok) {
        await fetchSlots();
        setSelectedSlot((prev) => ({
          ...prev,
          slot: {
            ...prev.slot,
            isBlocked: !newAvailable,
            status: !newAvailable ? "blocked" : undefined,
          },
        }));
      } else {
        const err = await safeJson(res);
        alert(err.message || "Failed to update slot");
      }
    } catch (err) {
      console.error("Failed to block/unblock slot:", err);
      alert("Failed to update slot");
    }
  };

  const addStudent = (student) => {
    if (!selectedSlot) return;
    const newStudent =
      typeof student === "string" ? { name: student, seat: "Unassigned" } : student;
    setSelectedSlot((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: [...(prev.slot.students || []), newStudent],
      },
    }));
  };

  const removeStudent = (studentName) => {
    if (!selectedSlot) return;
    setSelectedSlot((prev) => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: (prev.slot.students || []).filter(
          (s) => (typeof s === "string" ? s : s.name) !== studentName
        ),
      },
    }));
  };

  const editStudent = (index, updatedStudent) => {
    if (!selectedSlot) return;
    const students = [...(selectedSlot.slot.students || [])];
    students[index] = updatedStudent;
    setSelectedSlot((prev) => ({
      ...prev,
      slot: { ...prev.slot, students },
    }));
  };

  const handleBackToSlots = () => {
    setSelectedSlot(null);
  };

  const renderRightPanel = () => {
    if (selectedSlot) {
      return (
        <Panel
          selectedSlot={selectedSlot}
          addStudent={addStudent}
          removeStudent={removeStudent}
          onToggleBlock={toggleBlockSlot}
          onEditStudent={editStudent}
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
          onAddSlot={handleAddSlot}
        />
      );
    }
    return <div className={styles.panelPlaceholder}>Select a room</div>;
  };

  return (
    <div
      style={{
        backgroundColor: "#242738",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <HomeNavbar
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      />

      <img
        src="../../laboratoryPhoto.png"
        style={{
          height: "100vh",
          width: "100%",
          objectFit: "cover",
        }}
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
          setSearch={setSearch}
        />

        <div className={styles.container}>
          <div className={styles.schedule}>
            <div className={styles.addRoomRow}>
              <button
                className={styles.addRoomBtn}
                onClick={() => setAddRoomModalOpen(true)}
              >
                + Add Room
              </button>
            </div>
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab) => (
                <LabCard
                  key={lab._id}
                  lab={lab}
                  isSelected={selectedLab?._id === lab._id}
                  onClick={() => handleLabClick(lab)}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>
                  {search
                    ? `No rooms found matching "${search}"`
                    : "No rooms yet. Add one to get started."}
                </p>
              </div>
            )}
          </div>
          {renderRightPanel()}
        </div>
      </div>

      <AddRoomModal
        isOpen={addRoomModalOpen}
        onClose={() => setAddRoomModalOpen(false)}
        onAddRoom={handleAddRoom}
      />
    </div>
  );
}