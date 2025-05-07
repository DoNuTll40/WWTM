/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2';
import fs from 'fs'
import path from 'path'

// โหลด SSL Certificates
const key = fs.readFileSync(path.resolve(__dirname, './ssl/key.pem'))
const cert = fs.readFileSync(path.resolve(__dirname, './ssl/cert.pem'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      verbose: true,
      disable: false,
      threshold: 5120,      // ลด threshold เป็น 5KB
      algorithm: 'gzip',  // ใช้ Gzip แทน Brotli
      ext: '.gz',         // เพิ่มนามสกุล .gz
    }),
  ],
  build: {
    cssCodeSplit: true,    // เปิดใช้งาน CSS Code Splitting
  },
  // server: {
  //   https: {
  //     key,
  //     cert,
  //   },
  // },
})
