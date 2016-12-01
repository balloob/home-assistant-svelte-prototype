import closure from 'rollup-plugin-closure-compiler-js';

export default {
  entry: 'build/app.js',
  dest: 'build/app.min.js',
  plugins: [
    closure({
      languageIn: 'ECMASCRIPT6',
      languageOut: 'ECMASCRIPT5',
      // compilationLevel: 'ADVANCED',
      warningLevel: 'DEFAULT',
    })
  ]
}
