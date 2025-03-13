declare namespace DatLich {
  export interface Staff {
    id: string;
    name: string;
    maxClientsPerDay: number;
    avatar?: string;
    serviceIds: string[]; // Dịch vụ mà nhân viên có thể thực hiện
    workSchedule: {
      // Key là ngày trong tuần (0-6, 0 là Chủ nhật)
      [key: string]: {
        isWorking: boolean;
        startTime: string; // Định dạng: "HH:MM"
        endTime: string; // Định dạng: "HH:MM"
      }
    };
  }

  export interface Service {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    description?: string;
    image?: string;
  }

  export interface Appointment {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    serviceId: string;
    staffId: string;
    date: string; // Định dạng: "YYYY-MM-DD"
    startTime: string; // Định dạng: "HH:MM"
    endTime: string; // Định dạng: "HH:MM"
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: string; // Thời gian tạo lịch hẹn
  }
}
