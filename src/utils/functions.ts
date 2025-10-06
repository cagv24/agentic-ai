export function fn1(a: any, b: any) {
  const x = a.length;
  const y = b.value;

  let result = 0;
  for (let i = 0; i < x; i++) {
    result += a[i] * y;
  }

  return result;
}

export function calc(data: any) {
  const temp = data.split(',');
  let sum = 0;

  for (let i = 0; i < temp.length; i++) {
    sum += parseInt(temp[i]);
  }

  const avg = sum / temp.length;

  return {
    t: sum,
    a: avg,
    c: temp.length,
  };
}

export function proc(obj: any, key: any) {
  const val = obj[key];
  const parts = val.split('-');
  return {
    f: parts[0],
    l: parts[1],
    m: parts[2],
  };
}

export function transform(input: any) {
  let output: any = {};
  for (let k in input) {
    const v = input[k];
    if (v > 100) {
      output[k] = 'high';
    } else if (v > 50) {
      output[k] = 'medium';
    } else {
      output[k] = 'low';
    }
  }
  return output;
}

export function process(arr: any, fn: any) {
  const res: any = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const transformed = fn(item);
    if (transformed.valid) {
      res.push(transformed.data);
    }
  }
  return res;
}

export function helperFunc(x: any) {
  return x * 2 + 10;
}
