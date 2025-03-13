// Kiểm tra xem slot thời gian có bị trùng với các lịch hẹn hiện tại không
export function isTimeSlotAvailable(
  staffId: string,
  date: string, 
  startTime: string, 
  endTime: string,
  appointments: DatLich.Appointment[],
  excludeAppointmentId?: string // Loại trừ chính lịch hẹn đang chỉnh sửa
): boolean {
  const staffAppointments = appointments.filter(
    a => a.staffId === staffId && 
         a.date === date && 
         a.id !== excludeAppointmentId
  );

  // Chuyển startTime và endTime thành số phút từ 00:00
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Kiểm tra xem có trùng với bất kỳ cuộc hẹn nào không
  for (const appointment of staffAppointments) {
    const appointmentStart = timeToMinutes(appointment.startTime);
    const appointmentEnd = timeToMinutes(appointment.endTime);

    // Kiểm tra trùng lặp
    if (
      (startMinutes >= appointmentStart && startMinutes < appointmentEnd) ||
      (endMinutes > appointmentStart && endMinutes <= appointmentEnd) ||
      (startMinutes <= appointmentStart && endMinutes >= appointmentEnd)
    ) {
      return false;
    }
  }

  return true;
}

// Chuyển đổi thời gian từ định dạng "HH:MM" sang số phút kể từ 00:00
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Chuyển đổi số phút kể từ 00:00 sang định dạng "HH:MM"
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Kiểm tra xem nhân viên có làm việc vào ngày chỉ định không
export function isStaffWorkingOnDate(staff: DatLich.Staff, date: string): boolean {
  const dayOfWeek = new Date(date).getDay().toString();
  return staff.workSchedule[dayOfWeek]?.isWorking || false;
}

// Lấy giờ làm việc của nhân viên vào một ngày cụ thể
export function getStaffWorkingHours(staff: DatLich.Staff, date: string): {startTime: string, endTime: string} | null {
  const dayOfWeek = new Date(date).getDay().toString();
  const schedule = staff.workSchedule[dayOfWeek];
  
  if (!schedule || !schedule.isWorking) {
    return null;
  }
  
  return {
    startTime: schedule.startTime,
    endTime: schedule.endTime
  };
}

// Đếm số lịch hẹn của nhân viên trong ngày
export function countStaffAppointmentsForDay(staffId: string, date: string, appointments: DatLich.Appointment[]): number {
  return appointments.filter(
    appointment => appointment.staffId === staffId && 
                  appointment.date === date &&
                  appointment.status !== 'cancelled'
  ).length;
}

// Tạo danh sách các time slot có sẵn cho một ngày
export function generateAvailableTimeSlots(
  staff: DatLich.Staff, 
  date: string, 
  appointments: DatLich.Appointment[], 
  serviceDuration: number
): {startTime: string, endTime: string}[] {
  const workingHours = getStaffWorkingHours(staff, date);
  if (!workingHours) return [];
  
  const slots: {startTime: string, endTime: string}[] = [];
  const startMinutes = timeToMinutes(workingHours.startTime);
  const endMinutes = timeToMinutes(workingHours.endTime);
  
  // Tạo slot mỗi 15 phút
  for (let time = startMinutes; time + serviceDuration <= endMinutes; time += 15) {
    const slotStart = minutesToTime(time);
    const slotEnd = minutesToTime(time + serviceDuration);
    
    if (isTimeSlotAvailable(staff.id, date, slotStart, slotEnd, appointments)) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd
      });
    }
  }
  
  return slots;
}
