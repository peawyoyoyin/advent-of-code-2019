# problem statement at https://adventofcode.com/2019/day/4

def check(password: str) -> bool:
    increasing = True
    has_double = False

    last_char = password[0]
    min_num = int(password[0])

    for char in password[1:]:
        if char == last_char:
            has_double = True
        
        if int(char) < min_num:
            increasing = False
        
        last_char = char
        min_num = int(char)
    
    return has_double and increasing

def check_2(password: str) -> bool:
    increasing = True
    has_double = False

    last_char = password[0]
    min_num = int(password[0])

    consecutive_number = 1

    for char in password[1:]:
        if char == last_char:
            consecutive_number += 1
        else:
            if consecutive_number == 2:
                has_double = True
            else:
                consecutive_number = 1

        if int(char) < min_num:
            increasing = False
        
        last_char = char
        min_num = int(char)
    
    if consecutive_number == 2:
        has_double = True

    return has_double and increasing

if __name__ == '__main__':
    puzzle_input = '125730-579381'

    start, end = puzzle_input.split('-')

    valid_passwords = 0
    valid_passwords_2 = 0

    for num in range(int(start), int(end)+1):
        if check(str(num)):
            valid_passwords += 1
        if check_2(str(num)):
            valid_passwords_2 += 1
    
    print(valid_passwords, valid_passwords_2)
