
# Example about Mapped Type in Typescript

## do this
```
host-os$ docker build . -t mapped-type-sample
host-os$ docker run -i -t -v /path/to/your/repository:/usr/local/src/typescript mapped-type-sample /bin/bash
guest-os$ yarn install
guest-os$ ./node_modules/.bin/tsc
guest-os$ node building/index.js
```

