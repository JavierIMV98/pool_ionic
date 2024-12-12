import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonInput } from '@ionic/angular/standalone';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, FormsModule, NgFor],
  providers:[SQLite]
})
export class Tab2Page {
deleteRegistro() {
  this.db.transaction(()=>{
    this.db.executeSql('delete from clients where name = ?',['client'])
  }).then((result)=>{
    alert("record deleted")
  }).catch((e)=>alert(JSON.stringify(e))).then(()=>{
    alert('transaction successful');
  }).catch(e => alert(JSON.stringify(e)));
}
updateRegistro() {
this.db.transaction(()=>{
  this.db.executeSql('update clients set name=? where name = ?',['clientee', 'client'])
}).then((result)=>{
  alert(JSON.stringify(result))
  alert("Table updated")
}).catch((e)=>alert(JSON.stringify(e))).then(()=>{
  alert('transaction successful');
}).catch(e => alert(JSON.stringify(e)));
}
selectDataCondition() {
 this.clientData = [];
 this.db.executeSql('select * from clients where name = ?',['cliente']).then((result)=> {
  for(let i = 0; i < result.rows.length; i++){
    this.clientData.push({client_name:result.rows.item(i).name, "client_deuda":result.rows.item(i).price})
  }
}).catch(e => alert(JSON.stringify(e)))
}
selectData() {
  this.clientData = [];
  this.db.executeSql('select * from clients',[]).then((result)=> {
    for(let i = 0; i < result.rows.length; i++){
      this.clientData.push({client_name:result.rows.item(i).name, "client_deuda":result.rows.item(i).price})
    }
  }).catch(e => alert(JSON.stringify(e)))
}
  clientData:cliente[];
  client_name:string;
client_deuda:string;
db:SQLiteObject;

insertData() {
  let query:string = 'insert into clients (name,price) values("'+this.client_name +' ","'+this.client_deuda + '")';
  this.db.executeSql(query, []).then(() => alert('Registrado')).catch(e => alert(JSON.stringify(e)));
}


  constructor(private sqlite: SQLite) {}
createTable() {
 this.db.executeSql('create table IF NOT EXISTS clients (name VARCHAR(32), price varchar(10))', []).then((result) => alert('table created')).catch((e)=> alert(JSON.stringify(e)))
}
createOpenDatabase() {
  try{
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
  }).then((db: SQLiteObject) => {
    this.db = db;
    alert('db created/opened')
  })
}catch(err:any){
alert(err)
  }

  
}
}

class cliente{
  public client_name:string;
  public client_deuda:string;
}
