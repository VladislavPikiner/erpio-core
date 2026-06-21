export interface UserSession {
  id: string;
  role: 'admin' | 'cashier' | 'customer';
  branchId: string;
}
