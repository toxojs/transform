const { transform } = require('../src');

describe('transform', () => {
  it('Should transform an object based on its values and object paths to a source object', () => {
    const input = {
      name: 'Jesús',
      surname: 'Seijas',
      measures: {
        age: 45,
        height: 176,
        weight: 75,
      },
      data: [1, 2, 3],
    };

    const transformation = {
      personalData: {
        name: '@name',
        surname: '@surname',
        title: 'Mr.',
        age: '@measures.age',
        control: '@@something',
      },
      kpis: {
        height: '@measures.height',
        weight: '@measures.weight',
        control: '@data[1]',
      },
      kpisArr: ['@measures.height', '@measures.weight', '@data[1]'],
      id: 7,
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        surname: 'Seijas',
        title: 'Mr.',
        age: 45,
        control: '@something',
      },
      kpis: {
        height: 176,
        weight: 75,
        control: 2,
      },
      kpisArr: [176, 75, 2],
      id: 7,
    };

    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
  it('Should use default values that are strings', () => {
    const input = {
      name: 'Jesús',
    };

    const transformation = {
      personalData: {
        name: '@name',
        surname: '@surname || "Doe"',
      },
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        surname: 'Doe',
      },
    };
    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
  it('Should use default values that are integers', () => {
    const input = {
      name: 'Jesús',
    };

    const transformation = {
      personalData: {
        name: '@name',
        age: '@age || 45',
      },
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        age: 45,
      },
    };
    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
  it('Should use default values that are float', () => {
    const input = {
      name: 'Jesús',
    };

    const transformation = {
      personalData: {
        name: '@name',
        age: '@age || 45.4',
      },
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        age: 45.4,
      },
    };
    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
  it('Should use default values that are strings surronded by double quotes', () => {
    const input = {
      name: 'Jesús',
    };

    const transformation = {
      personalData: {
        name: '@name',
        age: '@age || "45.4"',
      },
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        age: '45.4',
      },
    };
    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
  it('Should use default values that are booleans', () => {
    const input = {
      name: 'Jesús',
    };

    const transformation = {
      personalData: {
        name: '@name',
        checked: '@age || true',
      },
    };
    const expected = {
      personalData: {
        name: 'Jesús',
        checked: true,
      },
    };
    const actual = transform(input, transformation);
    expect(actual).toEqual(expected);
  });
});
