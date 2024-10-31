document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío del formulario

        const formData = new FormData(form);
        const data = Object.fromEntries(formData); // Convierte FormData a un objeto

        try {
            const response = await fetch('/cita/agendar-cita', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Cita agendada con éxito: ' + JSON.stringify(result));
                form.reset(); // Opcional: restablece el formulario
            } else {
                alert('Error al agendar cita: ' + result.mensaje);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión al servidor');
        }
    });
});
