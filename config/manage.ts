export namespace StudyApp {
    export interface Subject {
      id: number;
      name: string;
      completed: boolean;
    }
  
    // Tiến độ học tập (log học tập)
    export interface StudyLog {
      id: number;
      subjectId: number;  // ID môn học
      date: string;        // Ngày học (YYYY-MM-DD)
      duration: number;    // Thời gian học (giờ)
      note?: string;       // Ghi chú
    }
  
    // Mục tiêu học tập
    export interface StudyGoal {
      month: string;       // Tháng (YYYY-MM)
      subjectId: number;   // ID môn học
      targetHours: number; // Số giờ mục tiêu
      completedHours: number; // Số giờ đã hoàn thành
    }
  }
  