export interface PathogenTestInfo {
  name: string;
  standard: string;
  result: string;
  type: "Bacteria" | "Spore" | "Virus" | "Fungus" | "Mycobacteria";
}

export const pathogenData: PathogenTestInfo[] = [
  { name: "C.difficile spores", standard: "AATCC 100 / JIS Z 2801", result: ">99.9% reduction (Log 3)", type: "Spore" },
  { name: "VRE", standard: "CG 147", result: "Bacteriostatic & Bactericidal", type: "Bacteria" },
  { name: "Pseudomonas aeruginosa", standard: "CG 147", result: "Bacteriostatic", type: "Bacteria" },
  { name: "Salmonella choleraesuis", standard: "AATCC 100", result: "Bactericidal", type: "Bacteria" },
  { name: "Aspergillus niger", standard: "AATCC 147", result: "Fungistatic", type: "Fungus" },
  { name: "Human Coronavirus", standard: "EN 14476", result: "Virucidal (Liquid Test)", type: "Virus" },
  { name: "Serratia marcescens", standard: "International Standard", result: "Effective", type: "Bacteria" },
  { name: "E.coli", standard: "AATCC 100 / ISO 20645", result: "Log 5 reduction", type: "Bacteria" },
  { name: "ESBL E.coli", standard: "AATCC 100", result: "Bactericidal", type: "Bacteria" },
  { name: "Acinetobacter baumanii", standard: "CG 147", result: "Bacteriostatic", type: "Bacteria" },
  { name: "Candida albicans", standard: "AATCC 100 / JIS Z 2801", result: "Fungicidal", type: "Fungus" },
  { name: "Measles virus", standard: "EN 14476", result: "Virucidal (Liquid Test)", type: "Virus" },
  { name: "MRSA", standard: "AATCC 100 / ISO 20743", result: ">99.999% reduction (Log 5)", type: "Bacteria" },
  { name: "E.hirae", standard: "CG 147", result: "Bacteriostatic", type: "Bacteria" },
  { name: "ESBL Klebsiella pneumoniae", standard: "CG 147", result: "Bacteriostatic", type: "Bacteria" },
  { name: "Mycobacteria tuberculosis", standard: "CG 147", result: "Bacteriostatic", type: "Mycobacteria" },
  { name: "Candidia auris", standard: "CG 147 / AATCC 100", result: "Fungistatic & Fungicidal", type: "Fungus" },
  { name: "H1N1 Swine flu", standard: "EN 14476", result: "Virucidal (Liquid Test)", type: "Virus" },
  { name: "Vaccinia virus", standard: "ISO 18184 / EN 14476", result: "Virucidal", type: "Virus" }
];
