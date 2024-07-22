import TableContainer from "./TableContainer";

export default function EtiquetasTable(className) {

    const datos = [
        { Nombre: "Juan", Edad: 25, Ciudad: "Madrid" },
        { Nombre: "Ana", Edad: 28, Ciudad: "Barcelona" },
        { Nombre: "Pedro", Edad: 30, Ciudad: "Valencia" }
    ];

    const encabezados = ["Nombre Etiqueta", "Edad", "Ciudad"];

    return (
        <TableContainer className={className + " overflow-clip h-full flex flex-col"}>
            <table className=" ">
                <thead>
                <tr>
                    {encabezados.map((encabezado) => (
                        <th key={encabezado}>{encabezado}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {datos.map((fila, index) => (
                    <tr key={index}>
                        {encabezados.map((encabezado) => (
                            <td key={encabezado}>{fila[encabezado]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </TableContainer>
    );
}