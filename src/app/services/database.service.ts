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
  nombre: string;
  deuda: number;
  extras: string;
}

export interface RegistroHistorial{
  numero :number;
  inicio: string;
  final: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection;
  private mesas: WritableSignal<Mesa[]> = signal<Mesa[]>([]);
  private clientes: WritableSignal<Cliente[]> = signal<Cliente[]>([]);
  private registros: WritableSignal<RegistroHistorial[]> = signal<RegistroHistorial[]>([]);
  constructor() { }
  private nrosdisponibles: WritableSignal<number[]> = signal<number[]>([]);

  async initializPlugin(){
    this.db = await this.sqlite.createConnection(
      DB_POOL, false,'no-encrypton',1,false
    );
    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS mesas (numero INTEGER PRIMARY KEY, inicio TEXT NOT NULL, precio INTEGER NOT NULL, extras INTEGER );
    CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, deuda INTEGER, extras TEXT );
    CREATE TABLE IF NOT EXISTS historial (id INTEGER PRIMARY KEY AUTOINCREMENT, numero INTEGER, inicio TEXT NOT NULL, final TEXT NOT NULL, total INTEGER);`;

    await this.db.execute(schema);
    await this.loadMesas();
    await this.loadHistorial();
    await this.loadClientes();
    return true;
  }
  async loadMesas() {
    try {
      if (!this.db) {
        throw new Error('La base de datos no está inicializada.');
      }

      const result = await this.db.query('SELECT * FROM mesas');
      const mesas = result.values || [];

      const todosLosNumeros = Array.from({ length: 12 }, (_, i) => i + 1);
      const ocupados = mesas.map((m: any) => m.numero);
      this.nrosdisponibles.set(todosLosNumeros.filter(numero => !ocupados.includes(numero)));

      this.mesas.set(mesas);
    } catch (error) {
      console.error('Error al cargar las mesas:', error);
    }
  }
  getNrosDisp() {
    return this.nrosdisponibles.asReadonly();
  }
  


  async loadClientes(): Promise<Cliente[]> {
    try {
      if (!this.db) {
        throw new Error('La base de datos no está inicializada.');
      }
  
      const result = await this.db.query('SELECT * FROM clientes');
      const clientes = result.values || [];
      this.clientes.set(clientes);
      return clientes; // Devuelve los clientes
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  }
  

  async getClientes(): Promise<Cliente[]> {
    // Aquí debería ir tu lógica para recuperar clientes desde la base de datos
    const clientes: Cliente[] = []; // Simula un array de clientes
    return clientes;
  }
  
  getMesas(){
    return this.mesas();
  }
  getRegistros(){
    return this.registros();
  }
  async iniciarDB(){

  }

  //CRUD MESAS:

  async insertMesa(mesa: Mesa) {
    try {
      const query = `INSERT INTO mesas (numero, inicio, precio, extras) VALUES (?, ?, ?, ?) RETURNING *;;`;
      const values = [Number(mesa.numero), mesa.inicio, Number(mesa.precio), mesa.extras];
      console.log('Ejecutando query:', query, 'con valores:', values);
  
      const result = await this.db.query(query, values);
  
      console.log('Service Resultado de la inserción:', result);
      console.log('Service mesa...', this.mesas);
  
      await this.loadMesas(); // Recargar las mesas después de la inserción
      const verify = await this.db.query('SELECT * FROM mesas');
console.log('Service: Estado actual de la tabla mesas:', verify.values);
      return result;
    } catch (error) {
      console.error('Error en insertMesa:', error);
      throw error;
    }
    
  }

async updateMesa(mesa: Mesa) {
  try {
    const query = `UPDATE mesas SET inicio = ?, precio = ?, extras = ? WHERE numero = ?;`;
    const values = [mesa.inicio, mesa.precio, mesa.extras, mesa.numero];

    console.log('Ejecutando query:', query);
    console.log('Valores:', values);

    const result = await this.db.query(query, values);
    console.log('Resultado del query:', result);

    // Si el método no lanza un error, asumimos que el query fue exitoso
    if (result && Object.keys(result).length > 0) {
      console.log('Mesa actualizada correctamente.');
      await this.loadMesas(); // Actualizar la lista de mesas
      return true;
    } else {
      console.error('No se actualizó ninguna fila. Verifica los datos.');
      return false;
    }
  } catch (error) {
    console.error('Error al actualizar la mesa:', error);
    throw error;
  }
}

  

  async deleteMesa(numero: number) {
    const query = `DELETE FROM mesas WHERE numero = ?;`;
    const result = await this.db.query(query, [numero]);
    this.loadMesas();
    return result;
  }


    //CRUD CLIENTES:

    async insertCliente(cliente: Cliente) {
      const query = `INSERT INTO clientes (nombre, deuda, extras) VALUES (?, ?, ?);`;
      const values = [cliente.nombre, cliente.deuda, cliente.extras];
      const result = await this.db.query(query, values);
      await this.loadClientes();
      return result;
    }
  //parece que este no va a estar bien...
    async updateCliente(cliente: Cliente) {
      const query = `UPDATE clientes SET deuda = ?, extras = ? WHERE nombre = ?;`;
      const values = [cliente.deuda, cliente.extras, cliente.nombre];
      const result = await this.db.query(query, values);
      this.loadClientes();
      return result;
    }
  
    async deleteCliente(nombre:string, deuda:number, extras:string) {
      const query = `DELETE FROM clientes WHERE nombre = ? AND deuda = ? AND extras = ? ;`;
      const result = await this.db.query(query, [nombre, deuda, extras]);
      this.loadClientes();
      return result;
    }

// CRUD HISTORIAL

async loadHistorial() {
  try {
    if (!this.db) {
      throw new Error('La base de datos no está inicializada.');
    }

    const result = await this.db.query('SELECT * FROM historial ORDER BY id DESC');
    const hists = result.values || [];

    this.registros.set(hists);
  } catch (error) {
    console.error('Error al cargar registros', error);
  }
}

    async insertRegistro(registroHistorial: RegistroHistorial) {
      const query = `INSERT INTO historial (numero, inicio, final, total) VALUES (?, ?, ?, ?);`;
      const values = [registroHistorial.numero, registroHistorial.inicio, registroHistorial.final, registroHistorial.total];
      const result = await this.db.query(query, values);
      this.loadHistorial();
      return result;
    }

    async deleteHistorial(numero: number, inicio: string, final: string, total: number) {
      try {
        const query = `
          DELETE FROM historial 
          WHERE numero = ? AND inicio = ? AND final = ? AND total = ?;
        `;
        const result = await this.db.query(query, [numero, inicio, final, total]);
        await this.loadHistorial(); // Recargar el historial después de eliminar
        return result;
      } catch (error) {
        console.error('Error al eliminar el historial:', error);
        throw error;
      }
    }
    

    async borrarHistorial() {
      const query = `DELETE FROM historial;`;
      const result = await this.db.query(query);
      this.loadHistorial();
      return result;
    }


    async calcularTotalesHistorial(): Promise<{ cantidad: number; suma: number }> {
      try {
        if (!this.db) {
          throw new Error('La base de datos no está inicializada.');
        }
    
        // Ajusta la consulta para contar todos los registros, pero sumar solo los valores mayores a 4000
        const query = `
          SELECT 
            COUNT(*) AS cantidad, 
            SUM(CASE WHEN total > 4000 THEN total ELSE 0 END) AS suma 
          FROM historial;
        `;
    
        const result = await this.db.query(query);
        const row = result.values?.[0] || { cantidad: 0, suma: 0 };
    
        return { cantidad: row.cantidad, suma: row.suma };
      } catch (error) {
        console.error('Error al calcular totales:', error);
        return { cantidad: 0, suma: 0 }; // Devuelve valores predeterminados en caso de error
      }
    }
    
      // Función para verificar si la mesa existe en la base de datos
  async verificarMesa(numeroMesa: number): Promise<boolean> {
    try {
      const query = `SELECT COUNT(*) AS count FROM mesas WHERE numero = ?;`;
      const result = await this.db.query(query, [numeroMesa]);
      const count = result.values?.[0]?.count || 0;
      return count > 0; // Si el conteo es mayor que 0, la mesa existe.
    } catch (error) {
      console.error('Error al verificar mesa:', error);
      throw error; // Puedes manejar este error según tu lógica
    }
  }

  // Función para reemplazar la mesa
  async reemplazarMesa(mesa: Mesa) {
    console.log("Reemplazar Servicio...")
    try {
      const query = `
        INSERT INTO mesas (numero, inicio, precio, extras)
        VALUES (?, ?, ?, ?);
      `;
      const values = [mesa.numero, mesa.inicio, mesa.precio, mesa.extras];
      await this.db.query(query, values);
  
      // Recargar las mesas después del reemplazo
      await this.loadMesas();
    } catch (error) {
      console.error('Error al reemplazar la mesa:', error);
      throw error;
    }
  }
  

}

