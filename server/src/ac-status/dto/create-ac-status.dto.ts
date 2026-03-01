import { AcMode } from '../ac-status.enum.js';

export class CreateAcStatusDto {
  isOn!: boolean;
  mode!: AcMode;
}
