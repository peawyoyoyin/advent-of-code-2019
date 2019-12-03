from __future__ import annotations
from typing import List, Tuple, Set, Dict

def manhattan_distance(position: Tuple[int, int]):
    x, y = position
    return abs(x) + abs(y)

class Wire:
    positions: Dict[Tuple[int, int], int]
    _current_position: Tuple[int, int]
    _current_step: int

    def __init__(self, directions: List[str]):
        self.positions = {}
        self._current_position = (0, 0)
        self._current_step = 0
        self.init_with_directions(directions)

    def init_with_directions(self, directions: List[str]):
        for direction_str in directions:
            direction, magnitude = direction_str[0], int(direction_str[1:])

            if direction == 'U':
                dx, dy = (0, 1)
            elif direction == 'D':
                dx, dy = (0, -1)
            elif direction == 'R':
                dx, dy = (1, 0)
            elif direction == 'L':
                dx, dy = (-1, 0)

            for i in range(magnitude):
                if self._current_position not in self.positions:
                    self.positions[self._current_position] = self._current_step
                self._current_step += 1

                x, y = self._current_position
                self._current_position = (x+dx, y+dy)

    def cross(self, other: Wire):
        result = set(self.positions.keys()).intersection(set(other.positions.keys()))
        result.remove((0, 0))
        return result
