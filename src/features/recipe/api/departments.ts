import { apiClient } from '@/config/client';

export type DepartmentOption = {
  id: number;
  translations: { name: string }[];
};

export async function getDepartments(): Promise<DepartmentOption[]> {
  const response = await apiClient<{ result: DepartmentOption[] }>('/departments');
  return response.result;
}

export async function createDepartment(name: string): Promise<DepartmentOption> {
  const response = await apiClient<{ result: DepartmentOption }>('/departments', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return response.result;
}
