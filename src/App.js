import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './auth/login'
import page from './pages/home';
import Guru from './pages/guru/Guru';
import Murid from './pages/murid/Murid';
import Kelas from './pages/kelas/Kelas';
import Mapel from './pages/mapel/Mapel';
import Private from "./components/private";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './pages/home';
import UbahGuru from './pages/guru/Edit_Guru'
import Register from './auth/register';
import UbahMurid from './pages/murid/Edit_murid'
import TambahMurid from './pages/murid/AddMurid';
import AddGuru from './pages/guru/AddGuru';
import UbahKelas from './pages/kelas/Edit_kelas';
import AddKelas from './pages/kelas/AddKelas';
import AddMapel from './pages/mapel/AddMapel';
import UbahMapel from './pages/mapel/Edit_Mapel'
import Coba from './pages/coba';
import Auth from './auth/auth';

function App() {
  return (
    <Router>
        <Sidebar />
        <Switch>
          <Private path="/dashboard" component={Dashboard} />
          <Private path="/" component={page} exact/>

          <Route path="/register" component={Register} exact/>
          <Route path="/login" component={Login} exact/>

          <Private path="/murid" component={Murid} exact/>
          <Private path="/edit_murid/:id" component={UbahMurid} exact/>
          <Private path="/add_murid" component={TambahMurid} />

          <Private path="/guru" component={Guru} exact/>
          <Private path="/add_guru" component={AddGuru} exact/>
          <Private path="/edit_guru/:id" component={UbahGuru} exact/>

          <Private path="/kelas" component={Kelas} exact/>
          <Private path="/add_kelas" component={AddKelas} />
          <Private path="/edit_kelas/:id" component={UbahKelas} exact/>

          <Private path="/mapel" component={Mapel} exact/>
          <Private path="/add_mapel" component={AddMapel} exact/>
          <Private path="/edit_mapel/:id" component={UbahMapel} exact/>

          <Route path="/coba" component={Coba} exact />
          <Route path="/auth" component={Auth} />
        </Switch>
    </Router>
  );
}

export default App;
