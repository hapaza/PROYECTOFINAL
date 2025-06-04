// Simulación de base de datos de usuarios
const usersDB = JSON.parse(localStorage.getItem('usersDB')) || [];
let currentUser = null;
// Al inicio del archivo auth.js, después de la declaración de usersDB
// Usuario predeterminado solo en modo desarrollo


// Expresiones regulares para validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const verificationForm = document.getElementById('verificationForm');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const medicoBtn = document.getElementById('medicoBtn');
const citaBtn = document.getElementById('citaBtn');
const urgenciaBtn = document.getElementById('urgenciaBtn');
const infoBtn = document.getElementById('infoBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
const verificationModal = new bootstrap.Modal(document.getElementById('verificationModal'));
const credentialsModal = new bootstrap.Modal(document.getElementById('credentialsModal'));
const medicoLoginModal = new bootstrap.Modal(document.getElementById('medicoLoginModal'));
const infoSection = document.getElementById('info');

let tempRegisterData = null;
function encrytPassword(password){
    return btoa(password) + '#' + password.length + '#HSP';
}
function generateUserCode(){
    return 'HSP-' + Math.floor(100000 + Math.random() * 900000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCounters();
    
    // Mostrar sección de información
    infoBtn.addEventListener('click', () => {
        infoSection.classList.toggle('d-none');
    });
    
    // Mostrar modal de login
    loginBtn.addEventListener('click', () => {
        loginModal.show();
    });
    
    // Mostrar modal de registro desde login
    registerBtn.addEventListener('click', () => {
        loginModal.hide();
        registerModal.show();
    });
    
    // Mostrar modal de personal médico
    medicoBtn.addEventListener('click', () => {
        medicoLoginModal.show();
    });
    
    // Mostrar modal de cita médica (solo si hay usuario logueado)
    citaBtn.addEventListener('click', () => {
        if (currentUser) {
            alert('Debe iniciar sesión para agendar una cita');
            loginModal.show();
            return;
        }
        const citaModal = new bootstrap.Modal(document.getElementById('citaModal'));
        citaModal.show();
    });
    
    // Mostrar modal de urgencia
    urgenciaBtn.addEventListener('click', () => {
        const urgenciaModal = new bootstrap.Modal(document.getElementById('urgenciaModal'));
        urgenciaModal.show();
    });
});

// Validación de formulario de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    
    const foundUser = usersDB.find(u => u.userCode === user && u.password === pass);
    
    if (foundUser) {
        currentUser = foundUser;
        loginModal.hide();
        alert(Bienvenido, $,{foundUser,email});
    } else {
        document.getElementById('loginError').classList.remove('d-none');
        document.getElementById('loginError').textContent = 'Usuario o contraseña incorrectos';
    }
});

// Validación de formulario de registro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar email
    if (!emailRegex.test(email)) {
        document.getElementById('registerEmail').classList.add('is-valid');
        return;
    } else {
        document.getElementById('registerEmail').classList.remove('is-valid');
    }
    
    // Validar contraseña
    if (!passwordRegex.test(password)) {
        document.getElementById('registerPassword').classList.add('is-valid');
       
    } else {
        document.getElementById('registerPassword').classList.remove('is-valid');
    }
    
    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-valid');
        
    } else {
        document.getElementById('confirmPassword').classList.remove('is-valid');
    }
    
    // Si todo es válido, proceder con verificación
    registerModal.hide();
    verificationModal.show();
});

// Procesar código de verificación
verificationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const code = document.getElementById('verificationCode').value;
    
    if (code.length !== 6 || !/^\d+$/.test(code)) {
        document.getElementById('verificationCode').classList.add('is-invalid');
        return;
    }
    function encryptPassword(password){
        const salt='xlc';
        return btoa(password + salt)+password.length.toString(36);
           
    }
    
    // Generar credenciales
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Encriptar contraseña (simulación)
    const encryptedPass = btoa(password) + '#' + password.length;
    
    // Generar código de usuario
    const userCode = 'HSP-' + Math.floor(100000 + Math.random() * 900000);
         
    
    // Guardar usuario
    const newUser = {
        email,
        password: encryptedPass,
        userCode,
        role: 'paciente'
    };
    
    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    
    // Mostrar credenciales
    document.getElementById('generatedUser').textContent = userCode;
    document.getElementById('generatedPass').textContent = encryptedPass;
    
    verificationModal.hide();
    credentialsModal.show();
});

// Limpiar formularios al cerrar modales
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('hidden.bs.modal', () => {
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Limpiar clases de validación
        const inputs = modal.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid');
        });
    });
});

// Función para actualizar contadores
function updateCounters() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    
    document.getElementById('leveCount').textContent = citas.filter(c => c.gravedad === 'Leve').length;
    document.getElementById('moderadoCount').textContent = citas.filter(c => c.gravedad === 'Moderado').length;
    document.getElementById('urgenteCount').textContent = citas.filter(c => c.gravedad === 'Urgente').length;
    document.getElementById('criticoCount').textContent = citas.filter(c => c.gravedad === 'Crítico').length;
}
// Función corregida para manejar el inicio de sesión
function handleLogin(e) {
    e.preventDefault();
    
    const userCode = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    
    // Buscar usuario por código
    const user = usersDB.find(u => u.userCode === userCode);
    
    if (!user) {
        showLoginError('Usuario no encontrado');
        return;
    }
    
    // Comparar contraseñas encriptadas
    const encryptedInput = encryptPassword(password);
    if (user.password !== encryptedInput) {
        showLoginError('Contraseña incorrecta');
        return;
    }
    
    // Inicio de sesión exitoso
    currentUser = user;
    loginModal.hide();
    
    // Mostrar mensaje de bienvenida
    alert(Bienvenido/a ,$,{user,email});
    
    // Actualizar interfaz según el rol
    if (user.role !== 'paciente') {
        document.getElementById('dashboardBtn').classList.remove('d-none');
    }
}

// Función corregida para mostrar credenciales después del registro
function showUserCredentials(userCode, plainPassword) {
    // Mostrar credenciales en el modal
    document.getElementById('generatedUser').textContent = userCode;
    document.getElementById('generatedPass').textContent = plainPassword;
    
    // Agregar botón para continuar al login
    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn btn-purple mt-3';
    continueBtn.textContent = 'Continuar al Inicio de Sesión';
    continueBtn.onclick = () => {
        credentialsModal.hide();
        loginModal.show();
        // Autorellenar los campos de login
        document.getElementById('loginUser').value = userCode;
        document.getElementById('loginPass').value = plainPassword;
    };
    
    document.querySelector('#credentialsModal .modal-body').appendChild(continueBtn);
}

// Función de encriptación (asegurarse que es consistente)
function encryptPassword(password) {
    // Mismo método de encriptación usado durante el registro
    return hsp-$;{btoa(password)}-$;{password.length};

}
// Función completamente corregida para manejar el registro
registerForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validar campos
    if (!validateEmail(email) || !validatePassword(password) || !validatePasswordConfirmation(password, confirmPassword)) {
        return;
    }

    // Generar código de usuario
    const userCode = generateUserCode();
    
    // Encriptar contraseña
    const encryptedPassword = encryptPassword(password);
    
    // Crear objeto de usuario
    const newUser = {
        email,
        password: encryptedPassword,
        userCode,
        role: 'paciente',
        createdAt: new Date().toISOString()
    };
    
    // Guardar usuario en la base de datos
    usersDB.push(newUser);
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
    
    // Mostrar credenciales en el modal
    showCredentialsModal(userCode, password);
    
    // Cerrar modal de registro
    registerModal.hide();
});

// Función para mostrar las credenciales
function showCredentialsModal(userCode, plainPassword) {
    // Actualizar contenido del modal
    document.getElementById('generatedUser').textContent = userCode;
    document.getElementById('generatedPass').textContent = plainPassword;
    
    // Limpiar botones anteriores si existen
    const existingBtn = document.querySelector('#credentialsModal .continue-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Crear botón para continuar
    const continueBtn = document.createElement('button');
    continueBtn.className = 'btn btn-purple mt-3 continue-btn';
    continueBtn.textContent = 'Continuar al Inicio de Sesión';
    
    continueBtn.addEventListener('click', function() {
        credentialsModal.hide();
        loginModal.show();
        document.getElementById('loginUser').value = userCode;
        document.getElementById('loginPass').value = plainPassword;
    });
    
    // Agregar botón al modal
    document.querySelector('#credentialsModal .modal-body').appendChild(continueBtn);
    
    // Mostrar modal de credenciales
    credentialsModal.show();
}

// Función para generar código de usuario
function generateUserCode() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return HSP-$;{randomNum};
}

// Función de encriptación (debe ser la misma para login y registro)
function encryptPassword(password) {
    return hsp-$;{btoa(password)}-$;{password.length};
}