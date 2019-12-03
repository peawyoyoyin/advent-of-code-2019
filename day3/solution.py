from module import Wire, manhattan_distance

if __name__ == '__main__':
    with open('input.txt') as f:
        wire_1_raw = f.readline()
        wire_2_raw = f.readline()
    
    wire_1_dir = wire_1_raw.split(',')
    wire_2_dir = wire_2_raw.split(',')

    wire_1 = Wire(wire_1_dir)
    wire_2 = Wire(wire_2_dir)

    intersection = wire_1.cross(wire_2)
    print(intersection)
    print(manhattan_distance(min(intersection, key=manhattan_distance)))
    best_cross = min(intersection, key=lambda position: wire_1.positions[position] + wire_2.positions[position])
    print(wire_1.positions[best_cross] + wire_2.positions[best_cross])
