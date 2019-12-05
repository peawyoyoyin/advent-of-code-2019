import { logger } from "../utils/logger";

function validPassword(password: string): boolean {
  let increasing = true;
  let hasDouble = false;

  let lastChar = password.charAt(0);
  let maxNum = parseInt(password.charAt(0));
  for (let char of password.slice(1)) {
    const numericVal = parseInt(char);

    if (numericVal < maxNum) {
      increasing = false;
    } else {
      maxNum = numericVal;
    }

    if (char == lastChar) {
      hasDouble = true;
    }
    lastChar = char;
  }

  return increasing && hasDouble;
}

function validPasswordForPart2(password: string): boolean {
  let increasing = true;
  let hasDouble = false;

  let lastChar = password.charAt(0);
  let maxNum = parseInt(password.charAt(0));
  let consecutiveChars = 1;
  for (let char of password.slice(1)) {
    const numericVal = parseInt(char);

    if (numericVal < maxNum) {
      increasing = false;
    } else {
      maxNum = numericVal;
    }

    if (char == lastChar) {
      consecutiveChars++;
    } else {
      if (consecutiveChars == 2) {
        hasDouble = true;
      }
      consecutiveChars = 1;
    }
    lastChar = char;
  }

  if (consecutiveChars == 2) {
    hasDouble = true;
  }

  return increasing && hasDouble;
}

const puzzleInput = '125730-579381';
const input = puzzleInput.split('-').map(str => parseInt(str.trim()));
logger.debug(input);

const [start, end] = input;
logger.debug(start, end);

let answer = 0;
let answerPart2 = 0;
for (let i = start; i <= end; i++) {
  logger.verbose('checking', i);
  if (validPassword(i.toString())) {
    logger.progress(i, 'is valid for part 1');
    answer++;
  }

  if (validPasswordForPart2(i.toString())) {
    logger.progress(i, 'is valid for part 2');
    answerPart2++;
  }
}
logger.solution('part 1', answer);
logger.solution('part 2', answerPart2);
