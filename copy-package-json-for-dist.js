/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/jgbpercy/Loadables/blob/master/LICENSE
 */

// Credit Nicholas Jamieson https://github.com/cartant/rxjs-etc/blob/master/scripts/pack.js

const fs = require("fs");

const content = Object.assign({},
  JSON.parse(fs.readFileSync("./package.json")),
  JSON.parse(fs.readFileSync("./package-dist.json"))
);

fs.writeFileSync("./dist/package.json", JSON.stringify(content, null, 2));