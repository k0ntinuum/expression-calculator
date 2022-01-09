function toPostfix(expression) {
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, ')': 3, '(': 3 };
  let infix = [], number = '', stack = [], postfix = [];

  for (let i = 0; i < expression.length; i++) {
    number += (expression[i] in precedence) ? '' : expression[i];

    if (expression[i] in precedence) {
      if (number.length > 0) infix.push(+number);
      infix.push(expression[i]);
      number = '';
    }
  }
  if (number.length > 0) infix.push(+number);

  while (infix.length > 0) {
    const token = infix.shift();

    if (!isNaN(token)) {
      postfix.push(token);
    } else if (stack.length === 0 || token === '(') {
      stack.unshift(token);
    } else if (token === ')') {
      while (stack[0] !== '(') {
        postfix.push(stack.shift());
      }
      stack.shift();
    } else {
      while (stack.length > 0 && stack[0] !== '(' && precedence[token] <= precedence[stack[0]]) {
        postfix.push(stack.shift());
      }
      stack.unshift(token);
    }
  }
  postfix.push(...stack);

  return postfix;
}

function calculate(expression) {
  const operators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
  };
  const stack = [];

  expression.forEach(token => {
    if (token in operators) {
      const [y, x] = [stack.pop(), stack.pop()];
      stack.push(operators[token](x, y));
    } else stack.push(token);
  });

  return stack[0];
}

function expressionCalculator(expression) {
  if (expression.match(/\/\s+0/g))
    throw new Error('TypeError: Division by zero.');
  if ((expression.match(/\(/g) || []).length !== (expression.match(/\)/g) || []).length)
    throw new Error('ExpressionError: Brackets must be paired');

  const infix = expression.replace(/\s/g, '');
  const postfix = toPostfix(infix);

  return calculate(postfix);
}

module.exports = {
    expressionCalculator
}