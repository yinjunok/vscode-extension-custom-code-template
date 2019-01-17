import * as fs from 'fs';

const readFilePromise = (src: string): Promise<string> => {
  return new Promise((res, rej) => {
    fs.readFile(src, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        rej(err);
      }
      res(data);
    })
  });
};

const statePromise = (src: string): Promise<fs.Stats> => {
  return new Promise((res, rej) => {
    fs.stat(src, (err, stats) => {
      if (err) {
        rej(err);
      }

      res(stats);
    });
  });
}

const readdirPromise = (src: string): Promise<string[]> => {
  return new Promise((res, rej) => {
    fs.readdir(src, (err, data) => {
      if (err) {
        rej(err);
      }

      res(data);
    });
  });
}

export {
  readFilePromise,
  statePromise,
  readdirPromise,
};