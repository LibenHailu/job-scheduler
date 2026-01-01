export class Agent {
  id: string;
  shards: number[];

  constructor(params: { id: string; shards: number[] }) {
    this.id = params.id;
    this.shards = params.shards;
  }

  public addShard(shard: number) {
    this.shards.push(shard);
  }

  public updateShards(shards: number[]) {
    this.shards = shards;
  }
}
