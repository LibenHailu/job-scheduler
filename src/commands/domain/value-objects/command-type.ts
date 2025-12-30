export class CommandType {
  constructor(readonly value: 'DELAY' | 'HTTP_GET_JSON') {}

  equals(type: CommandType) {
    return this.value === type.value;
  }
}
