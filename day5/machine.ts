import { logger } from "../utils/logger";

const Instructions = {
  ADD: 10,
  MUL: 20,
  INPUT: 30,
  OUTPUT: 40,
  JUMP_IF_TRUE: 50,
  JUMP_IF_FALSE: 60,
  LESS_THAN: 70,
  EQUALS: 80
}

const OpCodes = {
  HALT: 99
}

enum ParameterMode {
  POSITION,
  IMMEDIATE
}

enum State {
  INITIAL,
  ADD,
  MUL,
  INPUT,
  OUTPUT,
  HALT,
  JUMP_IF_TRUE,
  JUMP_IF_FALSE,
  LESS_THAN,
  EQUALS
}

class Machine {
  private memory: number[] = [];
  private state: State = State.INITIAL;
  private args: number[] = [];
  private outputs: number[] = [];
  private parameterModes: ParameterMode[] = [];
  private inputQueue: number[] = [];
  private instructionPointer: number = 0;
  private nextInstructionPointer: number | undefined = undefined;

  constructor(private opcodes: number[], private inputs: number[]) {
    this.setup();
  }

  public setup() {
    this.instructionPointer = 0;
    this.state = State.INITIAL;
    this.memory = this.opcodes.slice();
    this.args = [];
    this.inputQueue = this.inputs.slice();
  }

  private setArgumentModes(argumentMode: string) {
    this.parameterModes = [];
    for (let char of argumentMode) {
      if (char === '0') {
        this.parameterModes.push(ParameterMode.POSITION);
      } else if (char === '1') {
        this.parameterModes.push(ParameterMode.IMMEDIATE);
      }
    }
  }

  private calculateNextState(opcode: number): void {
    const rawOpcode = opcode.toString().split('').reverse().join('').padEnd(5, '0');
    logger.verbose('rawOpcode', rawOpcode);

    const instruction = parseInt(rawOpcode.slice(0, 2));
    const modes = (rawOpcode.slice(2)).toString();

    this.setArgumentModes(modes);
    switch(instruction) {
      case Instructions.ADD:
        this.state = State.ADD;
        break;
      case Instructions.MUL:
        this.state = State.MUL;
        break;
      case Instructions.INPUT:
        this.state = State.INPUT;
        break;
      case Instructions.OUTPUT:
        this.state = State.OUTPUT;
        break;
      case Instructions.LESS_THAN:
        this.state = State.LESS_THAN;
        break;
      case Instructions.EQUALS:
        this.state = State.EQUALS;
        break;
      case Instructions.JUMP_IF_FALSE:
        this.state = State.JUMP_IF_FALSE;
        break;
      case Instructions.JUMP_IF_TRUE:
        this.state = State.JUMP_IF_TRUE;
        break;
      default:
        logger.verbose('HALT', opcode)
        this.state = State.HALT;
        break;
    }
    logger.verbose('parsed', opcode, State[this.state]);
  }

  private resolveParameter(parameter: number, parameterMode: ParameterMode) {
    switch(parameterMode) {
      case ParameterMode.IMMEDIATE:
        return parameter;
      case ParameterMode.POSITION:
        return this.memory[parameter];
    }
  }

  private executeCalculateAndStore(calculation: (a: number, b: number) => number): void {
    const [a, b, c] = this.args;
    const [pmA, pmB, pmC] = this.parameterModes;
    logger.verbose('EXECUTING CALC AND STORE', a, b, c);
    logger.vverbose('resolved parameters', this.resolveParameter(a, pmA), this.resolveParameter(b, pmB), this.resolveParameter(c, pmC));

    const result = calculation(this.resolveParameter(a, pmA), this.resolveParameter(b, pmB));
    this.memory[c] = result;
    logger.vverbose('wrote', result, 'to address', c);
    this.args = [];
  }

  private executeConditionalJump(predicate: (a: number) => boolean): void {
    const [a, b] = this.args;
    const [pmA, pmB] = this.parameterModes;
    logger.verbose('EXECUTING CONDITIONAL JUMP', a, b);

    const resolvedA = this.resolveParameter(a, pmA);
    logger.vverbose('resolved parameter', resolvedA);
    if (predicate(resolvedA)) {
      const dst = this.resolveParameter(b, pmB);
      logger.vverbose('resolved dst', dst);
      this.nextInstructionPointer = dst;
    }

    this.args = [];
  }

  private updateInstructionPointer(): void {
    if (this.nextInstructionPointer != undefined) {
      logger.vverbose('jumping to', this.nextInstructionPointer);
      this.instructionPointer = this.nextInstructionPointer;
    } else {
      logger.vverbose('incrementing instruction pointer');
      this.instructionPointer++;
    }
    logger.verbose('updated instruction pointer to', this.instructionPointer);
    this.nextInstructionPointer = undefined;
  }

  public run() {
    while(this.state !== State.HALT) {
      logger.vverbose('STATE', State[this.state]);
      logger.vverbose('INSTRUCTION POINTER', this.instructionPointer);
      const opcode = this.memory[this.instructionPointer];
      logger.vverbose('MEMORY VALUE', opcode);
      switch(this.state) {
        case State.INITIAL:
          logger.verbose('parsing', opcode);
          switch(opcode) {
            case OpCodes.HALT:
              logger.verbose('HALT', opcode);
              this.state = State.HALT;
            default:
              this.calculateNextState(opcode);
              break;
          }
          break;
        case State.ADD:
          this.args.push(opcode);
          if (this.args.length == 3) {
            logger.verbose('ADD');
            this.executeCalculateAndStore((a, b) => a+b);
            this.state = State.INITIAL;
          }
          break;
        case State.MUL:
          this.args.push(opcode);
          if (this.args.length == 3) {
            logger.verbose('MUL');
            this.executeCalculateAndStore((a, b) => a*b);
            this.state = State.INITIAL;
          }
          break;
        case State.OUTPUT:
          logger.verbose('OUTPUT', opcode);
          const src = opcode;
          const output = this.resolveParameter(src, this.parameterModes[0]);
          this.outputs.push(output);
          logger.vverbose('wrote', output, 'to output');
          this.state = State.INITIAL;
          break;
        case State.INPUT:
          logger.verbose('INPUT', opcode);
          const dst = opcode;
          const input = this.inputQueue.shift();
          if (input !== undefined) {
            this.memory[dst] = input;
            logger.vverbose('wrote', input, 'to address', dst);
          }
          this.state = State.INITIAL;
          break;
        case State.LESS_THAN:
          this.args.push(opcode);
          if (this.args.length == 3) {
            logger.verbose('LESS_THAN');
            this.executeCalculateAndStore((a, b) => a < b ? 1 : 0);
            this.state = State.INITIAL;
          }
          break;
        case State.EQUALS:
          this.args.push(opcode);
          if (this.args.length == 3) {
            logger.verbose('EQUALS');
            this.executeCalculateAndStore((a, b) => a == b ? 1 : 0 );
            this.state = State.INITIAL;
          }
          break;
        case State.JUMP_IF_FALSE:
          this.args.push(opcode);
          if (this.args.length == 2) {
            logger.verbose('JUMP_IF_FALSE');
            this.executeConditionalJump(a => a == 0);
            this.state = State.INITIAL;
          }
          break;
        case State.JUMP_IF_TRUE:
          this.args.push(opcode);
          if (this.args.length == 2) {
            logger.verbose('JUMP_IF_TRUE');
            this.executeConditionalJump(a => a != 0);
            this.state = State.INITIAL;
          }
          break;
      }
      this.updateInstructionPointer();
    }
  }

  public result(): number[] {
    return this.outputs;
  }
}

export { Machine }

