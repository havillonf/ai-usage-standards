// Stacks da página "Exemplos por stack". O corte segue as tecnologias mais
// usadas na Stack Overflow Developer Survey 2026 (web, testes), mais as de
// análise de dados usadas no laboratório.

export type Camada = 'front' | 'back' | 'testes' | 'dados';

export const CAMADAS: {id: Camada; rotulo: string}[] = [
  {id: 'front', rotulo: 'Front-end'},
  {id: 'back', rotulo: 'Back-end'},
  {id: 'testes', rotulo: 'Testes e qualidade'},
  {id: 'dados', rotulo: 'Análise de dados'},
];

export type StackId =
  | 'react'
  | 'nextjs'
  | 'angular'
  | 'vue'
  | 'nuxt'
  | 'svelte'
  | 'node'
  | 'nestjs'
  | 'fastapi'
  | 'django'
  | 'flask'
  | 'spring'
  | 'dotnet'
  | 'laravel'
  | 'playwright'
  | 'cypress'
  | 'selenium'
  | 'pytest'
  | 'junit'
  | 'jest-vitest'
  | 'postman'
  | 'sonarqube'
  | 'jupyter'
  | 'pandas';

export interface Stack {
  id: StackId;
  nome: string;
  camada: Camada;
}

export const STACKS: Stack[] = [
  {id: 'react', nome: 'React', camada: 'front'},
  {id: 'nextjs', nome: 'Next.js', camada: 'front'},
  {id: 'angular', nome: 'Angular', camada: 'front'},
  {id: 'vue', nome: 'Vue', camada: 'front'},
  {id: 'nuxt', nome: 'Nuxt', camada: 'front'},
  {id: 'svelte', nome: 'Svelte / SvelteKit', camada: 'front'},
  {id: 'node', nome: 'Node.js / Express', camada: 'back'},
  {id: 'nestjs', nome: 'NestJS', camada: 'back'},
  {id: 'fastapi', nome: 'FastAPI', camada: 'back'},
  {id: 'django', nome: 'Django', camada: 'back'},
  {id: 'flask', nome: 'Flask', camada: 'back'},
  {id: 'spring', nome: 'Spring Boot', camada: 'back'},
  {id: 'dotnet', nome: '.NET / ASP.NET Core', camada: 'back'},
  {id: 'laravel', nome: 'Laravel', camada: 'back'},
  {id: 'playwright', nome: 'Playwright', camada: 'testes'},
  {id: 'cypress', nome: 'Cypress', camada: 'testes'},
  {id: 'selenium', nome: 'Selenium', camada: 'testes'},
  {id: 'pytest', nome: 'pytest', camada: 'testes'},
  {id: 'junit', nome: 'JUnit', camada: 'testes'},
  {id: 'jest-vitest', nome: 'Jest / Vitest', camada: 'testes'},
  {id: 'postman', nome: 'Postman (API)', camada: 'testes'},
  {id: 'sonarqube', nome: 'SonarQube', camada: 'testes'},
  {id: 'jupyter', nome: 'Jupyter', camada: 'dados'},
  {id: 'pandas', nome: 'pandas', camada: 'dados'},
];

export const STACKS_POR_ID = Object.fromEntries(STACKS.map((s) => [s.id, s])) as Record<StackId, Stack>;

export function stacksDaCamada(camada: Camada): StackId[] {
  return STACKS.filter((s) => s.camada === camada).map((s) => s.id);
}
