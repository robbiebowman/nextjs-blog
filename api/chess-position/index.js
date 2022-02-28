module.exports = async function (context, req) {

    const response = await fetch(process.env.PERSONAL_API_URL + "/chess-evals?difficulty=Medium").then(res => res.json())

    context.res = {
        // status: 200, /* Defaults to 200 */
        fen: response.fen,
        evaluation: response.evaluation
    };
}