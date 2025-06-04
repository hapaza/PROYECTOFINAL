// Elementos del DOM
const citaForm = document.getElementById('citaForm');
const urgenciaForm = document.getElementById('urgenciaForm');
const confirmarBtn = document.getElementById('confirmarBtn');
const imprimirBtn = document.getElementById('imprimirBtn');
const citasTableBody = document.getElementById('citasTableBody');
const criticalAlert = new bootstrap.Toast(document.getElementById('criticalAlert'));

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCitasTable();
});

citaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateCitaForm()) return;
    
    // Mostrar confirmación
    showCitaResumen();
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    confirmacionModal.show();
});

urgenciaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateUrgenciaForm()) return;
    
    // Registrar urgencia
    const urgencia = {
        nombre: document.getElementById('urgenciaNombre').value,
        edad: document.getElementById('urgenciaEdad').value,
        genero: document.getElementById('urgenciaGenero').value,
        documento: document.getElementById('urgenciaDocumento').value,
        gravedad: document.getElementById('urgenciaGravedad').value,
        sintomas: document.getElementById('urgenciaSintomas').value,
        medicamentos: document.getElementById('urgenciaMedicamentos').value,
        alergias: document.getElementById('urgenciaAlergias').value,
        tipo: 'urgencia',
        fecha: new Date().toISOString()
    };
    
    saveCita(urgencia);
    
    // Mostrar alerta si es crítico
    if (urgencia.gravedad === 'Crítico') {
        document.getElementById('criticalAlert').classList.remove('d-none');
        criticalAlert.show();
    }
    
    // Cerrar modal y mostrar mensaje
    const urgenciaModal = bootstrap.Modal.getInstance(document.getElementById('urgenciaModal'));
    urgenciaModal.hide();
    alert('Urgencia registrada exitosamente');
});

confirmarBtn.addEventListener('click', () => {
    // Guardar cita
    const cita = {
        nombre: document.getElementById('nombreCompleto').value,
        edad: document.getElementById('edad').value,
        genero: document.getElementById('genero').value,
        documento: document.getElementById('documento').value,
        gravedad: document.getElementById('gravedad').value,
        sintomas: document.getElementById('sintomas').value,
        medicamentos: document.getElementById('medicamentos').value,
        examenes: document.getElementById('examenes').value,
        doctor: document.getElementById('doctor').value,
        fecha: document.getElementById('fechaHora').value,
        tipo: 'cita'
    };
    
    saveCita(cita);
    
    // Cerrar modal y mostrar mensaje
    const confirmacionModal = bootstrap.Modal.getInstance(document.getElementById('confirmacionModal'));
    confirmacionModal.hide();
    alert('Cita médica registrada exitosamente');
});

imprimirBtn.addEventListener('click', () => {
    window.print();
});

// Funciones de validación
function validateCitaForm() {
    let isValid = true;
    
    // Validar edad
    const edad = document.getElementById('edad');
    if (edad.value < 1) {
        edad.classList.add('is-invalid');
        isValid = false;
    } else {
        edad.classList.remove('is-invalid');
    }
    
    // Validar documento (más de 5 caracteres)
    const documento = document.getElementById('documento');
    if (documento.value.length < 5) {
        documento.classList.add('is-invalid');
        isValid = false;
    } else {
        documento.classList.remove('is-invalid');
    }
    
    // Validar campos obligatorios
    const requiredFields = citaForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

function validateUrgenciaForm() {
    let isValid = true;
    
    // Validar edad
    const edad = document.getElementById('urgenciaEdad');
    if (edad.value < 1) {
        edad.classList.add('is-invalid');
        isValid = false;
    } else {
        edad.classList.remove('is-invalid');
    }
    
    // Validar documento (más de 5 caracteres)
    const documento = document.getElementById('urgenciaDocumento');
    if (documento.value.length < 5) {
        documento.classList.add('is-invalid');
        isValid = false;
    } else {
        documento.classList.remove('is-invalid');
    }
    
    // Validar campos obligatorios
    const requiredFields = urgenciaForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Mostrar resumen de cita
function showCitaResumen() {
    const resumen = document.getElementById('citaResumen');
    resumen.innerHTML = `
        <p><strong>Nombre:</strong> ${document.getElementById('nombreCompleto').value}</p>
        <p><strong>Edad:</strong> ${document.getElementById('edad').value}</p>
        <p><strong>Género:</strong> ${document.getElementById('genero').value}</p>
        <p><strong>Documento:</strong> ${document.getElementById('documento').value}</p>
        <p><strong>Gravedad:</strong> <span class="badge ${getGravedadBadgeClass(document.getElementById('gravedad').value)}">${document.getElementById('gravedad').value}</span></p>
        <p><strong>Síntomas:</strong> ${document.getElementById('sintomas').value}</p>
        <p><strong>Medicamentos:</strong> ${document.getElementById('medicamentos').value || 'Ninguno'}</p>
        <p><strong>Exámenes:</strong> ${document.getElementById('examenes').value || 'Ninguno'}</p>
        <p><strong>Doctor:</strong> ${document.getElementById('doctor').value}</p>
        <p><strong>Fecha y Hora:</strong> ${formatDateTime(document.getElementById('fechaHora').value)}</p>
    `;
}

// Guardar cita en localStorage
function saveCita(cita) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(cita);
    localStorage.setItem('citas', JSON.stringify(citas));
    updateCounters();
    loadCitasTable();
}

// Cargar tabla de citas
function loadCitasTable() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citasTableBody.innerHTML = '';
    
    citas.forEach((cita, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.edad}</td>
            <td>${cita.genero}</td>
            <td>${cita.documento}</td>
            <td>${cita.sintomas.substring(0, 30)}${cita.sintomas.length > 30 ? '...' : ''}</td>
            <td><span class="badge ${getGravedadBadgeClass(cita.gravedad)}">${cita.gravedad}</span></td>
            <td>${cita.doctor || 'Urgencia'}</td>
            <td>${formatDateTime(cita.fecha)}</td>
            <td>
                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        citasTableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('button').dataset.index;
            deleteCita(index);
        });
    });
}

// Eliminar cita
function deleteCita(index) {
    if (!confirm('¿Está seguro de eliminar este registro?')) return;
    
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.splice(index, 1);
    localStorage.setItem('citas', JSON.stringify(citas));
    loadCitasTable();
    updateCounters();
}

// Funciones auxiliares
function getGravedadBadgeClass(gravedad) {
    switch (gravedad) {
        case 'Leve': return 'bg-success';
        case 'Moderado': return 'bg-warning text-dark';
        case 'Urgente': return 'bg-danger';
        case 'Crítico': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function formatDateTime(dateTime) {
    if (!dateTime) return 'N/A';
    
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES');
}

function updateCounters() {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    
    document.getElementById('leveCount').textContent = citas.filter(c => c.gravedad === 'Leve').length;
    document.getElementById('moderadoCount').textContent = citas.filter(c => c.gravedad === 'Moderado').length;
    document.getElementById('urgenteCount').textContent = citas.filter(c => c.gravedad === 'Urgente').length;
    document.getElementById('criticoCount').textContent = citas.filter(c => c.gravedad === 'Crítico').length;
}