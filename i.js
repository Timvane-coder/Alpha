const { styletext } = require('./lib');

async function main() {
    try {
        const result = await styletext('Hello');
        console.log(result);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();