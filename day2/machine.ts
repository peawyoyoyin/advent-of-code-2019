import { logger } from "../utils/logger";

const OpCodes = {
  ADD: 1,
  MUL: 2,
  HALT: 99
}

enum State {
  INITIAL,
  ADD,
  MUL,
  HALT
}

class Machine {
  private memory: number[];
  private state: State;
  private args: number[];

  constructor(private opcodes: number[]) {
    this.memory = [];
    this.state = State.INITIAL;
    this.args = [];
    this.setup();
  }

  public setup(noun: number = 12, verb: number = 2) {
    this.state = State.INITIAL;
    this.memory = this.opcodes.slice();
    this.args = [];
    this.memory[1] = noun;
    this.memory[2] = verb;
  }

  public run() {
    for (const opcode of this.memory) {
      switch(this.state) {
        case State.INITIAL:
          logger.verbose('parsing', opcode);
          switch(opcode) {
            case OpCodes.ADD:
              this.state = State.ADD;
              break;
            case OpCodes.MUL:
              this.state = State.MUL;
              break;
            case OpCodes.HALT:
            default:
              logger.verbose('HALT', opcode);
              this.state = State.HALT;
              break;
          }
          break;
        case State.ADD:
          this.args.push(opcode);
          if (this.args.length == 3) {
            const [a1, a2, dst] = this.args;
            logger.verbose('ADD', a1, a2, dst);
            this.memory[dst] = this.memory[a1] + this.memory[a2];
            this.args = [];
            this.state = State.INITIAL;
          }
          break;
        case State.MUL:
          this.args.push(opcode);
          if (this.args.length == 3) {
            const [a1, a2, dst] = this.args;
            logger.verbose('MUL', a1, a2, dst);
            this.memory[dst] = this.memory[a1] * this.memory[a2];
            this.args = [];
            this.state = State.INITIAL;
          }
          break;
        case State.HALT:
          break;
      }
      if (this.state == State.HALT) {
        break;
      }
    }
  }

  public result(): number {
    return this.memory[0];
  }
}

export { Machine }

