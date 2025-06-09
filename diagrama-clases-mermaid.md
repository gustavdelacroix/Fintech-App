%% Diagrama de clases Mermaid para el modelo Fintech
classDiagram
    class Cliente {
        -nombre: string
        -apellido: string
        -dni: string
        -email: string
        -password: string
        +abrirCuenta(cuenta)
        +cerrarCuenta(cuenta)
        +obtenerSaldoTotal()
        +transferirA(destino, monto)
    }
    class Cuenta {
        -numero: string
        -tipo: string
        -titular: Cliente
        -saldo: number
        -movimientos: Movimiento[]
        +depositar(monto)
        +extraer(monto)
        +transferirA(destino, monto)
        +obtenerSaldo()
    }
    class Movimiento {
        -tipo: string
        -monto: number
        -fecha: Date
        -cuentaOrigen: Cuenta
        -cuentaDestino: Cuenta
    }
    class Fintech {
        -clientes: Cliente[]
        -cuentas: Cuenta[]
        +registrarCliente(cliente)
        +crearCuenta(cliente, numero, tipo)
        +buscarCuentaPorNumero(numero)
        +transferir(numeroOrigen, numeroDestino, monto)
    }
    
    Cliente "1" -- "*" Cuenta : posee
    Cuenta "*" -- "*" Movimiento : registra
    Fintech "1" -- "*" Cliente : administra
    Fintech "1" -- "*" Cuenta : administra
