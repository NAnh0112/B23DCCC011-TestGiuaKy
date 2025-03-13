import { useState, useCallback } from 'react';

const STORAGE_KEY = 'datlich_service';

export default function useServiceModel() {
  const [services, setServices] = useState<DatLich.Service[]>(() => {
    const savedServices = localStorage.getItem(STORAGE_KEY);
    return savedServices ? JSON.parse(savedServices) : [];
  });

  const [loading, setLoading] = useState<boolean>(false);

  const saveServices = useCallback((serviceList: DatLich.Service[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceList));
    setServices(serviceList);
  }, []);

  const addService = useCallback((newService: Omit<DatLich.Service, 'id'>) => {
    const serviceWithId: DatLich.Service = {
      ...newService,
      id: Date.now().toString(),
    };
    
    const updatedServices = [...services, serviceWithId];
    saveServices(updatedServices);
    return serviceWithId;
  }, [services, saveServices]);

  const updateService = useCallback((id: string, updatedService: Partial<DatLich.Service>) => {
    const updatedServiceList = services.map(service => 
      service.id === id ? { ...service, ...updatedService } : service
    );
    saveServices(updatedServiceList);
  }, [services, saveServices]);

  const deleteService = useCallback((id: string) => {
    const updatedServiceList = services.filter(service => service.id !== id);
    saveServices(updatedServiceList);
  }, [services, saveServices]);

  return {
    services,
    loading,
    setLoading,
    addService,
    updateService,
    deleteService,
  };
}
