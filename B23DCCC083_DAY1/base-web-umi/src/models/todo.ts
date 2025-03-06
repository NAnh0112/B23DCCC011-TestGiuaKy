export namespace Todo {
    export interface Record {
      id: number;
      task: string;
      completed: boolean;
      deadline?: string;
    }
  }
  