# 📄 Casos de Uso - Sistema Fintech App

## UC1: Registro de Cliente
- **Actor principal**: Usuario administrador
- **Flujo principal**:
  1. El usuario accede al formulario de registro de cliente.
  2. Ingresa nombre, DNI y otros datos requeridos.
  3. El sistema valida los datos y crea el cliente.
  4. Muestra mensaje de confirmación.
- **Flujos alternativos**:
  - 1a. Datos inválidos → mostrar mensaje de error.

## UC2: Creación de Cuenta
- **Actor principal**: Usuario administrador
- **Flujo principal**:
  1. El usuario selecciona un cliente existente.
  2. Ingresa un saldo inicial.
  3. El sistema asocia la cuenta al cliente y la registra.
  4. Muestra confirmación.

## UC3: Depósito
- **Actor principal**: Usuario final
- **Flujo principal**:
  1. El usuario selecciona una cuenta.
  2. Ingresa el monto a depositar.
  3. El sistema registra el movimiento y actualiza saldo.
  4. Muestra mensaje de éxito.

## UC4: Retiro
- **Actor principal**: Usuario final
- **Flujo principal**:
  1. El usuario selecciona una cuenta.
  2. Ingresa monto a retirar.
  3. El sistema valida el saldo disponible.
  4. Si hay saldo suficiente, se registra el movimiento y se actualiza el saldo.
  5. Muestra mensaje de éxito.
- **Flujos alternativos**:
  - 3a. Saldo insuficiente → mostrar mensaje de error.

## UC5: Consulta de saldo
- **Actor principal**: Usuario final
- **Flujo principal**:
  1. El usuario selecciona una cuenta.
  2. El sistema calcula el saldo total (saldo inicial + movimientos).
  3. Se muestra el saldo al usuario.

---

# 🧪 Documentación de Pruebas

## Prueba 1: Crear Cliente con Datos Válidos
- **Input**: Nombre: "Juan Perez", DNI: "12345678"
- **Esperado**: Cliente creado correctamente
- **Resultado**: ✔️ OK

## Prueba 2: Crear Cliente con DNI vacío
- **Input**: Nombre: "Ana", DNI: ""
- **Esperado**: Error de validación
- **Resultado**: ✔️ OK (mensaje de error mostrado)

## Prueba 3: Crear Cuenta con saldo inicial válido
- **Input**: Cliente: "Juan Perez", Saldo: 10000
- **Esperado**: Cuenta asociada y registrada
- **Resultado**: ✔️ OK

## Prueba 4: Realizar Depósito
- **Input**: Cuenta: "#001", Monto: 5000
- **Esperado**: Movimiento agregado y saldo actualizado
- **Resultado**: ✔️ OK

## Prueba 5: Realizar Retiro con Saldo Suficiente
- **Input**: Cuenta: "#001", Monto: 2000
- **Esperado**: Retiro exitoso
- **Resultado**: ✔️ OK

## Prueba 6: Retiro con Saldo Insuficiente
- **Input**: Cuenta: "#001", Monto: 20000
- **Esperado**: Error de saldo insuficiente
- **Resultado**: ✔️ OK (bloqueo del retiro)

## Prueba 7: Consultar Saldo
- **Input**: Cuenta: "#001"
- **Esperado**: Mostrar saldo actualizado correctamente
- **Resultado**: ✔️ OK
