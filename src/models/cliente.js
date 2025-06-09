class Cliente {
    #nombre;
    #apellido;
    #dni;
    #email;
    #password;
    #cuentas;

    constructor(nombre, apellido, dni, email, password) {
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#dni = dni;
        this.#email = email;
        this.#password = password;
        this.#cuentas = [];
    }

    // Getters
    get nombre() { return this.#nombre; }
    get apellido() { return this.#apellido; }
    get dni() { return this.#dni; }
    get email() { return this.#email; }
    get password() { return this.#password; }
    get cuentas() { return this.#cuentas; }

    // Setters
    set nombre(nombre) { this.#nombre = nombre; }
    set apellido(apellido) { this.#apellido = apellido; }
    set email(email) { this.#email = email; }
    set password(password) { this.#password = password; }

    // Métodos funcionales
    abrirCuenta(cuenta) {
        if (!this.#cuentas.includes(cuenta)) {
            this.#cuentas.push(cuenta);
        }
    }

    cerrarCuenta(cuenta) {
        // Permite cerrar por objeto o número
        const numero = typeof cuenta === 'string' ? cuenta : cuenta.numero;
        this.#cuentas = this.#cuentas.filter(c => c.numero !== numero);
    }

    obtenerSaldoTotal() {
        return this.#cuentas.reduce((total, cuenta) => total + (typeof cuenta.obtenerSaldo === 'function' ? cuenta.obtenerSaldo() : cuenta.saldo), 0);
    }

    transferirA(destinatario, monto, numeroCuentaOrigen = null, numeroCuentaDestino = null) {
        // Si se pasan cuentas, busca por número, si no, usa la única cuenta
        let cuentaOrigen = this.#cuentas[0];
        let cuentaDestino = destinatario.cuentas[0];
        if (numeroCuentaOrigen) {
            cuentaOrigen = this.#cuentas.find(c => c.numero === numeroCuentaOrigen);
        }
        if (numeroCuentaDestino) {
            cuentaDestino = destinatario.cuentas.find(c => c.numero === numeroCuentaDestino);
        }
        if (!cuentaOrigen || !cuentaDestino) {
            throw new Error("Cuenta origen o destino no encontrada.");
        }
        cuentaOrigen.transferirA(cuentaDestino, monto);
    }
}

module.exports = Cliente;

