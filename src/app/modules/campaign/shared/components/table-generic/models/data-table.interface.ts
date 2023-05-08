import { ActionTableInterface } from '@apps/modules/campaign/shared/components/table-generic/models/action-table.interface';

export interface DataTableInterface {
  name: string;
  priority: number;
  enabled: boolean;
  views?: number;
  goals?: number;
  ctr?: string;
  actions?: ActionTableInterface[];
}
