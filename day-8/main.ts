import { exec, readLines } from "../helpers";

const example = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf";

const exampleBig = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`

const parse = (lines: string[]): {input: string[], output: string[]}[] => {
    return lines.map(line => {
        const [input, output] = line.split(' | ');
        return {
            input: input.split(' '), 
            output: output.split(' ')
        };
    });
};

const main = async() => {
    const lines = await readLines("input.txt");
    const io = parse(lines);

    let count = 0;
    for (const {output} of io) {
        for (const o of output) {
            // 1, 4, 7, 8
            if ([2, 4, 3, 7].includes(o.length)) {
                count++;
            }
        }
    }
    console.log(`part 1: ${count}`);
    let sum = 0;
    for (const {input, output} of io) {
        /*
         aaaa
        b    c
        b    c
         dddd
        e    f
        e    f
         gggg
         1 = cf
         2 = acdeg
         3 = acdfg
         4 = bcdf
         5 = abdfg
         6 = abdefg
         7 = acf
         8 = abcdefg
         9 = abcdfg
         0 = abcefg
        */
        const countMatches = (source: string, compare: string): number => {
            return compare.split('').filter(c => {
                return source.includes(c);
            }).length;
        };
        const one = input.find(i => i.length === 2) ?? '';
        const four = input.find(i => i.length === 4) ?? '';
        const seven = input.find(i => i.length === 3) ?? '';
        const eight = input.find(i => i.length === 7) ?? '';
        const two = input.find(i => {
            // two should match 1 from 1, 2 from 4, 2 from 7,  5 from 8
            const matches = [
                countMatches(i, one) === 1,
                countMatches(i, four) === 2,
                countMatches(i, seven) === 2,
                countMatches(i, eight) === 5
            ];
            return matches.every(m => m);
        }) ?? '';
        const three = input.find(i => {
            // three should match 2 from 1, 3 from 4, 3 from 7,  5 from 8
            // 4 from 2
            const matches = [
                countMatches(i, one) === 2,
                countMatches(i, four) === 3,
                countMatches(i, seven) === 3,
                countMatches(i, eight) === 5
            ];
            return matches.every(m => m);
        }) ?? '';
        const five = input.find(i => {
            // five should match 1 from 1, 3 from 4, 2 from 7,  5 from 8
            const matches = [
                countMatches(i, one) === 1,
                countMatches(i, four) === 3,
                countMatches(i, seven) === 2,
                countMatches(i, eight) === 5
            ];
            return matches.every(m => m);
        }) ?? '';
        const six = input.find(i => {
            // six should match 1 from 1, 3 from 4, 2 from 7,  6 from 8
            const matches = [
                countMatches(i, one) === 1,
                countMatches(i, four) === 3,
                countMatches(i, seven) === 2,
                countMatches(i, eight) === 6
            ];
            return matches.every(m => m);
        }) ?? '';
        const nine = input.find(i => {
            // nine should match 2 from 1, 4 from 4, 3 from 7,  6 from 8
            const matches = [
                countMatches(i, one) === 2,
                countMatches(i, four) === 4,
                countMatches(i, seven) === 3,
                countMatches(i, eight) === 6
            ];
            return matches.every(m => m);
        }) ?? '';
        const zero = input.find(i => {
            // zero should match 2 from 1, 3 from 4, 3 from 7,  6 from 8
            const matches = [
                countMatches(i, one) === 2,
                countMatches(i, four) === 3,
                countMatches(i, seven) === 3,
                countMatches(i, eight) === 6
            ];
            return matches.every(m => m);
        }) ?? '';
        const decoder = {
            [one.split('').sort().join('')]: 1,
            [two.split('').sort().join('')]: 2,
            [three.split('').sort().join('')]: 3,
            [four.split('').sort().join('')]: 4,
            [five.split('').sort().join('')]: 5,
            [six.split('').sort().join('')]: 6,
            [seven.split('').sort().join('')]: 7,
            [eight.split('').sort().join('')]: 8,
            [nine.split('').sort().join('')]: 9,
            [zero.split('').sort().join('')]: 0
        };
        sum += parseInt(output.map(o => decoder[o.split('').sort().join('')]).join(''))
    }
    console.log(`part two: ${sum}`);
};

exec(main);