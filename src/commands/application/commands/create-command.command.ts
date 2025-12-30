export class CreateJobCommand {
  constructor(
    public readonly type: string,
    public readonly agentId: string,
  ) {}
}
