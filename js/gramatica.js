const EPSILON = '&';
const END_OF_STACK = '$';

const TERMINALS = ['a', 'b', 'c', 'd'];
const NON_TERMINALS = ['S', 'A', 'B', 'C'];

var grammar = {
    'S': ['AC', 'aB' ],
    'A': ['bB', 'aS' ],
    'B': ['cCa', 'AB'],
    'C': ['Bc', 'bCa', EPSILON]
};

var parsingTable = {
    'S': {
        'a': ['a', 'B'],
        'b': ['A', 'C'],
    },
    'A': {
        'a': ['a', 'S'],
        'b': ['b', 'B']
    },
    'B': {
        'a': ['a'],
        'b': ['A', 'B'],
        'c': ['c', 'C', 'a'],
    },
    'C': {
        'a': [EPSILON],
        'b': ['b', 'A', 'a'],
        'c': ['B', 'c'],
        '$': [EPSILON]
    }
};