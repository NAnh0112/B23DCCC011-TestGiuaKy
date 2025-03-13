import { useState, useCallback } from 'react';

const STORAGE_KEY = 'datlich_appointment';

export default function useAppointmentModel() {
  const [appointments, setAppointments] = useState<DatLich.Appointment[]>(() => {
    const savedAppointments = localStorage.getItem(STORAGE_KEY);
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  const saveAppointments = useCallback((appointmentList: DatLich.Appointment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointmentList));
    setAppointments(appointmentList);
  }, []);

  const addAppointment = useCallback((newAppointment: Omit<DatLich.Appointment, 'id' | 'createdAt'>) => {
    const appointmentWithId: DatLich.Appointment = {
      ...newAppointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedAppointments = [...appointments, appointmentWithId];
    saveAppointments(updatedAppointments);
    return appointmentWithId;
  }, [appointments, saveAppointments]);

  const updateAppointment = useCallback((id: string, updatedAppointment: Partial<DatLich.Appointment>) => {
    const updatedAppointmentList = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
    );
    saveAppointments(updatedAppointmentList);
  }, [appointments, saveAppointments]);

  const deleteAppointment = useCallback((id: string) => {
    const updatedAppointmentList = appointments.filter(appointment => appointment.id !== id);
    saveAppointments(updatedAppointmentList);
  }, [appointments, saveAppointments]);

  const getStaffAppointments = useCallback((staffId: string, date?: string) => {
    return appointments.filter(
      appointment => 
        appointment.staffId === staffId && 
        (!date || appointment.date === date)
    );
  }, [appointments]);

  const getDateAppointments = useCallback((date: string) => {
    return appointments.filter(
      appointment => appointment.date === date
    );
  }, [appointments]);

  return {
    appointments,
    loading,
    setLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getStaffAppointments,
    getDateAppointments,
  };
}
