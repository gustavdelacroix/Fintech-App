// Lógica básica del sistema (clientes, cuentas, movimientos)
const sistema = {
    clientes: [],
    cuentas: [],

    crearCliente(id, nombre, apellido, dni, email, password, codigoCuenta, saldoInicial) {
        const cliente = {
            id,
            nombre,
            apellido,
            dni,
            email,
            password,
        };
        this.clientes.push(cliente);
        // Crear cuenta asociada automáticamente
        const cuenta = {
            codigo: codigoCuenta,
            saldo: saldoInicial,
            cliente,
            movimientos: [],
            obtenerSaldo() { return this.saldo; },
            depositar(monto) {
                this.saldo += monto;
                this.movimientos.push({ tipo: 'depósito', monto, fecha: new Date().toISOString() });
            },
            retirar(monto) {
                this.saldo -= monto;
                this.movimientos.push({ tipo: 'retiro', monto, fecha: new Date().toISOString() });
            }
        };
        this.cuentas.push(cuenta);
        return cliente;
    },

    buscarClientePorEmail(email) {
        return this.clientes.find(c => c.email === email) || null;
    },

    eliminarClientePorEmail(email) {
        const index = this.clientes.findIndex(c => c.email === email);
        if (index !== -1) {
            this.clientes.splice(index, 1);
            return true;
        }
        return false;
    },

    buscarCuentaPorCodigo(codigo) {
        return this.cuentas.find(c => c.codigo === codigo) || null;
    },

    depositarEnCuenta(codigo, monto) {
        const cuenta = this.buscarCuentaPorCodigo(codigo);
        if (cuenta) {
            cuenta.depositar(monto);
            return true;
        }
        return false;
    },
    retirarDeCuenta(codigo, monto) {
        const cuenta = this.buscarCuentaPorCodigo(codigo);
        if (cuenta && cuenta.saldo >= monto) {
            cuenta.retirar(monto);
            return true;
        }
        return false;
    },
    consultarSaldo(codigo) {
        const cuenta = this.buscarCuentaPorCodigo(codigo);
        return cuenta ? cuenta.obtenerSaldo() : null;
    },
    // NUEVO: Mostrar todos los clientes
    mostrarClientes() {
        return this.clientes.map(c => `${c.nombre} ${c.apellido} (${c.email})`).join('\n');
    },
    // NUEVO: Mostrar todas las cuentas
    mostrarCuentas() {
        return this.cuentas.map(c => `Cuenta: ${c.codigo} - Cliente: ${c.cliente.nombre} ${c.cliente.apellido} - Saldo: $${c.saldo}`).join('\n');
    }
};

// Mostrar mensajes en interfaz
function mostrarResultado(mensaje, tipo = "exito") {
    const resultadoDiv = document.getElementById("output");
    if (resultadoDiv) {
        resultadoDiv.innerHTML = mensaje;
        resultadoDiv.classList.remove("mensaje-exito", "mensaje-error");
        if (tipo === "error") {
            resultadoDiv.classList.add("mensaje-error");
        } else {
            resultadoDiv.classList.add("mensaje-exito");
        }
    } else {
        alert(mensaje);
    }
}

// Consultar saldo y mostrar en pantalla
function consultarSaldo() {
    const codigo = document.getElementById("codigoSaldo").value.trim();
    const resultadoDiv = document.getElementById("resultadoSaldo");
    if (!codigo) {
        if (resultadoDiv) resultadoDiv.innerHTML = "<span style='color:#b03a2e'>Debe ingresar el código de la cuenta para consultar saldo.</span>";
        return;
    }
    const saldo = sistema.consultarSaldo(codigo);
    if (saldo !== null) {
        if (resultadoDiv) resultadoDiv.innerHTML = `<b>Saldo actual en cuenta ${codigo}:</b> $${saldo}`;
    } else {
        if (resultadoDiv) resultadoDiv.innerHTML = "<span style='color:#b03a2e'>Cuenta no encontrada.</span>";
    }
}

// Mostrar historial de movimientos de la cuenta desde el bloque de saldo
function mostrarHistorialMovimientosSaldo() {
    const codigo = document.getElementById("codigoSaldo").value.trim();
    const resultadoDiv = document.getElementById("resultadoSaldo");
    if (!codigo) {
        if (resultadoDiv) resultadoDiv.innerHTML = "<span style='color:#b03a2e'>Debe ingresar el código de la cuenta para ver el historial.</span>";
        return;
    }
    const cuenta = sistema.buscarCuentaPorCodigo(codigo);
    if (!cuenta) {
        if (resultadoDiv) resultadoDiv.innerHTML = "<span style='color:#b03a2e'>Cuenta no encontrada.</span>";
        return;
    }
    if (!cuenta.movimientos.length) {
        if (resultadoDiv) resultadoDiv.innerHTML = `<b>Saldo actual en cuenta ${codigo}:</b> $${cuenta.saldo}<br><i>No hay movimientos registrados para esta cuenta.</i>`;
        return;
    }
    let html = `<b>Saldo actual en cuenta ${codigo}:</b> $${cuenta.saldo}<br><b>Historial de movimientos:</b><ul style='margin-top:10px;'>`;
    for (const mov of cuenta.movimientos) {
        html += `<li>${mov.tipo} $${mov.monto} - ${new Date(mov.fecha).toLocaleString()}${mov.hash ? `<br><small>Hash: <code>${mov.hash}</code></small>` : ''}</li>`;
    }
    html += '</ul>';
    if (resultadoDiv) resultadoDiv.innerHTML = html;
}

// Unificar registro de cliente y cuenta en la UI
function registrarCliente() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const codigoCuenta = document.getElementById("codigoCuenta").value.trim();
    const saldoInicial = parseFloat(document.getElementById("saldoInicial").value);

    if (!nombre || !apellido || !dni || !email || !password || !codigoCuenta || isNaN(saldoInicial) || saldoInicial < 0) {
        mostrarResultado("Todos los campos son obligatorios y saldo inicial debe ser >= 0.", "error");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        mostrarResultado("Email inválido.", "error");
        return;
    }
    if (sistema.buscarClientePorEmail(email)) {
        mostrarResultado("Ya existe un cliente con ese email.", "error");
        return;
    }
    if (sistema.buscarCuentaPorCodigo(codigoCuenta)) {
        mostrarResultado("Ya existe una cuenta con ese código.", "error");
        return;
    }
    const id = sistema.clientes.length + 1;
    const cliente = sistema.crearCliente(id, nombre, apellido, dni, email, password, codigoCuenta, saldoInicial);
    mostrarResultado(`Cliente y cuenta registrados: ${cliente.nombre} ${cliente.apellido} - Cuenta: ${codigoCuenta} - Saldo: $${saldoInicial}`);
}

// Modificar cliente
function modificarCliente() {
    const email = document.getElementById("emailModificar").value.trim();
    const nombre = document.getElementById("nombreModificar").value.trim();
    const apellido = document.getElementById("apellidoModificar").value.trim();
    const dni = document.getElementById("dniModificar").value.trim();
    const password = document.getElementById("passwordModificar").value.trim();

    if (!email) {
        mostrarResultado("Debe ingresar el email del cliente a modificar.", "error");
        return;
    }
    const cliente = sistema.buscarClientePorEmail(email);
    if (!cliente) {
        mostrarResultado("Cliente no encontrado.", "error");
        return;
    }
    if (nombre) cliente.setNombre(nombre);
    if (apellido) cliente.setApellido(apellido);
    if (dni) cliente.setDni(dni);
    if (password) cliente.setPassword(password);
    mostrarResultado(`Cliente modificado: ${cliente.getNombreCompleto()}`);
}

// Eliminar cliente
function eliminarCliente() {
    const email = document.getElementById("emailEliminar").value.trim();
    if (!email) {
        mostrarResultado("Debe ingresar el email del cliente a eliminar.", "error");
        return;
    }
    const resultado = sistema.eliminarClientePorEmail(email);
    if (resultado) {
        mostrarResultado(`Cliente con email ${email} eliminado.`);
    } else {
        mostrarResultado("Cliente no encontrado.", "error");
    }
}

// Función para calcular hash SHA-256 de un movimiento (simulación blockchain)
async function calcularHashMovimiento(movimiento) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(movimiento));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Modificar métodos de depósito y retiro para incluir hash blockchain
async function registrarMovimiento() {
    const codigo = document.getElementById("codigoMovimiento").value.trim();
    const tipo = document.getElementById("tipoMovimiento").value;
    const monto = parseFloat(document.getElementById("montoMovimiento").value);

    if (!codigo || isNaN(monto) || monto <= 0) {
        mostrarResultado("Código y monto válido (> 0) son obligatorios para registrar movimiento.", "error");
        return;
    }
    const cuenta = sistema.buscarCuentaPorCodigo(codigo);
    if (!cuenta) {
        mostrarResultado("Cuenta no encontrada.", "error");
        return;
    }
    const movimiento = {
        tipo,
        monto,
        fecha: new Date().toISOString(),
        cuenta: codigo
    };
    movimiento.hash = await calcularHashMovimiento(movimiento);
    if (tipo === "depósito") {
        cuenta.depositar(monto);
        cuenta.movimientos[cuenta.movimientos.length - 1].hash = movimiento.hash;
        mostrarResultado(`Depósito de $${monto} realizado en cuenta ${codigo}.<br><small>Hash Blockchain: <code>${movimiento.hash}</code></small>`);
    } else if (tipo === "retiro") {
        if (monto > cuenta.obtenerSaldo()) {
            mostrarResultado("Fondos insuficientes para realizar el retiro.", "error");
            return;
        }
        cuenta.retirar(monto);
        cuenta.movimientos[cuenta.movimientos.length - 1].hash = movimiento.hash;
        mostrarResultado(`Retiro de $${monto} realizado en cuenta ${codigo}.<br><small>Hash Blockchain: <code>${movimiento.hash}</code></small>`);
    } else {
        mostrarResultado("Tipo de movimiento inválido.", "error");
    }
    guardarSistema();
}

// Mostrar historial de movimientos con hash blockchain
async function mostrarHistorialBlockchain() {
    const codigo = prompt("Ingrese el código de cuenta para ver el historial blockchain:");
    if (!codigo) return;
    const cuenta = sistema.buscarCuentaPorCodigo(codigo.trim());
    if (!cuenta) {
        mostrarResultado("Cuenta no encontrada.", "error");
        return;
    }
    if (!cuenta.movimientos.length) {
        mostrarResultado("No hay movimientos registrados para esta cuenta.");
        return;
    }
    let html = `<b>Historial Blockchain de la cuenta ${codigo}:</b><ul style='margin-top:10px;'>`;
    for (const mov of cuenta.movimientos) {
        html += `<li>${mov.tipo} $${mov.monto} - ${new Date(mov.fecha).toLocaleString()}<br><small>Hash: <code>${mov.hash || 'N/A'}</code></small></li>`;
    }
    html += '</ul>';
    mostrarResultado(html);
}

// Guardar y cargar datos automáticamente en localStorage (incluyendo movimientos)
function guardarSistema() {
    const data = JSON.stringify({
        clientes: sistema.clientes,
        cuentas: sistema.cuentas.map(c => ({
            codigo: c.codigo,
            saldo: c.saldo,
            clienteEmail: c.cliente.email,
            movimientos: c.movimientos || []
        }))
    });
    localStorage.setItem('fintechData', data);
}

function cargarSistema() {
    const data = localStorage.getItem('fintechData');
    if (!data) return;
    const parsed = JSON.parse(data);
    sistema.clientes = parsed.clientes || [];
    sistema.cuentas = (parsed.cuentas || []).map(c => {
        const cliente = sistema.clientes.find(cl => cl.email === c.clienteEmail);
        return {
            codigo: c.codigo,
            saldo: c.saldo,
            cliente,
            movimientos: c.movimientos || [],
            obtenerSaldo() { return this.saldo; },
            depositar(monto) {
                this.saldo += monto;
                this.movimientos.push({ tipo: 'depósito', monto, fecha: new Date().toISOString() });
            },
            retirar(monto) {
                this.saldo -= monto;
                this.movimientos.push({ tipo: 'retiro', monto, fecha: new Date().toISOString() });
            }
        };
    });
}

// Guardar automáticamente después de cada operación relevante
const originalCrearCliente = sistema.crearCliente;
sistema.crearCliente = function (...args) {
    const result = originalCrearCliente.apply(this, args);
    guardarSistema();
    return result;
};
const originalEliminarCliente = sistema.eliminarClientePorEmail;
sistema.eliminarClientePorEmail = function (...args) {
    const result = originalEliminarCliente.apply(this, args);
    guardarSistema();
    return result;
};
const originalDepositar = sistema.depositarEnCuenta;
sistema.depositarEnCuenta = function (...args) {
    const result = originalDepositar.apply(this, args);
    guardarSistema();
    return result;
};
const originalRetirar = sistema.retirarDeCuenta;
sistema.retirarDeCuenta = function (...args) {
    const result = originalRetirar.apply(this, args);
    guardarSistema();
    return result;
};

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', cargarSistema);

