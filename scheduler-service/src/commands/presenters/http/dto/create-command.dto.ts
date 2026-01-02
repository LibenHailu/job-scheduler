export class CreateCommandDto {
  type: 'DELAY' | 'HTTP_GET_JSON';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  scheduledTime?: number;
  url?: string;
}
