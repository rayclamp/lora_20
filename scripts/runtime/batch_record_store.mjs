export class GitHubBatchRecordStore {
  constructor({ client, owner, repo, path, branch = "main" }) {
    this.client = client;
    this.owner = owner;
    this.repo = repo;
    this.path = path;
    this.branch = branch;
  }

  read() {
    const item = this.client.getContents({ owner: this.owner, repo: this.repo, path: this.path, ref: this.branch });
    if (!item) return null;
    return { state: JSON.parse(Buffer.from(item.content, "base64").toString("utf8")), sha: item.sha };
  }

  create(state, message = "production: create batch record") {
    const content = Buffer.from(JSON.stringify(state, null, 2) + "\n", "utf8").toString("base64");
    const result = this.client.updateContents({
      owner: this.owner, repo: this.repo, path: this.path, branch: this.branch,
      content, message
    });
    return { state: clone(state), sha: result.content?.sha ?? result.sha };
  }

  compareAndSwap(expectedSha, state, message = "production: checkpoint batch record") {
    const content = Buffer.from(JSON.stringify(state, null, 2) + "\n", "utf8").toString("base64");
    const result = this.client.updateContents({
      owner: this.owner, repo: this.repo, path: this.path, branch: this.branch,
      sha: expectedSha, content, message
    });
    return { state: clone(state), sha: result.content?.sha ?? result.sha };
  }

  mutate(mutator, message = "production: checkpoint batch record") {
    const current = this.read();
    if (!current) throw new Error("BATCH_RECORD_MISSING");
    const next = mutator(clone(current.state));
    return this.compareAndSwap(current.sha, next, message);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
