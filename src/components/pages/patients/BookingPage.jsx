import React, { useState } from "react";
import SideBar from "../../sideBar";

const therapists = [
  { id: 1, name: "Dr.Kemunto Nyamweya", specialty: "Anxiety & Stress", availableSlots: ["10:00 AM", "2:00 PM", "5:00 PM"] },
  { id: 2, name: "Dr. Njoki Nyamweya", specialty: "Depression & PTSD", availableSlots: ["11:00 AM", "3:00 PM"] },
];

const BookingPage = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("Online");
  const [isOpen, setIsOpen] = useState(false);

  const handleBook = (therapist) => {
    setSelectedTherapist(therapist);
    setIsOpen(true);
  };

  const handleConfirmBooking = () => {
    alert(`Appointment booked with ${selectedTherapist.name} on ${selectedDate.toDateString()} at ${selectedTime} (${sessionType} session)`);
    setIsOpen(false);
  };

  return (
    <SideBar>
      <div style={{ padding: "2rem", maxWidth: "56rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
          Book a Therapy Session
        </h1>
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {therapists.map((therapist) => (
            <div key={therapist.id} style={{ padding: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{therapist.name}</h2>
                <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>{therapist.specialty}</p>
                <button 
                  onClick={() => handleBook(therapist)}
                  style={{ 
                    marginTop: "1rem", 
                    width: "100%", 
                    padding: "0.5rem 1rem", 
                    backgroundColor: "#3b82f6", 
                    color: "white", 
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {isOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              width: "100%",
              maxWidth: "32rem"
            }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Confirm Your Booking</h3>
              </div>
              <p style={{ fontSize: "1.125rem", fontWeight: "500" }}>Therapist: {selectedTherapist?.name}</p>
              
              <input 
                type="date" 
                value={selectedDate.toISOString().split('T')[0]} 
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}
              />
              
              <select 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}
              >
                <option value="">Select a time</option>
                {selectedTherapist?.availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
              
              <select 
                value={sessionType} 
                onChange={(e) => setSessionType(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0", border: "1px solid #e5e7eb", borderRadius: "0.375rem" }}
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
              
              <button 
                onClick={handleConfirmBooking} 
                disabled={!selectedTime}
                style={{ 
                  width: "100%", 
                  marginTop: "1rem", 
                  padding: "0.5rem 1rem", 
                  backgroundColor: "#3b82f6", 
                  color: "white", 
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  opacity: !selectedTime ? 0.5 : 1
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </SideBar>
  );
};

export default BookingPage;