import { useState } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import TopBar from "@/components/edit-reservations/TopBar/TopBar";
import RoomCard from "@/components/edit-reservations/RoomCard/RoomCard";
import Panel from "@/components/edit-reservations/Panel/Panel";
import styles from "./ManageReservations.module.css";

export default function Dashboard() {
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [rooms, setRooms] = useState([
    {
      name: "Room A",
      capacity: 30,
      slots: [
        { time: "0730–0900", status: "available", students: [{ name: "Juan Dela Cruz", seat: "A-01" }], isBlocked: false },
        { time: "9300–1100", status: "full", students: [{ name: "Maria Santos", seat: "A-02" }], isBlocked: false },
        { time: "1130–1300", status: "almost-full", students: [{ name: "Alex Lim", seat: "A-03" }], isBlocked: false },
        { time: "1330–1500", status: "available", students: [], isBlocked: false },
        { time: "1530–1700", status: "available", students: [], isBlocked: false },
        { time: "1730–1900", status: "full", students: [{ name: "Sample Student", seat: "A-04" }], isBlocked: false },
      ],
    },
    {
      name: "Room B",
      capacity: 20,
      slots: [
        { time: "0730–0900", status: "full", students: [{ name: "Juan Dela Cruz", seat: "B-01" }], isBlocked: false },
        { time: "9300–1100", status: "full", students: [{ name: "Maria Santos", seat: "B-02" }], isBlocked: false },
        { time: "1130–1300", status: "available", students: [], isBlocked: false },
        { time: "1330–1500", status: "available", students: [], isBlocked: false },
        { time: "1530–1700", status: "almost-full", students: [{ name: "Alex Lim", seat: "B-03" }], isBlocked: false },
        { time: "1730–1900", status: "available", students: [], isBlocked: false },
      ],
    },
    {
      name: "Room C",
      capacity: 25,
      slots: [
        { time: "0730–0900", status: "available", students: [], isBlocked: false },
        { time: "9300–1100", status: "almost-full", students: [{ name: "Ana Garcia", seat: "C-01" }], isBlocked: false },
        { time: "1130–1300", status: "full", students: [{ name: "Pedro Reyes", seat: "C-02" }, { name: "Sofia Cruz", seat: "C-03" }], isBlocked: false },
        { time: "1330–1500", status: "available", students: [], isBlocked: false },
        { time: "1530–1700", status: "full", students: [{ name: "Carlos Mendoza", seat: "C-04" }], isBlocked: false },
        { time: "1730–1900", status: "available", students: [], isBlocked: false },
      ],
    },
    {
      name: "Room D",
      capacity: 35,
      slots: [
        { time: "0730–0900", status: "almost-full", students: [{ name: "Elena Ramos", seat: "D-01" }], isBlocked: false },
        { time: "9300–1100", status: "available", students: [], isBlocked: false },
        { time: "1130–1300", status: "available", students: [], isBlocked: false },
        { time: "1330–1500", status: "full", students: [{ name: "Miguel Torres", seat: "D-02" }], isBlocked: false },
        { time: "1530–1700", status: "available", students: [], isBlocked: false },
        { time: "1730–1900", status: "almost-full", students: [{ name: "Isabella Fernandez", seat: "D-03" }], isBlocked: false },
      ],
    },
    {
      name: "Room E",
      capacity: 40,
      slots: [
        { time: "0730–0900", status: "full", students: [{ name: "David Martinez", seat: "E-01" }, { name: "Laura Gonzales", seat: "E-02" }], isBlocked: false },
        { time: "9300–1100", status: "available", students: [], isBlocked: false },
        { time: "1130–1300", status: "almost-full", students: [{ name: "Roberto Silva", seat: "E-03" }], isBlocked: false },
        { time: "1330–1500", status: "available", students: [], isBlocked: false },
        { time: "1530–1700", status: "available", students: [], isBlocked: false },
        { time: "1730–1900", status: "full", students: [{ name: "Carmen Diaz", seat: "E-04" }], isBlocked: false },
      ],
    },
  ]);

  const handleSlotClick = (room, slot) => {
    setSelectedSlot({ room, slot });
  };

  // Filter rooms based on search query
  const filteredRooms = rooms.filter(room => {
    const searchLower = search.toLowerCase();
    
    // Match room name
    if (room.name.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Match student names within slots
    const hasMatchingStudent = room.slots.some(slot => 
      slot.students.some(student => {
        const studentName = typeof student === 'string' ? student : student.name;
        return studentName.toLowerCase().includes(searchLower);
      })
    );
    
    return hasMatchingStudent;
  });

  const addStudent = (student) => {
    if (!student || !selectedSlot) return;

    const newStudent = typeof student === 'string' 
      ? { name: student, seat: 'Unassigned' } 
      : student;

    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.name === selectedSlot.room.name) {
          return {
            ...room,
            slots: room.slots.map(slot => {
              if (slot.time === selectedSlot.slot.time) {
                return {
                  ...slot,
                  students: [...slot.students, newStudent]
                };
              }
              return slot;
            })
          };
        }
        return room;
      })
    );

    // Update the selected slot state
    setSelectedSlot(prev => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: [...prev.slot.students, newStudent]
      }
    }));
  };

  const removeStudent = (studentName) => {
    if (!selectedSlot) return;

    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.name === selectedSlot.room.name) {
          return {
            ...room,
            slots: room.slots.map(slot => {
              if (slot.time === selectedSlot.slot.time) {
                return {
                  ...slot,
                  students: slot.students.filter(s => 
                    (typeof s === 'string' ? s : s.name) !== studentName
                  )
                };
              }
              return slot;
            })
          };
        }
        return room;
      })
    );

    // Update the selected slot state
    setSelectedSlot(prev => ({
      ...prev,
      slot: {
        ...prev.slot,
        students: prev.slot.students.filter(s => 
          (typeof s === 'string' ? s : s.name) !== studentName
        )
      }
    }));
  };

  const editStudent = (index, updatedStudent) => {
    if (!selectedSlot) return;

    setRooms(prevRooms =>
      prevRooms.map(room => {
        if (room.name === selectedSlot.room.name) {
          return {
            ...room,
            slots: room.slots.map(slot => {
              if (slot.time === selectedSlot.slot.time) {
                const updatedStudents = [...slot.students];
                updatedStudents[index] = updatedStudent;
                return {
                  ...slot,
                  students: updatedStudents
                };
              }
              return slot;
            })
          };
        }
        return room;
      })
    );

    // Update the selected slot state
    setSelectedSlot(prev => {
      const updatedStudents = [...prev.slot.students];
      updatedStudents[index] = updatedStudent;
      return {
        ...prev,
        slot: {
          ...prev.slot,
          students: updatedStudents
        }
      };
    });
  };

  const toggleBlockSlot = () => {
    if (!selectedSlot) return;
    
    setRooms(prevRooms => 
      prevRooms.map(room => {
        if (room.name === selectedSlot.room.name) {
          return {
            ...room,
            slots: room.slots.map(slot => {
              if (slot.time === selectedSlot.slot.time) {
                const newBlockedState = !slot.isBlocked;
                return {
                  ...slot,
                  isBlocked: newBlockedState,
                  status: newBlockedState ? 'blocked' : (slot.students.length === 0 ? 'available' : slot.status)
                };
              }
              return slot;
            })
          };
        }
        return room;
      })
    );

    // Update the selected slot state
    setSelectedSlot(prev => ({
      ...prev,
      slot: {
        ...prev.slot,
        isBlocked: !prev.slot.isBlocked,
        status: !prev.slot.isBlocked ? 'blocked' : (prev.slot.students.length === 0 ? 'available' : prev.slot.status)
      }
    }));
  };

  return (
    <div
      style={{
        backgroundColor: "#242738",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <HomeNavbar style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }} />

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
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room, i) => (
                <RoomCard
                  key={i}
                  room={room}
                  onSlotClick={handleSlotClick}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <p>No rooms found matching &ldquo;{search}&rdquo;</p>
              </div>
            )}
          </div>
          <Panel 
            selectedSlot={selectedSlot} 
            addStudent={addStudent}
            removeStudent={removeStudent}
            onToggleBlock={toggleBlockSlot}
            onEditStudent={editStudent}
          />
        </div>
      </div>
    </div>
  );
}
