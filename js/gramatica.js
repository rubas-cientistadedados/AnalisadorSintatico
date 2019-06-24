const EPSILON = 'ε';
const END_OF_STACK = '$';

const TERMINALS = ['a', 'b', 'c', 'd', 'e'];
const NON_TERMINALS = ['S', 'A', 'B', 'C', 'D'];

var grammar = {
    'S': ['Ae', 'aD'],
    'A': ['cC', 'dD', 'b'],
    'B': ['a', 'cCb', EPSILON],
    'C': ['De', 'aAe'],
    'D': ['ABd', 'eCc']
};

var parsingTable = {
    'S': {
        'a': ['a', 'D'],
        'b': ['A', 'e'],
        'c': ['A', 'e'],
        'd': ['A', 'e'],
    },
    'A': {
        'b': ['b'],
        'c': ['c', 'C'],
        'd': ['d', 'D']
    },
    'B': {
        'a': ['a'],
        'c': ['c', 'C', 'b'],
        'd': [EPSILON],
        '$': [EPSILON]
    },
    'C': {
        'a': ['a', 'A', 'e'],
        'b': ['D', 'e'],
        'c': ['D', 'e'],
        'd': ['D', 'e'],
        'e': ['D', 'e']
    },
    'D': {
        'b': ['A', 'B', 'd'],
        'c': ['A', 'B', 'd'],
        'd': ['A', 'B', 'd'],
        'e': ['e', 'C', 'c']
    }
};