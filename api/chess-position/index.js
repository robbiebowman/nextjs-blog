module.exports = async function (context, req) {

    const response = await fetch(process.env.PERSONAL_API_URL + "/chess-evals?difficulty=Medium").then(res => res.json())

    console.log(response)
    // req = HTTP incoming message, res = HTTP server response
    res.status(200).json(response)


    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}