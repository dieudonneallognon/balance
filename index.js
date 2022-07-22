window.addEventListener("DOMContentLoaded", async () => {
    fetch("http://localhost:4221/depenses")
        .then((response) => response.json())
        .then((data) => showOperations(data));
});

document.querySelector("table").addEventListener("click", (ev) => {
    if (ev.target.className.includes("btn-danger")) {
        fetch(
            "http://localhost:4221/depenses/" +
                ev.target.closest("tr").getAttribute("id"),
            {
                method: "DELETE",
            }
        )
            .then((response) => location.reload())
            .catch((reason) => console.error(reason));
    }

    if (ev.target.className.includes("btn-warning")) {
        const form = document.getElementById("add");

        const operation = {
            nom: form.nom.value,
            montant: form.montant.valueAsNumber,
        };

        if (!isNaN(operation.montant) && operation.nom.length >= 3) {
            fetch(
                "http://localhost:4221/depenses/" +
                    ev.target.closest("tr").getAttribute("id"),
                {
                    method: "PUT",
                    body: JSON.stringify(operation),
                    headers: { "Content-Type": "application/json" },
                }
            )
                .then((response) => location.reload())
                .catch((reason) => console.error(reason));
        } else {
            alert(
                "Vous devez insérer un label d'au moins trois caractères et un nombre !"
            );
        }
    }
});

document.getElementById("add").addEventListener("submit", (ev) => {
    ev.preventDefault();

    const operation = {
        nom: ev.target.nom.value,
        montant: ev.target.montant.valueAsNumber,
    };

    if (!isNaN(operation.montant) && operation.nom.length >= 3) {
        fetch("http://localhost:4221/depenses", {
            method: "POST",
            body: JSON.stringify(operation),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => location.reload())
            .catch((reason) => console.error(reason));
    } else {
        alert(
            "Vous devez insérer un label d'au moins trois caractères et un nombre !"
        );
    }
});

function showOperations(data) {
    document.querySelector("#balance-overview tbody").innerHTML = data
        .reduce((rows, op) => {
            rows.push(`
        <tr id="${op.id}">
            <td>${op.id}</td>
            <td>${op.nom}</td>
            <td>${op.montant}</td>
            <td>
                <button class="btn btn-warning">modifier</button>
                <button class="btn btn-danger">supprimer</button>
            </td>
        </tr>`);
            return rows;
        }, [])
        .join("");

    const dataStats = data.reduce(
        (stats, op) => {
            stats.total += op.montant;
            stats.depenses += op.montant > 0 ? op.montant : 0;
            stats.recettes += op.montant < 0 ? op.montant : 0;
            return stats;
        },
        {
            total: 0,
            depenses: 0,
            recettes: 0,
        }
    );

    document.getElementById("total-amount").innerHTML =
        dataStats.total.toFixed(2);

    document.getElementById("depenses").innerText =
        dataStats.depenses.toFixed(2);

    document.getElementById("recettes").innerText =
        dataStats.recettes.toFixed(2);
}
