// 这是一个不符合 Prettier 规范的测试文件

const name = 'hello world'; // 应该用单引号，缺少分号
const age = 18; // 等号两边缺少空格，缺少分号

function sayHello(name: string, age: number) {
  // 冒号后缺少空格，逗号后缺少空格
  console.log('Hello, ' + name); // 缩进用了4空格而不是2空格，缺少分号
  return { name: name, age: age }; // 对象属性冒号后缺少空格
}

const user = { name: 'Tom', age: 20 }; // 花括号内缺少空格

const longArray = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]; // 缺少空格

export { sayHello, user, longArray };
