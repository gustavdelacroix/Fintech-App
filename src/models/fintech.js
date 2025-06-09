// src/models/fintech.js
// Modelo de negocio orientado a objetos para una aplicación Fintech
// Incluye: Cliente, Cuenta, Movimiento, Fintech (gestor principal)

class Movimiento {
    /**
     * @param {string} tipo - 'depósito', 'extracción', 'transferencia'
     * @param {number} monto
     * @param {Date} fecha
     * @param {Cuenta} cuentaOrigen
     * @param {Cuenta} cuentaDestino
     */
    constructor(tipo, monto, fecha, cuentaOrigen = null, cuentaDestino = null) {
        this.tipo = tipo;
        this.monto = monto;
        this.fecha = fecha || new Date();
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
    }
}

class Cuenta {
    /**
     * @param {string} numero
     * @param {string} tipo
     * @param {Cliente} titular
     */
    constructor(numero, tipo, titular) {
        this.numero = numero;
        this.tipo = tipo; // 'ahorro', 'corriente', etc.
        this.titular = titular;
        this.saldo = 0;
        this.movimientos = [];
    }

    depositar(monto) {
        if (monto <= 0) throw new Error('El monto debe ser positivo');
        this.saldo += monto;
        this.movimientos.push(new Movimiento('depósito', monto, new Date(), null, this));
    }

    extraer(monto) {
        if (monto <= 0) throw new Error('El monto debe ser positivo');
        if (monto > this.saldo) throw new Error('Saldo insuficiente');
        this.saldo -= monto;
        this.movimientos.push(new Movimiento('extracción', monto, new Date(), this, null));
    }

    transferirA(destino, monto) {
        if (!(destino instanceof Cuenta)) throw new Error('Destino inválido');
        if (destino === this) throw new Error('No se puede transferir a la misma cuenta');
        this.extraer(monto);
        destino.depositar(monto);
        const mov = new Movimiento('transferencia', monto, new Date(), this, destino);
        this.movimientos.push(mov);
        destino.movimientos.push(mov);
    }

    obtenerSaldo() {
        return this.saldo;
    }
}

// Se asume que la clase Cliente ya existe y tiene los métodos requeridos.
// Aquí solo se muestra la integración con Cuenta y Movimiento.

class Fintech {
    constructor() {
        this.clientes = [];
        this.cuentas = [];
    }

    registrarCliente(cliente) {
        if (this.clientes.some(c => c.email === cliente.email)) {
            throw new Error('Ya existe un cliente con ese email');
        }
        this.clientes.push(cliente);
    }

    crearCuenta(cliente, numero, tipo) {
        if (this.cuentas.some(c => c.numero === numero)) {
            throw new Error('Ya existe una cuenta con ese número');
        }
        const cuenta = new Cuenta(numero, tipo, cliente);
        this.cuentas.push(cuenta);
        cliente.abrirCuenta(cuenta);
        return cuenta;
    }

    buscarCuentaPorNumero(numero) {
        return this.cuentas.find(c => c.numero === numero);
    }

    transferir(numeroOrigen, numeroDestino, monto) {
        const origen = this.buscarCuentaPorNumero(numeroOrigen);
        const destino = this.buscarCuentaPorNumero(numeroDestino);
        if (!origen || !destino) throw new Error('Cuenta no encontrada');
        origen.transferirA(destino, monto);
    }
}

// Ejemplo de uso completo
// (Se asume que la clase Cliente está implementada en otro archivo)
/*
const fintech = new Fintech();
const cliente1 = new Cliente('Ana', 'Pérez', '12345678', 'ana@mail.com', 'pass1');
const cliente2 = new Cliente('Juan', 'Gómez', '87654321', 'juan@mail.com', 'pass2');
fintech.registrarCliente(cliente1);
fintech.registrarCliente(cliente2);
const cuenta1 = fintech.crearCuenta(cliente1, '001', 'ahorro');
const cuenta2 = fintech.crearCuenta(cliente2, '002', 'corriente');
cuenta1.depositar(1000);
cuenta1.transferirA(cuenta2, 200);
console.log(cuenta1.saldo); // 800
console.log(cuenta2.saldo); // 200
console.log(cuenta1.movimientos);
console.log(cuenta2.movimientos);
*/

module.exports = { Movimiento, Cuenta, Fintech };
