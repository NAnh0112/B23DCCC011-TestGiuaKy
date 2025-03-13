import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'datlich_appointment';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string; 
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  createdAt: string;
}

export default function useAppointmentModel() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem(STORAGE_KEY);
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const saveAppointments = useCallback((appointmentList: Appointment[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointmentList));
    setAppointments(appointmentList);
  }, []);

  const addAppointment = useCallback((newAppointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const appointmentWithId: Appointment = {
      ...newAppointment,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const updatedAppointments = [...appointments, appointmentWithId];
    saveAppointments(updatedAppointments);
    return appointmentWithId;
  }, [appointments, saveAppointments]);

  const updateAppointment = useCallback((id: string, updatedAppointment: Partial<Appointment>) => {
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

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(app => 
      app.id === id ? { ...app, status } : app
    );
    setAppointments(updatedAppointments);
  };

  const checkConflict = (staffId: string, date: string, time: string, serviceId: string, services: any[]): boolean => {
    const service = services.find(s => s.id === serviceId);
    const duration = service ? service.duration : 60; 
    
    const startTime = convertTimeToMinutes(time);
    const endTime = startTime + duration;
    
    return appointments.some(app => {
      if (app.staffId !== staffId || app.date !== date || app.status === 'canceled') {
        return false;
      }
      
      const appStartTime = convertTimeToMinutes(app.time);
      const appService = services.find(s => s.id === app.serviceId);
      const appDuration = appService ? appService.duration : 60;
      const appEndTime = appStartTime + appDuration;
      
      return (startTime < appEndTime && endTime > appStartTime);
    });
  };
  
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return {
    appointments,
    loading,
    setLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getStaffAppointments,
    getDateAppointments,
    updateAppointmentStatus,
    checkConflict
  };
}
