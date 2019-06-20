const EPSILON = '&';
const END_OF_STACK = '$';

const TERMINALS = ['a', 'b', 'c', 'd', 'e'];
const NON_TERMINALS = ['S', 'A', 'B', 'C', 'D'];

var grammar = {
    'S': ['AC', 'aB' ],
    'A': ['bB', 'aS' ],
    'B': ['cCa', 'AB'],
    'C': ['Bc', 'bCa', EPSILON],
    'D': []
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