class Cliente {
    #nombre;
    #apellido;
    #dni;
    #email;
    #password;

    constructor(nombre, apellido, dni, email, password) {
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#dni = dni;
        this.#email = email;
        this.#password = password;
    }

    get nombre() { return this.#nombre; }
    get apellido() { return this.#apellido; }
    get dni() { return this.#dni; }
    get email() { return this.#email; }
    get password() { return this.#password; }

    set nombre(nombre) { this.#nombre = nombre; }
    set apellido(apellido) { this.#apellido = apellido; }
    set dni(dni) { this.#dni = dni; }
    set email(email) { this.#email = email; }
    set password(password) { this.#password = password; }

    actualizarDatos({ dni, email }) {
        if (dni && Cliente.validarDNI(dni)) { this.#dni = dni; }
        if (email && Cliente.validarEmail(email)) { this.#email = email; }
    }

    static validarEmail(email) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regexEmail.test(email);
    }

    static validarDNI(dni) {
        const regexDNI = /^\d{7,8}$/;
        return regexDNI.test(dni);
    }
}

class Cuenta {
    #cliente;
    #movimientos;
    constructor(cliente) {
        this.#cliente = cliente;
        this.#movimientos = [];
    }
    get cliente() { return this.#cliente; }
    get movimientos() { return this.#movimientos; }
    obtenerSaldo() {
        return this.#movimientos.reduce((saldo, movimiento) => {
            if (movimiento.tipo === "depósito") {
                return saldo + movimiento.monto;
            } else if (movimiento.tipo === "retiro") {
                return saldo - movimiento.monto;
            }
            return saldo;
        }, 0);
    }
    depositar(monto) {
        if (!Number.isFinite(monto) || monto <= 0) return false;
        this.#movimientos.push({ tipo: "depósito", monto, fecha: new Date() });
        return true;
    }
    retirar(monto) {
        if (!Number.isFinite(monto) || monto <= 0) return false;
        if (monto > this.obtenerSaldo()) return false;
        this.#movimientos.push({ tipo: "retiro", monto, fecha: new Date() });
        return true;
    }
}

class SistemaFintech {
    constructor() {
        this.clientes = [];
        this.cuentas = [];
    }
    crearCliente(nombre, apellido, dni, email, password) {
        if (!nombre || !apellido || !dni || !email || !password || !Cliente.validarDNI(dni) || !Cliente.validarEmail(email) || this.buscarClientePorEmail(email)) {
            return null;
        }
        const cliente = new Cliente(nombre, apellido, dni, email, password);
        this.clientes.push(cliente);
        const cuenta = new Cuenta(cliente);
        this.cuentas.push(cuenta);
        guardarSistema();
        return cliente;
    }
    buscarClientePorEmail(email) {
        return this.clientes.find((cliente) => cliente.email === email);
    }
    buscarClientePorDNI(dni) {
        return this.clientes.find((cliente) => cliente.dni === dni);
    }
    modificarCliente(email, nuevosDatos) {
        const cliente = this.buscarClientePorEmail(email);
        if (!cliente) return false;
        if (nuevosDatos.email && nuevosDatos.email !== email) {
            if (this.buscarClientePorEmail(nuevosDatos.email)) return false;
            if (!Cliente.validarEmail(nuevosDatos.email)) return false;
        }
        if (nuevosDatos.dni && nuevosDatos.dni !== cliente.dni) {
            if (this.buscarClientePorDNI(nuevosDatos.dni)) return false;
            if (!Cliente.validarDNI(nuevosDatos.dni)) return false;
        }
        cliente.actualizarDatos(nuevosDatos);
        guardarSistema();
        return true;
    }
    eliminarCliente(email) {
        const clienteIndex = this.clientes.findIndex((cliente) => cliente.email === email);
        if (clienteIndex === -1) return false;
        const cliente = this.clientes[clienteIndex];
        this.clientes.splice(clienteIndex, 1);
        const cuentaIndex = this.cuentas.findIndex((cuenta) => cuenta.cliente.email === email);
        if (cuentaIndex !== -1) {
            this.cuentas.splice(cuentaIndex, 1);
        }
        guardarSistema();
        return true;
    }
    obtenerCuentaPorEmail(email) {
        return this.cuentas.find((cuenta) => cuenta.cliente.email === email);
    }
    depositar(email, monto) {
        const cuenta = this.obtenerCuentaPorEmail(email);
        if (!cuenta) return false;
        const resultado = cuenta.depositar(monto);
        if (resultado) {
            guardarSistema();
        }
        return resultado;
    }
    retirar(email, monto) {
        const cuenta = this.obtenerCuentaPorEmail(email);
        if (!cuenta) return false;
        const resultado = cuenta.retirar(monto);
        if (resultado) {
            guardarSistema();
        }
        return resultado;
    }
    obtenerSaldo(email) {
        const cuenta = this.obtenerCuentaPorEmail(email);
        if (!cuenta) return null;
        return cuenta.obtenerSaldo();
    }
}

let sistemaFintech = new SistemaFintech();

function guardarSistema() {
    try {
        const data = JSON.stringify({
            clientes: sistemaFintech.clientes.map((cliente) => ({
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                dni: cliente.dni,
                email: cliente.email,
                password: cliente.password,
            })),
            cuentas: sistemaFintech.cuentas.map((cuenta) => ({
                emailCliente: cuenta.cliente.email,
                movimientos: cuenta.movimientos.map((mov) => ({
                    tipo: mov.tipo,
                    monto: mov.monto,
                    fecha: mov.fecha,
                })),
            })),
        });
        localStorage.setItem("sistemaFintech", data);
    } catch (error) {
        console.error("Error al guardar el sistema:", error);
    }
}

function cargarSistema() {
    try {
        const data = localStorage.getItem("sistemaFintech");
        if (!data) return;
        const parsedData = JSON.parse(data);
        sistemaFintech = new SistemaFintech();
        parsedData.clientes.forEach((clienteData) => {
            const cliente = new Cliente(
                clienteData.nombre,
                clienteData.apellido,
                clienteData.dni,
                clienteData.email,
                clienteData.password
            );
            sistemaFintech.clientes.push(cliente);
        });
        parsedData.cuentas.forEach((cuentaData) => {
            const cliente = sistemaFintech.buscarClientePorEmail(cuentaData.emailCliente);
            if (cliente) {
                const cuenta = new Cuenta(cliente);
                cuentaData.movimientos.forEach((mov) => {
                    cuenta.movimientos.push({
                        tipo: mov.tipo,
                        monto: mov.monto,
                        fecha: new Date(mov.fecha),
                    });
                });
                sistemaFintech.cuentas.push(cuenta);
            }
        });
    } catch (error) {
        console.error("Error al cargar el sistema:", error);
    }
}

function mostrarResultado(mensaje) {
    const resultado = document.getElementById("output");
    if (resultado) {
        resultado.textContent = mensaje;
    }
}

function crearClienteUI() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!nombre || !apellido || !dni || !email || !password) {
        mostrarResultado("Todos los campos son obligatorios.");
        return;
    }
    const clienteCreado = sistemaFintech.crearCliente(nombre, apellido, dni, email, password);
    if (clienteCreado) {
        mostrarResultado(`Cliente creado exitosamente: ${clienteCreado.nombre} ${clienteCreado.apellido}`);
    } else {
        mostrarResultado("Error al crear cliente. Verifica los datos ingresados.");
    }
}

function modificarClienteUI() {
    const email = document.getElementById("emailMod").value.trim();
    const nuevoDni = document.getElementById("dniMod").value.trim();
    const nuevoEmail = document.getElementById("emailNuevoMod").value.trim();
    if (!email) {
        mostrarResultado("El email del cliente a modificar es obligatorio.");
        return;
    }
    const nuevosDatos = {};
    if (nuevoDni) nuevosDatos.dni = nuevoDni;
    if (nuevoEmail) nuevosDatos.email = nuevoEmail;
    if (Object.keys(nuevosDatos).length === 0) {
        mostrarResultado("Debe ingresar al menos un dato para modificar (DNI o Email).");
        return;
    }
    const modificado = sistemaFintech.modificarCliente(email, nuevosDatos);
    if (modificado) {
        mostrarResultado("Cliente modificado exitosamente.");
    } else {
        mostrarResultado("Error al modificar cliente. Verifica los datos y que el cliente exista.");
    }
}

function eliminarClienteUI() {
    const email = document.getElementById("emailElim").value.trim();
    if (!email) {
        mostrarResultado("El email del cliente a eliminar es obligatorio.");
        return;
    }
    const eliminado = sistemaFintech.eliminarCliente(email);
    if (eliminado) {
        mostrarResultado("Cliente eliminado exitosamente.");
    } else {
        mostrarResultado("No se encontró cliente con ese email.");
    }
}

function depositarUI() {
    const email = document.getElementById("emailDep").value.trim();
    const monto = Number(document.getElementById("montoDep").value);
    if (!email || isNaN(monto)) {
        mostrarResultado("Email y monto válido son obligatorios.");
        return;
    }
    if (monto <= 0) {
        mostrarResultado("El monto debe ser mayor a cero.");
        return;
    }
    const resultado = sistemaFintech.depositar(email, monto);
    if (resultado) {
        mostrarResultado(`Depósito de ${monto} realizado correctamente.`);
    } else {
        mostrarResultado("Error al realizar depósito. Verifica los datos y saldo.");
    }
}

function retirarUI() {
    const email = document.getElementById("emailRet").value.trim();
    const monto = Number(document.getElementById("montoRet").value);
    if (!email || isNaN(monto)) {
        mostrarResultado("Email y monto válido son obligatorios.");
        return;
    }
    if (monto <= 0) {
        mostrarResultado("El monto debe ser mayor a cero.");
        return;
    }
    const resultado = sistemaFintech.retirar(email, monto);
    if (resultado) {
        mostrarResultado(`Retiro de ${monto} realizado correctamente.`);
    } else {
        mostrarResultado("Error al realizar retiro. Verifica los datos y saldo.");
    }
}

function obtenerSaldoUI() {
    const email = document.getElementById("emailSaldo").value.trim();
    if (!email) {
        mostrarResultado("El email es obligatorio para consultar saldo.");
        return;
    }
    const saldo = sistemaFintech.obtenerSaldo(email);
    if (saldo === null) {
        mostrarResultado("No se encontró cliente con ese email.");
    } else {
        mostrarResultado(`El saldo disponible es: ${saldo}`);
    }
}

cargarSistema();

