export interface Task {
    isMaximized: boolean;
    startDate: string | number | Date;
    duration: number;
    id: number;
    taskName: string;
    description: string;
    createdDate: string;
    dueDate: string;
    assignee: string;
    status: string;  // 'To Do', 'In Progress', 'Done'
    position: number;  // New property to track order within a column
    user_id: number; // New property
}
