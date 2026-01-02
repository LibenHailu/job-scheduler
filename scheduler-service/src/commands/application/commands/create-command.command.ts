export class CreateJobCommand {
  constructor(
    public readonly type: string,
    public readonly status: string,
    public readonly scheduledTime?: number,
    public readonly url?: string,
    public readonly shard?: number,
    public readonly isQueued?: boolean,
  ) {}
}
