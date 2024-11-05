        document.addEventListener("DOMContentLoaded", async function() {

    try {
        const resPsicologos = await fetch("http://localhost:8001/psicologo/lista");
        const psicologos = await resPsicologos.json();

        console.log(psicologos); // Verifica que los psicólogos se cargan correctamente

        const selectPsicologo = document.querySelector("select[name='Id_psicologo']");
        psicologos.forEach(psicologo => {
            const option = document.createElement("option");
            option.value = psicologo.Id_psicologo; 
            option.textContent = `${psicologo.Nombre} ${psicologo.Apellido_p} ${psicologo.Apellido_m}`;
            selectPsicologo.appendChild(option);
        });

        // Escuchar cambios en el select de psicólogos, para tratamientos
        selectPsicologo.addEventListener('change', async function() {
            const idPsicologoSeleccionado = this.value;
             // Cargar tratamientos específicos para el psicólogo seleccionado
            try {
                const resTratamientos = await fetch(`http://localhost:8001/servicio/lista/${idPsicologoSeleccionado}`);
                const tratamientos = await resTratamientos.json();

                const selectTratamiento = document.querySelector("select[name='Tratamiento']");
                selectTratamiento.innerHTML = ''; // Limpiar opciones anteriores
                tratamientos.forEach(tratamiento => {
                    const option = document.createElement("option");
                    option.value = tratamiento.Tratamiento; 
                    option.textContent = `${tratamiento.Tratamiento}`;
                    selectTratamiento.appendChild(option);
                });
            } catch (error) {
                console.error("Error al cargar Tratamientos:", error);
            }

            // Cargar dias para el psicólogo seleccionado
            try {
                const resHorarios = await fetch(`http://localhost:8001/horario/lista/${idPsicologoSeleccionado}`);
                const horarios = await resHorarios.json();

                const selectHorario = document.querySelector("select[name='Dia']");
                selectHorario.innerHTML = ''; // Limpiar opciones anteriores
                horarios.forEach(horario => {
                    const option = document.createElement("option");
                    option.value = horario.Dia; 
                    option.textContent = `${horario.Dia}`;
                    selectHorario.appendChild(option);
                });    

                // Agregar un listener para el select de días
                selectHorario.addEventListener('change', async function() {
                    const diaSeleccionado = this.value;
                    try {
                        // Obtener horas disponibles para el día seleccionado
                        const resHoras = await fetch(`http://localhost:8001/horario/horas/${idPsicologoSeleccionado}/   ${diaSeleccionado}`);
                        const horas = await resHoras.json();

                        const selectHoras = document.querySelector("select[name='Hora_inicio']");
                        selectHoras.innerHTML = ''; // Limpiar opciones anteriores
                        horas.forEach(hora => {
                            const option = document.createElement("option");
                            option.value = hora.Hora_inicio; 
                            option.textContent = `${hora.Hora_inicio}`;
                            selectHoras.appendChild(option);
                        });
                } catch (error) {
                    console.error("Error al cargar horas para el día seleccionado:", error);
                }
            });
            } catch (error) {
                console.error("Error al cargar dias:", error);
            }
        });
    } catch (error) {
        console.error("Error al cargar psicólogos:", error);
    }

    // Agendar cita al enviar formulario    
    document.getElementById("agendarCitaForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log(e.target.Nombre.value);

        const idPsicologo = e.target.Id_psicologo.value; // Captura correcta del Id_psicologo
        console.log("Id_psicologo:", idPsicologo);

        const Tratamiento = e.target.Tratamiento.value;
        console.log("Tratamiento:", Tratamiento);

        const Dia = e.target.Dia.value;
        console.log("Dia:", Dia);

        const Hora_inicio = e.target.Hora_inicio.value;
        console.log("Hora_inicio", Hora_inicio);

        const today = new Date();
        const Fecha_registro = today.getFullYear() + '-' + 
                               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(today.getDate()).padStart(2, '0');

        const res = await fetch("http://localhost:8001/cita/agendar-cita",{
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "Nombre": e.target.Nombre.value,
                "Apellido_p": e.target.Apellido_p.value,
                "Apellido_m": e.target.Apellido_m.value,
                "Telefono": e.target.Telefono.value, 
                "Correo": e.target.Correo.value,
                "Ocupacion": e.target.Ocupacion.value,
                "Fecha_registro": Fecha_registro,
                "Id_psicologo": idPsicologo, 
                "Tratamiento": Tratamiento,
                "Tipo": e.target.Tipo.value,
                "Hora_inicio": Hora_inicio,
                // "Estatus": e.target.Estatus.value,
                "Notas": e.target.Notas.value, 
                "Dia": Dia
            })
        });

        // Manejo de la respuesta
        if (res.ok) {
            const data = await res.json();
            console.log('Cita agendada exitosamente:', data);
        } else {
            const error = await res.json();
            console.error('Error al agendar cita:', error);
            alert(`Error: ${error.message} ${error.mensaje}`);
        }

    });
});



