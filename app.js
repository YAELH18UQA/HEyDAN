import { app } from "./firebase.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

let user = null;

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const container = document.querySelector("#container");
  checarEstado(user);
  if (user) {
    container.innerHTML = `<h1>${user.email}</h1>
        <button class="btn btn-success btn-lg float-end m-2" data-bs-toggle="modal"  id="btnAgregarAlumno" data-bs-target="#agregarModal"><i class="bi bi-plus-square-fill m-2"></i>Agregar</button>
        <table class="table">
            <thead class="table table-danger">
                <tr>
                <th scope="col" style="color:black;"><center>ID DEL PRODUCTO</th>
                <th scope="col" style="color:black;"><center>NOMBRE</th>
                <th scope="col" style="color:black;"><center>PRECIO</th>
                <th scope="col" style="color:black;"><center>MARCA DEL PROVEEDOR</th>
                <th scope="col" style="color:black;"><center>CADUCIDAD</th>
                <th scope="col" style="color:black;"><center>CONTENIDO DEL PRODUCTO</th>
                <th scope="col" style="color:black;"><center>ELIMINAR</th>
                <th scope="col" style="color:black;"><center>EDITAR</th>
                <th scope="col" style="color:black;"><center>QR</th>
                </tr>
            </thead>
            <tbody id="listas">

            </tbody>
        </table>
        `;
    const uid = user.uid;
  } else {
    container.innerHTML = `<h1>NO HAY USUARIO</h1>`;
  }
});


const btnGit = document.querySelector("#btnGit");
btnGit.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GithubAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider)
    user=credentials.user;
    const modalInstance = bootstrap.Modal.getInstance(btnGit.closest('.modal'));
    modalInstance.hide();
    checarEstado(user)

  } catch (error) {
    console.log(error);
  }
});


const btnFace = document.querySelector("#btnFace");
btnFace.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new FacebookAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider)
    user=credentials.user;
    const modalInstance = bootstrap.Modal.getInstance(btnFace.closest('.modal'));
    modalInstance.hide();
    checarEstado(user)

  } catch (error) {
    console.log(error);
  }
});


const btnAnonimo=document.querySelector("#btnAnonimo");
btnAnonimo.addEventListener('click', async(e)=>{
  e.preventDefault();
  try {
    const result=await signInAnonymously(auth);
    console.log(result);
    user=result.user;
    bootstrap.Modal.getInstance(document.getElementById('iniciarModal')).hide();
  }catch (error) {
   Swal.fire('ERROR AL INICIAR CON ANONIMO') 
  }
});



const btnGoogle = document.querySelector("#btnGoogle");
btnGoogle.addEventListener("click", async (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  try {
    const credentials = await signInWithPopup(auth, provider);
    user.modalInstance = bootstrap.Modal.getInstance(
      btnGoogle.closest(".modal")
    );
    modalInstance.hide();
    checarEstado(user);
  } catch (error) {
    console.log(error);
    bootstrap.Modal.getInstance(document.getElementById("iniciarModal")).hide();
  }
});

const checarEstado = (user = null) => {
  console.log(user);
  if (user == null) {
    document.querySelector("#iniciar").style.display = "block";
    document.querySelector("#crear").style.display = "block";
    document.querySelector("#btnCerrarSesion").style.display = "none";
  } else {
    document.querySelector("#iniciar").style.display = "none";
    document.querySelector("#crear").style.display = "none";
    document.querySelector("#btnCerrarSesion").style.display = "block";
  }
};

const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
btnCerrarSesion.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    checarEstado();
  } catch (error) {
    console.log(error);
  }
});

const btnIniciarSesion = document.querySelector("#btnIniciarSesion");
btnIniciarSesion.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#IniciarEmail");
  const password = document.querySelector("#IniciarPassword");
  try {
    const res = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    user = res.user;
    Swal.fire("BIENVENIDO");
    var myModalEl = document.getElementById("iniciarModal");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  } catch (error) {
    Swal.fire("USUARIO Y/O CONTRASEÑA INCORRCTA");
  }
});

const btnCrearCuenta = document.querySelector("#btnCrearCuenta");
btnCrearCuenta.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#crearEmail");
  const password = document.querySelector("#crearPassword");
  //console.log(email.value, password.value);
  var myModalEl = document.getElementById("crearModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  try {
    const respuesta = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    //console.log(respuesta.user);
    Swal.fire({
      Icon: "success",
      title: "Es correcto!!!",
      text: "La cuenta se registro correctamente",
    });
    email.value = "";
    password.value = "";
    modal.hide();
  } catch (error) {
    console.log(error.code);
    const code = error.code;
    if (code == "auth/invalid-email") {
      Swal.fire("CORREO ELECTRONICO INAVALIDO");
    }
    if (code == "auth/invalid-password") {
      Swal.fire("CORREO ELECTRONICO INAVALIDO");
    }
    if (code == "auth/email-already-in-use") {
      Swal.fire("CORREO ELECTRONICO YA ESTA EN USO!!!");
    }
  }
});
