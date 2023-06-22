const { clone, isObject, pipe, getAtPath, setAtPathMut } = require('@toxo/fun');
const { evaluate } = require('@toxo/evaluator');

const applyField = '__apply__';

function transformFromObj(input, src, context = {}) {
  if (Array.isArray(input)) {
    const l = input.length;
    for (let i = 0; i < l; i += 1) {
      // eslint-disable-next-line no-param-reassign
      input[i] = transformFromObj(input[i], src, context);
    }
    return input;
  }
  if (isObject(input)) {
    const keys = Object.keys(input);
    keys.forEach((key) => {
      // eslint-disable-next-line no-param-reassign
      input[key] = transformFromObj(input[key], src, context);
    });
    return input;
  }
  if (typeof input === 'string') {
    if (input.startsWith('@@')) {
      return input.slice(1);
    }
    if (input.startsWith('@')) {
      return evaluate(input.slice(1), {
        ...src,
        ...context,
        $: { ...src },
      });
    }
  }
  return input;
}

function transform(obj, transformation, context) {
  let result = transformFromObj(clone(transformation), obj, context);
  const applyProperty = result[applyField];
  if (applyProperty) {
    for (let i = 0; i < applyProperty.length; i += 1) {
      const fns = applyProperty[i].pipe
        .map((name) => context[name])
        .filter((x) => x);
      if (fns.length) {
        const { paths } = applyProperty[i];
        if (!paths) {
          result = pipe(...fns)(result);
        } else {
          for (let j = 0; j < paths.length; j += 1) {
            setAtPathMut(
              result,
              paths[j],
              pipe(...fns)(getAtPath(result, paths[j]))
            );
          }
        }
      }
    }
    delete result[applyField];
  }
  return result;
}

module.exports = transform;
