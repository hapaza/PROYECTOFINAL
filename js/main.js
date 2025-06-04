// Inicialización de modales y eventos generales
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Eventos para login de personal médico
    document.getElementById('asistenteBtn').addEventListener('click', () => {
        const medicoLoginModal = bootstrap.Modal.getInstance(document.getElementById('medicoLoginModal'));
        medicoLoginModal.hide();
        alert('Por favor inicie sesión con sus credenciales de asistente');
        document.getElementById('loginModal').show();
    });
    
    document.getElementById('doctorBtn').addEventListener('click', () => {
        const medicoLoginModal = bootstrap.Modal.getInstance(document.getElementById('medicoLoginModal'));
        medicoLoginModal.hide();
        alert('Por favor inicie sesión con sus credenciales de doctor');
        document.getElementById('loginModal').show();
    });
    
    document.getElementById('especialistaBtn').addEventListener('click', () => {
        const medicoLoginModal = bootstrap.Modal.getInstance(document.getElementById('medicoLoginModal'));
        medicoLoginModal.hide();
        alert('Por favor inicie sesión con sus credenciales de especialista');
        document.getElementById('loginModal').show();
    });
    
    // Evento para mostrar dashboard médico
    const dashboardBtn = document.createElement('button');
    dashboardBtn.id = 'dashboardBtn';
    dashboardBtn.className = 'nav-link btn btn-link d-none';
    dashboardBtn.innerHTML = '<i class="fas fa-user-md me-2"></i>Dashboard Médico';
    
    dashboardBtn.addEventListener('click', () => {
        const dashboardModal = new bootstrap.Modal(document.getElementById('dashboardModal'));
        dashboardModal.show();
    });
    
    document.querySelector('.navbar-nav').appendChild(dashboardBtn);
    
    // Simular usuario médico (para demostración)
    const medicosDB = [
    {
        id: 'HSP-DOC-001',
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        email: 'jperez@sanpedro.com',
        password: 'Cardio123#' // En un sistema real, esto estaría encriptado
    },
    {
        id: 'HSP-DOC-002',
        nombre: 'Dra. María Gómez',
        especialidad: 'Pediatría',
        email: 'mgomez@sanpedro.com',
        password: 'Pedia456#'
    },
    {
        id: 'HSP-DOC-003',
        nombre: 'Dr. Carlos López',
        especialidad: 'Traumatología',
        email: 'clopez@sanpedro.com',
        password: 'Trauma789#'
    },
    {
        id: 'HSP-DOC-004',
        nombre: 'Dra. Ana Rodríguez',
        especialidad: 'Neurología',
        email: 'arodriguez@sanpedro.com',
        password: 'Neuro012#'
    },
 {
        id: 'HSP-DOC-005',
        nombre: 'Dr. Luis Martínez',
        especialidad: 'Medicina General',
        email: 'lmartinez@sanpedro.com',
        password: 'General345#'
    }
];

    // En un sistema real, esto vendría del login
    if (window.location.search.includes('demo=medico')) {
        currentUser = {
            email: 'doctor@sanpedro.com',
            userCode: 'HSP-DOC-001',
            role: 'doctor'
        };
        dashboardBtn.classList.remove('d-none');
    }
});
// Nueva función para cargar la lista de pacientes
function loadPacientesList() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const pacientesTableBody = document.getElementById('pacientesTableBody');
    pacientesTableBody.innerHTML = '';

    if (citas.length === 0) {
        pacientesTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">No hay pacientes registrados</td>
            </tr>
        `;
        return;
    }

    citas.forEach((paciente, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${paciente.nombre}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.genero}</td>
            <td>${paciente.documento}</td>
            <td>${paciente.tipo === 'urgencia' ? 'Urgencia' : 'Cita médica'}</td>
            <td>
                <span class="badge ${getGravedadBadgeClass(paciente.gravedad)}">
                    ${paciente.gravedad}
                </span>
            </td>
            <td class="action-buttons">
                <button class="btn btn-danger btn-sm btn-action delete-paciente" data-index="${index}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        pacientesTableBody.appendChild(row);
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.delete-paciente').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            deletePaciente(index);
        });
    });
}

// Función para eliminar paciente
function deletePaciente(index) {
    if (!confirm('¿Está seguro de eliminar este paciente?')) return;
    
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.splice(index, 1);
    localStorage.setItem('citas', JSON.stringify(citas));
    
    // Recargar la lista
    loadPacientesList();
    // Actualizar contadores
    updateCounters();
    
    // Mostrar notificación
    const toast = new bootstrap.Toast(document.getElementById('operationToast'));
    document.getElementById('toastMessage').textContent = 'Paciente eliminado correctamente';
    toast.show();
}

// Función auxiliar para clases de badge según gravedad
function getGravedadBadgeClass(gravedad) {
    switch(gravedad.toLowerCase()) {
        case 'leve': return 'badge-leve';
        case 'moderado': return 'badge-moderado';
        case 'urgente': return 'badge-urgente';
        case 'crítico': return 'badge-critico';
        default: return 'bg-secondary';
    }
}

// Event listener para el botón de lista de pacientes
document.getElementById('pacientesBtn').addEventListener('click', () => {
    const pacientesModal = new bootstrap.Modal(document.getElementById('pacientesModal'));
    loadPacientesList();
    pacientesModal.show();
});

// Añadir toast de notificación (agrégalo al final del body en HTML)
document.body.insertAdjacentHTML('beforeend', `
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="operationToast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" id="toastMessage">
                    Operación realizada con éxito
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
`);