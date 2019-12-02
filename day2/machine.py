# problem statement https://adventofcode.com/2019/day/2

from typing import List, DefaultDict
from collections import defaultdict
import enum

class State(enum.Enum):
    INITIAL = 0
    ADD = 1
    MUL = 2

class Machine:
    opcodes: List[int]
    args: List[int]
    state: State

    memory: List[int]

    def __init__(self, opcodes: List[int]):
        self.opcodes = opcodes
        self.state = State.INITIAL
        self.args = []
        self.reset_memory()

    def reset_memory(self, noun=12, verb=2):
        self.memory = self.opcodes.copy()
        self.memory[1] = noun
        self.memory[2] = verb

    def run(self):
        for opcode in self.opcodes:
            if self.state == State.INITIAL:
                if opcode == 1:
                    self.state = State.ADD
                    self.args = []
                elif opcode == 2:
                    self.state = State.MUL
                    self.args = []
                else:
                    # print('BREAK', opcode)
                    break
            elif self.state == State.ADD:
                self.args.append(opcode)
                if len(self.args) == 3:
                    a, b, dst = self.args
                    self.memory[dst] = self.memory[a] + self.memory[b]
                    self.state = State.INITIAL
            elif self.state == State.MUL:
                self.args.append(opcode)
                if len(self.args) == 3:
                    a, b, dst = self.args
                    self.memory[dst] = self.memory[a] * self.memory[b]
                    self.state = State.INITIAL

if __name__ == '__main__':
    with open('input_p1.txt') as f:
        raw_opcodes = f.readline()
    opcodes = [int(raw_opcode) for raw_opcode in raw_opcodes.split(',')]

    print('ORIGINAL OPCODES', opcodes)

    machine = Machine(opcodes)
    machine.run()

    print(machine.memory[0])

    # brute force problem 2 (because I'm lazy)
    print('brute-forcing step 2...')
    target = 19690720
    found = False
    for noun in range(0, 100):
        for verb in range(0, 100):
            print('trying', noun, verb)
            machine.reset_memory(noun, verb)
            machine.run()

            result = machine.memory[0]
            print('result', result)

            if result == target:
                print('NOUN, VERB FOUND!')
                print(f'NOUN={noun}, VERB={verb}')
                print(f'100*NOUN + VERB = {100*noun+verb}')
                found = True
                break
        if found:
            break
