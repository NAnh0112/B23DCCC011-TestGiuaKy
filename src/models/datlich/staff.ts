import { useState, useCallback } from 'react';

const STORAGE_KEY = 'datlich_staff';

const defaultWorkSchedule = {
  '0': { isWorking: false, startTime: '08:00', endTime: '17:00' }, // Chủ nhật
  '1': { isWorking: true, startTime: '08:00', endTime: '17:00' },
  '2': { isWorking: true, startTime: '08:00', endTime: '17:00' },
  '3': { isWorking: true, startTime: '08:00', endTime: '17:00' },
  '4': { isWorking: true, startTime: '08:00', endTime: '17:00' },
  '5': { isWorking: true, startTime: '08:00', endTime: '17:00' },
  '6': { isWorking: false, startTime: '08:00', endTime: '17:00' }, // Thứ 7
};

export default function useStaffModel() {
  const [staff, setStaff] = useState<DatLich.Staff[]>(() => {
    const savedStaff = localStorage.getItem(STORAGE_KEY);
    return savedStaff ? JSON.parse(savedStaff) : [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  const saveStaff = useCallback((staffList: DatLich.Staff[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList));
    setStaff(staffList);
  }, []);

  const addStaff = useCallback((newStaff: Omit<DatLich.Staff, 'id'>) => {
    const staffWithId: DatLich.Staff = {
      ...newStaff,
      id: Date.now().toString(),
      workSchedule: newStaff.workSchedule || { ...defaultWorkSchedule },
    };
    
    const updatedStaff = [...staff, staffWithId];
    saveStaff(updatedStaff);
    return staffWithId;
  }, [staff, saveStaff]);

  const updateStaff = useCallback((id: string, updatedStaff: Partial<DatLich.Staff>) => {
    const updatedStaffList = staff.map(item => 
      item.id === id ? { ...item, ...updatedStaff } : item
    );
    saveStaff(updatedStaffList);
  }, [staff, saveStaff]);

  const deleteStaff = useCallback((id: string) => {
    const updatedStaffList = staff.filter(item => item.id !== id);
    saveStaff(updatedStaffList);
  }, [staff, saveStaff]);

  return {
    staff,
    loading,
    setLoading,
    addStaff,
    updateStaff,
    deleteStaff,
  };
}
