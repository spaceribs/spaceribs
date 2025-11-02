import { Edge } from './edge';

describe('Edge', () => {
  describe('type definition', () => {
    it('should accept string values', () => {
      const stringEdge: Edge = 'wall';
      const anotherStringEdge: Edge = 'floor';
      const emptyStringEdge: Edge = '';

      expect(stringEdge).toBe('wall');
      expect(anotherStringEdge).toBe('floor');
      expect(emptyStringEdge).toBe('');
    });

    it('should accept symbol values', () => {
      const symbolEdge: Edge = Symbol('wall');
      const anotherSymbolEdge: Edge = Symbol('floor');
      const uniqueSymbolEdge: Edge = Symbol();

      expect(typeof symbolEdge).toBe('symbol');
      expect(typeof anotherSymbolEdge).toBe('symbol');
      expect(typeof uniqueSymbolEdge).toBe('symbol');
      expect(symbolEdge).not.toBe(anotherSymbolEdge);
    });

    it('should handle mixed edge types', () => {
      const edges: Edge[] = [
        'wall',
        'floor',
        Symbol('door'),
        'ceiling',
        Symbol('window'),
      ];

      expect(edges).toHaveLength(5);
      expect(edges[0]).toBe('wall');
      expect(edges[1]).toBe('floor');
      expect(typeof edges[2]).toBe('symbol');
      expect(edges[3]).toBe('ceiling');
      expect(typeof edges[4]).toBe('symbol');
    });
  });

  describe('string edges', () => {
    it('should handle common tile edge types', () => {
      const wallEdge: Edge = 'wall';
      const floorEdge: Edge = 'floor';
      const doorEdge: Edge = 'door';
      const windowEdge: Edge = 'window';
      const ceilingEdge: Edge = 'ceiling';

      expect(wallEdge).toBe('wall');
      expect(floorEdge).toBe('floor');
      expect(doorEdge).toBe('door');
      expect(windowEdge).toBe('window');
      expect(ceilingEdge).toBe('ceiling');
    });

    it('should handle numeric string edges', () => {
      const numericEdge: Edge = '1';
      const anotherNumericEdge: Edge = '42';

      expect(numericEdge).toBe('1');
      expect(anotherNumericEdge).toBe('42');
    });

    it('should handle special character edges', () => {
      const specialEdge: Edge = '!@#$%^&*()';
      const unicodeEdge: Edge = '🚪';
      const spaceEdge: Edge = ' ';

      expect(specialEdge).toBe('!@#$%^&*()');
      expect(unicodeEdge).toBe('🚪');
      expect(spaceEdge).toBe(' ');
    });

    it('should handle empty string edge', () => {
      const emptyEdge: Edge = '';

      expect(emptyEdge).toBe('');
      expect(emptyEdge.length).toBe(0);
    });
  });

  describe('symbol edges', () => {
    it('should create unique symbols', () => {
      const symbol1: Edge = Symbol('wall');
      const symbol2: Edge = Symbol('wall');
      const symbol3: Edge = Symbol('floor');

      expect(symbol1).not.toBe(symbol2);
      expect(symbol1).not.toBe(symbol3);
      expect(symbol2).not.toBe(symbol3);
    });

    it('should handle symbols with descriptions', () => {
      const wallSymbol: Edge = Symbol('wall');
      const floorSymbol: Edge = Symbol('floor');
      const doorSymbol: Edge = Symbol('door');

      expect(wallSymbol.toString()).toBe('Symbol(wall)');
      expect(floorSymbol.toString()).toBe('Symbol(floor)');
      expect(doorSymbol.toString()).toBe('Symbol(door)');
    });

    it('should handle symbols without descriptions', () => {
      const uniqueSymbol: Edge = Symbol();
      const anotherUniqueSymbol: Edge = Symbol();

      expect(uniqueSymbol).not.toBe(anotherUniqueSymbol);
      expect(uniqueSymbol.toString()).toMatch(/^Symbol\(\)$/);
    });

    it('should handle symbols with empty descriptions', () => {
      const emptyDescSymbol: Edge = Symbol('');

      expect(emptyDescSymbol.toString()).toBe('Symbol()');
    });
  });

  describe('edge comparison', () => {
    it('should compare string edges correctly', () => {
      const edge1: Edge = 'wall';
      const edge2: Edge = 'wall';
      const edge3: Edge = 'floor';

      expect(edge1).toBe(edge2);
      expect(edge1).not.toBe(edge3);
      expect(edge2).not.toBe(edge3);
    });

    it('should compare symbol edges correctly', () => {
      const symbol1: Edge = Symbol('wall');
      const symbol2: Edge = Symbol('wall');
      const symbol3: Edge = Symbol('floor');

      expect(symbol1).not.toBe(symbol2); // Different symbol instances
      expect(symbol1).not.toBe(symbol3);
      expect(symbol2).not.toBe(symbol3);
    });

    it('should not compare string and symbol edges as equal', () => {
      const stringEdge: Edge = 'wall';
      const symbolEdge: Edge = Symbol('wall');

      expect(stringEdge).not.toBe(symbolEdge);
      expect(stringEdge as any === symbolEdge).toBe(false);
    });
  });

  describe('edge usage in collections', () => {
    it('should work in Set collections', () => {
      const edgeSet = new Set<Edge>();

      edgeSet.add('wall');
      edgeSet.add('floor');
      edgeSet.add(Symbol('door'));
      edgeSet.add('wall'); // Duplicate string

      expect(edgeSet.size).toBe(3);
      expect(edgeSet.has('wall')).toBe(true);
      expect(edgeSet.has('floor')).toBe(true);
      expect(edgeSet.has(Symbol('door'))).toBe(false); // Different symbol instance
    });

    it('should work in Map collections', () => {
      const edgeMap = new Map<Edge, string>();

      edgeMap.set('wall', 'solid');
      edgeMap.set('floor', 'walkable');
      edgeMap.set(Symbol('door'), 'passable');

      expect(edgeMap.size).toBe(3);
      expect(edgeMap.get('wall')).toBe('solid');
      expect(edgeMap.get('floor')).toBe('walkable');
      expect(edgeMap.get(Symbol('door'))).toBeUndefined(); // Different symbol instance
    });

    it('should work in Array collections', () => {
      const edges: Edge[] = ['wall', 'floor', Symbol('door'), 'ceiling'];

      expect(edges).toHaveLength(4);
      expect(edges[0]).toBe('wall');
      expect(edges[1]).toBe('floor');
      expect(typeof edges[2]).toBe('symbol');
      expect(edges[3]).toBe('ceiling');
    });
  });

  describe('edge type checking', () => {
    it('should allow type checking with typeof', () => {
      const stringEdge: Edge = 'wall';
      const symbolEdge: Edge = Symbol('wall');

      expect(typeof stringEdge).toBe('string');
      expect(typeof symbolEdge).toBe('symbol');
    });

    it('should allow instanceof checks for symbols', () => {
      const symbolEdge: Edge = Symbol('wall');

      expect(typeof symbolEdge).toBe('symbol');
    });

    it('should allow string methods for string edges', () => {
      const stringEdge: Edge = 'wall';

      expect(stringEdge.toUpperCase()).toBe('WALL');
      expect(stringEdge.length).toBe(4);
      expect(stringEdge.includes('all')).toBe(true);
    });
  });

  describe('edge serialization', () => {
    it('should serialize string edges correctly', () => {
      const stringEdge: Edge = 'wall';

      expect(JSON.stringify(stringEdge)).toBe('"wall"');
      expect(JSON.parse(JSON.stringify(stringEdge))).toBe('wall');
    });

    it('should handle symbol edges in JSON', () => {
      const symbolEdge: Edge = Symbol('wall');

      expect(JSON.stringify(symbolEdge)).toBe(undefined);
      // JSON.parse cannot parse undefined, so we test the stringify result directly
      expect(JSON.stringify(symbolEdge)).toBe(undefined);
    });

    it('should handle mixed edges in objects', () => {
      const edgeObject = {
        wall: 'wall' as Edge,
        door: Symbol('door') as Edge,
        floor: 'floor' as Edge,
      };

      const serialized = JSON.stringify(edgeObject);
      const parsed = JSON.parse(serialized);

      expect(parsed.wall).toBe('wall');
      expect(parsed.floor).toBe('floor');
      expect(parsed.door).toBe(undefined); // Symbol becomes undefined in JSON
    });
  });

  describe('edge edge cases', () => {
    it('should handle very long string edges', () => {
      const longEdge: Edge = 'a'.repeat(1000);

      expect(longEdge.length).toBe(1000);
      expect(longEdge).toBe('a'.repeat(1000));
    });

    it('should handle string edges with newlines', () => {
      const newlineEdge: Edge = 'wall\nfloor';
      const tabEdge: Edge = 'wall\tfloor';

      expect(newlineEdge).toBe('wall\nfloor');
      expect(tabEdge).toBe('wall\tfloor');
    });

    it('should handle symbol edges with special characters in description', () => {
      const specialSymbol: Edge = Symbol('wall\nfloor');
      const unicodeSymbol: Edge = Symbol('🚪');

      expect(specialSymbol.toString()).toBe('Symbol(wall\nfloor)');
      expect(unicodeSymbol.toString()).toBe('Symbol(🚪)');
    });

    it('should handle edge type coercion', () => {
      const stringEdge: Edge = 'wall';
      const numberStringEdge: Edge = '42';

      expect(stringEdge == 'wall').toBe(true);
      expect(numberStringEdge == '42').toBe(true);
      expect(numberStringEdge as any == 42).toBe(true); // Type coercion
    });
  });
});
