const Cliente = require('./Cliente');

describe('Clase Cliente', () => {
    let cliente;

    beforeEach(() => {
        cliente = new Cliente('Juan', 'Pérez', '12345678', 'juan@mail.com', 'secreto');
    });

    test('Debe crear un cliente con datos correctos', () => {
        expect(cliente.nombre).toBe('Juan');
        expect(cliente.apellido).toBe('Pérez');
        expect(cliente.dni).toBe('12345678');
        expect(cliente.email).toBe('juan@mail.com');
        expect(cliente.password).toBe('secreto');
        expect(cliente.cuentas).toEqual([]);
    });

    test('Debe permitir modificar nombre y email', () => {
        cliente.nombre = 'Carlos';
        cliente.email = 'carlos@mail.com';

        expect(cliente.nombre).toBe('Carlos');
        expect(cliente.email).toBe('carlos@mail.com');
    });

    test('Debe abrir cuentas y reflejar saldos', () => {
        cliente.abrirCuenta({ numero: '001', saldo: 1000 });
        cliente.abrirCuenta({ numero: '002', saldo: 500 });

        expect(cliente.cuentas.length).toBe(2);
        expect(cliente.obtenerSaldoTotal()).toBe(1500);
    });

    test('Debe cerrar cuentas correctamente', () => {
        cliente.abrirCuenta({ numero: '001', saldo: 1000 });
        cliente.abrirCuenta({ numero: '002', saldo: 500 });

        cliente.cerrarCuenta('001');

        expect(cliente.cuentas.length).toBe(1);
        expect(cliente.cuentas[0].numero).toBe('002');
    });

    test('Debe transferir fondos entre clientes', () => {
        const destino = new Cliente('Ana', 'Lopez', '87654321', 'ana@mail.com', 'clave');
        cliente.abrirCuenta({ numero: '001', saldo: 1000 });
        destino.abrirCuenta({ numero: '002', saldo: 100 });

        cliente.transferirA(destino, '001', '002', 300);

        expect(cliente.cuentas[0].saldo).toBe(700);
        expect(destino.cuentas[0].saldo).toBe(400);
    });

    test('Debe lanzar error si no hay saldo suficiente', () => {
        const destino = new Cliente('Ana', 'Lopez', '87654321', 'ana@mail.com', 'clave');
        cliente.abrirCuenta({ numero: '001', saldo: 200 });
        destino.abrirCuenta({ numero: '002', saldo: 100 });

        expect(() => {
            cliente.transferirA(destino, '001', '002', 500);
        }).toThrow('Fondos insuficientes.');
    });
});

