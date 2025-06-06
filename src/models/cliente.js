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
        this.#cuentas.push(cuenta);
    }

    cerrarCuenta(numeroCuenta) {
        this.#cuentas = this.#cuentas.filter(c => c.numero !== numeroCuenta);
    }

    obtenerSaldoTotal() {
        return this.#cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
    }

    transferirA(destinatario, numeroCuentaOrigen, numeroCuentaDestino, monto) {
        const cuentaOrigen = this.#cuentas.find(c => c.numero === numeroCuentaOrigen);
        const cuentaDestino = destinatario.cuentas.find(c => c.numero === numeroCuentaDestino);

        if (!cuentaOrigen || !cuentaDestino) {
            throw new Error("Cuenta origen o destino no encontrada.");
        }

        if (cuentaOrigen.saldo < monto) {
            throw new Error("Fondos insuficientes.");
        }

        cuentaOrigen.saldo -= monto;
        cuentaDestino.saldo += monto;
    }
}

module.exports = Cliente;

