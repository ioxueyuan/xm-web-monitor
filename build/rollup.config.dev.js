import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.ts',
	output: {
		file: 'lib/bundle.js',
		format: 'iife',
		// name: 'xm_monitor',
	},
	plugins: [nodeResolve(), commonjs(), typescript(), babel({ babelHelpers: 'runtime', exclude: /core-js/ })],
};
