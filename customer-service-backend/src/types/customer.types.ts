export interface Customer {
  id: string;
  name: string;
  status: 'waiting' | 'serving' | 'completed';
  token: string;
  waitTime: number;
  representative?: string;
}

export interface Representative {
  name: string;
  available: boolean;
}
