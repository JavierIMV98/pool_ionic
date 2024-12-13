import { Injectable, signal, WritableSignal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection , SQLiteDBConnection} from '@capacitor-community/sqlite';

const DB_POOL = 'mydb';


export interface Mesa{
  numero :number;
  inicio: string;
  precio: number;
  extras: number;
}

export interface Cliente{
  id :number;
  nombre: string;
  deuda: number;
  extras: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection;
  private mesas: WritableSignal<Mesa[]> = signal<Mesa[]>([]);
  private clientes: WritableSignal<Cliente[]> = signal<Cliente[]>([]);
  constructor() { }


  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_POOL, false,'no-encrypton',1,false
    );
    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS mesas (numero INTEGER PRIMARY KEY, inicio TEXT NOT NULL, precio INTEGER NOT NULL, extras INTEGER );
    CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, deuda INTEGER, extras TEXT );`;

    await this.db.execute(schema);
    this.loadMesas();
    this.loadClientes();
    return true;
  }
  async loadMesas(){
    const mesas = await this.db.query('SELECT * FROM mesas')
    this.mesas.set(mesas.values || []);
  }
  async loadClientes(){
    const clientes = await this.db.query('SELECT * FROM clientes')
    this.clientes.set(clientes.values || []);
  }

  getClientes(){
    return this.clientes;
  }
  getMesas(){
    return this.mesas;
  }

  //CRUD MESAS:

  async insertMesa(mesa: Mesa) {
    const query = `INSERT INTO mesas (numero, inicio, precio, extras) VALUES (?, ?, ?, ?);`;
    const values = [mesa.numero, mesa.inicio, mesa.precio, mesa.extras];
    const result = await this.db.query(query, values);
    this.loadMesas();
    return result;
  }

  async updateMesa(mesa: Mesa) {
    const query = `UPDATE mesas SET inicio = ?, precio = ?, extras = ? WHERE numero = ?;`;
    const values = [mesa.inicio, mesa.precio, mesa.extras, mesa.numero];
    const result = await this.db.query(query, values);
    this.loadMesas();
    return result;
  }

  async deleteMesa(numero: number) {
    const query = `DELETE FROM mesas WHERE numero = ?;`;
    const result = await this.db.query(query, [numero]);
    this.loadMesas();
    return result;
  }


    //CRUD CLIENTES:

    async insertCliente(cliente: Cliente) {
      const query = `INSERT INTO cliente (nombre, deuda, extras) VALUES (?, ?, ?);`;
      const values = [cliente.nombre, cliente.deuda, cliente.extras];
      const result = await this.db.query(query, values);
      this.loadClientes();
      return result;
    }
  //parece que este no va a estar bien...
    async updateCliente(cliente: Cliente) {
      const query = `UPDATE cliente SET nombre = ?, deuda = ?, extras = ? WHERE id = ?;`;
      const values = [cliente.nombre, cliente.deuda, cliente.extras];
      const result = await this.db.query(query, values);
      this.loadClientes();
      return result;
    }
  
    async deleteCliente(id: number) {
      const query = `DELETE FROM clientes WHERE id = ?;`;
      const result = await this.db.query(query, [id]);
      this.loadClientes();
      return result;
    }
  
}
