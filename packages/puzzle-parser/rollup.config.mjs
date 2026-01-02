import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // ESM + CJS builds
  {
    input: 'src/index.ts',
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json', declaration: true })
    ],
    output: [
      { file: 'dist/esm/index.js', format: 'es', sourcemap: true },
      { file: 'dist/cjs/index.cjs', format: 'cjs', sourcemap: true }
    ]
  },
  // Type declarations bundle
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: { file: 'dist/index.d.ts', format: 'es' }
  }
];

