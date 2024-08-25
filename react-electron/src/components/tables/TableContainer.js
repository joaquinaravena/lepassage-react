import styled from "styled-components";

export default styled.div`
    padding: 1rem;
    height: 100%;
    overflow: auto;

    table {
        border-spacing: 0;
        border: 1px solid black;
        table-layout: auto; /* Para que las columnas sean flexibles */

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;

            :last-child {
                border-right: 0;
            }
        }

        tfoot {
            tr:first-child {
                td {
                    border-top: 2px solid black;
                }
            }
            font-weight: bolder;
        }
    }
`;
