export type Task = {
  _id?: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
};

export type TaskQueryParams = {
  status?: 'active' | 'completed';
  title?: string;
};
