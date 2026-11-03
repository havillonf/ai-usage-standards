import type {Roteiro} from '../tipos';
import {configurar} from './configurar';
import {estenderInstrucao, estenderMcp, estenderSkill} from './estender';

/** Todos os roteiros guiados. Cada um gera as rotas `caminho` e `caminho/roteiro`. */
export const ROTEIROS: Roteiro[] = [configurar, estenderInstrucao, estenderSkill, estenderMcp];
