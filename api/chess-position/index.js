module.exports = async function (context, req) {

    const response = await fetch("https://rjb-personal-api.azurewebsites.net/chess-evals?difficulty=Medium").then(res => res.json())

    context.res = {
        // status: 200, /* Defaults to 200 */
        fen: response.fen,
        evaluation: response.evaluation
    };
}