// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  dest: 'build/app.js',
  format: 'iife',
  plugins: [
    nodeResolve(),
    svelte({
      // You can restrict which files are compiled
      // using `include` and `exclude`
      include: 'src/components/**.html'
    })
  ]
}
