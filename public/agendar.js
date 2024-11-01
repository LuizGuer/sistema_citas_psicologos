document.addEventListener("DOMContentLoaded", async function() {

    try {
        const res = await fetch("http://localhost:8001/psicologo/lista");
        const psicologos = await res.json();

        console.log(psicologos); // Verifica que los psicólogos se cargan correctamente

        const selectPsicologo = document.querySelector("select[name='Id_psicologo']");
        psicologos.forEach(psicologo => {
            const option = document.createElement("option");
            option.value = psicologo.Id_psicologo;
            option.textContent = `${psicologo.Nombre} ${psicologo.Apellido_p} ${psicologo.Apellido_m}`;
            selectPsicologo.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar psicólogos:", error);
    }
    
    
    document.getElementById("agendarCitaForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log(e.target.Nombre.value);

        const idPsicologo = e.target.Id_psicologo.value; // Captura correcta del Id_psicologo
        console.log("Id_psicologo:", idPsicologo);

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
                "Tratamiento": e.target.Tratamiento.value,
                "Tipo": e.target.Tipo.value,
                "Hora_inicio": e.target.Hora_inicio.value,
                "Estatus": e.target.Estatus.value,
                "Notas": e.target.Notas.value, 
                "Dia": e.target.Dia.value
            })
        });

        // Manejo de la respuesta
        if (res.ok) {
            const data = await res.json();
            console.log('Cita agendada exitosamente:', data);
        } else {
            const error = await res.json();
            console.error('Error al agendar cita:', error);
            alert(`Error: ${error.message}`);
        }

    });
});



