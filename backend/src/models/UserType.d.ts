export interface UserType {
  userId: number;
  userName: string;
  userAvatar: string | null;
  userEmail: string;
  password: string;
  reenteredPassword: string;
  isDeleted: number;
  updatedAt: Date | string;
  createdAt: Date | string;
  role: RolesType;
}

export default UserType;
