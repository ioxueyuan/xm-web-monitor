import 'core-js/stable';
import 'regenerator-runtime/runtime';

Array.from(new Set([1, 2, 3, 2, 1])); // => [1, 2, 3]
[1, [2, 3], [4, [5]]].flat(2); // => [1, 2, 3, 4, 5]
Promise.resolve(32).then((x) => console.log(x)); // => 32
