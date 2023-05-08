import { TypeInput } from '@apps/shared/utils/constants';

export interface ColDefinitionInterface {
  columnDef: string;
  header: string;
  cell: Function;
  type?: TypeInput;
  style?: any;
}
