import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require('./package.json');

const RollupConfig = [
  {
    input: 'libs/index.ts',
    output: [
      {
        file: 'dist/' + packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/' + packageJson.module,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      filesize(),
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      }),
      postcss({
        extract: true, // Optional: Extracts the CSS to a separate file
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.lib.json',
        declaration: true,
        sourceMap: true,
      }),
      terser(),
      copy({
        targets: [
          { src: 'package.json', dest: 'dist' },
          { src: 'libs/stylox/**/*.scss', dest: 'dist' },
          { src: 'libs/stylox/**/*.css', dest: 'dist' },
          {
            src: 'README.md',
            dest: 'dist',
          },
        ],
        flatten: false,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'quill',
      '@headlessui/react',
      '@fortawesome/react-fontawesome',
      '@fortawesome/pro-light-svg-icons',
      'classnames',
      'next/link',
      'lodash',
      'react-chartjs-2',
      'chart.js',
      '@tanstack/react-query',
      '@mui/material/Box',
      '@mui/material/styles',
      '@mui/material/LinearProgress',
      '@heroicons/react/20/solid',
      'next/navigation',
      '@heroicons/react/24/outline',
      '@mui/material/Switch',
      '@heroicons/react/24/solid',
      'react-hook-form',
      'moment-timezone',
      'framer-motion',
      '@hookform/error-message',
      'swiper',
      'swiper/react',
      'swiper/modules',
      'zustand',
      'react-easy-crop',
      'react-toastify',
    ],
  },
  {
    input: 'libs/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      typescript({
        tsconfig: './tsconfig.lib.json',
      }),
    ],
  },
];

export default RollupConfig;
