export enum CommandType {
  DELAY = 'DELAY',
  HTTP_GET_JSON = 'HTTP_GET_JSON',
}

export enum CommandStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class CommandPayloadDto {
  url?: string;
  ms?: number;
}

export class CreateCommandDto {
  type: CommandType;
  status: CommandStatus;
  payload: CommandPayloadDto;
}
