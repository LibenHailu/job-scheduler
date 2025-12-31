export class CommandStatus {
  constructor(readonly value: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED') {}

  equals(status: CommandStatus) {
    return this.value === status.value;
  }
}
