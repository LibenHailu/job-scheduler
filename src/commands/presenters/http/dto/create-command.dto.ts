export class CreateCommandDto {
  type: 'DELAY' | 'HTTP_GET_JSON';
  agentId: string;
}
