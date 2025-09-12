
// file: src/core/visibility.mjs

// Допустимые значения видимости

const visibility = [-1]

for (let i = 0;    i < 800;   i += 50)   visibility.push(i)
for (let i = 800;  i < 5000;  i += 100)  visibility.push(i)
for (let i = 5000; i < 10000; i += 1000) visibility.push(i)
                                         visibility.push(9999)

export default visibility
