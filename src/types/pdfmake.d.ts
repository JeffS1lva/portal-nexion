// src/types/pdfmake.d.ts
declare module "pdfmake/build/pdfmake" {
  const pdfMake: any;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  const pdfFonts: any;
  export default pdfFonts;
}

// Isso resolve o erro do vfs_fonts.js e mantém tudo funcionando
declare module "pdfmake/build/vfs_fonts.js" {
  const pdfFonts: any;
  export default pdfFonts;
}