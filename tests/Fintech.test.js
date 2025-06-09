// tests/Fintech.test.js
const { Movimiento, Cuenta, Fintech } = require('../src/models/fintech');
// Se asume que Cliente está implementado en ../src/models/cliente.js
const Cliente = require('../src/models/cliente');

describe('Modelo Fintech OO', () => {
    let fintech, cliente1, cliente2, cuenta1, cuenta2;

    beforeEach(() => {
        fintech = new Fintech();
        cliente1 = new Cliente('Ana', 'Pérez', '12345678', 'ana@mail.com', 'pass1');
        cliente2 = new Cliente('Juan', 'Gómez', '87654321', 'juan@mail.com', 'pass2');
        fintech.registrarCliente(cliente1);
        fintech.registrarCliente(cliente2);
        cuenta1 = fintech.crearCuenta(cliente1, '001', 'ahorro');
        cuenta2 = fintech.crearCuenta(cliente2, '002', 'corriente');
    });

    test('Creación de objetos', () => {
        expect(cliente1.nombre).toBe('Ana');
        expect(cuenta1.numero).toBe('001');
        expect(cuenta1.titular).toBe(cliente1);
    });

    test('Depósito y extracción', () => {
        cuenta1.depositar(500);
        expect(cuenta1.obtenerSaldo()).toBe(500);
        cuenta1.extraer(200);
        expect(cuenta1.obtenerSaldo()).toBe(300);
    });

    test('Transferencia entre cuentas', () => {
        cuenta1.depositar(1000);
        cuenta1.transferirA(cuenta2, 400);
        expect(cuenta1.obtenerSaldo()).toBe(600);
        expect(cuenta2.obtenerSaldo()).toBe(400);
    });

    test('Registro de movimientos', () => {
        cuenta1.depositar(100);
        cuenta1.extraer(50);
        expect(cuenta1.movimientos.length).toBe(2);
        expect(cuenta1.movimientos[0].tipo).toBe('depósito');
        expect(cuenta1.movimientos[1].tipo).toBe('extracción');
    });

    test('Transferencia genera movimiento en ambas cuentas', () => {
        cuenta1.depositar(200);
        cuenta1.transferirA(cuenta2, 100);
        expect(cuenta1.movimientos.some(m => m.tipo === 'transferencia')).toBe(true);
        expect(cuenta2.movimientos.some(m => m.tipo === 'transferencia')).toBe(true);
    });

    test('Error al extraer más del saldo', () => {
        cuenta1.depositar(50);
        expect(() => cuenta1.extraer(100)).toThrow('Saldo insuficiente');
    });

    test('Error al transferir a la misma cuenta', () => {
        cuenta1.depositar(100);
        expect(() => cuenta1.transferirA(cuenta1, 10)).toThrow('No se puede transferir a la misma cuenta');
    });

    test('Error por cuenta duplicada', () => {
        expect(() => fintech.crearCuenta(cliente1, '001', 'ahorro')).toThrow('Ya existe una cuenta con ese número');
    });

    test('Error por cliente duplicado', () => {
        const otro = new Cliente('Ana', 'Pérez', '12345678', 'ana@mail.com', 'pass1');
        expect(() => fintech.registrarCliente(otro)).toThrow('Ya existe un cliente con ese email');
    });
});
