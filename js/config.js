
export const sections = {
  1: { name: 'Åsbygda'},
  3: { 
    name: 'Kleggerud', 
    slide: 2, 
    docId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Z2VvdGVrXzIwMjEvUDAzLUtsZWdnZXJ1ZC1vdmVyZ2FuZ3NicnUucnZ0',
    phases: {
      1: { timeExtent: { start: new Date(2020, 5, 11) , end: new Date(2020, 5, 12)}},
      2: { timeExtent: { start: new Date(2020, 5, 17) , end: new Date(2020, 5, 18)}},
      3: { timeExtent: { start: new Date(2020, 5, 18) , end: new Date(2020, 5, 19)}},
      4: { timeExtent: { start: new Date(2020, 5, 19) , end: new Date(2020, 5, 20)}},
      5: { timeExtent: { start: new Date(2020, 5, 20) , end: new Date(2020, 5, 21)}},
      6: { timeExtent: { start: new Date(2020, 5, 21) , end: new Date(2020, 5, 22)}},
      7: { timeExtent: { start: new Date(2020, 5, 22) , end: new Date(2020, 5, 23)}}
    }
  },
  5: {
      name: 'Moselva',  
      slide: 3, 
      docId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Z2VvdGVrXzIwMjEvUDA1LU1vc2VsdmEtYnJ1LnJ2dA',
      phases: {
        1: {slide: 9},
        2: {slide: 9},
        3: {slide: 9},
        4: {slide: 10},
        5: {slide: 10},
        6: {slide: 10},
        7: {slide: 11}
      }
    },
  7: { name: 'Svenådalen', slide: 4, docId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Z2VvdGVrXzIwMjEvUDA3LVN2ZW5hJUNDJThBZGFsZW4tYnJ1X1YzLnJ2dA'},
  9: { name: 'Søtbakkdalen', slide: 5, docId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Z2VvdGVrXzIwMjEvUDA5LVMlQzMlQjh0YmFra2RhbGVuLW92ZXJnYW5nc2JydS5ydnQ'},
  10: { name: '', slide: 6, docId: 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Z2VvdGVrXzIwMjEvUDEwLUJla2tlc3R1YS1icnUucnZ0'},
  21: { name: 'Olum'}
}

export const dayToPhase = {
  11: 1,
  12: 2,
  13: 2,
  14: 3,
  15: 3,
  16: 4,
  17: 4,
  18: 5,
  19: 5,
  20: 6,
  21: 6,
  22: 7,
  23: 7
}

export const phaseToDay = {
  1: 11,
  2: 12,
  3: 14,
  4: 16,
  5: 18,
  6: 20,
  7: 22
}




