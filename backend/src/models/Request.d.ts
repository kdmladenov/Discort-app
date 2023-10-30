declare namespace Express {
  export interface Request {
    user: {
      userId: number;
      email: string;
      role: RolesType;
    },
    server: {
      serverId: number
    }
  }
}
