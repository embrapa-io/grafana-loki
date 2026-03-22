/**
 * Inicialização do banco de dados SQLite.
 *
 * Configura pragmas (WAL, foreign_keys, busy_timeout)
 * e executa o DDL de criação das tabelas.
 */

import Database from 'better-sqlite3';
import type { Logger } from 'pino';
import { SCHEMA_DDL } from './schema.js';

export interface InitDbOptions {
    dbPath: string;
    logger: Logger;
}

/**
 * Inicializa o banco SQLite, configura pragmas e cria tabelas.
 * Retorna a instância do banco pronta para uso.
 */
export function initDatabase({ dbPath, logger }: InitDbOptions): Database.Database {
    const db = new Database(dbPath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    db.exec(SCHEMA_DDL);

    logger.info({ dbPath }, 'Banco de dados SQLite inicializado');

    return db;
}
