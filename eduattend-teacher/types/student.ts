export interface Student {
  _id: string;
  studentCode: string;
  name: string;
  className: string;
  email:string;
  phone:string;
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}