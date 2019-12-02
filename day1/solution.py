# problem statement at https://adventofcode.com/2019/day/1

def required_fuel(mass):
    return (mass // 3) - 2

def recursive_required_fuel(mass):
    fuel_required = (mass // 3) - 2
    if fuel_required <= 0:
        return 0
    return fuel_required + recursive_required_fuel(fuel_required)

if __name__ == '__main__':
    lines = []
    with open('input_p1.txt') as f:
        lines = f.readlines()
    
    answers = []
    answers_2 = []

    for line in lines:
        answers.append(required_fuel(int(line)))
        answers_2.append(recursive_required_fuel(int(line)))
    print(sum(answers))
    print(sum(answers_2))
